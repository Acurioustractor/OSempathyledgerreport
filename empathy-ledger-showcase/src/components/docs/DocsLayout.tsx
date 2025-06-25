'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { documentationStructure, getAdjacentPages } from '@/data/documentation-structure'
import { Book, Heart, Code, Users, FileText, Lightbulb, ChevronRight, ChevronLeft, Menu, X } from 'lucide-react'
import { useState } from 'react'

const iconMap: Record<string, any> = {
  Book,
  Heart,
  Code,
  Users,
  FileText,
  Lightbulb
}

interface DocsLayoutProps {
  children: React.ReactNode
  currentSlug: string
  pageTitle: string
}

export default function DocsLayout({ children, currentSlug, pageTitle }: DocsLayoutProps) {
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { previous, next } = getAdjacentPages(currentSlug)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Fixed header with menu toggle */}
      <header className="fixed top-0 left-0 right-0 h-16 bg-white border-b border-gray-200 z-50">
        <div className="flex items-center justify-between h-full px-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 hover:bg-gray-100 rounded-lg"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
            <Link href="/wiki" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-orange-sky rounded-lg flex items-center justify-center">
                <Book className="w-5 h-5 text-white" />
              </div>
              <span className="font-semibold text-gray-900">Documentation</span>
            </Link>
          </div>
          <Link
            href="/"
            className="text-sm text-gray-600 hover:text-orange-sky"
          >
            Back to Site →
          </Link>
        </div>
      </header>

      <div className="flex pt-16">
        {/* Fixed Sidebar - Desktop */}
        <aside className="hidden lg:block fixed left-0 top-16 bottom-0 w-80 bg-white border-r border-gray-200 overflow-y-auto">
          <nav className="p-6">
            {documentationStructure.map((section, sectionIndex) => {
              const Icon = section.icon ? iconMap[section.icon] : null
              return (
                <div key={sectionIndex} className="mb-8">
                  <div className="flex items-center gap-2 mb-3">
                    {Icon && <Icon className="w-4 h-4 text-gray-500" />}
                    <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">
                      {section.title}
                    </h3>
                  </div>
                  <ul className="space-y-1">
                    {section.pages.map((page, pageIndex) => {
                      const isActive = pathname?.includes(page.slug) || currentSlug === page.slug
                      return (
                        <li key={pageIndex}>
                          <Link
                            href={`/docs/${page.slug}`}
                            className={`block px-3 py-2 text-sm rounded-lg transition-colors ${
                              isActive
                                ? 'bg-orange-50 text-orange-sky font-medium'
                                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                            }`}
                          >
                            {page.title}
                          </Link>
                        </li>
                      )
                    })}
                  </ul>
                </div>
              )
            })}
          </nav>
        </aside>

        {/* Mobile Sidebar */}
        {mobileMenuOpen && (
          <div className="lg:hidden fixed inset-0 z-40 flex">
            <div className="fixed inset-0 bg-black bg-opacity-50" onClick={() => setMobileMenuOpen(false)} />
            <aside className="relative flex-1 flex flex-col max-w-xs w-full bg-white">
              <nav className="flex-1 p-6 overflow-y-auto">
                {documentationStructure.map((section, sectionIndex) => {
                  const Icon = section.icon ? iconMap[section.icon] : null
                  return (
                    <div key={sectionIndex} className="mb-8">
                      <div className="flex items-center gap-2 mb-3">
                        {Icon && <Icon className="w-4 h-4 text-gray-500" />}
                        <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">
                          {section.title}
                        </h3>
                      </div>
                      <ul className="space-y-1">
                        {section.pages.map((page, pageIndex) => {
                          const isActive = pathname?.includes(page.slug) || currentSlug === page.slug
                          return (
                            <li key={pageIndex}>
                              <Link
                                href={`/docs/${page.slug}`}
                                onClick={() => setMobileMenuOpen(false)}
                                className={`block px-3 py-2 text-sm rounded-lg transition-colors ${
                                  isActive
                                    ? 'bg-orange-50 text-orange-sky font-medium'
                                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                                }`}
                              >
                                {page.title}
                              </Link>
                            </li>
                          )
                        })}
                      </ul>
                    </div>
                  )
                })}
              </nav>
            </aside>
          </div>
        )}

        {/* Main Content */}
        <main className="flex-1 lg:ml-80">
          <div className="max-w-4xl mx-auto px-6 py-12">
            {/* Page Title */}
            <h1 className="text-4xl font-bold text-gray-900 mb-8">{pageTitle}</h1>
            
            {/* Content */}
            <div className="prose prose-lg max-w-none">
              {children}
            </div>

            {/* Next/Previous Navigation */}
            <nav className="flex items-center justify-between mt-16 pt-8 border-t border-gray-200">
              {previous ? (
                <Link
                  href={`/docs/${previous.slug}`}
                  className="flex items-center gap-2 text-gray-600 hover:text-orange-sky transition-colors"
                >
                  <ChevronLeft className="w-5 h-5" />
                  <div>
                    <div className="text-sm text-gray-500">Previous</div>
                    <div className="font-medium">{previous.title}</div>
                  </div>
                </Link>
              ) : (
                <div />
              )}
              
              {next && (
                <Link
                  href={`/docs/${next.slug}`}
                  className="flex items-center gap-2 text-gray-600 hover:text-orange-sky transition-colors text-right"
                >
                  <div>
                    <div className="text-sm text-gray-500">Next</div>
                    <div className="font-medium">{next.title}</div>
                  </div>
                  <ChevronRight className="w-5 h-5" />
                </Link>
              )}
            </nav>
          </div>
        </main>
      </div>
    </div>
  )
}