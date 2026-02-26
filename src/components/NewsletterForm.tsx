'use client'

import { useState } from 'react'
import { Mail } from 'lucide-react'

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
              Newsletter gratuite
            </div>
            <h2 className="font-serif text-4xl md:text-5xl font-black mb-6 leading-tight">
              Restez informé des évolutions fiscales.
            </h2>
            <p className="text-ink/70 text-lg mb-8">
              Rejoignez des milliers d&apos;expatriés et recevez nos analyses exclusives directement dans votre boîte mail.
            </p>

            {status === 'success' ? (
              <div className="bg-ink text-paper px-8 py-4 font-mono text-sm">
                ✓ Inscription confirmée — bienvenue !
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
                    <><Mail className="w-4 h-4" /> S&apos;abonner</>
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
            <Mail className="w-32 h-32" />
          </div>
        </div>
      </div>
    </section>
  )
}
