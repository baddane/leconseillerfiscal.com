// Helpers de tracking — sûrs à appeler partout : si les pixels ne sont pas
// chargés (pas de consentement / pas d'ID configuré), les appels sont ignorés.

type Params = Record<string, unknown>

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void
    fbq?: (...args: unknown[]) => void
    dataLayer?: unknown[]
  }
}

export function trackEvent(name: string, params: Params = {}): void {
  if (typeof window === 'undefined') return
  try { window.gtag?.('event', name, params) } catch { /* noop */ }
}

/**
 * Conversion « Lead » — capture d'e-mail ou demande de bilan.
 * Envoie l'événement à GA4 (generate_lead) et à Meta (Lead).
 */
export function trackLead(source: string, extra: Params = {}): void {
  if (typeof window === 'undefined') return
  try { window.gtag?.('event', 'generate_lead', { lead_source: source, ...extra }) } catch { /* noop */ }
  try { window.fbq?.('track', 'Lead', { content_name: source, ...extra }) } catch { /* noop */ }
}

export {}
