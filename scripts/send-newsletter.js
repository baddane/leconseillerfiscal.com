#!/usr/bin/env node
/**
 * Envoi de la newsletter « nouvel article publié ».
 * Déclenché par la GitHub Action .github/workflows/newsletter-on-publish.yml
 * à chaque push sur main qui ajoute un article dans content/articles/.
 *
 * Regroupe : le(s) nouvel(s) article(s) + une sélection des dernières
 * actualités fiscales (« en vogue »), et envoie une campagne Brevo à la
 * liste newsletter.
 *
 * Variables d'environnement :
 *   BREVO_API_KEY             (secret)  — clé API Brevo
 *   BREVO_NEWSLETTER_LIST_ID  (secret)  — id de la liste newsletter Brevo
 *   NEXT_PUBLIC_SITE_URL                — ex. https://www.leconseillerfiscal.com
 *   NEW_ARTICLE_SLUGS                   — slugs ajoutés (séparés par espaces/virgules)
 *   DRY_RUN                             — "1"/"true" → construit sans envoyer
 */
const fs = require('fs')
const path = require('path')
const { execSync } = require('child_process')

const DIR = path.join(process.cwd(), 'content/articles')
const SITE = (process.env.NEXT_PUBLIC_SITE_URL || 'https://www.leconseillerfiscal.com').replace(/\/+$/, '')
const DRY = /^(1|true)$/i.test(process.env.DRY_RUN || '')
const BREVO_KEY = process.env.BREVO_API_KEY
const LIST_ID = parseInt(process.env.BREVO_NEWSLETTER_LIST_ID || '', 10)

// ── Lecture minimale du frontmatter (sans dépendance) ──────────────────────
function readFront(slug) {
  const raw = fs.readFileSync(path.join(DIR, `${slug}.mdx`), 'utf8')
  const m = raw.match(/^---\n([\s\S]*?)\n---/)
  const fm = {}
  if (m) {
    for (const line of m[1].split('\n')) {
      const mm = line.match(/^([A-Za-z0-9_]+):\s*"?(.*?)"?\s*$/)
      if (mm && !fm[mm[1]]) fm[mm[1]] = mm[2]
    }
  }
  return fm
}

const urlFor = (slug, pays) => `${SITE}/expatriation/${pays}/${slug}`

function gitAddedTime(slug) {
  try {
    const t = execSync(`git log --diff-filter=A --format=%ct -1 -- "content/articles/${slug}.mdx"`,
      { stdio: ['ignore', 'pipe', 'ignore'] }).toString().trim()
    return parseInt(t, 10) || 0
  } catch { return 0 }
}

