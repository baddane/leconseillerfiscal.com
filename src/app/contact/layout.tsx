import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Contact — Le Conseiller Fiscal',
  description:
    'Contactez Le Conseiller Fiscal pour toute question sur la fiscalité internationale, l\'expatriation ou un partenariat. Réponse sous 48h.',
  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_SITE_URL ?? 'https://leconseillerfiscal.com'}/contact`,
  },
}

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children
}
