'use client'

import { useEffect, useRef, useState } from 'react'
import { List } from 'lucide-react'
import type { TocItem } from '@/lib/toc'

interface TableOfContentsProps {
  items: TocItem[]
}

export default function TableOfContents({ items }: TableOfContentsProps) {
  const [activeId, setActiveId] = useState<string>('')
  const observerRef = useRef<IntersectionObserver | null>(null)

  useEffect(() => {
    const headings = items.map(({ id }) => document.getElementById(id)).filter(Boolean) as HTMLElement[]

    observerRef.current = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting)
        if (visible.length > 0) setActiveId(visible[0].target.id)
      },
      { rootMargin: '0px 0px -60% 0px' }
    )

    headings.forEach((el) => observerRef.current?.observe(el))
    return () => observerRef.current?.disconnect()
  }, [items])

  if (items.length < 3) return null

  return (
    <nav className="border border-ink/10 bg-cream p-5 mb-10">
      <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-ink/50 mb-4">
        <List className="w-3.5 h-3.5" />
        Sommaire
      </div>
      <ol className="flex flex-col gap-1.5">
        {items.map((item) => (
          <li key={item.id} style={{ paddingLeft: item.level === 3 ? '1rem' : '0' }}>
            <a
              href={`#${item.id}`}
              className={`text-sm font-sans transition-colors hover:text-gold ${
                activeId === item.id ? 'text-gold font-medium' : 'text-ink/70'
              }`}
            >
              {item.text}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  )
}

