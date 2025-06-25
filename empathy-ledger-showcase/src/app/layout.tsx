import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import '@/styles/wiki.css'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://empathy-ledger-showcase.vercel.app'),
  title: 'Empathy Ledger Showcase | 102 Stories of Connection',
  description: 'Discover the power of ethical storytelling through 102 stories collected across 8 cities. A showcase of human connection, community, and the Orange Sky mission.',
  keywords: ['empathy', 'storytelling', 'community', 'orange sky', 'social impact', 'human connection'],
  authors: [{ name: 'Orange Sky' }],
  openGraph: {
    title: 'Empathy Ledger Showcase | 102 Stories of Connection',
    description: 'Discover the power of ethical storytelling through 102 stories collected across 8 cities.',
    type: 'website',
    locale: 'en_AU',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Empathy Ledger Showcase | 102 Stories of Connection',
    description: 'Discover the power of ethical storytelling through 102 stories collected across 8 cities.',
  },
  robots: {
    index: true,
    follow: true,
  },
  viewport: {
    width: 'device-width',
    initialScale: 1,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${inter.className} antialiased`}>
        {/* Skip to main content link for keyboard navigation */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 bg-orange-sky text-white px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-sky transition-all"
        >
          Skip to main content
        </a>
        
        <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 to-gray-100">
          <Header />
          <main id="main-content" className="flex-grow" tabIndex={-1} role="main">
            {children}
          </main>
          <Footer />
        </div>
      </body>
    </html>
  )
}