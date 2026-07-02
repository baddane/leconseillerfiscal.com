import type { ArticleMeta } from './articles'

const esc = (s: string) =>
  String(s || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

export function urlForArticle(siteUrl: string, a: ArticleMeta): string {
  return `${siteUrl.replace(/\/+$/, '')}/expatriation/${a.pays}/${a.slug}`
}

const MONTHS: Record<string, number> = {
  janvier: 1, fevrier: 2, février: 2, mars: 3, avril: 4, mai: 5, juin: 6,
  juillet: 7, aout: 8, août: 8, septembre: 9, octobre: 10, novembre: 11, decembre: 12, décembre: 12,
}

// Convertit "juillet 2026" → nombre triable (aaaamm), pour classer les actus.
export function dateVerifSortKey(dv: string): number {
  const m = (dv || '').toLowerCase().match(/([a-zéû]+)\s+(\d{4})/)
  if (!m) return 0
  return parseInt(m[2], 10) * 100 + (MONTHS[m[1]] ?? 0)
}

export interface BuiltEmail {
  subject: string
  html: string
  text: string
}

export function buildNewsletterEmail(
  featured: ArticleMeta[],
  vogue: ArticleMeta[],
  siteUrl: string,
): BuiltEmail {
  const site = siteUrl.replace(/\/+$/, '')
  const subject =
    featured.length === 1
      ? `Nouveau : ${featured[0].title}`
      : `${featured.length} articles — fiscalité des expatriés`

  const btn = (url: string, label: string) =>
    `<a href="${url}" style="display:inline-block;background:#c9a84c;color:#0f0e0b;padding:12px 24px;font-family:monospace;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.12em;text-decoration:none;">${label}</a>`

  const cards = featured
    .map(
      (it) => `
    <div style="border:1px solid #e5e0d8;background:#fff;padding:24px;margin:0 0 16px;">
      <p style="font-family:monospace;font-size:10px;text-transform:uppercase;letter-spacing:0.15em;color:#c9a84c;margin:0 0 10px;">À lire</p>
      <h2 style="font-family:Georgia,serif;font-size:20px;font-weight:900;color:#0f0e0b;margin:0 0 10px;line-height:1.25;">${esc(it.title)}</h2>
      <p style="font-family:Arial,sans-serif;font-size:14px;color:#555;line-height:1.6;margin:0 0 18px;">${esc(it.metaDescription)}</p>
      ${btn(urlForArticle(site, it), 'Lire l’article →')}
    </div>`,
    )
    .join('')

  const vogueList = vogue.length
    ? `
    <div style="margin:32px 0 0;">
      <p style="font-family:monospace;font-size:11px;text-transform:uppercase;letter-spacing:0.15em;color:#999;margin:0 0 14px;">À ne pas manquer — actualités fiscales</p>
      <table width="100%" cellpadding="0" cellspacing="0">
        ${vogue
          .map(
            (v) => `
        <tr><td style="padding:8px 0;border-bottom:1px solid #ece6da;">
          <a href="${urlForArticle(site, v)}" style="font-family:Arial,sans-serif;font-size:14px;color:#0f0e0b;text-decoration:none;">→ ${esc(v.title)}</a>
        </td></tr>`,
          )
          .join('')}
      </table>
    </div>`
    : ''

  const html = `<!DOCTYPE html><html lang="fr"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${esc(subject)}</title></head>
<body style="margin:0;padding:0;background:#f5f0e8;font-family:Georgia,serif;">
  <div style="max-width:600px;margin:0 auto;background:#f5f0e8;">
    <div style="background:#0f0e0b;padding:28px 40px;text-align:center;">
      <div style="display:inline-block;width:38px;height:38px;background:#c9a84c;border-radius:50%;line-height:38px;text-align:center;margin-bottom:10px;">
        <span style="color:#0f0e0b;font-weight:900;font-size:20px;">C</span></div>
      <div style="color:#f5f0e8;font-size:17px;font-weight:700;">Le Conseiller <em style="color:#c9a84c;">Fiscal</em></div>
    </div>
    <div style="height:4px;background:#c9a84c;"></div>
    <div style="padding:40px;">
      <p style="font-family:monospace;font-size:11px;text-transform:uppercase;letter-spacing:0.15em;color:#c9a84c;margin:0 0 12px;">Mise à jour</p>
      <h1 style="font-family:Georgia,serif;font-size:26px;font-weight:900;color:#0f0e0b;margin:0 0 8px;line-height:1.2;">Du nouveau côté fiscalité des expatriés</h1>
      <p style="font-family:Arial,sans-serif;font-size:15px;color:#555;line-height:1.6;margin:0 0 28px;">Voici notre sélection et les actualités fiscales à suivre en ce moment.</p>
      ${cards}
      ${vogueList}
      <div style="margin:36px 0 0;background:#0f0e0b;padding:24px;text-align:center;">
        <p style="font-family:Arial,sans-serif;font-size:14px;color:#f5f0e8;line-height:1.6;margin:0 0 16px;">Une question sur votre propre situation ? Demandez votre bilan fiscal gratuit.</p>
        ${btn(`${site}/bilan-fiscal`, 'Demander mon bilan gratuit →')}
      </div>
    </div>
    <div style="padding:20px 40px;border-top:1px solid #e5e0d8;text-align:center;">
      <p style="font-family:monospace;font-size:10px;color:#bbb;text-transform:uppercase;letter-spacing:0.1em;margin:0;">leconseillerfiscal.com</p>
    </div>
  </div>
</body></html>`

  const text = [
    'Le Conseiller Fiscal — Mise à jour',
    '',
    'Du nouveau côté fiscalité des expatriés :',
    '',
    ...featured.map((it) => `• ${it.title}\n  ${urlForArticle(site, it)}`),
    ...(vogue.length ? ['', 'À ne pas manquer :', ...vogue.map((v) => `- ${v.title} : ${urlForArticle(site, v)}`)] : []),
    '',
    `Bilan fiscal gratuit : ${site}/bilan-fiscal`,
    'leconseillerfiscal.com',
  ].join('\n')

  return { subject, html, text }
}
