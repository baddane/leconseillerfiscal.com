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
  // Date de publication machine (YYYY-MM-DD) — alimente le sitemap, le flux RSS
  // et la détection de nouveaux articles. dateModified est optionnelle.
  datePublished: string
  dateModified?: string
  motClePrincipal: string
  affiliations: string[]
  faq: ArticleFaq[]
}

// Repli si un article n'a pas encore de datePublished dans son frontmatter.
const FALLBACK_DATE = '2026-01-01'

export interface Article extends ArticleFrontmatter {
  content: string
  contentHtml: string
  readTime: number
}

function computeReadTime(content: string): number {
  const wordCount = content.trim().split(/\s+/).length
  return Math.max(1, Math.ceil(wordCount / 200))
}

async function markdownToHtml(markdown: string): Promise<string> {
  const result = await remark()
    .use(remarkGfm)
    .use(remarkHtml, { sanitize: false })
    .process(markdown)

  return sanitizeHtml(result.toString(), {
    allowedTags: sanitizeHtml.defaults.allowedTags.concat([
      'img', 'details', 'summary', 'del', 'ins', 'sup', 'sub',
    ]),
    allowedAttributes: {
      ...sanitizeHtml.defaults.allowedAttributes,
      img: ['src', 'alt', 'title', 'width', 'height', 'loading'],
      a: ['href', 'title', 'target', 'rel'],
      th: ['align'],
      td: ['align'],
    },
    allowedSchemes: ['http', 'https', 'mailto'],
  })
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
      datePublished: (data.datePublished as string) ?? FALLBACK_DATE,
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
export function getAllSlugsSynced(): { pays: string; slug: string; datePublished: string }[] {
  try {
    const fileNames = fs.readdirSync(articlesDirectory)
    return fileNames
      .filter((name) => name.endsWith('.mdx'))
      .map((name) => {
        const slug = name.replace(/\.mdx$/, '')
        const fullPath = path.join(articlesDirectory, `${slug}.mdx`)
        const fileContents = fs.readFileSync(fullPath, 'utf8')
        const { data } = matter(fileContents)
        return {
          pays: (data as ArticleFrontmatter).pays,
          slug,
          datePublished: (data.datePublished as string) ?? FALLBACK_DATE,
        }
      })
  } catch {
    return []
  }
}

export function getAllPaysListSynced(): string[] {
  return [...new Set(getAllSlugsSynced().map((s) => s.pays))]
}

export interface ArticleMeta {
  slug: string
  title: string
  pays: string
  dateVerification: string
  metaDescription: string
}

// Frontmatter seul (rapide, sans conversion markdown) — pour lister/choisir
// les articles côté admin et construire la newsletter.
export function getAllArticleMetaSynced(): ArticleMeta[] {
  try {
    return fs
      .readdirSync(articlesDirectory)
      .filter((name) => name.endsWith('.mdx'))
      .map((name) => {
        const slug = name.replace(/\.mdx$/, '')
        const { data } = matter(fs.readFileSync(path.join(articlesDirectory, name), 'utf8'))
        const d = data as ArticleFrontmatter
        return {
          slug,
          title: d.title ?? slug,
          pays: d.pays ?? 'outils',
          dateVerification: d.dateVerification ?? '',
          metaDescription: d.metaDescription ?? '',
        }
      })
  } catch {
    return []
  }
}
