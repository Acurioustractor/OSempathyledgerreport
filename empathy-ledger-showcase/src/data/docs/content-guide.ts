import { WikiSection } from '@/data/wiki-content'

export const contentGuideContent: WikiSection[] = [
  {
    id: 'intro',
    type: 'callout',
    content: {
      variant: 'blue',
      title: '📝 Easy Content Management',
      description: 'This guide shows you how to add any type of content to your documentation. Simply copy the code examples below!'
    }
  },
  
  // Text Section
  {
    id: 'text-content',
    title: '1. Text Content',
    type: 'text',
    content: {
      paragraphs: [
        'The simplest content type. Just add paragraphs of text and they\'ll be automatically formatted.',
        'Here\'s how to add text content:'
      ]
    }
  },
  {
    id: 'text-code',
    type: 'codeblock',
    content: {
      code: `{
  id: 'my-text',
  title: 'Section Title',
  type: 'text',
  content: {
    paragraphs: [
      'First paragraph here.',
      'Second paragraph here.'
    ]
  }
}`
    }
  },

  // Video Section
  {
    id: 'video-content',
    title: '2. Video Content',
    type: 'text',
    content: {
      paragraphs: ['Embed videos from YouTube, Vimeo, or any platform. Videos are responsive and look great on all devices.']
    }
  },
  {
    id: 'video-example',
    type: 'video',
    content: {
      url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      title: 'Example Video',
      description: 'Replace the URL with your video\'s embed URL'
    }
  },
  {
    id: 'video-code',
    type: 'codeblock',
    content: {
      code: `{
  id: 'my-video',
  title: 'Video Title',
  type: 'video',
  content: {
    url: 'https://www.youtube.com/embed/YOUR_VIDEO_ID',
    title: 'Video Title',
    description: 'Optional description'
  }
}`
    }
  },

  // Callout Section
  {
    id: 'callout-content',
    title: '3. Callout Boxes',
    type: 'text',
    content: {
      paragraphs: ['Use callouts to highlight important information. Available in 4 colors:']
    }
  },
  {
    id: 'callout-orange',
    type: 'callout',
    content: {
      variant: 'orange',
      text: '🔥 Orange callout for warnings or important notes'
    }
  },
  {
    id: 'callout-blue',
    type: 'callout',
    content: {
      variant: 'blue',
      text: '💡 Blue callout for tips and information'
    }
  },
  {
    id: 'callout-green',
    type: 'callout',
    content: {
      variant: 'green',
      text: '✅ Green callout for success messages'
    }
  },
  {
    id: 'callout-purple',
    type: 'callout',
    content: {
      variant: 'purple',
      text: '🎯 Purple callout for special notes'
    }
  },
  {
    id: 'callout-code',
    type: 'codeblock',
    content: {
      code: `{
  id: 'my-callout',
  type: 'callout',
  content: {
    variant: 'blue', // orange, blue, green, purple
    title: 'Optional Title',
    text: 'Your message here'
  }
}`
    }
  },

  // List Section
  {
    id: 'list-content',
    title: '4. Lists',
    type: 'text',
    content: {
      paragraphs: ['Create ordered (numbered) or unordered (bullet) lists:']
    }
  },
  {
    id: 'ordered-list-example',
    title: 'Ordered List Example',
    type: 'list',
    content: {
      ordered: true,
      items: [
        {
          title: 'First Step',
          description: 'Description of the first step'
        },
        {
          title: 'Second Step',
          description: 'Description of the second step'
        },
        {
          title: 'Third Step',
          description: 'Description of the third step'
        }
      ]
    }
  },
  {
    id: 'list-code',
    type: 'codeblock',
    content: {
      code: `{
  id: 'my-list',
  title: 'My List Title',
  type: 'list',
  content: {
    ordered: true, // true for numbers, false for bullets
    items: [
      {
        title: 'Item Title',
        description: 'Item description'
      },
      // Or just strings for simple lists:
      'Simple item 1',
      'Simple item 2'
    ]
  }
}`
    }
  },

  // Grid Section
  {
    id: 'grid-content',
    title: '5. Grid Layouts',
    type: 'text',
    content: {
      paragraphs: ['Display features or concepts in a responsive grid:']
    }
  },
  {
    id: 'grid-example',
    type: 'grid',
    content: {
      columns: 2,
      items: [
        {
          icon: 'Book',
          iconColor: 'blue',
          title: 'Documentation',
          description: 'Comprehensive guides for every feature'
        },
        {
          icon: 'Heart',
          iconColor: 'green',
          title: 'Support',
          description: 'Get help when you need it'
        },
        {
          icon: 'Code',
          iconColor: 'purple',
          title: 'Examples',
          description: 'Copy and paste ready code'
        },
        {
          icon: 'Users',
          iconColor: 'orange',
          title: 'Community',
          description: 'Learn from others'
        }
      ]
    }
  },
  {
    id: 'grid-code',
    type: 'codeblock',
    content: {
      code: `{
  id: 'my-grid',
  title: 'Features',
  type: 'grid',
  content: {
    columns: 2, // 2, 3, or 4
    items: [
      {
        icon: 'Book', // Any Lucide icon name
        iconColor: 'blue', // blue, green, purple, orange
        title: 'Feature Title',
        description: 'Feature description'
      }
    ]
  }
}`
    }
  },

  // Table Section
  {
    id: 'table-content',
    title: '6. Tables',
    type: 'text',
    content: {
      paragraphs: ['Display data in clean, responsive tables:']
    }
  },
  {
    id: 'table-example',
    type: 'table',
    content: {
      headers: ['Content Type', 'Best For', 'Example Use'],
      rows: [
        ['Text', 'Documentation', 'Explanations, guides'],
        ['Video', 'Tutorials', 'How-to demonstrations'],
        ['Callout', 'Important notes', 'Warnings, tips'],
        ['List', 'Steps or features', 'Instructions, benefits'],
        ['Grid', 'Feature showcase', 'Services, concepts'],
        ['Table', 'Data comparison', 'Pricing, specifications']
      ]
    }
  },
  {
    id: 'table-code',
    type: 'codeblock',
    content: {
      code: `{
  id: 'my-table',
  title: 'Comparison Table',
  type: 'table',
  content: {
    headers: ['Column 1', 'Column 2', 'Column 3'],
    rows: [
      ['Row 1 Cell 1', 'Row 1 Cell 2', 'Row 1 Cell 3'],
      ['Row 2 Cell 1', 'Row 2 Cell 2', 'Row 2 Cell 3']
    ]
  }
}`
    }
  },

  // Quick Start
  {
    id: 'quick-start',
    title: '🚀 Quick Start',
    type: 'callout',
    content: {
      variant: 'green',
      title: 'Adding Content in 3 Steps',
      text: '1. Create a content file in src/data/docs/\n2. Add your content array using the examples above\n3. Import it in src/app/docs/[slug]/page.tsx'
    }
  },

  // File Structure
  {
    id: 'file-structure',
    title: 'File Structure',
    type: 'codeblock',
    content: {
      code: `src/
├── data/
│   └── docs/
│       ├── introduction.ts
│       ├── quick-start.ts
│       └── your-new-page.ts  // Add your content here!
└── app/
    └── docs/
        └── [slug]/
            └── page.tsx      // Import your content here`
    }
  },

  // Tips
  {
    id: 'tips',
    title: 'Pro Tips',
    type: 'list',
    content: {
      ordered: false,
      items: [
        'Each section needs a unique ID',
        'Use meaningful IDs for better navigation',
        'Videos work with any embed URL (YouTube, Vimeo, etc.)',
        'Icons come from Lucide (see lucide.dev for options)',
        'Grids are automatically responsive',
        'Tables scroll horizontally on mobile',
        'Mix and match content types for engaging docs!'
      ]
    }
  }
]