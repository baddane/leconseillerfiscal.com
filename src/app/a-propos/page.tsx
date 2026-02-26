import type { Metadata } from 'next'
import Link from 'next/link'
import { Scale, Globe, ShieldCheck, BookOpen } from 'lucide-react'

export const metadata: Metadata = {
  title: 'À propos — Le Conseiller Fiscal',
  description:
    'Le Conseiller Fiscal est la référence francophone de la fiscalité des expatriés. Notre mission : rendre la fiscalité internationale accessible, claire et actionnable.',
  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_SITE_URL ?? 'https://leconseillerfiscal.com'}/a-propos`,
  },
}

const values = [
  {
    icon: ShieldCheck,
    title: 'Rigueur',
    desc: 'Chaque information est vérifiée, sourcée et datée. Nous indiquons systématiquement la date de dernière vérification de nos articles.',
  },
  {
    icon: BookOpen,
    title: 'Pédagogie',
    desc: 'La fiscalité est complexe. Nous la rendons accessible sans sacrifier la précision. Pas de jargon inutile, des exemples concrets.',
  },
  {
    icon: Globe,
    title: 'Exhaustivité',
    desc: '20+ destinations couvertes, des conventions fiscales aux cas pratiques. Un guide complet pour chaque pays cible des expatriés français.',
  },
  {
    icon: Scale,
    title: 'Indépendance',
    desc: 'Nos recommandations sont basées sur notre expertise, pas sur les commissions. Nous signalons toujours nos liens d\'affiliation.',
  },
]

export default function AProposPage() {
  return (
    <div className="pt-32 pb-24">
      <section className="px-6 pb-16 border-b border-ink/5">
        <div className="max-w-4xl mx-auto">
          <span className="text-gold font-mono text-xs font-bold tracking-widest uppercase block mb-4">
            Qui sommes-nous
          </span>
          <h1 className="text-5xl md:text-7xl font-black leading-tight mb-8 font-serif">
            La référence <span className="italic text-gold">fiscale</span> des expatriés français.
          </h1>
          <p className="text-xl text-ink/60 leading-relaxed font-sans max-w-2xl">
            Le Conseiller Fiscal est né d&apos;un constat simple : trouver des informations fiables sur la fiscalité internationale est un parcours du combattant pour les Français qui s&apos;expatrient.
          </p>
        </div>
      </section>

      <section className="px-6 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="prose prose-lg max-w-none mb-16">
            <h2 className="font-serif text-3xl font-bold mb-6">Notre mission</h2>
            <p className="text-ink/70 leading-relaxed font-sans text-lg">
              Chaque année, plus de 100 000 Français quittent la France pour s&apos;installer à l&apos;étranger. La plupart se retrouvent face à un mur d&apos;informations contradictoires, de forums obsolètes et de conseils non vérifiés.
            </p>
            <p className="text-ink/70 leading-relaxed font-sans text-lg">
              Le Conseiller Fiscal a pour mission de centraliser, vérifier et vulgariser l&apos;information fiscale pour les expatriés français. Nos guides couvrent les conventions fiscales bilatérales, les régimes préférentiels (NHR Portugal, Loi Beckham Espagne, 0% Dubaï...), les obligations déclaratives et les outils pratiques.
            </p>
            <p className="text-ink/70 leading-relaxed font-sans text-lg">
              Nous recommandons également des outils et services que nous jugeons utiles pour les expatriés (banques, assurances, logiciels fiscaux). Ces recommandations contiennent des liens d&apos;affiliation clairement identifiés — c&apos;est ce qui nous permet de proposer tout notre contenu gratuitement.
            </p>
          </div>

          <h2 className="font-serif text-3xl font-bold mb-8">Nos valeurs</h2>
          <div className="grid md:grid-cols-2 gap-6 mb-16">
            {values.map((v, i) => (
              <div key={i} className="border border-ink/10 bg-white p-8">
                <div className="w-12 h-12 bg-paper flex items-center justify-center mb-4">
                  <v.icon className="w-6 h-6 text-gold" />
                </div>
                <h3 className="font-serif text-xl font-bold mb-3">{v.title}</h3>
                <p className="text-sm text-ink/60 leading-relaxed font-sans">{v.desc}</p>
              </div>
            ))}
          </div>

          <div className="border border-gold/30 bg-gold/5 p-8 text-center">
            <h2 className="font-serif text-2xl font-bold mb-4">Une question ? Un partenariat ?</h2>
            <p className="text-ink/60 font-sans mb-6 max-w-lg mx-auto">
              Nous sommes toujours disponibles pour répondre à vos questions ou discuter d&apos;opportunités de collaboration.
            </p>
            <Link
              href="/contact"
              className="inline-block bg-ink text-paper px-8 py-3 font-mono text-xs tracking-widest uppercase hover:bg-gold hover:text-ink transition-all"
            >
              Nous contacter →
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
