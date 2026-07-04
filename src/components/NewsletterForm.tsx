'use client'

import { useState } from 'react'
import { Download, FileText } from 'lucide-react'
import { trackLead } from '@/lib/track'

export default function NewsletterForm() {
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
      if (res.ok) {
        setStatus('success')
        setEmail('')
        trackLead('newsletter-home')
      } else {
        setStatus('error')
      }
    } catch {
      setStatus('error')
    }
  }

  return (
    <section className="py-24 px-6">
      <div className="max-w-5xl mx-auto bg-gold p-12 md:p-20 text-ink relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row items-center gap-12">
          <div className="flex-1">
            <div className="font-mono text-xs uppercase tracking-widest mb-4 opacity-60">
              Ressource gratuite · PDF
            </div>
            <h2 className="font-serif text-4xl md:text-5xl font-black mb-6 leading-tight">
              Recevez gratuitement la checklist fiscale de l&apos;expatrié.
            </h2>
            <p className="text-ink/70 text-lg mb-6">
              <strong>10 étapes fiscales obligatoires avant de quitter la France</strong> — domicile fiscal, exit tax, épargne, protection sociale. Entrez votre e-mail : vous recevez le PDF immédiatement.
            </p>
            <p className="flex flex-wrap items-center gap-x-4 gap-y-1 text-ink/60 font-mono text-xs uppercase tracking-wider mb-8">
              <span>✓ Envoi immédiat</span><span>✓ 100% gratuit</span><span>✓ Sans spam</span>
            </p>

            {status === 'success' ? (
              <div className="bg-ink text-paper px-8 py-6">
                <div className="font-mono text-sm mb-4">✓ Inscription confirmée — votre checklist est prête.</div>
                <a
                  href="/checklist-fiscale-expatrie.pdf"
                  download
                  className="inline-flex items-center gap-2 bg-gold text-ink px-6 py-3 font-mono text-xs tracking-widest uppercase hover:bg-gold/80 transition-all font-bold"
                >
                  ⬇ Télécharger la checklist (PDF)
                </a>
                <p className="mt-3 text-paper/60 font-mono text-[11px]">Nous vous l&apos;avons aussi envoyée par e-mail.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="votre@email.com"
                  required
                  className="flex-1 px-6 py-4 bg-white/30 border border-ink/10 placeholder:text-ink/40 focus:outline-none focus:bg-white/50 transition-all font-mono text-sm"
                />
                <button
                  type="submit"
                  disabled={status === 'loading'}
                  className="bg-ink text-paper px-8 py-4 font-mono text-xs tracking-widest uppercase hover:bg-ink/80 transition-all flex items-center justify-center gap-2 disabled:opacity-60"
                >
                  {status === 'loading' ? 'Envoi...' : (
                    <><Download className="w-4 h-4" /> Recevoir le PDF gratuit</>
                  )}
                </button>
              </form>
            )}

            {status === 'error' && (
              <p className="mt-3 text-sm text-ink/70 font-mono">
                Une erreur est survenue. Réessayez ou écrivez-nous directement.
              </p>
            )}
          </div>
          <div className="hidden lg:flex items-center justify-center w-48 h-48 opacity-10">
            <FileText className="w-32 h-32" />
          </div>
        </div>
      </div>
    </section>
  )
}
