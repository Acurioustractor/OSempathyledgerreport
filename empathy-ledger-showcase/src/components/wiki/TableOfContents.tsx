'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

interface TocItem {
  id: string
  title: string
  level: number
}

export default function TableOfContents() {
  const [activeId, setActiveId] = useState<string>('')
  const [headings, setHeadings] = useState<TocItem[]>([])

  useEffect(() => {
    // Get all headings on mount
    const elements = document.querySelectorAll('h2[id], h3[id]')
    const items: TocItem[] = Array.from(elements).map((elem) => ({
      id: elem.id,
      title: elem.textContent || '',
      level: parseInt(elem.tagName.charAt(1))
    }))
    setHeadings(items)

    // Set up intersection observer
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id)
          }
        })
      },
      {
        rootMargin: '-20% 0% -70% 0%'
      }
    )

    elements.forEach((elem) => observer.observe(elem))

    return () => {
      elements.forEach((elem) => observer.unobserve(elem))
    }
  }, [])

  return (
    <nav className="sticky top-8 max-h-[calc(100vh-4rem)] overflow-y-auto">
      <h3 className="font-semibold text-sm text-gray-900 mb-4">On this page</h3>
      <ul className="space-y-2 text-sm">
        {headings.map((heading) => (
          <li
            key={heading.id}
            className={`${
              heading.level === 3 ? 'ml-4' : ''
            }`}
          >
            <Link
              href={`#${heading.id}`}
              className={`block py-1 transition-colors duration-200 ${
                activeId === heading.id
                  ? 'text-orange-sky font-medium'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {heading.title}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  )
}