'use client'

import { usePathname } from 'next/navigation'
import Navbar from './Navbar'
import Footer from './Footer'
import CookieBanner from './CookieBanner'
import ExitIntentModal from './ExitIntentModal'
import StickyLeadBar from './StickyLeadBar'

// Masque le chrome du site (menu, footer, pop-ups) sur les landing pages /lp/*
// afin d'obtenir une page de conversion 100% sans distraction.
export default function SiteFrame({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const bare = pathname?.startsWith('/lp')

  if (bare) return <>{children}</>

  return (
    <>
      <Navbar />
      <main>{children}</main>
      <Footer />
      <CookieBanner />
      <ExitIntentModal />
      <StickyLeadBar />
    </>
  )
}
