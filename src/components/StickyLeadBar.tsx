'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { X, ArrowRight } from 'lucide-react'
import { getConsent } from './CookieBanner'

export default function StickyLeadBar() {
  const [visible, setVisible] = useState(false)
  const [dismissed, setDismissed] = useState(false)
  const [consentGiven, setConsentGiven] = useState(false)

  useEffect(() => {
    try {
      if (localStorage.getItem('lcf_bar_dismissed')) {
        setDismissed(true)
        return
      }
    } catch {}

    // Check consent once, then listen for changes via event
    if (getConsent() !== null) setConsentGiven(true)

    function onConsentChanged() {
      if (getConsent() !== null) setConsentGiven(true)
    }

    window.addEventListener('lcf_consent_changed', onConsentChanged)

    function onScroll() {
      const scrolled = window.scrollY / (document.body.scrollHeight - window.innerHeight)
      if (scrolled > 0.3) setVisible(true)
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('lcf_consent_changed', onConsentChanged)
    }
  }, [])

  function dismiss() {
    setDismissed(true)
    try { localStorage.setItem('lcf_bar_dismissed', '1') } catch {}
  }

  if (dismissed || !visible || !consentGiven) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[100] bg-ink text-paper border-t border-gold/20 shadow-2xl">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-2 h-2 bg-gold rounded-full flex-shrink-0 animate-pulse" />
          <p className="text-sm font-sans text-paper/80 truncate">
            <span className="text-gold font-bold">Bilan Fiscal Gratuit</span>
            <span className="hidden sm:inline"> — Décrivez votre situation, recevez une analyse personnalisée sous 48h</span>
          </p>
        </div>
        <div className="flex items-center gap-3 flex-shrink-0">
          <Link
            href="/bilan-fiscal"
            className="bg-gold text-ink px-5 py-2 font-mono text-xs tracking-widest uppercase hover:bg-gold/80 transition-all flex items-center gap-2 font-bold whitespace-nowrap"
          >
            Commencer <ArrowRight className="w-3.5 h-3.5" />
          </Link>
          <button
            onClick={dismiss}
            className="text-paper/40 hover:text-paper/80 transition-colors"
            aria-label="Fermer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  )
}
