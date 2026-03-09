import Link from 'next/link'
import { Globe, ShieldCheck, TrendingUp, BookOpen, ArrowRight, CheckCircle } from 'lucide-react'
import Hero from '@/components/Hero'
import NewsletterForm from '@/components/NewsletterForm'
import { FadeInCard, HoverScaleCard, FadeIn } from '@/components/AnimatedCard'
import { countries } from '@/data/countries'

const destinations = countries.filter((c) => c.volume >= 4).slice(0, 10)

const pillarData = [
  { iconName: 'Globe', title: 'Vision Globale', desc: '20 destinations couvertes exhaustivement pour les expatriés français, des guides pays aux cas concrets.' },
  { iconName: 'ShieldCheck', title: 'Sécurité Juridique', desc: 'Informations vérifiées régulièrement, basées sur les conventions fiscales officielles et la réglementation en vigueur.' },
  { iconName: 'TrendingUp', title: 'Optimisation', desc: 'Outils comparatifs et guides pratiques pour maximiser vos revenus et minimiser votre pression fiscale légalement.' },
  { iconName: 'BookOpen', title: 'Pédagogie', desc: 'Des guides clairs et accessibles, du guide pays complet aux cas concrets ultra-spécifiques. Gratuit et sans jargon.' },
]

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Globe, ShieldCheck, TrendingUp, BookOpen,
}

