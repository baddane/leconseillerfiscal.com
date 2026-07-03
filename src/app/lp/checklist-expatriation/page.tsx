import type { Metadata } from 'next'
import {
  AlertTriangle, Scale, Landmark, Check, ShieldCheck, ArrowRight, Clock, FileCheck,
} from 'lucide-react'
import CaptureForm from './CaptureForm'

export const metadata: Metadata = {
  title: 'Checklist fiscale gratuite — 10 étapes avant de quitter la France',
  description:
    'Téléchargez gratuitement la checklist des 10 étapes fiscales à valider avant votre expatriation : domicile fiscal, exit tax, conventions, épargne, protection sociale.',
  robots: { index: false, follow: false },
}

const steps = [
  'Vérifier votre domicile fiscal actuel',
  'Identifier la convention fiscale applicable',
  'Évaluer votre exposition à l’exit tax',
  'Sécuriser votre date de départ fiscale',
  'Déposer votre déclaration de départ',
  'Organiser vos revenus français résiduels',
  'Anticiper la fiscalité de votre épargne',
  'Préparer votre couverture sociale',
  'Ouvrir vos comptes à l’étranger',
  'Consulter un fiscaliste avant le départ',
]

const pains = [
  { icon: Landmark, title: 'Exit tax', desc: 'Une imposition immédiate de vos plus-values latentes au départ si vous détenez plus de 800 000 € de titres. Mal anticipée, la facture est brutale.' },
  { icon: Scale, title: 'Double imposition', desc: 'Sans lire la bonne convention fiscale, vous risquez d’être imposé deux fois sur les mêmes revenus — en France et dans votre pays d’accueil.' },
  { icon: AlertTriangle, title: 'Redressement', desc: 'Comptes étrangers non déclarés, date de départ mal fixée : 1 500 € d’amende par compte oublié et un contrôle qui remonte plusieurs années.' },
]

const faqs = [
  { q: 'La checklist est-elle vraiment gratuite ?', a: 'Oui, à 100 %. Vous entrez votre e-mail, vous téléchargez le PDF immédiatement et vous le recevez aussi par e-mail. Aucune carte bancaire, aucun engagement.' },
  { q: 'À qui s’adresse cette checklist ?', a: 'À tout Français qui envisage de s’expatrier ou qui vient de partir : salariés, entrepreneurs, retraités, investisseurs. Elle couvre les étapes fiscales universelles, quel que soit votre pays de destination.' },
  { q: 'Sur quoi repose ce contenu ?', a: 'Sur les textes officiels français (Code général des impôts, BOFiP, impots.gouv.fr) et l’analyse d’une base de guides dédiés à la fiscalité des expatriés. Ce n’est pas un conseil personnalisé, mais un point de départ fiable.' },
]

