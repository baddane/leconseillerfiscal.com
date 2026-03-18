'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Settings, X, Check, ChevronDown, ChevronUp, Shield } from 'lucide-react'

export interface CookieConsent {
  necessary: true
  analytics: boolean
  marketing: boolean
  savedAt: number // timestamp ms
}

const STORAGE_KEY = 'lcf_cookie_consent'
const CONSENT_DURATION_MS = 13 * 30 * 24 * 60 * 60 * 1000 // 13 mois (CNIL)

export function getConsent(): CookieConsent | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const parsed: CookieConsent = JSON.parse(raw)
    if (Date.now() - parsed.savedAt > CONSENT_DURATION_MS) {
      localStorage.removeItem(STORAGE_KEY)
      return null
    }
    return parsed
  } catch {
    return null
  }
}

function saveConsent(analytics: boolean, marketing: boolean) {
  const consent: CookieConsent = {
    necessary: true,
    analytics,
    marketing,
    savedAt: Date.now(),
  }
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(consent))
  } catch {}
  // Notify other components that consent changed
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('lcf_consent_changed', { detail: consent }))
  }
  return consent
}

const categories = [
  {
    id: 'necessary' as const,
    label: 'Cookies nécessaires',
    description:
      'Indispensables au fonctionnement du site (préférences UI, sécurité des formulaires). Ne peuvent pas être désactivés.',
    always: true,
  },
  {
    id: 'analytics' as const,
    label: 'Cookies analytiques',
    description:
      'Nous aident à comprendre comment les visiteurs utilisent le site (pages vues, durée). Données anonymisées et agrégées — aucune identification individuelle.',
    always: false,
  },
  {
    id: 'marketing' as const,
    label: 'Cookies de mesure d\'affiliation',
    description:
      'Permettent de mesurer les performances des liens partenaires (Wise, Revolut, ACS, etc.) via des traceurs anonymisés. Aucune publicité ciblée.',
    always: false,
  },
]

