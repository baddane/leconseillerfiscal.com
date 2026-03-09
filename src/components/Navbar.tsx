'use client'

import Link from 'next/link'
import { useState } from 'react'
import { usePathname } from 'next/navigation'
import { Menu, X } from 'lucide-react'

const navLinks = [
  { href: '/expatriation', label: 'Expatriation' },
  { href: '/expatriation/outils', label: 'Outils' },
  { href: '/a-propos', label: 'À propos' },
]

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()

  const isActive = (href: string) =>
    href === '/expatriation'
      ? pathname === '/expatriation' || (pathname.startsWith('/expatriation/') && !pathname.startsWith('/expatriation/outils'))
      : pathname === href || pathname.startsWith(href + '/')

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
          {navLinks.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              aria-current={isActive(href) ? 'page' : undefined}
              className={`transition-colors ${isActive(href) ? 'text-gold' : 'hover:text-gold'}`}
            >
              {label}
            </Link>
          ))}
          <Link
            href="/bilan-fiscal"
            aria-current={pathname === '/bilan-fiscal' ? 'page' : undefined}
            className="bg-gold text-ink px-6 py-2.5 hover:bg-gold/80 transition-all duration-300 text-xs font-bold"
          >
            Bilan Gratuit
          </Link>
        </div>

        <button className="md:hidden" onClick={() => setIsOpen(!isOpen)} aria-label="Menu">
          {isOpen ? <X /> : <Menu />}
        </button>
      </div>

      {isOpen && (
        <div className="md:hidden bg-paper border-b border-ink/5 p-6 flex flex-col gap-4 text-center">
          {navLinks.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={`text-lg font-serif transition-colors ${isActive(href) ? 'text-gold' : ''}`}
              onClick={() => setIsOpen(false)}
            >
              {label}
            </Link>
          ))}
          <Link
            href="/bilan-fiscal"
            className="bg-gold text-ink py-3 font-mono text-xs tracking-widest uppercase font-bold"
            onClick={() => setIsOpen(false)}
          >
            Bilan Fiscal Gratuit
          </Link>
        </div>
      )}
    </nav>
  )
}
