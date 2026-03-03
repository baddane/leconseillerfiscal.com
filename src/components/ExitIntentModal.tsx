'use client'

import { useState, useEffect, useCallback } from 'react'
import { X, Mail, ArrowRight } from 'lucide-react'
import Link from 'next/link'

export default function ExitIntentModal() {
  const [visible, setVisible] = useState(false)
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')

  const dismiss = useCallback(() => {
    setVisible(false)
    try { localStorage.setItem('lcf_exit_dismissed', '1') } catch {}
  }, [])

  useEffect(() => {
    try {
      if (localStorage.getItem('lcf_exit_dismissed')) return
    } catch {}

    let triggered = false

    function onMouseLeave(e: MouseEvent) {
      if (triggered) return
      if (e.clientY <= 5) {
        triggered = true
        setVisible(true)
      }
    }

    // Fallback timer for mobile (45s)
    const timer = setTimeout(() => {
      if (!triggered) {
        triggered = true
        setVisible(true)
      }
    }, 45000)

    document.addEventListener('mouseleave', onMouseLeave)
    return () => {
      document.removeEventListener('mouseleave', onMouseLeave)
      clearTimeout(timer)
    }
  }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!email) return
    setStatus('loading')
    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      if (res.ok) {
        setStatus('success')
        try { localStorage.setItem('lcf_exit_dismissed', '1') } catch {}
      } else {
        setStatus('error')
      }
    } catch {
      setStatus('error')
    }
  }

  if (!visible) return null

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-ink/60 backdrop-blur-sm">
      <div className="relative max-w-lg w-full bg-paper border border-ink/10 shadow-2xl overflow-hidden">
        <div className="h-1 bg-gold w-full" />

        <button
          onClick={dismiss}
          className="absolute top-4 right-4 text-ink/40 hover:text-ink transition-colors"
          aria-label="Fermer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-8 md:p-10">
          <div className="font-mono text-xs uppercase tracking-widest text-gold mb-3">
            Avant de partir
          </div>
          <h2 className="font-serif text-2xl font-black leading-tight mb-4">
            Votre situation fiscale mérite une analyse sérieuse.
          </h2>
          <p className="text-ink/60 text-sm leading-relaxed mb-6 font-sans">
            Décrivez votre projet en 3 minutes. Nos experts analysent votre profil
            et vous répondent personnellement sous 48h — gratuitement, sans engagement.
          </p>

          <Link
            href="/bilan-fiscal"
            onClick={dismiss}
            className="flex items-center justify-center gap-2 bg-gold text-ink px-6 py-3 font-mono text-xs tracking-widest uppercase hover:bg-gold/80 transition-all font-bold mb-6"
          >
            Demander mon bilan fiscal gratuit <ArrowRight className="w-4 h-4" />
          </Link>

          <div className="border-t border-ink/8 pt-5">
            <p className="text-xs text-ink/40 font-mono mb-3 uppercase tracking-widest">
              Ou restez simplement informé
            </p>
            {status === 'success' ? (
              <div className="text-sm font-mono text-gold">
                ✓ Inscription confirmée — bienvenue !
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex gap-2">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="votre@email.com"
                  required
                  className="flex-1 px-3 py-2.5 border border-ink/15 bg-white focus:border-gold focus:outline-none font-mono text-sm"
                />
                <button
                  type="submit"
                  disabled={status === 'loading'}
                  className="bg-ink text-paper px-4 py-2.5 font-mono text-xs tracking-widest uppercase hover:bg-ink/80 transition-all flex items-center gap-1.5 disabled:opacity-60 whitespace-nowrap"
                >
                  <Mail className="w-3.5 h-3.5" />
                  {status === 'loading' ? '...' : "S'abonner"}
                </button>
              </form>
            )}
            {status === 'error' && (
              <p className="mt-2 text-xs text-red font-mono">Erreur. Réessayez.</p>
            )}
          </div>

          <button
            onClick={dismiss}
            className="mt-5 text-xs text-ink/25 hover:text-ink/50 transition-colors font-mono underline"
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  )
}
