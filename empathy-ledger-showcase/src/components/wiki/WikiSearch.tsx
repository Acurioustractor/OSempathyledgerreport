'use client'

import { useState, useEffect, useRef } from 'react'
import { Search, X } from 'lucide-react'
import Link from 'next/link'

interface SearchResult {
  title: string
  description: string
  href: string
  section: string
}

// Mock search data - in production, this would come from an API or search index
const searchData: SearchResult[] = [
  {
    title: 'Ethical Storytelling Principles',
    description: 'Learn about informed consent, ongoing agency, transparency, and benefit sharing',
    href: '/wiki/overview#ethical-principles',
    section: 'Getting Started'
  },
  {
    title: 'Privacy & Consent Framework',
    description: 'Three-tier consent model for internal, anonymous, and full attribution sharing',
    href: '/wiki/overview#privacy-consent',
    section: 'Getting Started'
  },
  {
    title: 'Airtable Setup',
    description: 'Configure Airtable as the central repository for stories and consent records',
    href: '/wiki/overview#airtable-setup',
    section: 'Implementation'
  },
  {
    title: 'Interview Techniques',
    description: 'Best practices for creating safe spaces and conducting ethical interviews',
    href: '/wiki/overview#interview-techniques',
    section: 'Methodology'
  },
  {
    title: 'Consent Templates',
    description: 'Ready-to-use consent forms for different story collection scenarios',
    href: '/wiki/overview#consent-templates',
    section: 'Resources'
  },
  {
    title: 'Technical Stack',
    description: 'Next.js, TypeScript, Tailwind CSS, Airtable, and other core technologies',
    href: '/wiki/overview#technical-stack',
    section: 'Technical'
  }
]

export default function WikiSearch() {
  const [isOpen, setIsOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isOpen])

  useEffect(() => {
    if (query.length > 1) {
      const filtered = searchData.filter(
        item =>
          item.title.toLowerCase().includes(query.toLowerCase()) ||
          item.description.toLowerCase().includes(query.toLowerCase()) ||
          item.section.toLowerCase().includes(query.toLowerCase())
      )
      setResults(filtered)
    } else {
      setResults([])
    }
  }, [query])

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setIsOpen(true)
      }
      if (e.key === 'Escape') {
        setIsOpen(false)
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [])

  return (
    <>
      {/* Search Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 px-4 py-2 text-sm text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
      >
        <Search className="w-4 h-4" />
        <span>Search documentation</span>
        <kbd className="hidden sm:inline-block px-2 py-1 text-xs bg-white rounded border border-gray-300">
          ⌘K
        </kbd>
      </button>

      {/* Search Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div
            className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
            onClick={() => setIsOpen(false)}
          />
          <div className="flex min-h-full items-start justify-center p-4 text-center sm:p-0">
            <div className="relative mt-20 w-full max-w-2xl transform overflow-hidden rounded-lg bg-white shadow-xl transition-all">
              {/* Search Input */}
              <div className="flex items-center border-b border-gray-200 px-4 py-3">
                <Search className="w-5 h-5 text-gray-400" />
                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search wiki..."
                  className="ml-3 flex-1 outline-none placeholder-gray-400"
                />
                <button
                  onClick={() => setIsOpen(false)}
                  className="ml-3 rounded-md p-1 hover:bg-gray-100"
                >
                  <X className="w-5 h-5 text-gray-400" />
                </button>
              </div>

              {/* Search Results */}
              {query.length > 1 && (
                <div className="max-h-96 overflow-y-auto p-2">
                  {results.length > 0 ? (
                    <ul className="space-y-1">
                      {results.map((result, index) => (
                        <li key={index}>
                          <Link
                            href={result.href}
                            onClick={() => {
                              setIsOpen(false)
                              setQuery('')
                            }}
                            className="block rounded-lg px-4 py-3 text-left hover:bg-gray-50 transition-colors"
                          >
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="font-medium text-gray-900">
                                  {result.title}
                                </p>
                                <p className="mt-1 text-sm text-gray-600">
                                  {result.description}
                                </p>
                              </div>
                              <span className="ml-3 text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                                {result.section}
                              </span>
                            </div>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div className="px-4 py-8 text-center text-gray-500">
                      No results found for "{query}"
                    </div>
                  )}
                </div>
              )}

              {/* Help Text */}
              {query.length === 0 && (
                <div className="px-4 py-8 text-center text-sm text-gray-500">
                  Start typing to search the wiki...
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}