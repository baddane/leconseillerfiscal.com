'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Send, CheckCircle, ShieldCheck, Clock, Star, ArrowRight } from 'lucide-react'

const pays_options = [
  'Portugal', 'Émirats Arabes Unis (Dubaï)', 'Suisse', 'Espagne', 'Canada',
  'Belgique', 'Luxembourg', 'Thaïlande', 'Singapour', 'Île Maurice',
  'Allemagne', 'Pays-Bas', 'Italie', 'Royaume-Uni', 'États-Unis',
  'Australie', 'Maroc', 'Mexique', 'Costa Rica', 'Japon', 'Autre',
]

const situations = [
  'Salarié souhaitant partir à l\'étranger',
  'Entrepreneur / Freelance expatrié',
  'Retraité cherchant un pays fiscalement avantageux',
  'Digital nomad',
  'Déjà expatrié, optimiser ma situation',
  'Retour en France en préparation',
  'Investisseur / revenus passifs',
  'Autre situation',
]

const revenus_ranges = [
  'Moins de 30 000 € / an',
  '30 000 – 60 000 € / an',
  '60 000 – 100 000 € / an',
  '100 000 – 200 000 € / an',
  'Plus de 200 000 € / an',
  'Préfère ne pas répondre',
]

const guarantees = [
  { icon: ShieldCheck, text: 'Données 100% confidentielles' },
  { icon: Clock, text: 'Réponse sous 48h ouvrées' },
  { icon: Star, text: 'Analyse personnalisée gratuite' },
]

const steps = [
  { n: '1', title: 'Remplissez le formulaire', desc: 'Décrivez votre situation en 3 minutes.' },
  { n: '2', title: 'Nous analysons', desc: 'Notre équipe étudie votre profil fiscal en détail.' },
  { n: '3', title: 'Vous recevez votre analyse', desc: 'Un email personnalisé avec recommandations concrètes sous 48h.' },
]

