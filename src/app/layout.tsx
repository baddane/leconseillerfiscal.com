import type { Metadata } from 'next'
import './globals.css'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

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
    description:
      'La référence francophone de la fiscalité des expatriés. Guides complets, comparatifs et outils gratuits.',
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
    <html lang="fr">
      <body className="min-h-screen bg-paper text-ink font-sans antialiased">
        <Navbar />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  )
}