const stats = [
  { label: 'Destinations couvertes', value: '20+' },
  { label: 'Articles & Guides', value: '120' },
  { label: 'Pays avec convention', value: '18' },
  { label: 'Accès 100% gratuit', value: '∞' },
]

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <Hero />

      {/* Stats — pure server HTML */}
      <section className="py-12 border-y border-ink/5 bg-white/30">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, i) => (
            <div key={i} className="text-center">
              <div className="text-3xl md:text-4xl font-serif font-black text-ink mb-1">{stat.value}</div>
              <div className="font-mono text-xs uppercase tracking-widest text-ink/40 font-bold">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Pillars — thin client wrappers for animation only */}
      <section className="py-24 px-6 bg-paper">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
            <div className="max-w-2xl">
              <span className="text-gold font-mono font-bold tracking-widest uppercase text-xs mb-4 block">
                Nos fondations
              </span>
              <h2 className="text-4xl md:text-6xl font-black leading-tight font-serif">
                Une approche rigoureuse pour des résultats concrets.
              </h2>
            </div>
            <p className="text-ink/60 max-w-sm text-sm leading-relaxed font-sans">
              Expertise fondateur expatrié, exhaustivité par pays, affiliation intégrée et production LLM maîtrisée.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {pillarData.map((p, i) => {
              const Icon = iconMap[p.iconName]
              return (
                <FadeInCard
                  key={i}
                  delay={i * 0.1}
                  className="p-8 bg-white border border-ink/5 hover:border-gold/30 transition-all group"
                >
                  <div className="w-14 h-14 bg-paper flex items-center justify-center mb-6 group-hover:bg-gold/10 transition-colors">
                    {Icon && <Icon className="w-7 h-7 text-gold" />}
                  </div>
                  <h3 className="text-xl font-bold mb-4 font-serif">{p.title}</h3>
                  <p className="text-ink/60 leading-relaxed text-sm font-sans">{p.desc}</p>
                </FadeInCard>
              )
            })}
          </div>
        </div>
      </section>

      {/* Destinations */}
      <section className="py-24 px-6 bg-ink text-paper relative overflow-hidden">
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-6xl font-black mb-6 font-serif">
              Destinations <span className="text-gold italic">Cibles</span>
            </h2>
            <p className="text-paper/60 max-w-xl mx-auto font-sans">
              Explorez nos guides détaillés par pays. Chaque guide couvre la convention fiscale, les impôts locaux et les affiliations recommandées.
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-12">
            {destinations.map((c) => (
              <HoverScaleCard key={c.slug}>
                <Link
                  href={`/expatriation/${c.slug}`}
                  className="block p-6 bg-white/5 border border-white/10 hover:bg-white/10 transition-all group"
                >
                  <span className="text-3xl mb-4 block">{c.flag}</span>
                  <h4 className="text-lg font-bold mb-1 font-serif">{c.name}</h4>
                  <span className="font-mono text-xs text-gold font-bold tracking-widest uppercase">{c.tag}</span>
                </Link>
              </HoverScaleCard>
            ))}
          </div>
          <div className="text-center">
            <Link
              href="/expatriation"
              className="inline-flex items-center gap-2 border border-gold/40 text-gold px-8 py-3 font-mono text-xs tracking-widest uppercase hover:bg-gold hover:text-ink transition-all"
            >
              Voir toutes les destinations <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
        <div
          className="absolute inset-0 opacity-5 pointer-events-none"
          style={{ backgroundImage: 'radial-gradient(#c9a84c 1px, transparent 1px)', backgroundSize: '40px 40px' }}
        />
      </section>

      {/* Bilan Fiscal CTA */}
      <section className="py-24 px-6 bg-paper">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-0 border border-ink/10 overflow-hidden">
            {/* Left — value prop */}
            <div className="bg-gold p-12 md:p-16">
              <span className="font-mono text-xs uppercase tracking-widest opacity-60 mb-4 block">
                Service Gratuit
              </span>
              <h2 className="font-serif text-4xl md:text-5xl font-black leading-tight mb-6">
                Votre Bilan Fiscal<br />
                <span className="italic">Personnalisé.</span>
              </h2>
              <p className="text-ink/70 leading-relaxed mb-8 font-sans">
                Décrivez votre situation en 3 minutes. Nos experts analysent votre profil
                et vous envoient des recommandations concrètes, gratuitement.
              </p>
              <ul className="flex flex-col gap-3 mb-8">
                {[
                  'Analyse personnalisée de votre situation',
                  'Pays optimal identifié selon vos critères',
                  'Réponse sous 48h ouvrées',
                  'Sans engagement, 100% gratuit',
                ].map((item) => (
                  <li key={item} className="flex items-center gap-3 text-sm font-sans">
                    <CheckCircle className="w-4 h-4 flex-shrink-0 text-ink/60" />
                    <span className="text-ink/80">{item}</span>
                  </li>
                ))}
              </ul>
              <Link
                href="/bilan-fiscal"
                className="inline-flex items-center gap-2 bg-ink text-paper px-8 py-4 font-mono font-bold text-xs tracking-widest uppercase hover:bg-ink/80 transition-all group"
              >
                Demander mon bilan gratuit
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
            {/* Right — social proof */}
            <div className="bg-ink text-paper p-12 md:p-16 flex flex-col justify-between">
              <div>
                <span className="font-mono text-xs uppercase tracking-widest text-gold mb-8 block">
                  Ce que vous recevrez
                </span>
                <div className="flex flex-col gap-6">
                  {[
                    { step: '01', title: 'Analyse de résidence fiscale', desc: 'Votre domicile fiscal actuel et les risques potentiels.' },
                    { step: '02', title: 'Comparatif pays ciblés', desc: 'Les 2-3 destinations les plus adaptées à votre profil.' },
                    { step: '03', title: 'Plan d\'action prioritaire', desc: 'Les étapes concrètes à suivre avant de partir.' },
                  ].map((item) => (
                    <div key={item.step} className="flex items-start gap-4">
                      <span className="font-mono text-gold font-bold text-xs">{item.step}</span>
                      <div>
                        <div className="font-serif font-bold text-sm mb-0.5">{item.title}</div>
                        <div className="text-xs text-paper/50 font-sans">{item.desc}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="mt-10 pt-8 border-t border-white/10">
                <p className="text-sm text-paper/40 font-mono italic">
                  &ldquo;La fiscalité est complexe. Notre rôle est de la rendre accessible.&rdquo;
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quote */}
      <section className="py-32 px-6 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <FadeIn>
            <span className="text-gold text-5xl font-serif mb-8 block">&ldquo;</span>
            <blockquote className="text-3xl md:text-4xl font-serif italic leading-tight mb-12 text-ink">
              Devenir la référence francophone de la fiscalité des expatriés — le seul site qui répond précisément à chaque question d&apos;un Français qui part, vit, ou rentre de l&apos;étranger.
            </blockquote>
            <cite className="not-italic font-mono text-xs uppercase tracking-widest text-ink/40">
              — Notre mission · leconseillerfiscal.com
            </cite>
          </FadeIn>
        </div>
      </section>

      <NewsletterForm />
    </div>
  )
}