export default function BilanFiscalPage() {
  const [form, setForm] = useState({
    nom: '', email: '', telephone: '',
    pays: '', situation: '', revenus: '', message: '',
  })
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')

  function update(field: string, value: string) {
    setForm((f) => ({ ...f, [field]: value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setStatus('loading')
    try {
      const res = await fetch('/api/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, source: 'bilan-fiscal' }),
      })
      setStatus(res.ok ? 'success' : 'error')
    } catch {
      setStatus('error')
    }
  }

  return (
    <div className="pt-32 pb-24">
      {/* Header */}
      <section className="px-6 pb-16 border-b border-ink/5">
        <div className="max-w-4xl mx-auto">
          <span className="inline-block px-3 py-1 bg-gold/10 text-gold font-mono text-xs font-bold tracking-widest uppercase mb-6">
            Gratuit · Sans engagement
          </span>
          <h1 className="text-5xl md:text-7xl font-black leading-tight mb-6 font-serif">
            Votre Bilan <span className="italic text-gold">Fiscal</span> Gratuit.
          </h1>
          <p className="max-w-2xl text-lg text-ink/60 leading-relaxed font-sans">
            Décrivez votre situation en quelques lignes. Nos experts analysent votre profil
            et vous envoient une analyse personnalisée avec des recommandations concrètes,
            gratuitement, sous 48 heures.
          </p>
        </div>
      </section>

      <section className="px-6 py-16">
        <div className="max-w-5xl mx-auto grid lg:grid-cols-5 gap-16">

          {/* Form */}
          <div className="lg:col-span-3">
            {status === 'success' ? (
              <div className="border border-gold/30 bg-gold/5 p-12 text-center">
                <div className="w-16 h-16 bg-gold/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle className="w-8 h-8 text-gold" />
                </div>
                <h2 className="font-serif text-2xl font-bold mb-4 text-ink">
                  Demande bien reçue !
                </h2>
                <p className="text-ink/70 font-sans mb-6 leading-relaxed">
                  Nous avons reçu votre demande de bilan fiscal. Notre équipe va analyser
                  votre situation et vous envoyer une réponse personnalisée sous 48 heures ouvrées.
                </p>
                <p className="text-sm text-ink/50 font-mono">
                  En attendant, explorez nos guides par pays →
                </p>
                <div className="mt-6 flex justify-center">
                  <Link
                    href="/expatriation"
                    className="inline-flex items-center gap-2 bg-ink text-paper px-6 py-3 font-mono text-xs tracking-widest uppercase hover:bg-gold hover:text-ink transition-all"
                  >
                    Explorer les guides <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                <div className="grid sm:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="bilan-nom" className="block font-mono text-xs uppercase tracking-widest text-grey mb-2">
                      Prénom & Nom *
                    </label>
                    <input
                      id="bilan-nom"
                      type="text"
                      required
                      value={form.nom}
                      onChange={(e) => update('nom', e.target.value)}
                      className="w-full px-4 py-3 border border-ink/10 bg-white focus:border-gold focus:outline-none font-sans transition-colors"
                      placeholder="Jean Dupont"
                    />
                  </div>
                  <div>
                    <label htmlFor="bilan-email" className="block font-mono text-xs uppercase tracking-widest text-grey mb-2">
                      Email *
                    </label>
                    <input
                      id="bilan-email"
                      type="email"
                      required
                      value={form.email}
                      onChange={(e) => update('email', e.target.value)}
                      className="w-full px-4 py-3 border border-ink/10 bg-white focus:border-gold focus:outline-none font-sans transition-colors"
                      placeholder="jean@example.com"
                    />
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="bilan-telephone" className="block font-mono text-xs uppercase tracking-widest text-grey mb-2">
                      Téléphone (optionnel)
                    </label>
                    <input
                      id="bilan-telephone"
                      type="tel"
                      pattern="[\d\s\-+().]{7,20}"
                      title="Numéro de téléphone valide (7 à 20 caractères)"
                      value={form.telephone}
                      onChange={(e) => update('telephone', e.target.value)}
                      className="w-full px-4 py-3 border border-ink/10 bg-white focus:border-gold focus:outline-none font-sans transition-colors"
                      placeholder="+33 6 12 34 56 78"
                    />
                  </div>
                  <div>
                    <label htmlFor="bilan-pays" className="block font-mono text-xs uppercase tracking-widest text-grey mb-2">
                      Pays d&apos;intérêt
                    </label>
                    <select
                      id="bilan-pays"
                      value={form.pays}
                      onChange={(e) => update('pays', e.target.value)}
                      className="w-full px-4 py-3 border border-ink/10 bg-white focus:border-gold focus:outline-none font-sans transition-colors"
                    >
                      <option value="">Choisir un pays...</option>
                      {pays_options.map((p) => (
                        <option key={p} value={p}>{p}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label htmlFor="bilan-situation" className="block font-mono text-xs uppercase tracking-widest text-grey mb-2">
                    Votre situation
                  </label>
                  <select
                    id="bilan-situation"
                    value={form.situation}
                    onChange={(e) => update('situation', e.target.value)}
                    className="w-full px-4 py-3 border border-ink/10 bg-white focus:border-gold focus:outline-none font-sans transition-colors"
                  >
                    <option value="">Sélectionner votre profil...</option>
                    {situations.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="bilan-revenus" className="block font-mono text-xs uppercase tracking-widest text-grey mb-2">
                    Revenus annuels (optionnel)
                  </label>
                  <select
                    id="bilan-revenus"
                    value={form.revenus}
                    onChange={(e) => update('revenus', e.target.value)}
                    className="w-full px-4 py-3 border border-ink/10 bg-white focus:border-gold focus:outline-none font-sans transition-colors"
                  >
                    <option value="">Sélectionner une tranche...</option>
                    {revenus_ranges.map((r) => (
                      <option key={r} value={r}>{r}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="bilan-message" className="block font-mono text-xs uppercase tracking-widest text-grey mb-2">
                    Décrivez votre situation *
                  </label>
                  <textarea
                    id="bilan-message"
                    required
                    rows={5}
                    maxLength={5000}
                    value={form.message}
                    onChange={(e) => update('message', e.target.value)}
                    className="w-full px-4 py-3 border border-ink/10 bg-white focus:border-gold focus:outline-none font-sans transition-colors resize-y"
                    placeholder="Ex : Je suis salarié en CDI, je souhaite m'expatrier au Portugal dans 6 mois. J'ai un appartement en France que je souhaite conserver en location. Quelles sont les implications fiscales ?"
                  />
                </div>

                {status === 'error' && (
                  <p className="text-red font-mono text-sm">
                    Une erreur est survenue. Réessayez ou contactez-nous directement.
                  </p>
                )}

                <button
                  type="submit"
                  disabled={status === 'loading'}
                  className="bg-gold text-ink px-8 py-4 font-mono text-xs tracking-widest uppercase hover:bg-gold/80 transition-all flex items-center justify-center gap-2 disabled:opacity-60 font-bold self-start"
                >
                  {status === 'loading' ? 'Envoi en cours...' : (
                    <><Send className="w-4 h-4" /> Demander mon bilan fiscal gratuit</>
                  )}
                </button>

                <p className="text-xs text-ink/40 font-sans">
                  En soumettant ce formulaire, vous acceptez d&apos;être recontacté par email.
                  Aucun engagement. Désabonnement possible à tout moment.
                </p>
              </form>
            )}
          </div>

          {/* Sidebar */}
          <aside className="lg:col-span-2">
            <div className="sticky top-28 flex flex-col gap-6">
              {/* How it works */}
              <div className="bg-ink text-paper p-6">
                <div className="font-mono text-xs uppercase tracking-widest text-gold mb-4">
                  Comment ça marche ?
                </div>
                <div className="flex flex-col gap-5">
                  {steps.map((step) => (
                    <div key={step.n} className="flex items-start gap-4">
                      <div className="w-8 h-8 bg-gold text-ink flex items-center justify-center font-mono font-bold text-sm flex-shrink-0">
                        {step.n}
                      </div>
                      <div>
                        <div className="font-serif font-bold text-sm mb-0.5">{step.title}</div>
                        <div className="text-xs text-paper/50 font-sans">{step.desc}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Guarantees */}
              <div className="border border-ink/10 bg-white p-6">
                <div className="font-mono text-xs uppercase tracking-widest text-ink/40 mb-4">
                  Nos engagements
                </div>
                <div className="flex flex-col gap-3">
                  {guarantees.map(({ icon: Icon, text }) => (
                    <div key={text} className="flex items-center gap-3">
                      <Icon className="w-4 h-4 text-gold flex-shrink-0" />
                      <span className="text-sm font-sans text-ink/70">{text}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Disclaimer */}
              <div className="bg-cream border border-border p-4 text-xs text-ink/50 font-sans leading-relaxed">
                <strong className="text-ink/70 font-mono uppercase tracking-wider">Note :</strong>{' '}
                Ce bilan est fourni à titre informatif. Pour un accompagnement complet, nous vous
                orienterons vers un fiscaliste partenaire qualifié.
              </div>
            </div>
          </aside>
        </div>
      </section>
    </div>
  )
}