const esc = (s) => String(s || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

// ── 1. Nouveaux articles ───────────────────────────────────────────────────
let newSlugs = (process.env.NEW_ARTICLE_SLUGS || '')
  .split(/[\s,]+/)
  .map((s) => s.replace(/^content\/articles\//, '').replace(/\.mdx$/, ''))
  .filter(Boolean)
newSlugs = [...new Set(newSlugs)].filter((s) => fs.existsSync(path.join(DIR, `${s}.mdx`)))

if (newSlugs.length === 0) {
  console.log('ℹ️  Aucun nouvel article détecté → aucune newsletter envoyée.')
  process.exit(0)
}

const newItems = newSlugs.map((s) => {
  const fm = readFront(s)
  return { slug: s, title: fm.title, desc: fm.metaDescription, pays: fm.pays || 'outils', url: urlFor(s, fm.pays || 'outils') }
})

// ── 2. « En vogue » : dernières actualités (hors nouveautés) ────────────────
const allSlugs = fs.readdirSync(DIR).filter((f) => f.endsWith('.mdx')).map((f) => f.replace(/\.mdx$/, ''))
const vogueItems = allSlugs
  .filter((s) => !newSlugs.includes(s) && readFront(s).pays === 'actualite')
  .map((s) => ({ s, t: gitAddedTime(s) }))
  .sort((a, b) => b.t - a.t)
  .slice(0, 5)
  .map(({ s }) => {
    const fm = readFront(s)
    return { title: fm.title, url: urlFor(s, 'actualite') }
  })

// ── 3. Construction de l'e-mail ────────────────────────────────────────────
const subject = newItems.length === 1
  ? `Nouveau : ${newItems[0].title}`
  : `${newItems.length} nouveaux articles — fiscalité des expatriés`

const btn = (url, label) =>
  `<a href="${url}" style="display:inline-block;background:#c9a84c;color:#0f0e0b;padding:12px 24px;font-family:monospace;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.12em;text-decoration:none;">${label}</a>`

const newCards = newItems.map((it) => `
  <div style="border:1px solid #e5e0d8;background:#fff;padding:24px;margin:0 0 16px;">
    <p style="font-family:monospace;font-size:10px;text-transform:uppercase;letter-spacing:0.15em;color:#c9a84c;margin:0 0 10px;">Nouvel article</p>
    <h2 style="font-family:Georgia,serif;font-size:20px;font-weight:900;color:#0f0e0b;margin:0 0 10px;line-height:1.25;">${esc(it.title)}</h2>
    <p style="font-family:Arial,sans-serif;font-size:14px;color:#555;line-height:1.6;margin:0 0 18px;">${esc(it.desc)}</p>
    ${btn(it.url, 'Lire l’article →')}
  </div>`).join('')

const vogueList = vogueItems.length ? `
  <div style="margin:32px 0 0;">
    <p style="font-family:monospace;font-size:11px;text-transform:uppercase;letter-spacing:0.15em;color:#999;margin:0 0 14px;">À ne pas manquer — actualités fiscales</p>
    <table width="100%" cellpadding="0" cellspacing="0">
      ${vogueItems.map((v) => `
      <tr><td style="padding:8px 0;border-bottom:1px solid #ece6da;">
        <a href="${v.url}" style="font-family:Arial,sans-serif;font-size:14px;color:#0f0e0b;text-decoration:none;">→ ${esc(v.title)}</a>
      </td></tr>`).join('')}
    </table>
  </div>` : ''

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
      <p style="font-family:Arial,sans-serif;font-size:15px;color:#555;line-height:1.6;margin:0 0 28px;">Voici notre dernière publication et les actualités fiscales à suivre en ce moment.</p>
      ${newCards}
      ${vogueList}
      <div style="margin:36px 0 0;background:#0f0e0b;padding:24px;text-align:center;">
        <p style="font-family:Arial,sans-serif;font-size:14px;color:#f5f0e8;line-height:1.6;margin:0 0 16px;">Une question sur votre propre situation ? Demandez votre bilan fiscal gratuit.</p>
        ${btn(`${SITE}/bilan-fiscal`, 'Demander mon bilan gratuit →')}
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
  ...newItems.map((it) => `• ${it.title}\n  ${it.url}`),
  ...(vogueItems.length ? ['', 'À ne pas manquer :', ...vogueItems.map((v) => `- ${v.title} : ${v.url}`)] : []),
  '',
  `Bilan fiscal gratuit : ${SITE}/bilan-fiscal`,
  'leconseillerfiscal.com',
].join('\n')

// ── 4. Envoi via campagne Brevo ────────────────────────────────────────────
async function main() {
  console.log(`📰 Newsletter — ${newItems.length} nouvel(s) article(s), ${vogueItems.length} actu(s) en vogue.`)
  console.log(`   Sujet : ${subject}`)

  if (DRY) {
    const out = path.join(process.cwd(), 'newsletter-preview.html')
    fs.writeFileSync(out, html)
    console.log(`🧪 DRY_RUN — aperçu écrit dans ${out} (aucun envoi).`)
    return
  }
  if (!BREVO_KEY || !LIST_ID) {
    console.log('⚠️  BREVO_API_KEY ou BREVO_NEWSLETTER_LIST_ID manquant → envoi ignoré (configurez les secrets GitHub).')
    return
  }

  const HEADERS = { 'api-key': BREVO_KEY, 'Content-Type': 'application/json', accept: 'application/json' }
  // 4a. Créer la campagne (brouillon)
  const createRes = await fetch('https://api.brevo.com/v3/emailCampaigns', {
    method: 'POST',
    headers: HEADERS,
    body: JSON.stringify({
      name: `Newsletter ${new Date().toISOString().slice(0, 16)} — ${subject}`.slice(0, 120),
      subject,
      sender: { name: 'Le Conseiller Fiscal', email: 'noreply@leconseillerfiscal.com' },
      type: 'classic',
      htmlContent: html,
      recipients: { listIds: [LIST_ID] },
    }),
  })
  if (!createRes.ok) {
    console.error('❌ Création de campagne Brevo échouée :', createRes.status, await createRes.text())
    process.exit(1)
  }
  const { id } = await createRes.json()
  console.log(`✅ Campagne créée (id ${id}).`)

  // 4b. Envoyer immédiatement
  const sendRes = await fetch(`https://api.brevo.com/v3/emailCampaigns/${id}/sendNow`, { method: 'POST', headers: HEADERS })
  if (!sendRes.ok && sendRes.status !== 204) {
    console.error('❌ Envoi de campagne Brevo échoué :', sendRes.status, await sendRes.text())
    process.exit(1)
  }
  console.log(`🚀 Newsletter envoyée à la liste ${LIST_ID}.`)
}

main().catch((e) => { console.error(e); process.exit(1) })
