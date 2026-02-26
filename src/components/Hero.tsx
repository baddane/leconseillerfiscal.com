'use client'

import Link from 'next/link'
import { motion } from 'motion/react'
import { ArrowRight } from 'lucide-react'

export default function Hero() {
  return (
    <section className="relative pt-40 pb-24 px-6 overflow-hidden">
      <div className="max-w-7xl mx-auto text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <span className="inline-block px-4 py-1.5 bg-gold/10 text-gold font-mono text-xs font-bold tracking-widest uppercase mb-6">
            Fiscalité Expatriation · Guides Gratuits · Affiliation
          </span>
          <h1 className="text-6xl md:text-8xl font-black leading-[0.9] mb-8 tracking-tighter">
            L&apos;Excellence <br />
            <span className="italic text-gold">Fiscale</span> sans Frontières.
          </h1>
          <p className="max-w-2xl mx-auto text-lg md:text-xl text-ink/60 font-light leading-relaxed mb-12">
            La référence francophone de la fiscalité des expatriés. Guides complets par pays, comparatifs d&apos;outils et ressources gratuites pour optimiser votre situation.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/expatriation"
              className="w-full sm:w-auto bg-ink text-paper px-10 py-4 font-mono font-bold text-sm tracking-widest uppercase flex items-center justify-center gap-2 hover:bg-gold hover:text-ink transition-all group"
            >
              Découvrir les guides
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="/expatriation/outils/comparatif-assurance-sante-expatrie"
              className="w-full sm:w-auto border border-ink/20 px-10 py-4 font-mono font-bold text-sm tracking-widest uppercase hover:bg-ink/5 transition-all"
            >
              Comparer les assurances
            </Link>
          </div>
        </motion.div>
      </div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gold/5 rounded-full blur-3xl -z-0" />
    </section>
  )
}
