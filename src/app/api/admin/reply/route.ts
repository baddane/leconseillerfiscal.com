import { NextRequest, NextResponse } from 'next/server'
import { remark } from 'remark'
import remarkGfm from 'remark-gfm'
import remarkHtml from 'remark-html'
import sanitizeHtml from 'sanitize-html'
import { verifyAdminPassword } from '@/lib/adminAuth'
import { supabase } from '@/lib/supabase'
import { isValidEmail, sanitizeText, isNonEmpty } from '@/lib/validation'
import { BREVO_SENDER } from '@/lib/mail'

// Styles inline par balise : les clients email (Gmail, Outlook…) ignorent
// les feuilles de style, tout doit être porté par les attributs style.
const TAG_STYLES: Record<string, string> = {
  h2: 'font-family:Georgia,serif;font-size:20px;font-weight:700;color:#0f0e0b;margin:28px 0 12px;',
  h3: 'font-family:Georgia,serif;font-size:17px;font-weight:700;color:#0f0e0b;margin:22px 0 10px;',
  p: 'margin:0 0 16px;line-height:1.7;',
  ul: 'margin:0 0 16px;padding-left:22px;line-height:1.7;',
  ol: 'margin:0 0 16px;padding-left:22px;line-height:1.7;',
  li: 'margin:4px 0;',
  blockquote: 'margin:0 0 16px;padding:2px 0 2px 14px;border-left:3px solid #c9a84c;color:#555555;',
  table: 'border-collapse:collapse;margin:0 0 16px;font-size:14px;',
  th: 'border:1px solid #e5e0d8;background:#f5f0e8;padding:8px;text-align:left;',
  td: 'border:1px solid #e5e0d8;padding:8px;',
  hr: 'border:none;border-top:1px solid #e5e0d8;margin:24px 0;',
  a: 'color:#8a6d2f;',
}

// Convertit le markdown du composeur en HTML sûr et stylé inline.
async function renderEmailBody(text: string): Promise<string> {
  // Préserve les retours à la ligne simples (comportement historique du composeur)
  const withBreaks = text.replace(/(?<!\n)\n(?!\n)/g, '  \n')
  const raw = String(await remark().use(remarkGfm).use(remarkHtml, { sanitize: false }).process(withBreaks))

  const transformTags: sanitizeHtml.IOptions['transformTags'] = {
    h1: () => ({ tagName: 'h2', attribs: { style: TAG_STYLES.h2 } }),
    h4: () => ({ tagName: 'h3', attribs: { style: TAG_STYLES.h3 } }),
  }
  for (const [tag, style] of Object.entries(TAG_STYLES)) {
    transformTags[tag] = (tagName, attribs) => ({ tagName, attribs: { ...attribs, style } })
  }

  return sanitizeHtml(raw, {
    allowedTags: [
      'h2', 'h3', 'p', 'br', 'strong', 'em', 'del', 'ul', 'ol', 'li', 'a',
      'blockquote', 'table', 'thead', 'tbody', 'tr', 'th', 'td', 'hr', 'code', 'pre',
    ],
    allowedAttributes: { a: ['href', 'style'], '*': ['style'] },
    allowedSchemes: ['https', 'http', 'mailto'],
    transformTags,
  })
}

function wrapHtml(bodyHtml: string, siteUrl: string): string {
  const html = bodyHtml
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

  const { password, to, subject, body: message, messageId, leadId } = body as {
    password?: string; to?: string; subject?: string; body?: string; messageId?: string; leadId?: string
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
      sender: BREVO_SENDER,
      replyTo: { email: contactEmail, name: 'Le Conseiller Fiscal' },
      to: [{ email: to }],
      subject: sanitizeText(subject, 200) || 'Réponse — Le Conseiller Fiscal',
      htmlContent: wrapHtml(await renderEmailBody(text), siteUrl),
      textContent: text,
      tags: ['admin-reply'],
    }),
  })
  if (!res.ok) {
    return NextResponse.json({ error: 'Échec de l’envoi : ' + (await res.text()) }, { status: 502 })
  }

  // Enregistrer la réponse dans le fil de la conversation (best-effort)
  const { error: dbError } = await supabase.rpc('lcf_admin_add_reply', {
    p_password: password,
    p_message_id: messageId ?? null,
    p_lead_id: leadId ?? null,
    p_to: to,
    p_subject: sanitizeText(subject, 200) || null,
    p_body: text,
  })
  if (dbError) {
    console.error('[admin/reply] Persist error:', dbError.message)
  }

  return NextResponse.json({ ok: true, to })
}
