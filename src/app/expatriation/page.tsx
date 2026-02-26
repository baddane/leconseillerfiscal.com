import type { Metadata } from 'next'
import Link from 'next/link'
import { getAllArticles } from '@/lib/articles'
import { countries } from '@/data/countries'
import { ArrowRight } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Expatriation & Fiscalité par Pays — Guides Complets',
  description:
    'Tous nos guides de fiscalité pour expatriés français : Portugal NHR, Dubaï 0%, Suisse, Canada, Espagne Loi Beckham. Conventions fiscales, conseils pratiques et outils comparatifs.',
  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_SITE_URL ?? 'https://leconseillerfiscal.com'}/expatriation`,
  },
}

const categoryHubs = [
  { slug: 'outils', label: 'Outils & Comparatifs', emoji: '🔧', desc: 'Wise, Revolut, assurances santé, outils crypto.' },
]

export default async function ExpatriationPage() {
  const articles = await getAllArticles()

  return (
    <div className="pt-32 pb-24">
      {/* Header */}
      <section className="px-6 pb-16 border-b border-ink/5">
        <div className="max-w-7xl mx-auto">
          <span className="text-gold font-mono text-xs font-bold tracking-widest uppercase block mb-4">
            Hub principal
          </span>
          <h1 className="text-5xl md:text-7xl font-black leading-tight mb-6">
            Expatriation <span className="italic text-gold">& Fiscalité</span>
          </h1>
          <p className="max-w-2xl text-lg text-ink/60 leading-relaxed font-sans">
            Guides de fiscalité pour expatriés français par destination. Chaque guide couvre la convention fiscale, les régimes préférentiels, les obligations déclaratives et les outils recommandés.
          </p>
        </div>
      </section>

      {/* Pays avec articles */}
      <section className="px-6 py-16">
        <div className="max-w-7xl mx-auto">
          <h2 className="font-serif text-3xl font-bold mb-8">Destinations avec guides</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
            {countries
              .filter((c) => articles.some((a) => a.pays === c.slug) || c.volume >= 3)
              .slice(0, 12)
              .map((country) => {
                const countryArticles = articles.filter((a) => a.pays === country.slug)
                return (
                  <Link
                    key={country.slug}
                    href={`/expatriation/${country.slug}`}
                    className="group border border-ink/10 p-6 hover:border-gold/40 transition-all bg-white hover:bg-cream"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <span className="text-3xl mb-2 block">{country.flag}</span>
                        <h3 className="text-xl font-bold font-serif">{country.name}</h3>
                        <span className="font-mono text-xs text-gold font-bold tracking-widest uppercase">{country.tag}</span>
                      </div>
                      {country.convention && (
                        <span className="bg-green-50 text-green-700 border border-green-200 text-xs font-mono px-2 py-1">
                          Convention ✓
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-ink/60 leading-relaxed mb-4 font-sans">{country.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs text-ink/40">
                        {countryArticles.length > 0 ? `${countryArticles.length} article${countryArticles.length > 1 ? 's' : ''}` : 'Guide en préparation'}
                      </span>
                      <ArrowRight className="w-4 h-4 text-gold group-hover:translate-x-1 transition-transform" />
                    </div>
                  </Link>
                )
              })}
          </div>

          {/* Hubs thématiques */}
          <h2 className="font-serif text-3xl font-bold mb-8">Outils & Comparatifs</h2>
          <div className="grid md:grid-cols-3 gap-6 mb-16">
            {categoryHubs.map((hub) => (
              <Link
                key={hub.slug}
                href={`/expatriation/${hub.slug}`}
                className="group border border-ink/10 p-6 hover:border-gold/40 transition-all bg-white hover:bg-cream"
              >
                <span className="text-3xl mb-4 block">{hub.emoji}</span>
                <h3 className="text-xl font-bold font-serif mb-2">{hub.label}</h3>
                <p className="text-sm text-ink/60 mb-4 font-sans">{hub.desc}</p>
                <ArrowRight className="w-4 h-4 text-gold group-hover:translate-x-1 transition-transform" />
              </Link>
            ))}
          </div>

          {/* Derniers articles */}
          {articles.length > 0 && (
            <>
              <h2 className="font-serif text-3xl font-bold mb-8">Derniers articles publiés</h2>
              <div className="flex flex-col gap-4">
                {articles.map((article) => {
                  const country = countries.find((c) => c.slug === article.pays)
                  return (
                    <Link
                      key={article.slug}
                      href={`/expatriation/${article.pays}/${article.slug}`}
                      className="group flex items-center gap-6 border border-ink/10 p-6 hover:border-gold/40 transition-all bg-white"
                    >
                      <div className="flex-shrink-0 text-2xl">{country?.flag ?? '📄'}</div>
                      <div className="flex-1 min-w-0">
                        <div className="font-mono text-xs text-gold uppercase tracking-widest mb-1">
                          {country?.name ?? article.pays} · Vérifié {article.dateVerification}
                        </div>
                        <h3 className="font-serif text-lg font-bold text-ink group-hover:text-gold transition-colors leading-tight">
                          {article.title}
                        </h3>
                        <p className="text-sm text-ink/50 mt-1 font-sans">{article.metaDescription}</p>
                      </div>
                      <ArrowRight className="w-4 h-4 text-gold flex-shrink-0 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  )
                })}
              </div>
            </>
          )}
        </div>
      </section>
    </div>
  )
}