export default function LandingPage() {
  return (
    <div className="bg-paper text-ink overflow-x-hidden">
      {/* Barre logo (sans navigation) */}
      <header className="px-6 py-5 border-b border-ink/5">
        <div className="max-w-6xl mx-auto flex items-center gap-3">
          <div className="w-9 h-9 bg-ink rounded-full flex items-center justify-center">
            <span className="text-gold font-serif font-bold text-lg">C</span>
          </div>
          <span className="font-serif text-lg font-bold">
            Le Conseiller <span className="italic text-gold">Fiscal</span>
          </span>
        </div>
      </header>

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section className="px-6 py-16 md:py-24">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div>
            <span className="inline-block font-mono text-xs font-bold tracking-widest uppercase text-gold mb-5">
              Ressource gratuite · PDF
            </span>
            <h1 className="font-serif text-[2rem] leading-[1.1] sm:text-5xl md:text-6xl sm:leading-[1.05] font-black mb-6 break-words">
              Quittez la France <span className="italic text-gold">sans</span> erreur fiscale.
            </h1>
            <p className="text-lg text-ink/70 leading-relaxed mb-8 max-w-xl">
              La checklist des <strong className="text-ink">10 étapes obligatoires</strong> avant de vous
              expatrier — exit tax, domicile fiscal, conventions, épargne, comptes à l’étranger.
              Évitez les erreurs qui coûtent des milliers d’euros.
            </p>

            <div className="bg-cream border border-border p-6 md:p-7 shadow-sm">
              <p className="font-serif text-xl font-bold mb-4">Recevez-la maintenant, gratuitement 👇</p>
              <CaptureForm id="hero-form" />
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2 text-ink/50 font-mono text-[11px] uppercase tracking-wider">
              <span className="flex items-center gap-1.5"><ShieldCheck className="w-4 h-4 text-gold" /> Données protégées</span>
              <span className="flex items-center gap-1.5"><Clock className="w-4 h-4 text-gold" /> Téléchargement immédiat</span>
            </div>
          </div>

          <div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/checklist-cover.png"
              alt="Couverture de la checklist fiscale — 10 étapes avant de quitter la France"
              width={680}
              height={858}
              className="w-52 sm:w-64 lg:w-full lg:max-w-md mx-auto shadow-2xl"
            />
          </div>
        </div>
      </section>

      {/* ── Bandeau confiance ────────────────────────────────────────────── */}
      <section className="bg-ink text-paper px-6 py-6">
        <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-center gap-x-10 gap-y-3 font-mono text-[11px] md:text-xs uppercase tracking-widest text-paper/70">
          <span>La référence francophone de la fiscalité des expatriés</span>
          <span className="text-gold">•</span>
          <span>80+ guides par pays &amp; par thème</span>
          <span className="text-gold">•</span>
          <span>Basée sur les textes officiels (BOFiP)</span>
        </div>
      </section>

      {/* ── Problème / agitation ─────────────────────────────────────────── */}
      <section className="px-6 py-16 md:py-24">
        <div className="max-w-6xl mx-auto">
          <div className="max-w-2xl mb-12">
            <span className="font-mono text-xs font-bold tracking-widest uppercase text-red">Ce que personne ne vous dit</span>
            <h2 className="font-serif text-3xl md:text-4xl font-black mt-3 leading-tight">
              Partir sans préparer sa fiscalité peut coûter <span className="text-red">très cher.</span>
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {pains.map((p) => (
              <div key={p.title} className="border border-border bg-white p-7">
                <div className="w-11 h-11 bg-red/10 flex items-center justify-center mb-5">
                  <p.icon className="w-5 h-5 text-red" />
                </div>
                <h3 className="font-serif text-xl font-bold mb-2">{p.title}</h3>
                <p className="text-ink/65 font-sans text-sm leading-relaxed">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Ce que contient la checklist ─────────────────────────────────── */}
      <section className="bg-cream px-6 py-16 md:py-24 border-y border-border">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <span className="font-mono text-xs font-bold tracking-widest uppercase text-gold">Dans la checklist</span>
            <h2 className="font-serif text-3xl md:text-4xl font-black mt-3 mb-6 leading-tight">
              10 étapes claires, prêtes à cocher.
            </h2>
            <p className="text-ink/70 font-sans leading-relaxed mb-8">
              Chaque étape indique <strong className="text-ink">quoi vérifier</strong> et
              <strong className="text-ink"> quoi faire concrètement</strong>, avec les seuils, formulaires et
              délais à connaître. Un document que vous gardez sous la main jusqu’au départ.
            </p>
            <a
              href="#final-form"
              className="inline-flex items-center gap-2 bg-ink text-paper px-7 py-4 font-mono text-xs font-bold uppercase tracking-widest hover:bg-gold hover:text-ink transition-colors"
            >
              <FileCheck className="w-4 h-4" /> Obtenir la checklist
            </a>
          </div>
          <ul className="grid sm:grid-cols-2 gap-x-6 gap-y-3">
            {steps.map((s, i) => (
              <li key={i} className="flex items-start gap-3">
                <span className="mt-0.5 w-5 h-5 bg-gold flex items-center justify-center shrink-0">
                  <Check className="w-3.5 h-3.5 text-ink" />
                </span>
                <span className="font-sans text-sm text-ink/80 leading-snug">{s}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ── CTA final ────────────────────────────────────────────────────── */}
      <section className="px-6 py-16 md:py-24">
        <div className="max-w-xl mx-auto text-center">
          <span className="font-mono text-xs font-bold tracking-widest uppercase text-gold">Téléchargement gratuit</span>
          <h2 className="font-serif text-3xl md:text-4xl font-black mt-3 mb-4 leading-tight">
            Sécurisez votre départ dès aujourd’hui.
          </h2>
          <p className="text-ink/70 font-sans mb-8">
            Entrez votre e-mail : vous recevez la checklist immédiatement.
          </p>
          <div className="bg-cream border border-border p-6 md:p-7 text-left">
            <CaptureForm id="final-form" cta="Télécharger le PDF gratuit" />
          </div>
        </div>
      </section>

      {/* ── Offre secondaire : bilan fiscal ──────────────────────────────── */}
      <section className="bg-ink text-paper px-6 py-14">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
          <div>
            <span className="font-mono text-[11px] font-bold tracking-widest uppercase text-gold">Situation complexe ?</span>
            <h3 className="font-serif text-2xl font-bold mt-2 mb-1">Demandez un bilan fiscal gratuit.</h3>
            <p className="text-paper/60 font-sans text-sm">Une analyse personnalisée de votre profil, sous 48 h ouvrées.</p>
          </div>
          <a
            href="/bilan-fiscal"
            className="shrink-0 inline-flex items-center gap-2 bg-gold text-ink px-7 py-4 font-mono text-xs font-bold uppercase tracking-widest hover:bg-gold-light transition-colors"
          >
            Demander mon bilan <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </section>

      {/* ── FAQ ──────────────────────────────────────────────────────────── */}
      <section className="px-6 py-16 md:py-20">
        <div className="max-w-3xl mx-auto">
          <h2 className="font-serif text-3xl font-black mb-10 text-center">Questions fréquentes</h2>
          <div className="flex flex-col divide-y divide-border border-y border-border">
            {faqs.map((f) => (
              <div key={f.q} className="py-6">
                <h3 className="font-serif text-lg font-bold mb-2">{f.q}</h3>
                <p className="text-ink/70 font-sans text-sm leading-relaxed">{f.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Footer minimal (légal, sans navigation) ──────────────────────── */}
      <footer className="bg-ink text-paper/50 px-6 py-10">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-center">
          <span className="font-mono text-[11px] uppercase tracking-widest">
            © {new Date().getFullYear()} Le Conseiller Fiscal
          </span>
          <div className="flex items-center gap-6 font-mono text-[11px] uppercase tracking-widest">
            <a href="/mentions-legales" className="hover:text-gold transition-colors">Mentions légales</a>
            <a href="/confidentialite" className="hover:text-gold transition-colors">Confidentialité</a>
          </div>
        </div>
      </footer>
    </div>
  )
}
