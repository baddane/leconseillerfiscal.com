'use client'

import type { Metadata } from 'next'
import { useState } from 'react'
import { Send, Mail, MessageSquare } from 'lucide-react'

export default function ContactPage() {
  const [form, setForm] = useState({ nom: '', email: '', sujet: 'expatriation', message: '' })
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')

  function update(field: string, value: string) {
    setForm((f) => ({ ...f, [field]: value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setStatus('loading')
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      setStatus(res.ok ? 'success' : 'error')
    } catch {
      setStatus('error')
    }
  }

  return (
    <div className="pt-32 pb-24">
      <section className="px-6 pb-16 border-b border-ink/5">
        <div className="max-w-4xl mx-auto">
          <span className="text-gold font-mono text-xs font-bold tracking-widest uppercase block mb-4">
            Contact
          </span>
          <h1 className="text-5xl md:text-7xl font-black leading-tight mb-6 font-serif">
            Parlons de votre <span className="italic text-gold">situation.</span>
          </h1>
          <p className="max-w-2xl text-lg text-ink/60 leading-relaxed font-sans">
            Une question sur votre expatriation ? Besoin d&apos;un avis sur votre situation fiscale ? Remplissez le formulaire ci-dessous et nous vous répondrons dans les 48 heures.
          </p>
        </div>
      </section>

      <section className="px-6 py-16">
        <div className="max-w-4xl mx-auto grid lg:grid-cols-3 gap-16">
          <div className="lg:col-span-2">
            {status === 'success' ? (
              <div className="border border-green-200 bg-green-50 p-12 text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Send className="w-8 h-8 text-green-700" />
                </div>
                <h2 className="font-serif text-2xl font-bold mb-4 text-green-900">Message envoyé</h2>
                <p className="text-green-700 font-sans">
                  Nous avons bien reçu votre demande et vous répondrons dans les 48 heures ouvrées.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                <div className="grid sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block font-mono text-xs uppercase tracking-widest text-grey mb-2">
                      Nom complet *
                    </label>
                    <input
                      type="text"
                      required
                      value={form.nom}
                      onChange={(e) => update('nom', e.target.value)}
                      className="w-full px-4 py-3 border border-ink/10 bg-white focus:border-gold focus:outline-none font-sans transition-colors"
                      placeholder="Jean Dupont"
                    />
                  </div>
                  <div>
                    <label className="block font-mono text-xs uppercase tracking-widest text-grey mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      required
                      value={form.email}
                      onChange={(e) => update('email', e.target.value)}
                      className="w-full px-4 py-3 border border-ink/10 bg-white focus:border-gold focus:outline-none font-sans transition-colors"
                      placeholder="jean@example.com"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-mono text-xs uppercase tracking-widest text-grey mb-2">
                    Sujet
                  </label>
                  <select
                    value={form.sujet}
                    onChange={(e) => update('sujet', e.target.value)}
                    className="w-full px-4 py-3 border border-ink/10 bg-white focus:border-gold focus:outline-none font-sans transition-colors"
                  >
                    <option value="expatriation">Question sur une expatriation</option>
                    <option value="fiscalite">Question fiscale</option>
                    <option value="partenariat">Proposition de partenariat</option>
                    <option value="erreur">Signaler une erreur dans un article</option>
                    <option value="autre">Autre</option>
                  </select>
                </div>

                <div>
                  <label className="block font-mono text-xs uppercase tracking-widest text-grey mb-2">
                    Message *
                  </label>
                  <textarea
                    required
                    rows={6}
                    value={form.message}
                    onChange={(e) => update('message', e.target.value)}
                    className="w-full px-4 py-3 border border-ink/10 bg-white focus:border-gold focus:outline-none font-sans transition-colors resize-y"
                    placeholder="Décrivez votre situation ou votre question..."
                  />
                </div>

                {status === 'error' && (
                  <p className="text-red font-mono text-sm">
                    Une erreur est survenue. Réessayez ou écrivez-nous directement par email.
                  </p>
                )}

                <button
                  type="submit"
                  disabled={status === 'loading'}
                  className="bg-ink text-paper px-8 py-4 font-mono text-xs tracking-widest uppercase hover:bg-gold hover:text-ink transition-all flex items-center justify-center gap-2 disabled:opacity-60 self-start"
                >
                  {status === 'loading' ? 'Envoi en cours...' : (
                    <><Send className="w-4 h-4" /> Envoyer le message</>
                  )}
                </button>
              </form>
            )}
          </div>

          <aside>
            <div className="sticky top-28 flex flex-col gap-6">
              <div className="border border-ink/10 bg-white p-6">
                <div className="w-10 h-10 bg-paper flex items-center justify-center mb-4">
                  <Mail className="w-5 h-5 text-gold" />
                </div>
                <h3 className="font-serif font-bold mb-2">Email direct</h3>
                <p className="text-sm text-ink/60 font-sans mb-2">
                  Pour les demandes urgentes :
                </p>
                <span className="font-mono text-sm text-gold">contact@leconseillerfiscal.com</span>
              </div>

              <div className="border border-ink/10 bg-white p-6">
                <div className="w-10 h-10 bg-paper flex items-center justify-center mb-4">
                  <MessageSquare className="w-5 h-5 text-gold" />
                </div>
                <h3 className="font-serif font-bold mb-2">Délai de réponse</h3>
                <p className="text-sm text-ink/60 font-sans">
                  Nous répondons à toutes les demandes sous 48 heures ouvrées. Les questions complexes nécessitant une recherche approfondie peuvent prendre plus de temps.
                </p>
              </div>

              <div className="bg-cream border border-border p-6 text-xs text-ink/50 font-sans leading-relaxed">
                <strong className="text-ink/70 font-mono uppercase tracking-wider">Note :</strong>{' '}
                Les informations échangées via ce formulaire ne constituent pas un conseil fiscal personnalisé. Pour un accompagnement sur mesure, nous vous orienterons vers un fiscaliste qualifié.
              </div>
            </div>
          </aside>
        </div>
      </section>
    </div>
  )
}
