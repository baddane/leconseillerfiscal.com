import { NextRequest, NextResponse } from 'next/server'

// Simple in-memory rate limiter
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
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown'
    if (isRateLimited(ip)) {
      return NextResponse.json({ error: 'Trop de requêtes. Réessayez plus tard.' }, { status: 429 })
    }

    const body = await request.json()
    const { nom, email, telephone, pays, situation, revenus, message, source } = body

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: 'Email invalide' }, { status: 400 })
    }
    if (!nom) {
      return NextResponse.json({ error: 'Nom requis' }, { status: 400 })
    }

    const apiKey = process.env.RESEND_API_KEY
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
      `Source    : ${source || 'bilan-fiscal'}`,
      ``,
      `Message :`,
      message || '(aucun message)',
    ].join('\n')

    if (!apiKey) {
      console.log(`[lead] ${emailText}`)
      return NextResponse.json({ ok: true })
    }

    // Send notification email
    const notifRes = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
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
      console.error('[lead] Resend notification error:', err)
    }

    // Add to newsletter contacts
    await fetch('https://api.resend.com/contacts', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, first_name: nom.split(' ')[0], unsubscribed: false }),
    }).catch(() => {}) // Non-blocking

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('[lead] Error:', err)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
