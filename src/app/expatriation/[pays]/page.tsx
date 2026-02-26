import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getArticlesByPays, getAllPaysListSynced } from '@/lib/articles'
import { countries } from '@/data/countries'
import { affiliateDisplay } from '@/lib/affiliates'
import AffiliateBox from '@/components/AffiliateBox'
import Breadcrumb from '@/components/Breadcrumb'
import { BreadcrumbJsonLd } from '@/components/JsonLd'
import { ArrowRight, CheckCircle, FileText } from 'lucide-react'

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://leconseillerfiscal.com'

// Hubs thématiques hors pays
const topicHubs: Record<string, { title: string; description: string; emoji: string }> = {
  outils: {
    title: 'Outils & Comparatifs',
    description: 'Comparatifs des meilleurs outils financiers pour expatriés : néobanques, assurances santé, logiciels fiscaux crypto.',
    emoji: '🔧',
  },
  comparatifs: {
    title: 'Comparatifs',
    description: 'Guides comparatifs pour choisir les bons outils et services en expatriation.',
    emoji: '⚖️',
  },
}

export async function generateStaticParams() {
  const paysList = getAllPaysListSynced()
  const countrySlugs = countries.map((c) => c.slug)
  const allPays = [...new Set([...paysList, ...countrySlugs])]
  return allPays.map((pays) => ({ pays }))
}

export async function generateMetadata({ params }: { params: Promise<{ pays: string }> }): Promise<Metadata> {
  const { pays } = await params
  const country = countries.find((c) => c.slug === pays)
  const hub = topicHubs[pays]

  const title = country
    ? `Fiscalité ${country.name} pour les Français Expatriés — Guide Complet`
    : hub
      ? `${hub.title} — Le Conseiller Fiscal`
      : `Expatriation ${pays} — Guide Fiscal`

  const description = country
    ? country.longDescription
    : hub?.description ?? `Guides fiscaux pour les expatriés français en ${pays}.`

  return {
    title,
    description,
    alternates: { canonical: `${siteUrl}/expatriation/${pays}` },
    openGraph: {
      title,
      description,
      url: `${siteUrl}/expatriation/${pays}`,
    },
  }
}

export default async function PaysPage({ params }: { params: Promise<{ pays: string }> }) {
  const { pays } = await params
  const articles = await getArticlesByPays(pays)
  const country = countries.find((c) => c.slug === pays)
  const hub = topicHubs[pays]

  // Si le pays n'existe pas dans countries et n'a pas d'articles et n'est pas un hub connu
  if (!country && articles.length === 0 && !hub) {
    notFound()
  }

  const title = country ? country.name : hub ? hub.title : pays
  const flag = country?.flag ?? hub?.emoji ?? '🌍'
  const description = country?.longDescription ?? hub?.description ?? ''
  const mainAffiliates = country?.mainAffiliates ?? ['wise', 'acs']

  const breadcrumbs = [
    { name: 'Expatriation', url: '/expatriation' },
    { name: title, url: `/expatriation/${pays}` },
  ]

  return (
    <div className="pt-32 pb-24">
      <BreadcrumbJsonLd items={[{ name: 'Accueil', url: '/' }, ...breadcrumbs]} />

      <div className="max-w-7xl mx-auto px-6">
        <Breadcrumb
          items={[
            { label: 'Expatriation', href: '/expatriation' },
            { label: title },
          ]}
        />

        <div className="grid lg:grid-cols-3 gap-16">
          {/* Main */}
          <div className="lg:col-span-2">
            <div className="mb-12">
              <span className="text-5xl mb-4 block">{flag}</span>
              <h1 className="text-4xl md:text-6xl font-black leading-tight mb-6 font-serif">
                {country
                  ? <>Fiscalité <span className="text-gold italic">{country.name}</span></>
                  : <span className="text-gold italic">{title}</span>}
              </h1>
              <p className="text-lg text-ink/60 leading-relaxed font-sans max-w-2xl">{description}</p>
            </div>

            {/* Tax highlights for country */}
            {country && country.taxHighlights.length > 0 && (
              <div className="mb-12 border border-ink/10 bg-white p-8">
                <h2 className="font-serif text-xl font-bold mb-6 flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-gold" />
                  Points clés fiscaux
                </h2>
                <ul className="flex flex-col gap-3">
                  {country.taxHighlights.map((point, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm">
                      <span className="text-gold font-bold mt-0.5 font-mono">→</span>
                      <span className="text-ink/80 font-sans">{point}</span>
                    </li>
                  ))}
                </ul>
                {country.convention && (
                  <div className="mt-6 pt-6 border-t border-ink/5 flex items-center gap-2 text-sm font-mono text-grey">
                    <span className="text-green-600 font-bold">✓</span>
                    Convention fiscale France–{country.name}
                    {country.conventionDate && <span className="text-ink/30"> · signée en {country.conventionDate}</span>}
                  </div>
                )}
              </div>
            )}

            {/* Articles */}
            <div>
              <h2 className="font-serif text-2xl font-bold mb-6 flex items-center gap-2">
                <FileText className="w-5 h-5 text-gold" />
                {articles.length > 0 ? `Nos guides (${articles.length})` : 'Guides en préparation'}
              </h2>
              {articles.length > 0 ? (
                <div className="flex flex-col gap-4">
                  {articles.map((article) => (
                    <Link
                      key={article.slug}
                      href={`/expatriation/${pays}/${article.slug}`}
                      className="group border border-ink/10 p-6 hover:border-gold/40 transition-all bg-white block"
                    >
                      <div className="font-mono text-xs text-gold uppercase tracking-widest mb-2">
                        Vérifié {article.dateVerification} · {article.readTime} min de lecture
                      </div>
                      <h3 className="font-serif text-xl font-bold text-ink group-hover:text-gold transition-colors mb-2">
                        {article.title}
                      </h3>
                      <p className="text-sm text-ink/50 font-sans">{article.metaDescription}</p>
                      <div className="flex items-center gap-2 mt-4 text-gold font-mono text-xs font-bold uppercase tracking-widest">
                        Lire l&apos;article <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="border border-border bg-cream p-8 text-center">
                  <p className="text-ink/60 font-sans mb-4">
                    Nos guides pour {title} sont en cours de rédaction.
                  </p>
                  <Link
                    href="/contact"
                    className="inline-block bg-ink text-paper px-6 py-2.5 font-mono text-xs tracking-widest uppercase hover:bg-gold hover:text-ink transition-all"
                  >
                    Me prévenir à la publication →
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <aside className="lg:col-span-1">
            <div className="sticky top-28 flex flex-col gap-6">
              {mainAffiliates.slice(0, 3).map((id) =>
                affiliateDisplay[id] ? (
                  <AffiliateBox key={id} partnerId={id} variant="sidebar" />
                ) : null
              )}
              <div className="border border-gold/30 bg-gold/5 p-6">
                <div className="font-mono text-xs uppercase tracking-widest text-gold mb-3">
                  Besoin d&apos;un conseiller ?
                </div>
                <p className="text-sm text-ink/70 font-sans leading-relaxed mb-4">
                  Votre situation est complexe ? Nos experts fiscalistes spécialisés en expatriation peuvent vous accompagner.
                </p>
                <Link
                  href="/contact"
                  className="block text-center bg-ink text-paper py-3 font-mono text-xs tracking-widest uppercase hover:bg-gold hover:text-ink transition-all"
                >
                  Prendre contact →
                </Link>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}
