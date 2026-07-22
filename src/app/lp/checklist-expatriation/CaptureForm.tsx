'use client'

import { useState } from 'react'
import { Download, Check } from 'lucide-react'
import { trackLead } from '@/lib/track'
import { getAttribution } from '@/lib/attribution'

export default function CaptureForm({ id, cta = 'Recevoir le PDF gratuit' }: { id?: string; cta?: string }) {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    if (!email) return
    setStatus('loading')
    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, ...getAttribution() }),
      })
      if (res.ok) {
        setStatus('success')
        trackLead('checklist-pdf-lp')
      } else {
        setStatus('error')
      }
    } catch {
      setStatus('error')
    }
  }

  if (status === 'success') {
    return (
      <div className="bg-ink text-paper p-6 text-center">
        <div className="w-12 h-12 bg-gold/15 rounded-full flex items-center justify-center mx-auto mb-3">
          <Check className="w-6 h-6 text-gold" />
        </div>
        <p className="font-serif text-lg font-bold mb-4">Votre checklist est prête.</p>
        <a
          href="/checklist-fiscale-expatrie.pdf"
          download
          className="inline-flex items-center gap-2 bg-gold text-ink px-6 py-3.5 font-mono text-xs font-bold uppercase tracking-widest hover:bg-gold-light transition-colors"
        >
          <Download className="w-4 h-4" /> Télécharger le PDF
        </a>
        <p className="mt-3 text-paper/50 font-mono text-[11px]">Nous vous l&apos;avons aussi envoyée par e-mail.</p>
      </div>
    )
  }

  return (
    <form id={id} onSubmit={submit} className="flex flex-col gap-3">
      <input
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="votre@email.com"
        className="w-full px-5 py-4 bg-white border border-border text-ink placeholder:text-ink/30 focus:outline-none focus:border-gold transition-colors font-sans"
      />
      <button
        type="submit"
        disabled={status === 'loading'}
        className="w-full bg-gold text-ink py-4 font-mono text-sm font-bold uppercase tracking-widest hover:bg-gold-light transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
      >
        <Download className="w-4 h-4" />
        {status === 'loading' ? 'Envoi…' : cta}
      </button>
      <p className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-grey font-mono text-[11px] uppercase tracking-wider">
        <span>✓ Envoi immédiat</span><span>✓ 100% gratuit</span><span>✓ Sans spam</span>
      </p>
      {status === 'error' && (
        <p className="text-red font-sans text-sm text-center">Une erreur est survenue. Réessayez.</p>
      )}
    </form>
  )
}
