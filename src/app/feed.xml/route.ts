import { getAllArticles } from '@/lib/articles'
import { countries } from '@/data/countries'

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://leconseillerfiscal.com'

function escapeXml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

export async function GET() {
  const articles = await getAllArticles()

  const items = articles
    .map((article) => {
      const country = countries.find((c) => c.slug === article.pays)
      const url = `${siteUrl}/expatriation/${article.pays}/${article.slug}`
      return `    <item>
      <title>${escapeXml(article.title)}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <description>${escapeXml(article.metaDescription)}</description>
      <category>${escapeXml(country?.name ?? article.pays)}</category>
      <pubDate>${new Date().toUTCString()}</pubDate>
    </item>`
    })
    .join('\n')

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Le Conseiller Fiscal</title>
    <link>${siteUrl}</link>
    <description>La référence francophone de la fiscalité des expatriés. Guides complets par pays, comparatifs outils et analyses fiscales.</description>
    <language>fr</language>
    <atom:link href="${siteUrl}/feed.xml" rel="self" type="application/rss+xml"/>
${items}
  </channel>
</rss>`

  return new Response(rss, {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  })
}
