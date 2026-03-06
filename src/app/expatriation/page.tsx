import type { Metadata } from 'next'
import Link from 'next/link'
import { getAllArticles } from '@/lib/articles'
import { countries } from '@/data/countries'
import { ArrowRight } from 'lucide-react'

const faqItems = [
  {
    question: 'Comment changer sa résidence fiscale en quittant la France ?',
    answer:
      'Pour cesser d\'être résident fiscal français, vous devez quitter effectivement la France et établir votre résidence principale à l\'étranger. Il faut notamment y installer votre foyer (famille), y exercer votre activité principale ou y transférer le centre de vos intérêts économiques. La démarche implique de déposer une déclaration de revenus française pour l\'année de départ (formulaire 2042 + 2042 NR), d\'informer vos banques et caisses de retraite, et le cas échéant de déclarer les plus-values latentes si l\'exit tax s\'applique.',
  },
  {
    question: 'Dois-je continuer à déclarer mes revenus en France si je suis expatrié ?',
    answer:
      'Cela dépend de votre situation. Si vous avez des revenus de source française (revenus immobiliers en France, dividendes de sociétés françaises non couverts par une convention, etc.), vous devez déposer une déclaration en tant que non-résident. En revanche, si vous n\'avez plus aucun revenu de source française, vous n\'avez en principe aucune obligation déclarative en France. Vérifiez toujours la convention fiscale entre la France et votre pays de résidence.',
  },
  {
    question: 'Qu\'est-ce que l\'exit tax et qui est concerné ?',
    answer:
      'L\'exit tax (article 167 bis CGI) impose les plus-values latentes sur titres lors du transfert de domicile fiscal hors de France. Elle s\'applique si vous avez été résident fiscal français pendant au moins 6 des 10 dernières années et détenez des participations supérieures à 800 000 € ou représentant plus de 50 % d\'une société. Un sursis de paiement automatique est accordé lors d\'un départ dans l\'UE ou l\'EEE, et un dégrèvement est possible après 2 ou 5 ans selon les situations.',
  },
  {
    question: 'Quels sont les pays avec les meilleurs régimes fiscaux pour les expatriés français ?',
    answer:
      'Plusieurs destinations offrent des régimes préférentiels reconnus : le Portugal avec l\'IFICI (ex-NHR, taux de 20 % sur 10 ans pour professions qualifiées), Dubaï et les Émirats Arabes Unis (0 % d\'impôt sur le revenu), Malte et Chypre avec leurs programmes pour résidents non domiciliés, la Suisse avec les forfaits fiscaux cantonaux, et l\'Espagne avec la Loi Beckham (24 % fixe pour impatriés). Le choix dépend de votre profil de revenus, de la convention fiscale franco-locale et de vos contraintes personnelles.',
  },
  {
    question: 'Une convention fiscale protège-t-elle totalement de la double imposition ?',
    answer:
      'Pas nécessairement. Les conventions définissent quel État a le droit d\'imposer chaque catégorie de revenus, mais certains revenus peuvent rester imposables dans les deux pays avec un mécanisme de crédit d\'impôt pour éviter la double charge. De plus, certaines conventions françaises sont anciennes et comportent des lacunes. La protection est optimale quand la convention prévoit l\'exonération avec progressivité (méthode d\'exemption) plutôt que la méthode du crédit d\'impôt.',
  },
  {
    question: 'Comment fonctionne l\'imposition des revenus immobiliers en France pour un expatrié ?',
    answer:
      'Les revenus de biens immobiliers situés en France restent en principe imposables en France, même si vous êtes résident fiscal à l\'étranger. Ils sont soumis à l\'impôt sur le revenu au taux minimum de 20 % (ou taux du barème si plus favorable) ainsi qu\'aux prélèvements sociaux à 17,2 %. Toutefois, si vous résidez dans l\'EEE (UE, Islande, Norvège, Liechtenstein), les prélèvements sociaux peuvent être réduits. La convention fiscale de votre pays de résidence peut prévoir des modalités spécifiques.',
  },
]

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

          {/* FAQ */}
          <div className="mt-20">
            <h2 className="font-serif text-3xl font-bold mb-3">Questions fréquentes sur l&apos;expatriation fiscale</h2>
            <p className="text-ink/50 font-sans text-sm mb-8">
              Les réponses aux questions les plus posées par les expatriés français.
            </p>
            <div className="space-y-3">
              {faqItems.map((item, i) => (
                <details
                  key={i}
                  className="group border border-ink/10 bg-white open:border-gold/30"
                >
                  <summary className="flex items-center justify-between gap-4 px-6 py-5 cursor-pointer list-none font-serif font-bold text-base leading-snug select-none hover:text-gold transition-colors">
                    {item.question}
                    <span className="flex-shrink-0 text-gold font-mono text-lg leading-none group-open:rotate-45 transition-transform">+</span>
                  </summary>
                  <div className="px-6 pb-6 pt-1 text-ink/70 font-sans text-sm leading-relaxed border-t border-ink/5">
                    {item.answer}
                  </div>
                </details>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
