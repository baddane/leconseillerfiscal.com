import { NextRequest, NextResponse } from 'next/server'
import { isValidEmail, sanitizeText, isNonEmpty, isBodyTooLarge } from '@/lib/validation'
import { supabase } from '@/lib/supabase'

// Simple in-memory rate limiter (best-effort on serverless)
const rateLimit = new Map<string, { count: number; resetAt: number }>()
const RATE_LIMIT_MAX = 5
const RATE_LIMIT_WINDOW = 60 * 60 * 1000 // 1 hour

function isRateLimited(ip: string): boolean {
  const now = Date.now()
  const entry = rateLimit.get(ip)
  if (!entry || now > entry.resetAt) {
    rateLimit.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW })
    return false
  }
  entry.count++
  return entry.count > RATE_LIMIT_MAX
}

export async function POST(request: NextRequest) {
  try {
    if (isBodyTooLarge(request.headers.get('content-length'))) {
      return NextResponse.json({ error: 'Corps de requête trop volumineux' }, { status: 413 })
    }

    const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown'
    if (isRateLimited(ip)) {
      return NextResponse.json({ error: 'Trop de requêtes. Réessayez plus tard.' }, { status: 429 })
    }

    const body = await request.json()
    const nom = sanitizeText(body.nom, 200)
    const email = body.email
    const sujet = sanitizeText(body.sujet, 100)
    const message = sanitizeText(body.message, 5000)

    if (!isNonEmpty(nom) || !isNonEmpty(message)) {
      return NextResponse.json({ error: 'Champs requis manquants' }, { status: 400 })
    }
    if (!isValidEmail(email)) {
      return NextResponse.json({ error: 'Email invalide' }, { status: 400 })
    }

    const apiKey = process.env.RESEND_API_KEY
    const contactEmail = process.env.CONTACT_EMAIL ?? 'contact@leconseillerfiscal.com'
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://leconseillerfiscal.com'

    // ── Double écriture (best-effort) : Supabase + notification email ──────
    // Succès si AU MOINS l'un des deux canaux aboutit.
    let supabaseOk = false
    let emailOk = false

    // ── 1. Persistance Supabase (lcf_contact_messages) ─────────────────────
    const { error: dbError } = await supabase.from('lcf_contact_messages').insert({
      name: nom,
      email,
      subject: sujet,
      message,
    })
    if (dbError) {
      console.error('[contact] Supabase insert error:', dbError.message)
    } else {
      supabaseOk = true
    }

    // ── 1bis. L'auteur du message est aussi un lead (visible dans /admin) ──
    const { error: leadError } = await supabase.from('lcf_leads').insert({
      name: nom,
      email,
      source: 'contact',
      message: sujet ? `Sujet : ${sujet}` : null,
    })
    if (leadError) {
      console.error('[contact] Supabase lead insert error:', leadError.message)
    }

    // ── 2. Notification interne (Resend) ───────────────────────────────────
    if (!apiKey) {
      // Pas de clé email : on s'appuie sur Supabase (et on logue en dev)
      console.log(`[contact] From: ${nom} <${email}> | Sujet: ${sujet} | Message: ${message.substring(0, 200)}`)
    } else {
      const internalRes = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: 'Le Conseiller Fiscal <noreply@leconseillerfiscal.com>',
          to: contactEmail,
          reply_to: email,
          subject: `[Contact] ${sujet} — ${nom}`,
          text: `Nom: ${nom}\nEmail: ${email}\nSujet: ${sujet}\n\n${message}`,
        }),
      }).catch((err) => {
        console.error('[contact] Resend error:', err)
        return null
      })
      emailOk = !!internalRes && internalRes.ok
      if (internalRes && !internalRes.ok) {
        console.error('[contact] Resend error:', await internalRes.text())
      }
    }

    // Échec uniquement si les DEUX canaux ont échoué
    if (!supabaseOk && !emailOk && apiKey) {
      return NextResponse.json({ error: 'Erreur d\'envoi' }, { status: 500 })
    }

    // ── 3. Email de confirmation à l'utilisateur (best-effort) ─────────────
    if (apiKey) {
      await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'Le Conseiller Fiscal <noreply@leconseillerfiscal.com>',
        to: email,
        subject: 'Nous avons bien reçu votre message — Le Conseiller Fiscal',
        text: [
          `Bonjour ${nom},`,
          ``,
          `Nous avons bien reçu votre message concernant "${sujet}".`,
          `Notre équipe vous répondra dans les 48 heures ouvrées.`,
          ``,
          `Cordialement,`,
          `L'équipe du Conseiller Fiscal`,
          `${siteUrl}`,
        ].join('\n'),
      }),
      }).catch((err) => console.error('[contact] Confirmation email error:', err))
    }

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('[contact] Error:', err)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
