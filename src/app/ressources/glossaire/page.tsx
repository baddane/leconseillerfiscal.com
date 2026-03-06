import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Glossaire Fiscal Expatrié — Définitions & Termes Clés',
  description:
    'Tous les termes de la fiscalité internationale pour expatriés français expliqués simplement : résidence fiscale, convention fiscale, NHR, exit tax, CFC, établissement stable et plus.',
  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_SITE_URL ?? 'https://leconseillerfiscal.com'}/ressources/glossaire`,
  },
}

const terms: { term: string; definition: string; related?: string[] }[] = [
  {
    term: 'Assujetti fiscal',
    definition:
      'Personne physique ou morale soumise à l\'impôt dans un État donné, en raison de sa résidence fiscale ou de la source de ses revenus.',
  },
  {
    term: 'Convention fiscale bilatérale',
    definition:
      'Accord international entre deux États destiné à éviter la double imposition des résidents et à prévenir l\'évasion fiscale. Elle définit quel État a le droit d\'imposer chaque catégorie de revenus.',
    related: ['Double imposition', 'Résidence fiscale'],
  },
  {
    term: 'CFC (Controlled Foreign Corporation)',
    definition:
      'Société étrangère contrôlée par des résidents fiscaux français. La France peut imposer les bénéfices de cette société dans les mains de ses associés même si les bénéfices ne sont pas distribués (article 209 B CGI).',
  },
  {
    term: 'Crédit d\'impôt étranger',
    definition:
      'Mécanisme prévu par les conventions fiscales permettant de déduire l\'impôt payé à l\'étranger de l\'impôt dû en France, afin d\'éviter la double imposition sur les mêmes revenus.',
    related: ['Double imposition', 'Convention fiscale bilatérale'],
  },
  {
    term: 'Domicile fiscal',
    definition:
      'Notion française équivalente à la résidence fiscale. Défini à l\'article 4 B du CGI : foyer ou lieu de séjour principal, activité professionnelle principale, ou centre des intérêts économiques en France.',
    related: ['Résidence fiscale', 'Foyer fiscal'],
  },
  {
    term: 'Double imposition',
    definition:
      'Situation où un même revenu est imposé deux fois, dans deux États différents. Les conventions fiscales et le mécanisme de crédit d\'impôt visent à l\'éliminer.',
    related: ['Convention fiscale bilatérale', 'Crédit d\'impôt étranger'],
  },
  {
    term: 'Établissement stable',
    definition:
      'Installation fixe d\'affaires par l\'intermédiaire de laquelle une entreprise exerce tout ou partie de son activité dans un État (bureau, usine, chantier). Critère déclenchant l\'imposition dans cet État.',
  },
  {
    term: 'Exit Tax',
    definition:
      'Imposition des plus-values latentes lors du transfert de domicile fiscal hors de France, applicable aux personnes ayant été fiscalement domiciliées en France pendant au moins 6 des 10 dernières années (article 167 bis CGI). Un sursis de paiement est possible dans l\'UE/EEE.',
  },
  {
    term: 'Exonération avec progressivité',
    definition:
      'Méthode d\'élimination de la double imposition prévue par certaines conventions : le revenu étranger est exonéré d\'impôt en France mais pris en compte pour déterminer le taux d\'imposition applicable aux autres revenus.',
  },
  {
    term: 'Flat tax (PFU)',
    definition:
      'Prélèvement Forfaitaire Unique de 30 % sur les revenus du capital en France (12,8 % d\'IR + 17,2 % de prélèvements sociaux). Peut impacter les non-résidents selon la convention applicable.',
  },
  {
    term: 'Foyer fiscal',
    definition:
      'Unité d\'imposition en France composée du contribuable, de son conjoint ou partenaire de PACS, et de leurs enfants à charge. Un seul foyer fiscal dépose une déclaration commune.',
    related: ['Domicile fiscal'],
  },
  {
    term: 'IMF (Impôt Minimum Mondial)',
    definition:
      'Règle Pilier 2 de l\'OCDE instaurant un taux d\'imposition effectif minimum de 15 % pour les grands groupes multinationaux (CA > 750 M€). Applicable depuis 2024 dans l\'UE.',
  },
  {
    term: 'Loi Beckham (Espagne)',
    definition:
      'Régime fiscal espagnol permettant aux impatriés de choisir d\'être imposés comme non-résidents à un taux fixe de 24 % sur les revenus de source espagnole jusqu\'à 600 000 €, pendant 6 ans.',
    related: ['Régime des impatriés', 'Non-résident fiscal'],
  },
  {
    term: 'NHR (Non-Habitual Resident — Portugal)',
    definition:
      'Ancien régime fiscal portugais (remplacé par le IFICI en 2024) offrant 10 ans d\'avantages fiscaux aux nouveaux résidents : taux fixe de 20 % sur certains revenus portugais et exonération possible sur les revenus étrangers.',
    related: ['Résidence fiscale', 'Convention fiscale bilatérale'],
  },
  {
    term: 'IFICI (Portugal)',
    definition:
      'Incentivo Fiscal à Investigação Científica e Inovação — successeur du NHR au Portugal depuis 2024. Réservé à des professions qualifiées (tech, recherche, enseignement), il offre un taux d\'IR de 20 % pendant 10 ans.',
    related: ['NHR'],
  },
  {
    term: 'Non-résident fiscal',
    definition:
      'Personne dont le domicile fiscal n\'est pas en France. Elle est imposée uniquement sur ses revenus de source française (salaires versés par un employeur français, revenus immobiliers en France, etc.).',
    related: ['Domicile fiscal', 'Résidence fiscale'],
  },
  {
    term: 'Paradis fiscal',
    definition:
      'État ou territoire à fiscalité nulle ou très faible, peu transparent sur les informations fiscales et financières. La France maintient une liste d\'États et territoires non coopératifs (ETNC) entraînant des régimes fiscaux punitifs.',
  },
  {
    term: 'Régime des impatriés (France)',
    definition:
      'Exonération partielle d\'impôt accordée aux salariés et dirigeants recrutés à l\'étranger venant exercer en France. Permet d\'exonérer une partie du salaire et certains revenus étrangers pendant 8 ans maximum.',
  },
  {
    term: 'Résidence fiscale',
    definition:
      'Pays dans lequel une personne est considérée comme contribuable principal selon des critères légaux (foyer, séjour, activité, intérêts économiques). Détermine le pays ayant le droit d\'imposer les revenus mondiaux.',
    related: ['Domicile fiscal', 'Convention fiscale bilatérale'],
  },
  {
    term: 'Retenue à la source',
    definition:
      'Impôt prélevé directement à la source sur certains revenus versés à des non-résidents (dividendes, intérêts, redevances, salaires). Son taux peut être réduit ou éliminé par une convention fiscale.',
    related: ['Non-résident fiscal', 'Convention fiscale bilatérale'],
  },
  {
    term: 'Taux effectif d\'imposition',
    definition:
      'Rapport entre le montant total d\'impôt payé et le revenu brut total. Distinct du taux marginal, il mesure la charge fiscale réelle d\'un contribuable sur l\'ensemble de ses revenus.',
  },
  {
    term: 'Territoire à fiscalité privilégiée',
    definition:
      'État où le niveau d\'imposition est inférieur de plus de moitié à celui qui aurait été dû en France. Ce critère déclenche des obligations déclaratives spécifiques (article 238 A CGI) et une présomption de non-déductibilité de certaines charges.',
  },
  {
    term: 'Tie-breaker rule',
    definition:
      'Règle de départage prévue par les conventions fiscales pour déterminer l\'État de résidence fiscale lorsqu\'une personne est considérée comme résidente par deux États simultanément. Elle examine successivement : foyer permanent, centre des intérêts vitaux, séjour habituel, nationalité.',
    related: ['Résidence fiscale', 'Double imposition'],
  },
  {
    term: 'Transparency fiscale (pass-through)',
    definition:
      'Régime par lequel les bénéfices d\'une entité (société de personnes, LLC américaine) sont directement imposés entre les mains des associés, sans imposition au niveau de la société.',
  },
]

const alphabet = [...new Set(terms.map((t) => t.term[0].toUpperCase()))].sort()

export default function GlossairePage() {
  const grouped = alphabet.map((letter) => ({
    letter,
    terms: terms.filter((t) => t.term[0].toUpperCase() === letter),
  }))

  return (
    <div className="pt-32 pb-24">
      {/* Header */}
      <section className="px-6 pb-16 border-b border-ink/5">
        <div className="max-w-4xl mx-auto">
          <span className="text-gold font-mono text-xs font-bold tracking-widest uppercase block mb-4">
            Ressources
          </span>
          <h1 className="text-5xl md:text-6xl font-black leading-tight mb-6">
            Glossaire <span className="italic text-gold">Fiscal</span>
          </h1>
          <p className="text-lg text-ink/60 leading-relaxed font-sans max-w-2xl">
            Les termes essentiels de la fiscalité internationale pour expatriés français,
            définis clairement pour vous aider à comprendre votre situation et les conventions applicables.
          </p>
        </div>
      </section>

      {/* Navigation alphabétique */}
      <section className="px-6 py-8 border-b border-ink/5 sticky top-16 bg-paper/95 backdrop-blur-sm z-10">
        <div className="max-w-4xl mx-auto flex flex-wrap gap-2">
          {alphabet.map((letter) => (
            <a
              key={letter}
              href={`#lettre-${letter}`}
              className="font-mono text-xs font-bold px-3 py-1.5 border border-ink/10 hover:border-gold hover:text-gold transition-all"
            >
              {letter}
            </a>
          ))}
        </div>
      </section>

      {/* Termes */}
      <section className="px-6 py-16">
        <div className="max-w-4xl mx-auto space-y-16">
          {grouped.map(({ letter, terms: groupTerms }) => (
            <div key={letter} id={`lettre-${letter}`}>
              <h2 className="text-4xl font-black text-gold/30 font-serif mb-8 border-b border-ink/5 pb-4">
                {letter}
              </h2>
              <dl className="space-y-8">
                {groupTerms.map((item) => (
                  <div key={item.term} className="border-l-2 border-gold/20 pl-6">
                    <dt className="text-xl font-bold font-serif text-ink mb-2">{item.term}</dt>
                    <dd className="text-ink/70 leading-relaxed font-sans mb-3">{item.definition}</dd>
                    {item.related && item.related.length > 0 && (
                      <p className="font-mono text-xs text-ink/40">
                        Voir aussi :{' '}
                        {item.related.map((r, i) => {
                          const target = terms.find((t) => t.term === r)
                          const anchor = target ? `#lettre-${r[0].toUpperCase()}` : undefined
                          return (
                            <span key={r}>
                              {anchor ? (
                                <a href={anchor} className="text-gold hover:underline">
                                  {r}
                                </a>
                              ) : (
                                r
                              )}
                              {i < (item.related?.length ?? 0) - 1 ? ', ' : ''}
                            </span>
                          )
                        })}
                      </p>
                    )}
                  </div>
                ))}
              </dl>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 pb-8">
        <div className="max-w-4xl mx-auto border border-gold/20 bg-gold/5 p-8 flex flex-col md:flex-row items-start md:items-center gap-6">
          <div className="flex-1">
            <h2 className="text-2xl font-bold font-serif mb-2">
              Un terme manque ou une question sur votre situation ?
            </h2>
            <p className="text-ink/60 font-sans">
              Consultez nos guides par pays ou demandez un bilan fiscal personnalisé.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 flex-shrink-0">
            <Link
              href="/expatriation"
              className="border border-ink/20 px-6 py-3 font-mono font-bold text-xs tracking-widest uppercase hover:bg-ink/5 transition-all text-center"
            >
              Guides par pays
            </Link>
            <Link
              href="/bilan-fiscal"
              className="bg-gold text-ink px-6 py-3 font-mono font-bold text-xs tracking-widest uppercase hover:bg-gold/80 transition-all text-center"
            >
              Bilan fiscal gratuit
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
