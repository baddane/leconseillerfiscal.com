'use client'

import { Printer } from 'lucide-react'

export default function PrintButton() {
  return (
    <button
      onClick={() => window.print()}
      className="flex items-center gap-2 bg-gold text-ink px-5 py-2.5 font-mono text-xs tracking-widest uppercase hover:bg-gold/80 transition-all font-bold"
    >
      <Printer className="w-4 h-4" />
      Imprimer / Sauvegarder en PDF
    </button>
  )
}
