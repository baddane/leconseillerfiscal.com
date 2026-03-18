import { NextRequest, NextResponse } from 'next/server'
import { isValidEmail, isValidPhone, sanitizeText, isNonEmpty, isBodyTooLarge } from '@/lib/validation'
import { getEnvInt } from '@/lib/env'

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
    // Body size check
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
    const telephone = sanitizeText(body.telephone, 30)
    const pays = sanitizeText(body.pays, 100)
    const situation = sanitizeText(body.situation, 200)
    const revenus = sanitizeText(body.revenus, 100)
    const message = sanitizeText(body.message, 5000)
    const source = sanitizeText(body.source, 50) || 'bilan-fiscal'

    if (!isValidEmail(email)) {
      return NextResponse.json({ error: 'Email invalide' }, { status: 400 })
    }
    if (!isNonEmpty(nom)) {
      return NextResponse.json({ error: 'Nom requis' }, { status: 400 })
    }
    if (!isValidPhone(telephone)) {
      return NextResponse.json({ error: 'Numéro de téléphone invalide' }, { status: 400 })
    }

    const resendKey = process.env.RESEND_API_KEY
    const brevoKey = process.env.BREVO_API_KEY
    const contactEmail = process.env.CONTACT_EMAIL ?? 'contact@leconseillerfiscal.com'

    const emailText = [
      `NOUVEAU LEAD — Bilan Fiscal`,
      ``,
      `Nom       : ${nom}`,
      `Email     : ${email}`,
      `Téléphone : ${telephone || 'Non renseigné'}`,
      `Pays cible: ${pays || 'Non renseigné'}`,
      `Situation : ${situation || 'Non renseigné'}`,
      `Revenus   : ${revenus || 'Non renseigné'}`,
      `Source    : ${source}`,
      ``,
      `Message :`,
      message || '(aucun message)',
    ].join('\n')

    if (!resendKey && !brevoKey) {
      console.log(`[lead] ${emailText}`)
      return NextResponse.json({ ok: true })
    }

    // ── 1. Resend — notification email transactionnel ──────────────────────
    if (resendKey) {
      const notifRes = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${resendKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: 'Le Conseiller Fiscal <noreply@leconseillerfiscal.com>',
          to: contactEmail,
          reply_to: email,
          subject: `[Lead] Bilan Fiscal — ${nom} · ${pays || 'pays NC'}`,
          text: emailText,
        }),
      })

      if (!notifRes.ok) {
        const err = await notifRes.text()
        console.error('[lead] Resend error:', err)
      }
    }

    // ── 2. Brevo — contact enrichi pour séquences de nurturing ────────────
    if (brevoKey) {
      const [prenom, ...rest] = nom.trim().split(' ')
      const nomFamille = rest.join(' ')

      const listId = getEnvInt('BREVO_LEADS_LIST_ID')

      // Attributs personnalisés — à créer dans Brevo : Contacts → Paramètres → Attributs
      // Noms attendus : PRENOM, NOM, TELEPHONE, PAYS_CIBLE, SITUATION, REVENUS, SOURCE (type Texte)
      const attributes: Record<string, string> = {
        PRENOM: prenom ?? nom,
        ...(nomFamille && { NOM: nomFamille }),
        ...(telephone && { TELEPHONE: telephone }),
        ...(pays && { PAYS_CIBLE: pays }),
        ...(situation && { SITUATION: situation }),
        ...(revenus && { REVENUS: revenus }),
        SOURCE: source,
      }

      const payload: Record<string, unknown> = {
        email,
        attributes,
        updateEnabled: true,
      }
      if (listId) payload.listIds = [listId]

      await fetch('https://api.brevo.com/v3/contacts', {
        method: 'POST',
        headers: {
          'api-key': brevoKey,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      }).catch((err) => console.error('[lead] Brevo error:', err))
    }

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('[lead] Error:', err)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
