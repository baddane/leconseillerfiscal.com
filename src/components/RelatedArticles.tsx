import Link from 'next/link'
import { Clock } from 'lucide-react'
import type { Article } from '@/lib/articles'

interface RelatedArticlesProps {
  currentSlug: string
  pays: string
  articles: Article[]
}

export default function RelatedArticles({ currentSlug, pays, articles }: RelatedArticlesProps) {
  const related = articles
    .filter((a) => a.slug !== currentSlug && a.pays === pays)
    .slice(0, 3)

  if (related.length === 0) return null

  return (
    <section className="mt-16 pt-12 border-t border-ink/10">
      <h2 className="font-serif text-2xl font-bold mb-6">Guides associés</h2>
      <div className="grid sm:grid-cols-3 gap-4">
        {related.map((article) => (
          <Link
            key={article.slug}
            href={`/expatriation/${article.pays}/${article.slug}`}
            className="group border border-ink/10 bg-white p-5 hover:border-gold/40 transition-colors"
          >
            <p className="font-serif font-bold text-sm leading-snug mb-3 group-hover:text-gold transition-colors line-clamp-3">
              {article.title}
            </p>
            <span className="flex items-center gap-1 font-mono text-xs text-grey">
              <Clock className="w-3 h-3" />
              {article.readTime} min
            </span>
          </Link>
        ))}
      </div>
    </section>
  )
}
