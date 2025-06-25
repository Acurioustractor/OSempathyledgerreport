import Link from 'next/link'
import { ArrowLeft, ArrowRight } from 'lucide-react'

interface NavItem {
  title: string
  href: string
}

interface PageNavigationProps {
  previous?: NavItem
  next?: NavItem
}

export default function PageNavigation({ previous, next }: PageNavigationProps) {
  return (
    <nav className="flex items-center justify-between border-t border-gray-200 pt-8 mt-12">
      {previous ? (
        <Link
          href={previous.href}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <div>
            <p className="text-xs text-gray-500">Previous</p>
            <p className="font-medium">{previous.title}</p>
          </div>
        </Link>
      ) : (
        <div />
      )}
      
      {next ? (
        <Link
          href={next.href}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors text-right"
        >
          <div>
            <p className="text-xs text-gray-500">Next</p>
            <p className="font-medium">{next.title}</p>
          </div>
          <ArrowRight className="w-4 h-4" />
        </Link>
      ) : (
        <div />
      )}
    </nav>
  )
}