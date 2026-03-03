/**
 * Script de configuration Brevo — à lancer UNE SEULE FOIS
 *
 * Ce script crée automatiquement dans votre compte Brevo :
 *   1. Les 2 listes (Newsletter + Leads)
 *   2. Les 4 attributs personnalisés pour les leads
 *   3. Vérifie que le domaine d'envoi est configuré
 *
 * Usage :
 *   BREVO_API_KEY=votre_cle node scripts/setup-brevo.js
 *
 * Le script est idempotent : relancez-le sans risque si besoin.
 */

const API_KEY = process.env.BREVO_API_KEY

if (!API_KEY) {
  console.error('\n❌  BREVO_API_KEY manquante.')
  console.error('    Usage : BREVO_API_KEY=votre_cle node scripts/setup-brevo.js\n')
  process.exit(1)
}

const BASE = 'https://api.brevo.com/v3'
const H = { 'api-key': API_KEY, 'Content-Type': 'application/json' }

const ATTRIBUTES = ['PAYS_CIBLE', 'SITUATION', 'REVENUS', 'SOURCE']
const LISTS = [
  'Newsletter — Le Conseiller Fiscal',
  'Leads — Bilan Fiscal',
]

// ── Helpers ──────────────────────────────────────────────────────────────────

async function api(method, path, body) {
  const res = await fetch(`${BASE}${path}`, {
    method,
    headers: H,
    ...(body ? { body: JSON.stringify(body) } : {}),
  })
  const text = await res.text()
  let json = null
  try { json = JSON.parse(text) } catch {}
  return { status: res.status, ok: res.ok, json, text }
}

function logOk(msg)   { console.log(`  ✅  ${msg}`) }
function logSkip(msg) { console.log(`  ⏭   ${msg}`) }
function logErr(msg)  { console.log(`  ❌  ${msg}`) }
function logInfo(msg) { console.log(`  ℹ   ${msg}`) }

// ── Steps ─────────────────────────────────────────────────────────────────────

async function step1_checkAccount() {
  console.log('\n─── Étape 1 · Vérification du compte ───────────────────────────\n')
  const { ok: isOk, json } = await api('GET', '/account')
  if (!isOk) {
    logErr('Clé API invalide ou compte inaccessible')
    process.exit(1)
  }
  logOk(`Connecté : ${json.email} (plan : ${json.plan?.[0]?.type ?? 'inconnu'})`)
}

async function step2_createLists() {
  console.log('\n─── Étape 2 · Création des listes contacts ──────────────────────\n')
  const ids = {}

  const { json: existing } = await api('GET', '/contacts/lists?limit=50')
  const existingNames = (existing?.lists ?? []).reduce((acc, l) => {
    acc[l.name] = l.id
    return acc
  }, {})

  for (const name of LISTS) {
    if (existingNames[name]) {
      logSkip(`"${name}" — déjà existante (ID: ${existingNames[name]})`)
      ids[name] = existingNames[name]
      continue
    }
    const { ok: isOk, json } = await api('POST', '/contacts/lists', { name, folderId: 1 })
    if (isOk) {
      logOk(`"${name}" — créée (ID: ${json.id})`)
      ids[name] = json.id
    } else {
      logErr(`"${name}" — ${json?.message ?? 'erreur inconnue'}`)
    }
  }

  return ids
}

async function step3_createAttributes() {
  console.log('\n─── Étape 3 · Création des attributs personnalisés ──────────────\n')

  const { json: existing } = await api('GET', '/contacts/attributes/normal')
  const existingNames = new Set((existing?.attributes ?? []).map(a => a.name))

  for (const name of ATTRIBUTES) {
    if (existingNames.has(name)) {
      logSkip(`Attribut "${name}" — déjà existant`)
      continue
    }
    const { ok: isOk, status, json } = await api(
      'POST',
      `/contacts/attributes/normal/${name}`,
      { type: 'text' }
    )
    if (isOk || status === 204) {
      logOk(`Attribut "${name}" — créé`)
    } else {
      logErr(`Attribut "${name}" — ${json?.message ?? 'erreur inconnue'}`)
    }
  }
}

async function step4_checkSender() {
  console.log('\n─── Étape 4 · Vérification des expéditeurs ──────────────────────\n')
  const { json } = await api('GET', '/senders')
  const senders = json?.senders ?? []

  if (senders.length === 0) {
    logErr('Aucun expéditeur configuré dans Brevo.')
    logInfo('Ajoutez un expéditeur : Brevo → Paramètres → Expéditeurs & IP')
    logInfo('Adresse recommandée : noreply@leconseillerfiscal.com')
  } else {
    senders.forEach(s => logOk(`Expéditeur : ${s.name} <${s.email}>`))
  }
}

// ── Main ──────────────────────────────────────────────────────────────────────

async function main() {
  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  console.log('   Brevo Setup · Le Conseiller Fiscal')
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')

  await step1_checkAccount()
  const listIds = await step2_createLists()
  await step3_createAttributes()
  await step4_checkSender()

  const newsletterId = listIds[LISTS[0]]
  const leadsId      = listIds[LISTS[1]]

  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  console.log('   ✅  Setup terminé !\n')
  console.log('   Copiez ces variables dans Vercel → Settings → Env :\n')
  if (newsletterId) console.log(`   BREVO_NEWSLETTER_LIST_ID=${newsletterId}`)
  if (leadsId)      console.log(`   BREVO_LEADS_LIST_ID=${leadsId}`)
  console.log('\n   Et ajoutez votre clé API :')
  console.log('   BREVO_API_KEY=<votre clé Brevo>')
  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n')
}

main().catch(e => {
  console.error('\n❌  Erreur fatale :', e.message)
  process.exit(1)
})
