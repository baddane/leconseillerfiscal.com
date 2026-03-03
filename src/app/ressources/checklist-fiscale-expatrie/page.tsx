import type { Metadata } from 'next'
import Link from 'next/link'
import { CheckSquare, ArrowLeft } from 'lucide-react'
import PrintButton from './PrintButton'

export const metadata: Metadata = {
  title: 'Checklist Fiscale — 10 étapes avant de quitter la France',
  description: 'La checklist complète des étapes fiscales à valider avant votre départ : domicile fiscal, exit tax, épargne, protection sociale et plus encore.',
  robots: { index: false },
}

const steps = [
  {
    n: '01',
    title: 'Vérifier votre domicile fiscal actuel',
    category: 'Situation de départ',
    content:
      "Selon l'article 4B du CGI, vous êtes résident fiscal français si vous remplissez l'un des trois critères : foyer ou lieu de séjour principal en France, activité professionnelle principale exercée en France, ou centre de vos intérêts économiques en France. Un seul critère suffit. Vérifiez précisément votre situation avant toute démarche.",
    action: "Listez vos liens avec la France (logement, famille, revenus) et évaluez lequel prévaut.",
  },
  {
    n: '02',
    title: 'Identifier la convention fiscale applicable',
    category: 'Cadre juridique',
    content:
      "La France a signé plus de 120 conventions fiscales bilatérales. Ces textes déterminent quel pays a le droit d'imposer chaque catégorie de revenus (salaires, dividendes, plus-values immobilières, pensions…). L'absence de convention (ex : Émirats Arabes Unis) change radicalement la stratégie. Certaines conventions protègent mieux que d'autres.",
    action: "Consultez le site impots.gouv.fr → rubrique « Conventions internationales » pour votre pays cible.",
  },
  {
    n: '03',
    title: "Évaluer votre exposition à l'exit tax",
    category: 'Imposition au départ',
    content:
      "L'article 167 bis du CGI prévoit une imposition immédiate des plus-values latentes sur vos participations au moment du départ si vous détenez plus de 50 % d'une société OU si la valeur de vos titres dépasse 800 000 €. Un report d'imposition automatique existe dans l'UE/EEE. Hors UE, un sursis est possible sous conditions (garanties bancaires).",
    action: "Valorisez vos titres et participations. Anticipez ce point au moins 12 mois avant le départ.",
  },
  {
    n: '04',
    title: 'Sécuriser votre date de départ fiscale',
    category: 'Imposition au départ',
    content:
      "La rupture de résidence fiscale intervient à votre date de départ effectif, ou à la date précisée dans la convention bilatérale. Conservez tous les justificatifs : contrat de bail ou acte d'achat étranger, factures d'eau/électricité, relevés bancaires locaux, certificat de résidence. Ces preuves seront demandées en cas de contrôle fiscal.",
    action: "Constituez un dossier physique et numérique de vos preuves d'installation à l'étranger.",
  },
  {
    n: '05',
    title: 'Déposer votre déclaration de départ',
    category: 'Obligations déclaratives',
    content:
      "L'année de votre départ, vous déposez une déclaration de revenus partielle pour les revenus perçus en France entre le 1er janvier et votre date de départ. Utilisez le formulaire 2042 classique en cochant « Départ à l'étranger ». Informez simultanément le Centre des Impôts des Non-Résidents (CIDNR) de votre changement de situation.",
    action: "Signalez votre départ au CIDNR (10 rue du Centre, 93465 Noisy-le-Grand) ou en ligne sur impots.gouv.fr.",
  },
  {
    n: '06',
    title: 'Organiser vos revenus de source française résiduels',
    category: 'Revenus continus',
    content:
      "Si vous conservez des biens immobiliers en location, percevez des dividendes de sociétés françaises, une retraite française, ou des revenus d'activité partielle en France, ces revenus restent imposables en France via le régime des non-résidents. Anticipez les retenues à la source et le taux minimum de 20 % applicable.",
    action: "Identifiez chaque flux de revenu de source française et son traitement sous la convention applicable.",
  },
  {
    n: '07',
    title: "Anticiper la fiscalité de votre épargne",
    category: 'Patrimoine financier',
    content:
      "Chaque enveloppe d'épargne réagit différemment à l'expatriation. L'assurance-vie : les rachats après le départ subissent la retenue à la source selon la convention. Le PEA : le départ entraîne en principe la clôture sauf maintien sous conditions. Le PER : les droits acquis peuvent être conservés. Ne procédez à aucun rachat sans analyse préalable — les conséquences peuvent être irréversibles.",
    action: "Listez toutes vos enveloppes (AV, PEA, PER, compte-titres) et consultez un expert avant tout rachat.",
  },
  {
    n: '08',
    title: 'Préparer votre couverture sociale',
    category: 'Protection sociale',
    content:
      "En quittant la France, vous perdez votre affiliation automatique à la Sécurité Sociale française. Deux options principales : rejoindre la CFE (Caisse des Français de l'Étranger) pour maintenir une couverture proche du régime français avec cotisations volontaires, ou souscrire une assurance santé internationale privée (ACS, Cigna, April International) souvent plus flexible et moins coûteuse.",
    action: "Comparez CFE vs assurance privée selon votre destination, âge et état de santé. Décidez 3 mois avant le départ.",
  },
  {
    n: '09',
    title: 'Ouvrir vos comptes bancaires à l\'étranger',
    category: 'Aspects bancaires',
    content:
      "Anticipez l'ouverture d'un compte bancaire local dans votre pays de destination (parfois complexe pour un étranger sans historique). Ouvrez également un compte multi-devises (Wise ou Revolut) pour les transferts internationaux sans frais. Pensez à déclarer vos comptes étrangers à l'administration fiscale française (formulaire 3916) — l'oubli est sanctionné d'une amende de 1 500 € par compte.",
    action: "Formulaire 3916 à joindre à votre déclaration de revenus pour chaque compte bancaire étranger détenu.",
  },
  {
    n: '10',
    title: 'Consulter un fiscaliste spécialisé expatriation',
    category: 'Accompagnement expert',
    content:
      "La fiscalité de l'expatriation est complexe, individuelle et souvent irréversible. Une consultation avec un expert franco-étranger avant le départ peut vous faire économiser des milliers d'euros d'impôts, éviter des sanctions pour déclarations manquantes et sécuriser juridiquement votre départ. C'est l'investissement le plus rentable de votre expatriation.",
    action: "Planifiez cette consultation 6 mois avant votre départ prévu pour avoir le temps d'agir sur les recommandations.",
  },
]

