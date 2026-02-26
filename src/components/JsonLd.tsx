interface JsonLdProps {
  data: Record<string, unknown>
}

export function JsonLd({ data }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  )
}

export function ArticleJsonLd({
  title,
  description,
  url,
  datePublished,
  dateModified,
}: {
  title: string
  description: string
  url: string
  datePublished: string
  dateModified?: string
}) {
  return (
    <JsonLd
      data={{
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: title,
        description,
        url,
        datePublished,
        dateModified: dateModified ?? datePublished,
        author: {
          '@type': 'Person',
          name: 'Le Conseiller Fiscal',
          url: `${process.env.NEXT_PUBLIC_SITE_URL ?? 'https://leconseillerfiscal.com'}/a-propos`,
        },
        publisher: {
          '@type': 'Organization',
          name: 'Le Conseiller Fiscal',
          url: process.env.NEXT_PUBLIC_SITE_URL ?? 'https://leconseillerfiscal.com',
        },
      }}
    />
  )
}

export function FaqJsonLd({ faq }: { faq: { question: string; reponse: string }[] }) {
  return (
    <JsonLd
      data={{
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: faq.map((item) => ({
          '@type': 'Question',
          name: item.question,
          acceptedAnswer: {
            '@type': 'Answer',
            text: item.reponse,
          },
        })),
      }}
    />
  )
}

export function BreadcrumbJsonLd({
  items,
}: {
  items: { name: string; url: string }[]
}) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://leconseillerfiscal.com'
  return (
    <JsonLd
      data={{
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: items.map((item, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          name: item.name,
          item: item.url.startsWith('http') ? item.url : `${siteUrl}${item.url}`,
        })),
      }}
    />
  )
}
