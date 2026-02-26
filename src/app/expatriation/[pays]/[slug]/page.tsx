import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getArticleBySlug, getAllSlugsSynced } from '@/lib/articles'
import { affiliateDisplay } from '@/lib/affiliates'
import { countries } from '@/data/countries'
import AffiliateBox from '@/components/AffiliateBox'
import Breadcrumb from '@/components/Breadcrumb'
import { ArticleJsonLd, FaqJsonLd, BreadcrumbJsonLd } from '@/components/JsonLd'
import Link from 'next/link'
import { Clock, ShieldCheck, ChevronDown } from 'lucide-react'

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://leconseillerfiscal.com'

export async function generateStaticParams() {
  return getAllSlugsSynced()
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ pays: string; slug: string }>
}): Promise<Metadata> {
  const { pays, slug } = await params
  const article = await getArticleBySlug(slug)
  if (!article) return {}

  const url = `${siteUrl}/expatriation/${pays}/${slug}`
  return {
    title: article.title,
    description: article.metaDescription,
    keywords: [article.motClePrincipal, `fiscalité ${pays}`, 'expatrié français', 'impôt étranger'],
    alternates: { canonical: url },
    openGraph: {
      title: article.title,
      description: article.metaDescription,
      url,
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      title: article.title,
      description: article.metaDescription,
    },
  }
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ pays: string; slug: string }>
}) {
  const { pays, slug } = await params
  const article = await getArticleBySlug(slug)

  if (!article || article.pays !== pays) notFound()

  const country = countries.find((c) => c.slug === pays)
  const countryName = country?.name ?? pays.charAt(0).toUpperCase() + pays.slice(1)
  const articleUrl = `${siteUrl}/expatriation/${pays}/${slug}`

  const breadcrumbItems = [
    { name: 'Accueil', url: '/' },
    { name: 'Expatriation', url: '/expatriation' },
    { name: countryName, url: `/expatriation/${pays}` },
    { name: article.title, url: `/expatriation/${pays}/${slug}` },
  ]

  const primaryAffiliate = article.affiliations[0]
  const sidebarAffiliates = article.affiliations.slice(0, 3)

  return (
    <div className="pt-32 pb-24">
      {/* JSON-LD */}
      <ArticleJsonLd
        title={article.title}
        description={article.metaDescription}
        url={articleUrl}
        datePublished={`2025-01-01`}
      />
      {article.faq.length > 0 && <FaqJsonLd faq={article.faq} />}
      <BreadcrumbJsonLd items={breadcrumbItems} />

      <div className="max-w-7xl mx-auto px-6">
        {/* Breadcrumb */}
        <Breadcrumb
          items={[
            { label: 'Expatriation', href: '/expatriation' },
            { label: countryName, href: `/expatriation/${pays}` },
            { label: article.title },
          ]}
        />

        <div className="grid lg:grid-cols-3 gap-16">
          {/* Article content */}
          <article className="lg:col-span-2 min-w-0">
            {/* Verification badge */}
            <div className="inline-flex items-center gap-2 bg-green-50 border border-green-200 text-green-800 px-4 py-2 font-mono text-xs mb-6">
              <ShieldCheck className="w-3.5 h-3.5" />
              Informations vérifiées au {article.dateVerification}
            </div>

            <h1 className="text-3xl md:text-5xl font-black leading-tight mb-6 font-serif text-ink">
              {article.title}
            </h1>

            <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-grey mb-10 pb-10 border-b border-ink/5">
              <span className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" />
                {article.readTime} min de lecture
              </span>
              <span className="uppercase tracking-widest text-gold font-bold">{countryName}</span>
              <span className="bg-ink/5 px-2 py-0.5">{article.motClePrincipal}</span>
            </div>

            {/* Article Content */}
            <div
              className="article-content"
              dangerouslySetInnerHTML={{ __html: article.contentHtml }}
            />

            {/* Inline affiliate after content */}
            {primaryAffiliate && affiliateDisplay[primaryAffiliate] && (
              <AffiliateBox partnerId={primaryAffiliate} variant="inline" />
            )}

            {/* FAQ */}
            {article.faq.length > 0 && (
              <section className="mt-16 pt-12 border-t border-ink/10">
                <h2 className="font-serif text-3xl font-bold mb-8">Questions fréquentes</h2>
                <div className="flex flex-col gap-4">
                  {article.faq.map((item, i) => (
                    <details
                      key={i}
                      className="group border border-ink/10 bg-white open:border-gold/30"
                    >
                      <summary className="flex items-start justify-between gap-4 p-6 cursor-pointer list-none font-serif font-bold text-lg hover:text-gold transition-colors">
                        <span>{item.question}</span>
                        <ChevronDown className="w-5 h-5 flex-shrink-0 mt-0.5 group-open:rotate-180 transition-transform text-gold" />
                      </summary>
                      <div className="px-6 pb-6 text-ink/70 leading-relaxed font-sans text-sm border-t border-ink/5 pt-4">
                        {item.reponse}
                      </div>
                    </details>
                  ))}
                </div>
              </section>
            )}

            {/* Disclaimer */}
            <div className="mt-12 bg-cream border border-border p-6 text-xs text-ink/50 font-sans leading-relaxed">
              <strong className="text-ink/70 font-mono uppercase tracking-wider text-xs">
                Avertissement légal :
              </strong>{' '}
              Les informations contenues dans cet article sont fournies à titre purement informatif et ne constituent pas un conseil fiscal ou juridique personnalisé. La fiscalité évolue régulièrement et les situations individuelles varient. Avant toute décision, consultez un conseiller fiscal qualifié et vérifiez la réglementation en vigueur dans votre pays de résidence.
            </div>
          </article>

          {/* Sidebar */}
          <aside className="lg:col-span-1">
            <div className="sticky top-28 flex flex-col gap-6">
              {sidebarAffiliates.map((id) =>
                affiliateDisplay[id] ? (
                  <AffiliateBox key={id} partnerId={id} variant="sidebar" />
                ) : null
              )}

              {/* Expert contact */}
              <div className="border border-gold/30 bg-gold/5 p-6">
                <div className="font-mono text-xs uppercase tracking-widest text-gold mb-3">
                  Besoin d&apos;un conseiller ?
                </div>
                <p className="text-sm text-ink/70 font-sans leading-relaxed mb-4">
                  Votre situation fiscale est unique. Nos experts spécialisés en expatriation peuvent vous accompagner personnellement.
                </p>
                <Link
                  href="/contact"
                  className="block text-center bg-ink text-paper py-3 font-mono text-xs tracking-widest uppercase hover:bg-gold hover:text-ink transition-all"
                >
                  Consulter un expert →
                </Link>
              </div>

              {/* Navigation */}
              <div className="border border-ink/10 bg-white p-6">
                <div className="font-mono text-xs uppercase tracking-widest text-ink/40 mb-3">
                  Explorer
                </div>
                <Link
                  href={`/expatriation/${pays}`}
                  className="flex items-center gap-2 text-sm hover:text-gold transition-colors mb-2 font-sans"
                >
                  ← Tous les guides {countryName}
                </Link>
                <Link
                  href="/expatriation"
                  className="flex items-center gap-2 text-sm hover:text-gold transition-colors font-sans"
                >
                  ← Hub Expatriation
                </Link>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}
