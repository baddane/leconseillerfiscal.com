import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

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
  readTime: number
}

function computeReadTime(content: string): number {
  const wordCount = content.trim().split(/\s+/).length
  return Math.max(1, Math.ceil(wordCount / 200))
}

export function getAllArticles(): Article[] {
  try {
    const fileNames = fs.readdirSync(articlesDirectory)
    return fileNames
      .filter((name) => name.endsWith('.mdx'))
      .map((name) => {
        const slug = name.replace(/\.mdx$/, '')
        return getArticleBySlug(slug)
      })
      .filter((a): a is Article => a !== null)
  } catch {
    return []
  }
}

export function getArticleBySlug(slug: string): Article | null {
  try {
    const fullPath = path.join(articlesDirectory, `${slug}.mdx`)
    const fileContents = fs.readFileSync(fullPath, 'utf8')
    const { data, content } = matter(fileContents)

    return {
      ...(data as ArticleFrontmatter),
      slug,
      content,
      readTime: computeReadTime(content),
    }
  } catch {
    return null
  }
}

export function getArticlesByPays(pays: string): Article[] {
  return getAllArticles().filter((a) => a.pays === pays)
}

export function getAllSlugs(): { pays: string; slug: string }[] {
  return getAllArticles().map((a) => ({ pays: a.pays, slug: a.slug }))
}

export function getAllPaysList(): string[] {
  const all = getAllArticles().map((a) => a.pays)
  return [...new Set(all)]
}
