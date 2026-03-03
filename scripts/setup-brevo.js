/**
 * Script de configuration Brevo — à lancer UNE SEULE FOIS
 *
 * Ce script crée les attributs personnalisés nécessaires dans votre compte Brevo,
 * ainsi que les deux listes (Newsletter + Leads).
 *
 * Usage :
 *   BREVO_API_KEY=votre_cle node scripts/setup-brevo.js
 *
 * Ou via npm (après avoir ajouté la clé dans .env.local) :
 *   node -e "require('fs').readFileSync('.env.local','utf8').split('\n').forEach(l=>{const[k,v]=l.split('=');if(k&&v)process.env[k.trim()]=v.trim()})" && node scripts/setup-brevo.js
 */

const API_KEY = process.env.BREVO_API_KEY

if (!API_KEY) {
  console.error('\n❌  BREVO_API_KEY manquante.')
  console.error('    Usage : BREVO_API_KEY=re_xxx node scripts/setup-brevo.js\n')
  process.exit(1)
}

const BASE = 'https://api.brevo.com/v3'
const HEADERS = { 'api-key': API_KEY, 'Content-Type': 'application/json' }

// Attributs à créer (type "text" = champ libre)
const ATTRIBUTES = ['PAYS_CIBLE', 'SITUATION', 'REVENUS', 'SOURCE']

// Listes à créer
const LISTS = [
  { name: 'Newsletter — Le Conseiller Fiscal' },
  { name: 'Leads — Bilan Fiscal' },
]

async function createAttribute(name) {
  const res = await fetch(`${BASE}/contacts/attributes/normal/${name}`, {
    method: 'POST',
    headers: HEADERS,
    body: JSON.stringify({ type: 'text' }),
  })

  if (res.status === 400) {
    const err = await res.json().catch(() => ({}))
    if (err.code === 'duplicate_parameter') {
      console.log(`  ✓ Attribut "${name}" — déjà existant`)
      return
    }
  }

  if (!res.ok) {
    const err = await res.text()
    console.error(`  ✗ Attribut "${name}" — erreur ${res.status}: ${err}`)
    return
  }

  console.log(`  ✓ Attribut "${name}" — créé`)
}

async function createList(name) {
  const res = await fetch(`${BASE}/contacts/lists`, {
    method: 'POST',
    headers: HEADERS,
    body: JSON.stringify({ name, folderId: 1 }),
  })

  if (!res.ok) {
    const err = await res.text()
    console.error(`  ✗ Liste "${name}" — erreur ${res.status}: ${err}`)
    return null
  }

  const data = await res.json()
  console.log(`  ✓ Liste "${name}" — créée (ID: ${data.id})`)
  return data.id
}

async function main() {
  console.log('\n━━━ Brevo Setup — Le Conseiller Fiscal ━━━\n')

  console.log('1. Création des attributs personnalisés...')
  for (const attr of ATTRIBUTES) {
    await createAttribute(attr)
  }

  console.log('\n2. Création des listes...')
  const ids = []
  for (const list of LISTS) {
    const id = await createList(list.name)
    if (id) ids.push({ name: list.name, id })
  }

  console.log('\n━━━ Configuration terminée ! ━━━\n')
  console.log('Ajoutez ces IDs dans vos variables d\'environnement Vercel :\n')

  if (ids[0]) console.log(`  BREVO_NEWSLETTER_LIST_ID=${ids[0].id}   # ${ids[0].name}`)
  if (ids[1]) console.log(`  BREVO_LEADS_LIST_ID=${ids[1].id}        # ${ids[1].name}`)

  console.log('\n')
}

main().catch(console.error)
