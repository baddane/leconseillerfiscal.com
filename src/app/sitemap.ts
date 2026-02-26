import { MetadataRoute } from 'next'
import { getAllArticles, getAllPaysList } from '@/lib/articles'
import { countries } from '@/data/countries'

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://leconseillerfiscal.com'

export default function sitemap(): MetadataRoute.Sitemap {
  const articles = getAllArticles()
  const paysList = getAllPaysList()

  const staticPages: MetadataRoute.Sitemap = [
    { url: siteUrl, lastModified: new Date(), changeFrequency: 'weekly', priority: 1.0 },
    { url: `${siteUrl}/expatriation`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
    { url: `${siteUrl}/a-propos`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
    { url: `${siteUrl}/contact`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
  ]

  const countryPages: MetadataRoute.Sitemap = countries.map((c) => ({
    url: `${siteUrl}/expatriation/${c.slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }))

  const hubPages: MetadataRoute.Sitemap = paysList
    .filter((pays) => !countries.find((c) => c.slug === pays))
    .map((pays) => ({
      url: `${siteUrl}/expatriation/${pays}`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    }))

  const articlePages: MetadataRoute.Sitemap = articles.map((a) => ({
    url: `${siteUrl}/expatriation/${a.pays}/${a.slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }))

  return [...staticPages, ...countryPages, ...hubPages, ...articlePages]
}
