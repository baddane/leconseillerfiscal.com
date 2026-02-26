import Link from 'next/link'
import { affiliateDisplay } from '@/lib/affiliates'

interface AffiliateBoxProps {
  partnerId: string
  variant?: 'sidebar' | 'inline'
}

export default function AffiliateBox({ partnerId, variant = 'sidebar' }: AffiliateBoxProps) {
  const affiliate = affiliateDisplay[partnerId]
  if (!affiliate) return null

  const badgeColor = {
    high: 'bg-green-50 text-green-800 border-green-200',
    medium: 'bg-gold/10 text-gold border-gold/20',
    low: 'bg-grey/10 text-grey border-grey/20',
  }[affiliate.badge]

  if (variant === 'inline') {
    return (
      <div className="my-8 border-l-4 border-gold bg-cream p-6 flex items-start gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-2">
            <span className="font-serif font-bold text-lg text-ink">{affiliate.name}</span>
            <span className="font-mono text-xs text-grey">{affiliate.category}</span>
          </div>
          <p className="text-sm text-grey leading-relaxed mb-4">{affiliate.description}</p>
          <Link
            href={`/go/${affiliate.id}`}
            className="inline-block bg-ink text-paper px-6 py-2.5 font-mono text-xs tracking-widest uppercase hover:bg-gold hover:text-ink transition-all"
            rel="nofollow sponsored"
            target="_blank"
          >
            {affiliate.cta} →
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="border border-border bg-cream p-6 mb-6">
      <div className="font-mono text-xs text-grey uppercase tracking-widest mb-3 pb-3 border-b border-border">
        Partenaire recommandé
      </div>
      <div className="font-serif font-bold text-xl text-ink mb-1">{affiliate.name}</div>
      <div className={`inline-block text-xs px-2 py-0.5 border font-mono mb-3 ${badgeColor}`}>
        {affiliate.commission}
      </div>
      <p className="text-sm text-grey leading-relaxed mb-5">{affiliate.description}</p>
      <Link
        href={`/go/${affiliate.id}`}
        className="block text-center bg-ink text-paper py-3 font-mono text-xs tracking-widest uppercase hover:bg-gold hover:text-ink transition-all"
        rel="nofollow sponsored"
        target="_blank"
      >
        {affiliate.cta} →
      </Link>
    </div>
  )
}
