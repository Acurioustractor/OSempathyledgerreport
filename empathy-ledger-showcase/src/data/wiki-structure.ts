export interface WikiPage {
  title: string
  slug: string
  description?: string
}

export interface WikiSection {
  title: string
  icon?: string
  pages: WikiPage[]
}

export const wikiStructure: WikiSection[] = [
  {
    title: 'Getting Started',
    icon: 'Book',
    pages: [
      {
        title: 'Wiki Home',
        slug: '',
        description: 'Welcome to the Empathy Ledger Wiki'
      },
      {
        title: 'What is the Empathy Ledger?',
        slug: 'overview',
        description: 'Complete guide to the platform'
      }
    ]
  },
  {
    title: 'Platform Guide',
    icon: 'Heart',
    pages: [
      {
        title: 'Core Principles',
        slug: 'overview#core-principles',
        description: 'Ethical storytelling principles'
      },
      {
        title: 'Privacy & Consent',
        slug: 'overview#privacy-consent',
        description: 'Privacy-first framework'
      },
      {
        title: 'Platform Features',
        slug: 'overview#platform-features',
        description: 'Key features and capabilities'
      }
    ]
  },
  {
    title: 'Implementation',
    icon: 'Code',
    pages: [
      {
        title: 'Airtable Setup',
        slug: 'overview#airtable-setup',
        description: 'Database configuration guide'
      },
      {
        title: 'Interview Process',
        slug: 'overview#interview-process',
        description: 'Conducting ethical interviews'
      },
      {
        title: 'Technical Stack',
        slug: 'overview#technical-stack',
        description: 'Technology and architecture'
      }
    ]
  },
  {
    title: 'Content Management',
    icon: 'FileText',
    pages: [
      {
        title: 'Content Guide',
        slug: 'content-guide',
        description: 'Best practices for content creation'
      },
      {
        title: 'Story Management',
        slug: 'content-guide#story-management',
        description: 'Managing storyteller content'
      },
      {
        title: 'Media Guidelines',
        slug: 'content-guide#media-guidelines',
        description: 'Photo and video standards'
      }
    ]
  },
  {
    title: 'Resources',
    icon: 'Users',
    pages: [
      {
        title: 'Technical Documentation',
        slug: '/docs/introduction',
        description: 'Detailed technical docs'
      },
      {
        title: 'Future Vision',
        slug: 'overview#future-vision',
        description: 'Roadmap and possibilities'
      }
    ]
  }
]

export function getWikiPageBySlug(slug: string): WikiPage | null {
  for (const section of wikiStructure) {
    const page = section.pages.find(p => p.slug === slug)
    if (page) return page
  }
  return null
}

export function getAdjacentWikiPages(currentSlug: string) {
  const allPages = wikiStructure.flatMap(section => section.pages)
  const currentIndex = allPages.findIndex(page => page.slug === currentSlug)
  
  return {
    previous: currentIndex > 0 ? allPages[currentIndex - 1] : null,
    next: currentIndex < allPages.length - 1 ? allPages[currentIndex + 1] : null
  }
}