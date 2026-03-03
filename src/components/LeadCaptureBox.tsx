'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Mail, ArrowRight } from 'lucide-react'

interface Props {
  pays?: string
  variant?: 'email' | 'cta'
}

export default function LeadCaptureBox({ pays, variant = 'email' }: Props) {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')

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
      setStatus(res.ok ? 'success' : 'error')
    } catch {
      setStatus('error')
    }
  }

  if (variant === 'cta') {
    return (
      <div className="my-10 border-l-4 border-gold bg-gold/5 p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="font-mono text-xs uppercase tracking-widest text-gold mb-1">
            Situation personnelle ?
          </div>
          <p className="font-serif font-bold text-lg leading-tight">
            Obtenez un bilan fiscal gratuit{pays ? ` pour votre expatriation ${pays}` : ''}.
          </p>
          <p className="text-sm text-ink/60 font-sans mt-1">
            Réponse personnalisée sous 48h ouvrées.
          </p>
        </div>
        <Link
          href="/bilan-fiscal"
          className="flex-shrink-0 bg-ink text-paper px-6 py-3 font-mono text-xs tracking-widest uppercase hover:bg-gold hover:text-ink transition-all flex items-center gap-2 font-bold"
        >
          Commencer <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    )
  }

  return (
    <div className="my-10 bg-ink text-paper p-8">
      <div className="max-w-xl">
        <div className="font-mono text-xs uppercase tracking-widest text-gold mb-3">
          Restez informé
        </div>
        <h3 className="font-serif text-2xl font-bold mb-2 leading-tight">
          Recevez nos analyses{pays ? ` sur la fiscalité ${pays}` : ' exclusives'}.
        </h3>
        <p className="text-paper/60 text-sm font-sans mb-5">
          Rejoignez nos abonnés et soyez notifié en priorité des évolutions fiscales.
        </p>

        {status === 'success' ? (
          <div className="flex items-center gap-2 text-gold font-mono text-sm">
            <span>✓</span> Inscription confirmée — bienvenue !
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="votre@email.com"
              required
              className="flex-1 px-4 py-3 bg-white/10 border border-white/10 text-paper placeholder:text-paper/30 focus:outline-none focus:border-gold/50 font-mono text-sm"
            />
            <button
              type="submit"
              disabled={status === 'loading'}
              className="bg-gold text-ink px-6 py-3 font-mono text-xs tracking-widest uppercase hover:bg-gold/80 transition-all flex items-center justify-center gap-2 disabled:opacity-60 font-bold whitespace-nowrap"
            >
              <Mail className="w-4 h-4" />
              {status === 'loading' ? 'Envoi...' : "S'abonner"}
            </button>
          </form>
        )}

        {status === 'error' && (
          <p className="mt-2 text-xs text-red font-mono">Erreur. Réessayez ou contactez-nous.</p>
        )}
      </div>
    </div>
  )
}
