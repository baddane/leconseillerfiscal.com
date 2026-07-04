'use client'

import { usePathname } from 'next/navigation'
import Navbar from './Navbar'
import Footer from './Footer'
import ExitIntentModal from './ExitIntentModal'
import StickyLeadBar from './StickyLeadBar'

// Masque le chrome marketing (menu, footer, pop-ups) sur les landing pages /lp/*
// pour une page de conversion sans distraction. La bannière cookies et le
// tracking restent globaux (rendus dans le layout racine) car nécessaires
// au consentement et à la mesure des campagnes, y compris sur les LP.
export default function SiteFrame({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const bare = pathname?.startsWith('/lp')

  if (bare) return <>{children}</>

  return (
    <>
      <Navbar />
      <main>{children}</main>
      <Footer />
      <ExitIntentModal />
      <StickyLeadBar />
    </>
  )
}
