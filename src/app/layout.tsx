import type { Metadata } from 'next'
import { Inter, Playfair_Display, JetBrains_Mono } from 'next/font/google'
import './globals.css'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
})

const jetbrains = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains',
  display: 'swap',
})

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://leconseillerfiscal.com'

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'Le Conseiller Fiscal — Fiscalité Expatriation Français',
    template: '%s | Le Conseiller Fiscal',
  },
  description:
    'La référence francophone de la fiscalité des expatriés. Guides complets par pays, comparatifs outils, fiscalité NHR Portugal, Dubaï, Suisse, Canada.',
  keywords: ['fiscalité expatrié', 'impôt expatriation', 'NHR Portugal', 'résidence fiscale', 'exit tax'],
  authors: [{ name: 'Le Conseiller Fiscal', url: siteUrl }],
  creator: 'Le Conseiller Fiscal',
  openGraph: {
    type: 'website',
    locale: 'fr_FR',
    url: siteUrl,
    siteName: 'Le Conseiller Fiscal',
    title: 'Le Conseiller Fiscal — Fiscalité Expatriation Français',
    description: 'La référence francophone de la fiscalité des expatriés. Guides complets, comparatifs et outils gratuits.',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'Le Conseiller Fiscal' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Le Conseiller Fiscal',
    description: 'La référence francophone de la fiscalité des expatriés.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large' },
  },
  alternates: {
    canonical: siteUrl,
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="fr"
      className={`${inter.variable} ${playfair.variable} ${jetbrains.variable}`}
    >
      <body className="min-h-screen selection:bg-gold selection:text-ink">
        <Navbar />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  )
}
