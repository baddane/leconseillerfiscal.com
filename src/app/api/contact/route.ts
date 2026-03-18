import { NextRequest, NextResponse } from 'next/server'
import { isValidEmail, sanitizeText, isNonEmpty, isBodyTooLarge } from '@/lib/validation'

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

    if (!apiKey) {
      // Dev mode: log to console
      console.log(`[contact] From: ${nom} <${email}> | Sujet: ${sujet} | Message: ${message.substring(0, 200)}`)
      return NextResponse.json({ ok: true })
    }

    // ── 1. Notification interne ────────────────────────────────────────────
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
    })

    if (!internalRes.ok) {
      const err = await internalRes.text()
      console.error('[contact] Resend error:', err)
      return NextResponse.json({ error: 'Erreur d\'envoi' }, { status: 500 })
    }

    // ── 2. Email de confirmation à l'utilisateur ───────────────────────────
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

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('[contact] Error:', err)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
