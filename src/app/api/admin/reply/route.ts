import { NextRequest, NextResponse } from 'next/server'
import { verifyAdminPassword } from '@/lib/adminAuth'
import { isValidEmail, sanitizeText, isNonEmpty } from '@/lib/validation'

const esc = (s: string) =>
  String(s || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

function wrapHtml(bodyText: string, siteUrl: string): string {
  const html = esc(bodyText).replace(/\n/g, '<br>')
  return `<!DOCTYPE html><html lang="fr"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f5f0e8;font-family:Georgia,serif;">
  <div style="max-width:600px;margin:0 auto;background:#f5f0e8;">
    <div style="background:#0f0e0b;padding:24px 40px;">
      <span style="color:#f5f0e8;font-size:16px;font-weight:700;">Le Conseiller <em style="color:#c9a84c;">Fiscal</em></span>
    </div>
    <div style="height:4px;background:#c9a84c;"></div>
    <div style="padding:36px 40px;font-family:Arial,sans-serif;font-size:15px;color:#222;line-height:1.7;">
      ${html}
    </div>
    <div style="padding:18px 40px;border-top:1px solid #e5e0d8;">
      <a href="${siteUrl}" style="font-family:monospace;font-size:11px;color:#999;text-transform:uppercase;letter-spacing:0.1em;text-decoration:none;">leconseillerfiscal.com</a>
    </div>
  </div>
</body></html>`
}

export async function POST(request: NextRequest) {
  let body: Record<string, unknown>
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Requête invalide' }, { status: 400 })
  }

  const { password, to, subject, body: message } = body as {
    password?: string; to?: string; subject?: string; body?: string
  }

  if (!(await verifyAdminPassword(password))) {
    return NextResponse.json({ error: 'Mot de passe incorrect' }, { status: 401 })
  }
  if (!isValidEmail(to)) {
    return NextResponse.json({ error: 'Destinataire invalide' }, { status: 400 })
  }
  const text = sanitizeText(message, 10000)
  if (!isNonEmpty(text)) {
    return NextResponse.json({ error: 'Le message est vide' }, { status: 400 })
  }

  const brevoKey = process.env.BREVO_API_KEY
  if (!brevoKey) {
    return NextResponse.json({ error: 'BREVO_API_KEY non configurée sur le serveur' }, { status: 500 })
  }
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.leconseillerfiscal.com'
  const contactEmail = process.env.CONTACT_EMAIL ?? 'contact@leconseillerfiscal.com'

  const res = await fetch('https://api.brevo.com/v3/smtp/email', {
    method: 'POST',
    headers: { 'api-key': brevoKey, 'Content-Type': 'application/json', accept: 'application/json' },
    body: JSON.stringify({
      sender: { name: 'Le Conseiller Fiscal', email: 'noreply@leconseillerfiscal.com' },
      replyTo: { email: contactEmail, name: 'Le Conseiller Fiscal' },
      to: [{ email: to }],
      subject: sanitizeText(subject, 200) || 'Réponse — Le Conseiller Fiscal',
      htmlContent: wrapHtml(text, siteUrl),
      textContent: text,
      tags: ['admin-reply'],
    }),
  })
  if (!res.ok) {
    return NextResponse.json({ error: 'Échec de l’envoi : ' + (await res.text()) }, { status: 502 })
  }
  return NextResponse.json({ ok: true, to })
}
