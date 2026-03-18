'use client'

import { useState, useEffect, useCallback } from 'react'
import { X, FileText, Mail } from 'lucide-react'

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

    // Fallback timer for mobile (90s — less aggressive)
    const timer = setTimeout(() => {
      if (!triggered) {
        triggered = true
        setVisible(true)
      }
    }, 90000)

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
        {/* Top gold bar */}
        <div className="h-1 bg-gold w-full" />

        <button
          onClick={dismiss}
          className="absolute top-4 right-4 text-ink/40 hover:text-ink transition-colors"
          aria-label="Fermer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-8 md:p-10">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-gold/10 flex items-center justify-center flex-shrink-0">
              <FileText className="w-6 h-6 text-gold" />
            </div>
            <div>
              <div className="font-mono text-xs uppercase tracking-widest text-gold mb-1">
                Ressource Gratuite
              </div>
              <h2 className="font-serif text-xl font-black leading-tight">
                Checklist : 10 étapes fiscales avant de quitter la France
              </h2>
            </div>
          </div>

          <p className="text-ink/60 text-sm leading-relaxed mb-6 font-sans">
            Évitez les erreurs coûteuses. Notre checklist détaille les démarches fiscales essentielles
            pour sécuriser votre départ : résidence fiscale, exit tax, conventions, comptes bancaires…
          </p>

          {status === 'success' ? (
            <div className="bg-gold/10 border border-gold/20 p-6 text-center">
              <div className="text-2xl mb-2">✓</div>
              <p className="font-serif font-bold text-ink mb-1">Parfait, c&apos;est parti !</p>
              <p className="text-sm text-ink/60 font-sans">
                Vous recevrez la checklist dans votre boîte mail sous peu.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-3">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="votre@email.com"
                required
                className="px-4 py-3 border border-ink/15 bg-white focus:border-gold focus:outline-none font-mono text-sm"
              />
              <button
                type="submit"
                disabled={status === 'loading'}
                className="bg-gold text-ink px-6 py-3 font-mono text-xs tracking-widest uppercase hover:bg-gold/80 transition-all flex items-center justify-center gap-2 disabled:opacity-60 font-bold"
              >
                <Mail className="w-4 h-4" />
                {status === 'loading' ? 'Envoi...' : 'Recevoir la checklist gratuite'}
              </button>
              {status === 'error' && (
                <p className="text-xs text-red font-mono">Erreur. Réessayez ou écrivez-nous.</p>
              )}
            </form>
          )}

          <button
            onClick={dismiss}
            className="mt-4 text-xs text-ink/30 hover:text-ink/50 transition-colors font-mono underline"
          >
            Non merci, je connais déjà mes obligations fiscales
          </button>
        </div>
      </div>
    </div>
  )
}