const categoryColors: Record<string, string> = {
  'Situation de départ': 'bg-blue-50 text-blue-700',
  'Cadre juridique': 'bg-purple-50 text-purple-700',
  'Imposition au départ': 'bg-red-50 text-red-700',
  'Obligations déclaratives': 'bg-orange-50 text-orange-700',
  'Revenus continus': 'bg-yellow-50 text-yellow-700',
  'Patrimoine financier': 'bg-green-50 text-green-700',
  'Protection sociale': 'bg-teal-50 text-teal-700',
  'Aspects bancaires': 'bg-cyan-50 text-cyan-700',
  'Accompagnement expert': 'bg-gold/10 text-gold',
}

export default function ChecklistPage() {
  return (
    <div className="min-h-screen bg-paper">
      {/* ── Print header (hidden on screen) ── */}
      <div className="hidden print:flex items-center justify-between px-8 py-6 border-b border-ink/10 mb-8">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-ink rounded-full flex items-center justify-center">
            <span className="text-gold font-serif font-bold text-lg">C</span>
          </div>
          <span className="font-serif font-bold text-xl">
            Le Conseiller <span className="italic">Fiscal</span>
          </span>
        </div>
        <span className="font-mono text-xs text-ink/40 uppercase tracking-widest">
          leconseillerfiscal.com
        </span>
      </div>

      {/* ── Screen nav ── */}
      <div className="print:hidden pt-28 pb-6 px-6 border-b border-ink/5">
        <div className="max-w-4xl mx-auto flex items-center justify-between gap-4">
          <Link
            href="/"
            className="flex items-center gap-2 text-sm font-mono text-ink/50 hover:text-ink transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Retour au site
          </Link>
          <PrintButton />
        </div>
      </div>

      {/* ── Header ── */}
      <header className="px-6 py-12 print:py-4">
        <div className="max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-gold/10 text-gold px-3 py-1 font-mono text-xs font-bold tracking-widest uppercase mb-6 print:hidden">
            <CheckSquare className="w-3.5 h-3.5" />
            Ressource Gratuite
          </div>
          <h1 className="font-serif text-4xl md:text-5xl font-black leading-tight mb-4 print:text-3xl">
            10 étapes fiscales obligatoires<br />
            <span className="italic text-gold">avant de quitter la France.</span>
          </h1>
          <p className="text-lg text-ink/60 font-sans leading-relaxed max-w-2xl print:text-sm">
            Cette checklist détaille les démarches fiscales et administratives essentielles à valider
            avant votre départ. Chaque étape omise peut entraîner des redressements, pénalités ou
            une imposition imprévue.
          </p>
          <div className="mt-6 flex flex-wrap gap-4 text-xs font-mono text-ink/40 print:mt-2">
            <span>✓ Mise à jour mars 2026</span>
            <span>✓ Droit fiscal français</span>
            <span>✓ 120+ conventions couvertes</span>
          </div>
        </div>
      </header>

      {/* ── Steps ── */}
      <main className="px-6 pb-16 print:pb-4">
        <div className="max-w-4xl mx-auto flex flex-col gap-5 print:gap-3">
          {steps.map((step) => (
            <div
              key={step.n}
              className="border border-ink/10 bg-white print:border-ink/20 print:break-inside-avoid"
            >
              <div className="p-6 print:p-4">
                <div className="flex items-start gap-5 print:gap-3">
                  {/* Step number + checkbox */}
                  <div className="flex flex-col items-center gap-2 flex-shrink-0">
                    <div className="w-10 h-10 bg-gold text-ink flex items-center justify-center font-mono font-black text-sm print:w-8 print:h-8 print:text-xs">
                      {step.n}
                    </div>
                    {/* Printable checkbox */}
                    <div className="hidden print:block w-5 h-5 border-2 border-ink/20" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <h2 className="font-serif font-black text-xl leading-tight print:text-base">
                        {step.title}
                      </h2>
                      <span className={`px-2 py-0.5 text-[10px] font-mono uppercase tracking-wider ${categoryColors[step.category] ?? 'bg-ink/5 text-ink/50'} print:hidden`}>
                        {step.category}
                      </span>
                    </div>

                    <p className="text-sm text-ink/70 font-sans leading-relaxed mb-3 print:text-xs print:mb-2">
                      {step.content}
                    </p>

                    <div className="flex items-start gap-2 bg-gold/5 border-l-2 border-gold px-3 py-2">
                      <span className="font-mono text-[10px] uppercase tracking-widest text-gold font-bold flex-shrink-0 mt-0.5">
                        Action
                      </span>
                      <p className="text-xs text-ink/70 font-sans leading-relaxed">
                        {step.action}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* ── Footer ── */}
      <footer className="px-6 py-10 border-t border-ink/10 print:py-4 print:mt-4">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <p className="font-serif font-bold text-lg mb-1">Le Conseiller Fiscal</p>
            <p className="text-sm text-ink/50 font-sans">
              La référence francophone de la fiscalité des expatriés.
            </p>
            <p className="text-xs font-mono text-ink/30 mt-1">leconseillerfiscal.com</p>
          </div>
          <div className="text-xs text-ink/30 font-sans leading-relaxed max-w-sm print:hidden">
            Ces informations sont fournies à titre indicatif et ne constituent pas un conseil fiscal
            personnalisé. Consultez un fiscaliste qualifié avant toute décision.
          </div>
          <div className="print:hidden">
            <Link
              href="/bilan-fiscal"
              className="inline-flex items-center gap-2 bg-ink text-paper px-6 py-3 font-mono text-xs tracking-widest uppercase hover:bg-gold hover:text-ink transition-all font-bold"
            >
              Obtenir un bilan personnalisé →
            </Link>
          </div>
        </div>
      </footer>

      {/* ── Print global styles ── */}
      <style>{`
        @media print {
          @page { margin: 1.5cm; size: A4; }
          body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
        }
      `}</style>
    </div>
  )
}
