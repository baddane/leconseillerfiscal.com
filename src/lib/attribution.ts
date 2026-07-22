// Traçabilité de l'origine des leads (first-touch).
// La première page visitée de la session enregistre l'origine (UTM + referrer
// externe + page d'entrée) dans le sessionStorage ; tous les formulaires
// l'attachent ensuite à leur envoi. On capture la PREMIÈRE source pour ne pas
// la perdre lorsque le visiteur navigue sur le site avant de convertir.

export interface Attribution {
  utm_source?: string
  utm_medium?: string
  utm_campaign?: string
  utm_content?: string
  referrer?: string
  landing_page?: string
}

// Champs partagés client + serveur (le serveur les assainit à la réception).
export const ATTRIBUTION_FIELDS = [
  'utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'referrer', 'landing_page',
] as const

const KEY = 'lcf_attribution'
const UTM_KEYS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content'] as const

/**
 * Extrait et assainit les champs d'attribution d'un corps de requête (serveur).
 * Fonction pure (aucun accès au DOM) : sûre à importer dans une route API.
 */
export function pickAttribution(
  body: Record<string, unknown>,
  sanitize: (v: unknown, max: number) => string,
): Partial<Record<(typeof ATTRIBUTION_FIELDS)[number], string>> {
  const out: Partial<Record<(typeof ATTRIBUTION_FIELDS)[number], string>> = {}
  for (const f of ATTRIBUTION_FIELDS) {
    const v = sanitize(body[f], 300)
    if (v) out[f] = v
  }
  return out
}

/** À appeler au chargement de chaque page : ne capture qu'une fois par session. */
export function captureAttribution(): void {
  if (typeof window === 'undefined') return
  try {
    if (sessionStorage.getItem(KEY)) return // origine déjà figée pour la session
    const params = new URLSearchParams(window.location.search)
    const data: Attribution = {}
    for (const k of UTM_KEYS) {
      const v = params.get(k)
      if (v) data[k] = v.slice(0, 200)
    }
    // Referrer externe uniquement (on ignore la navigation interne au site)
    const ref = document.referrer
    if (ref && !ref.startsWith(window.location.origin)) {
      data.referrer = ref.slice(0, 300)
    }
    data.landing_page = (window.location.pathname + window.location.search).slice(0, 300)
    sessionStorage.setItem(KEY, JSON.stringify(data))
  } catch { /* noop */ }
}

/** Renvoie l'origine figée de la session (objet vide si rien). */
export function getAttribution(): Attribution {
  if (typeof window === 'undefined') return {}
  try {
    const raw = sessionStorage.getItem(KEY)
    return raw ? (JSON.parse(raw) as Attribution) : {}
  } catch {
    return {}
  }
}
