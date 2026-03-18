import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import type { Article } from '@/lib/articles'

interface Props {
  articles: Article[]
  currentSlug: string
  pays: string
  countryName: string
}

export default function RelatedArticles({ articles, currentSlug, pays, countryName }: Props) {
  const related = articles.filter((a) => a.slug !== currentSlug).slice(0, 3)
  if (related.length === 0) return null

  return (
    <section className="mt-16 pt-12 border-t border-ink/10">
      <h2 className="font-serif text-2xl font-bold mb-6">
        Autres guides {countryName}
      </h2>
      <div className="flex flex-col gap-4">
        {related.map((article) => (
          <Link
            key={article.slug}
            href={`/expatriation/${pays}/${article.slug}`}
            className="group border border-ink/10 p-5 hover:border-gold/40 transition-all bg-white block"
          >
            <div className="font-mono text-xs text-gold uppercase tracking-widest mb-1">
              {article.readTime} min de lecture
            </div>
            <h3 className="font-serif text-lg font-bold text-ink group-hover:text-gold transition-colors leading-tight">
              {article.title}
            </h3>
            <div className="flex items-center gap-2 mt-2 text-gold font-mono text-xs font-bold uppercase tracking-widest">
              Lire <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}
