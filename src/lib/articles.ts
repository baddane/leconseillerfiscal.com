import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { remark } from 'remark'
import remarkGfm from 'remark-gfm'
import remarkHtml from 'remark-html'
import sanitizeHtml from 'sanitize-html'

const articlesDirectory = path.join(process.cwd(), 'content/articles')

export interface ArticleFaq {
  question: string
  reponse: string
}

export interface ArticleFrontmatter {
  title: string
  metaDescription: string
  pays: string
  slug: string
  dateVerification: string
  datePublished?: string
  motClePrincipal: string
  affiliations: string[]
  faq: ArticleFaq[]
}

const FRENCH_MONTHS: Record<string, string> = {
  janvier: '01', février: '02', mars: '03', avril: '04',
  mai: '05', juin: '06', juillet: '07', août: '08',
  septembre: '09', octobre: '10', novembre: '11', décembre: '12',
}

export function dateVerificationToIso(dateVerification: string): string {
  const parts = dateVerification.trim().toLowerCase().split(/\s+/)
  if (parts.length === 2) {
    const month = FRENCH_MONTHS[parts[0]]
    const year = parts[1]
    if (month && year) return `${year}-${month}-01`
  }
  return '2025-01-01'
}

export interface Article extends ArticleFrontmatter {
  content: string
  contentHtml: string
  readTime: number
}

function computeReadTime(content: string): number {
  const wordCount = content.trim().split(/\s+/).length
  return Math.max(1, Math.ceil(wordCount / 200))
}

function toSlug(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

function addHeadingIds(html: string): string {
  return html.replace(/<(h[23])>(.*?)<\/h[23]>/g, (_, tag, inner) => {
    const id = toSlug(inner.replace(/<[^>]+>/g, ''))
    return `<${tag} id="${id}">${inner}</${tag}>`
  })
}

async function markdownToHtml(markdown: string): Promise<string> {
  const result = await remark()
    .use(remarkGfm)
    .use(remarkHtml, { sanitize: false })
    .process(markdown)

  const sanitized = sanitizeHtml(result.toString(), {
    allowedTags: sanitizeHtml.defaults.allowedTags.concat([
      'img', 'details', 'summary', 'del', 'ins', 'sup', 'sub',
    ]),
    allowedAttributes: {
      ...sanitizeHtml.defaults.allowedAttributes,
      img: ['src', 'alt', 'title', 'width', 'height', 'loading'],
      a: ['href', 'title', 'target', 'rel'],
      th: ['align'],
      td: ['align'],
      h2: ['id'],
      h3: ['id'],
    },
    allowedSchemes: ['http', 'https', 'mailto'],
    transformTags: {
      a: (tagName, attribs) => {
        if (attribs.href?.startsWith('/go/')) {
          return {
            tagName,
            attribs: { ...attribs, rel: 'nofollow sponsored', target: '_blank' },
          }
        }
        return { tagName, attribs }
      },
    },
  })

  return addHeadingIds(sanitized)
}

export async function getAllArticles(): Promise<Article[]> {
  try {
    const fileNames = fs.readdirSync(articlesDirectory)
    const articles = await Promise.all(
      fileNames
        .filter((name) => name.endsWith('.mdx'))
        .map((name) => getArticleBySlug(name.replace(/\.mdx$/, '')))
    )
    return articles.filter((a): a is Article => a !== null)
  } catch {
    return []
  }
}

export async function getArticleBySlug(slug: string): Promise<Article | null> {
  try {
    const fullPath = path.join(articlesDirectory, `${slug}.mdx`)
    const fileContents = fs.readFileSync(fullPath, 'utf8')
    const { data, content } = matter(fileContents)
    const contentHtml = await markdownToHtml(content)

    return {
      ...(data as ArticleFrontmatter),
      slug,
      content,
      contentHtml,
      readTime: computeReadTime(content),
    }
  } catch {
    return null
  }
}

export async function getArticlesByPays(pays: string): Promise<Article[]> {
  const all = await getAllArticles()
  return all.filter((a) => a.pays === pays)
}

// Sync versions for generateStaticParams (no async allowed there in Next.js build)
export function getAllSlugsSynced(): { pays: string; slug: string }[] {
  try {
    const fileNames = fs.readdirSync(articlesDirectory)
    return fileNames
      .filter((name) => name.endsWith('.mdx'))
      .map((name) => {
        const slug = name.replace(/\.mdx$/, '')
        const fullPath = path.join(articlesDirectory, `${slug}.mdx`)
        const fileContents = fs.readFileSync(fullPath, 'utf8')
        const { data } = matter(fileContents)
        return { pays: (data as ArticleFrontmatter).pays, slug }
      })
  } catch {
    return []
  }
}

export function getAllPaysListSynced(): string[] {
  return [...new Set(getAllSlugsSynced().map((s) => s.pays))]
}
