import Link from 'next/link'
import { ArrowRight, Book, FileText, Users } from 'lucide-react'

export default function WikiLandingPage() {
  const wikiPages = [
    {
      title: 'Empathy Ledger Overview',
      description: 'Complete guide to the Empathy Ledger platform, including core principles, technical implementation, and ethical frameworks.',
      href: '/wiki/overview',
      icon: Book,
      color: 'orange'
    },
    {
      title: 'Content Guide',
      description: 'Best practices for creating, editing, and managing storyteller content with respect and dignity.',
      href: '/wiki/content-guide',
      icon: FileText,
      color: 'blue'
    },
    {
      title: 'Documentation',
      description: 'Detailed technical documentation, setup guides, and system architecture information.',
      href: '/docs/introduction',
      icon: Users,
      color: 'green'
    }
  ]

  return (
    <div className="wiki-container">
      {/* Header */}
      <section className="wiki-header">
        <div className="wiki-header-content">
          <h1 className="wiki-title">
            Empathy Ledger Wiki
          </h1>
          <p className="wiki-subtitle">
            Comprehensive documentation and guides for the Empathy Ledger platform
          </p>
        </div>
      </section>

      {/* Wiki Pages Grid */}
      <section className="wiki-content">
        <div className="wiki-content-wrapper max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {wikiPages.map((page) => {
              const IconComponent = page.icon
              return (
                <Link
                  key={page.href}
                  href={page.href}
                  className={`wiki-card wiki-card-${page.color} group`}
                >
                  <div className="flex items-start space-x-4">
                    <div className={`wiki-icon-wrapper wiki-icon-${page.color}`}>
                      <IconComponent className="w-6 h-6" />
                    </div>
                    <div className="flex-1">
                      <h3 className="wiki-card-title group-hover:text-orange-sky transition-colors">
                        {page.title}
                      </h3>
                      <p className="wiki-card-description">
                        {page.description}
                      </p>
                    </div>
                  </div>
                  <div className="mt-4 flex items-center text-orange-sky opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="text-sm font-medium">View guide</span>
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </div>
                </Link>
              )
            })}
          </div>
        </div>
      </section>
    </div>
  )
}