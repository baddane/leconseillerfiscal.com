'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Menu, X } from 'lucide-react'

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-paper/90 backdrop-blur-lg border-b border-ink/5">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-ink rounded-full flex items-center justify-center">
            <span className="text-gold font-serif font-bold text-lg">C</span>
          </div>
          <span className="font-serif font-bold text-xl tracking-tight">
            Le Conseiller <span className="text-gold italic">Fiscal</span>
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-8 text-sm font-medium uppercase tracking-widest">
          <Link href="/expatriation" className="hover:text-gold transition-colors">
            Expatriation
          </Link>
          <Link href="/expatriation/outils" className="hover:text-gold transition-colors">
            Outils
          </Link>
          <Link href="/a-propos" className="hover:text-gold transition-colors">
            À propos
          </Link>
          <Link
            href="/contact"
            className="bg-ink text-paper px-6 py-2.5 hover:bg-gold hover:text-ink transition-all duration-300 text-xs"
          >
            Consulter un Expert
          </Link>
        </div>

        <button className="md:hidden" onClick={() => setIsOpen(!isOpen)} aria-label="Menu">
          {isOpen ? <X /> : <Menu />}
        </button>
      </div>

      {isOpen && (
        <div className="md:hidden bg-paper border-b border-ink/5 p-6 flex flex-col gap-4 text-center">
          <Link href="/expatriation" className="text-lg font-serif" onClick={() => setIsOpen(false)}>
            Expatriation
          </Link>
          <Link href="/expatriation/outils" className="text-lg font-serif" onClick={() => setIsOpen(false)}>
            Outils & Comparatifs
          </Link>
          <Link href="/a-propos" className="text-lg font-serif" onClick={() => setIsOpen(false)}>
            À propos
          </Link>
          <Link
            href="/contact"
            className="bg-ink text-paper py-3 font-mono text-xs tracking-widest uppercase"
            onClick={() => setIsOpen(false)}
          >
            Consulter un Expert
          </Link>
        </div>
      )}
    </nav>
  )
}
