// Wiki Content Structure
// This file makes it easy to add and manage wiki content

export interface WikiSection {
  id: string
  title?: string // Made optional since callouts and some other types don't need titles
  type: 'text' | 'video' | 'callout' | 'list' | 'table' | 'codeblock' | 'image' | 'grid'
  content?: any
}

export interface WikiPage {
  id: string
  title: string
  description: string
  sections: WikiSection[]
}

// Example content structure for the overview page
export const wikiOverviewContent: WikiSection[] = [
  {
    id: 'intro',
    type: 'callout',
    content: {
      variant: 'orange', // orange, blue, green, purple
      title: 'The Empathy Ledger is a privacy-first storytelling platform that enables organizations to collect, analyze, and share human stories with dignity and respect.',
      description: 'Born from Orange Sky\'s commitment to positive conversations, it demonstrates how technology can amplify human connection while protecting individual privacy.'
    }
  },
  {
    id: 'core-principles',
    title: 'Core Principles',
    type: 'grid',
    content: {
      columns: 2,
      items: [
        {
          icon: 'Shield',
          iconColor: 'blue',
          title: 'Privacy First',
          description: 'Every story is collected with explicit consent, stored securely, and shared only according to the storyteller\'s wishes.'
        },
        {
          icon: 'Heart',
          iconColor: 'green',
          title: 'Dignity & Respect',
          description: 'Stories are treated as precious gifts, with storytellers maintaining control over how their experiences are shared.'
        },
        {
          icon: 'Users',
          iconColor: 'purple',
          title: 'Community Driven',
          description: 'Built by and for communities, ensuring the platform serves the needs of both storytellers and organizations.'
        },
        {
          icon: 'Book',
          iconColor: 'orange',
          title: 'Open & Replicable',
          description: 'All code, methodologies, and learnings are shared openly to enable ethical storytelling everywhere.'
        }
      ]
    }
  },
  {
    id: 'how-it-works',
    title: 'How It Works',
    type: 'list',
    content: {
      ordered: true,
      items: [
        {
          title: 'Story Collection',
          description: 'Trained volunteers or staff members collect stories using ethical interview techniques, always with explicit consent.'
        },
        {
          title: 'Privacy Processing',
          description: 'Stories are processed according to the consent level provided, with options for full, partial, or anonymous sharing.'
        },
        {
          title: 'Insight Generation',
          description: 'Anonymous, aggregated data reveals patterns and insights while individual stories maintain their human context.'
        },
        {
          title: 'Dignified Sharing',
          description: 'Stories are shared in ways that honor the storyteller, build empathy, and drive positive change in communities.'
        }
      ]
    }
  },
  {
    id: 'why-it-matters',
    title: 'Why It Matters',
    type: 'text',
    content: {
      paragraphs: [
        'In a world where data is often extracted without consent and stories are commodified, the Empathy Ledger offers a different path. It proves that we can leverage technology to understand and serve our communities better while treating every person with the dignity they deserve.',
        'By making these tools and methodologies freely available, we hope to inspire a new standard for how organizations collect and share human stories—one that puts people first, always.'
      ]
    }
  },
  {
    id: 'video-tutorial',
    title: 'Introduction Video',
    type: 'video',
    content: {
      url: 'https://www.youtube.com/embed/dQw4w9WgXcQ', // Replace with actual video URL
      title: 'Getting Started with the Empathy Ledger',
      description: 'Watch this 5-minute introduction to understand the core concepts.'
    }
  }
]

// Easy way to add new sections
export const createTextSection = (id: string, title: string, paragraphs: string[]): WikiSection => ({
  id,
  title,
  type: 'text',
  content: { paragraphs }
})

export const createVideoSection = (id: string, title: string, videoUrl: string, description?: string): WikiSection => ({
  id,
  title,
  type: 'video',
  content: { url: videoUrl, title, description }
})

export const createCalloutSection = (id: string, text: string, variant: 'orange' | 'blue' | 'green' | 'purple' = 'orange'): WikiSection => ({
  id,
  type: 'callout',
  content: { text, variant }
})

export const createListSection = (id: string, title: string, items: any[], ordered = false): WikiSection => ({
  id,
  title,
  type: 'list',
  content: { items, ordered }
})