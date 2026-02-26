import Link from 'next/link'
import { Globe } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-ink text-paper pt-24 pb-12 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-4 gap-12 mb-20">
          <div className="col-span-2">
            <div className="flex items-center gap-2 mb-8">
              <div className="w-10 h-10 bg-paper rounded-full flex items-center justify-center">
                <span className="text-ink font-serif font-bold text-xl">C</span>
              </div>
              <span className="font-serif font-bold text-2xl tracking-tight">
                Le Conseiller <span className="text-gold italic">Fiscal</span>
              </span>
            </div>
            <p className="text-paper/40 max-w-sm leading-relaxed mb-6 font-mono text-xs">
              La référence francophone de la fiscalité internationale. Expertise, clarté et accompagnement pour vos projets d&apos;expatriation.
            </p>
            <p className="text-paper/25 text-xs font-mono leading-relaxed max-w-sm">
              Les informations publiées sur ce site sont fournies à titre purement informatif et ne constituent pas un conseil fiscal personnalisé.
            </p>
          </div>

          <div>
            <h5 className="font-mono font-bold mb-6 uppercase tracking-widest text-xs text-gold">
              Destinations
            </h5>
            <ul className="flex flex-col gap-3 text-paper/60 text-sm font-mono">
              <li><Link href="/expatriation/portugal" className="hover:text-paper transition-colors">Portugal (NHR)</Link></li>
              <li><Link href="/expatriation/emirats-arabes-unis" className="hover:text-paper transition-colors">Émirats Arabes Unis</Link></li>
              <li><Link href="/expatriation/suisse" className="hover:text-paper transition-colors">Suisse</Link></li>
              <li><Link href="/expatriation/canada" className="hover:text-paper transition-colors">Canada</Link></li>
              <li><Link href="/expatriation" className="hover:text-gold transition-colors text-gold/60">Toutes destinations →</Link></li>
            </ul>
          </div>

          <div>
            <h5 className="font-mono font-bold mb-6 uppercase tracking-widest text-xs text-gold">
              Ressources
            </h5>
            <ul className="flex flex-col gap-3 text-paper/60 text-sm font-mono">
              <li><Link href="/expatriation/outils/wise-vs-revolut-expatrie" className="hover:text-paper transition-colors">Wise vs Revolut</Link></li>
              <li><Link href="/expatriation/outils/comparatif-assurance-sante-expatrie" className="hover:text-paper transition-colors">Assurance santé expat</Link></li>
              <li><Link href="/expatriation/portugal/fiscalite-francais-portugal" className="hover:text-paper transition-colors">Guide Portugal NHR</Link></li>
              <li><Link href="/a-propos" className="hover:text-paper transition-colors">À propos</Link></li>
              <li><Link href="/contact" className="hover:text-paper transition-colors">Contact</Link></li>
            </ul>
          </div>
        </div>

        <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6 text-xs uppercase tracking-widest text-paper/30 font-mono font-bold">
          <div>© {new Date().getFullYear()} Le Conseiller Fiscal. Tous droits réservés.</div>
          <div className="flex gap-8">
            <Link href="/mentions-legales" className="hover:text-paper transition-colors">Mentions Légales</Link>
            <Link href="/confidentialite" className="hover:text-paper transition-colors">Confidentialité</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
