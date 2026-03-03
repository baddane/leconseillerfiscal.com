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
      `Source    : ${source || 'bilan-fiscal'}`,
      ``,
      `Message :`,
      message || '(aucun message)',
    ].join('\n')

    if (!brevoKey) {
      console.log(`[lead] ${emailText}`)
      return NextResponse.json({ ok: true })
    }

    const HEADERS = { 'api-key': brevoKey, 'Content-Type': 'application/json' }

    // ── 1. Brevo — notification email transactionnel ───────────────────────
    await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: HEADERS,
      body: JSON.stringify({
        sender: { name: 'Le Conseiller Fiscal', email: 'noreply@leconseillerfiscal.com' },
        to: [{ email: contactEmail }],
        replyTo: { email, name: nom },
        subject: `[Lead] Bilan Fiscal — ${nom} · ${pays || 'pays NC'}`,
        textContent: emailText,
      }),
    }).catch((err) => console.error('[lead] Brevo notif error:', err))

    // ── 2. Brevo — contact enrichi pour séquences de nurturing ────────────
    const [prenom, ...rest] = nom.trim().split(' ')
    const nomFamille = rest.join(' ')

    const listId = process.env.BREVO_LEADS_LIST_ID
      ? parseInt(process.env.BREVO_LEADS_LIST_ID)
      : null

    const attributes: Record<string, string> = {
      PRENOM: prenom ?? nom,
      ...(nomFamille && { NOM: nomFamille }),
      ...(telephone && { TELEPHONE: telephone }),
      ...(pays && { PAYS_CIBLE: pays }),
      ...(situation && { SITUATION: situation }),
      ...(revenus && { REVENUS: revenus }),
      SOURCE: source ?? 'bilan-fiscal',
    }

    const contactPayload: Record<string, unknown> = {
      email,
      attributes,
      updateEnabled: true,
    }
    if (listId) contactPayload.listIds = [listId]

    await fetch('https://api.brevo.com/v3/contacts', {
      method: 'POST',
      headers: HEADERS,
      body: JSON.stringify(contactPayload),
    }).catch((err) => console.error('[lead] Brevo contact error:', err))

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('[lead] Error:', err)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