export default function CookieBanner() {
  const [show, setShow] = useState(false)
  const [panel, setPanel] = useState(false)
  const [analytics, setAnalytics] = useState(false)
  const [marketing, setMarketing] = useState(false)

  useEffect(() => {
    if (!getConsent()) {
      // Small delay so the banner doesn't flash during hydration
      const t = setTimeout(() => setShow(true), 600)
      return () => clearTimeout(t)
    }
  }, [])

  function acceptAll() {
    saveConsent(true, true)
    setShow(false)
  }

  function refuseAll() {
    saveConsent(false, false)
    setShow(false)
  }

  function saveCustom() {
    saveConsent(analytics, marketing)
    setShow(false)
  }

  if (!show) return null

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Gestion des cookies"
      className="fixed bottom-0 left-0 right-0 z-[300] shadow-2xl"
    >
      {/* Gold top accent line */}
      <div className="h-0.5 bg-gradient-to-r from-gold/40 via-gold to-gold/40" />

      <div className="bg-paper border-t border-ink/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-5">

          {/* Main banner row */}
          {!panel && (
            <div className="flex flex-col md:flex-row md:items-center gap-5">
              {/* Icon + text */}
              <div className="flex items-start gap-3 flex-1 min-w-0">
                <Shield className="w-5 h-5 text-gold flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-mono text-xs font-bold uppercase tracking-widest text-ink mb-1">
                    Respect de votre vie privée
                  </p>
                  <p className="text-sm text-ink/60 font-sans leading-relaxed">
                    Nous utilisons des cookies pour améliorer votre expérience et mesurer les performances du site.
                    Vous pouvez accepter, refuser ou personnaliser vos choix.{' '}
                    <Link href="/confidentialite" className="text-gold underline underline-offset-2 hover:text-gold/70 transition-colors whitespace-nowrap">
                      Politique de confidentialité
                    </Link>
                  </p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-wrap items-center gap-2 flex-shrink-0">
                {/* Personnaliser — text link, less prominent */}
                <button
                  onClick={() => setPanel(true)}
                  className="flex items-center gap-1.5 text-xs font-mono text-ink/50 hover:text-ink transition-colors underline underline-offset-2 px-1"
                >
                  <Settings className="w-3.5 h-3.5" />
                  Personnaliser
                </button>

                {/* Refuser — CNIL: doit être aussi accessible qu'Accepter */}
                <button
                  onClick={refuseAll}
                  className="px-5 py-2.5 border border-ink/20 font-mono text-xs tracking-widest uppercase hover:bg-ink/5 transition-all font-bold text-ink/70"
                >
                  Tout refuser
                </button>

                {/* Accepter */}
                <button
                  onClick={acceptAll}
                  className="px-5 py-2.5 bg-gold text-ink font-mono text-xs tracking-widest uppercase hover:bg-gold/80 transition-all font-bold flex items-center gap-1.5"
                >
                  <Check className="w-3.5 h-3.5" />
                  Tout accepter
                </button>
              </div>
            </div>
          )}

          {/* Preferences panel */}
          {panel && (
            <div>
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setPanel(false)}
                    className="text-ink/40 hover:text-ink transition-colors"
                    aria-label="Retour"
                  >
                    <ChevronUp className="w-4 h-4" />
                  </button>
                  <span className="font-mono text-xs font-bold uppercase tracking-widest">
                    Paramétrer mes préférences
                  </span>
                </div>
              </div>

              <div className="flex flex-col gap-3 mb-5">
                {categories.map((cat) => {
                  const checked = cat.always
                    ? true
                    : cat.id === 'analytics'
                    ? analytics
                    : marketing

                  return (
                    <div
                      key={cat.id}
                      className="flex items-start gap-4 border border-ink/8 bg-white/60 p-4"
                    >
                      {/* Toggle */}
                      <button
                        role="switch"
                        aria-checked={checked}
                        aria-label={cat.label}
                        disabled={cat.always}
                        onClick={() => {
                          if (cat.id === 'analytics') setAnalytics((v) => !v)
                          if (cat.id === 'marketing') setMarketing((v) => !v)
                        }}
                        className={[
                          'relative flex-shrink-0 mt-0.5 w-10 h-5 rounded-full transition-colors',
                          cat.always ? 'cursor-not-allowed' : 'cursor-pointer',
                          checked ? 'bg-gold' : 'bg-ink/15',
                        ].join(' ')}
                      >
                        <span
                          className={[
                            'absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform',
                            checked ? 'translate-x-5' : 'translate-x-0.5',
                          ].join(' ')}
                        />
                      </button>

                      <div className="min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className="font-mono text-xs font-bold uppercase tracking-wider">
                            {cat.label}
                          </span>
                          {cat.always && (
                            <span className="px-1.5 py-0.5 bg-ink/5 text-ink/40 font-mono text-[10px] uppercase tracking-wider">
                              Requis
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-ink/50 font-sans leading-relaxed">
                          {cat.description}
                        </p>
                      </div>
                    </div>
                  )
                })}
              </div>

              {/* Save custom */}
              <div className="flex flex-wrap items-center justify-end gap-2">
                <button
                  onClick={refuseAll}
                  className="px-5 py-2.5 border border-ink/20 font-mono text-xs tracking-widest uppercase hover:bg-ink/5 transition-all font-bold text-ink/70"
                >
                  Tout refuser
                </button>
                <button
                  onClick={saveCustom}
                  className="px-5 py-2.5 bg-ink text-paper font-mono text-xs tracking-widest uppercase hover:bg-gold hover:text-ink transition-all font-bold"
                >
                  Enregistrer mes choix
                </button>
                <button
                  onClick={acceptAll}
                  className="px-5 py-2.5 bg-gold text-ink font-mono text-xs tracking-widest uppercase hover:bg-gold/80 transition-all font-bold flex items-center gap-1.5"
                >
                  <Check className="w-3.5 h-3.5" />
                  Tout accepter
                </button>
              </div>

              <p className="mt-3 text-[10px] text-ink/30 font-sans">
                Votre choix est conservé pendant 13 mois, conformément aux recommandations de la CNIL.
                Vous pouvez modifier vos préférences à tout moment via la page{' '}
                <Link href="/confidentialite" className="underline hover:text-ink/50 transition-colors">
                  Politique de confidentialité
                </Link>.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
