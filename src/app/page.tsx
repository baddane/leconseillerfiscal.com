import Link from 'next/link'
import { Globe, ShieldCheck, TrendingUp, BookOpen, ArrowRight } from 'lucide-react'
import Hero from '@/components/Hero'
import NewsletterForm from '@/components/NewsletterForm'
import { FadeInCard, HoverScaleCard, FadeIn } from '@/components/AnimatedCard'

const destinations = [
  { name: 'Portugal', flag: '🇵🇹', tag: 'NHR · Retraite', slug: 'portugal' },
  { name: 'Émirats', flag: '🇦🇪', tag: '0% Impôt · Crypto', slug: 'emirats-arabes-unis' },
  { name: 'Suisse', flag: '🇨🇭', tag: 'Frontaliers', slug: 'suisse' },
  { name: 'Espagne', flag: '🇪🇸', tag: 'Loi Beckham', slug: 'espagne' },
  { name: 'Canada', flag: '🇨🇦', tag: 'Immigration', slug: 'canada' },
  { name: 'Belgique', flag: '🇧🇪', tag: 'Succession', slug: 'belgique' },
  { name: 'Luxembourg', flag: '🇱🇺', tag: 'Frontaliers', slug: 'luxembourg' },
  { name: 'Thaïlande', flag: '🇹🇭', tag: 'LTR Visa', slug: 'thailande' },
  { name: 'Singapour', flag: '🇸🇬', tag: 'No capital gains', slug: 'singapour' },
  { name: 'Île Maurice', flag: '🇲🇺', tag: 'Flat Tax 15%', slug: 'ile-maurice' },
]

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
            {destinations.map((c, i) => (
              <HoverScaleCard key={i}>
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

      {/* Quote */}
      <section className="py-32 px-6 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <FadeIn>
            <span className="text-gold text-5xl font-serif mb-8 block">&ldquo;</span>
            <blockquote className="text-3xl md:text-4xl font-serif italic leading-tight mb-12 text-ink">
              Devenir la référence francophone de la fiscalité des expatriés — le seul site qui répond précisément à chaque question d&apos;un Français qui part, vit, ou rentre de l&apos;étranger.
            </blockquote>
            <cite className="not-italic font-mono text-xs uppercase tracking-widest text-ink/40">
              — Positionnement stratégique · leconseillerfiscal.com/expatriation/
            </cite>
          </FadeIn>
        </div>
      </section>

      <NewsletterForm />
    </div>
  )
}
