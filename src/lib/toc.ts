export interface TocItem {
  id: string
  text: string
  level: number
}

export function extractTocItems(html: string): TocItem[] {
  const matches = [...html.matchAll(/<h([23])[^>]*id="([^"]+)"[^>]*>(.*?)<\/h[23]>/g)]
  return matches.map((m) => ({
    level: parseInt(m[1]),
    id: m[2],
    text: m[3].replace(/<[^>]+>/g, ''),
  }))
}
