import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { remark } from 'remark'
import remarkGfm from 'remark-gfm'
import remarkHtml from 'remark-html'

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
  motClePrincipal: string
  affiliations: string[]
  faq: ArticleFaq[]
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

async function markdownToHtml(markdown: string): Promise<string> {
  const result = await remark()
    .use(remarkGfm)
    .use(remarkHtml, { sanitize: false })
    .process(markdown)
  return result.toString()
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
