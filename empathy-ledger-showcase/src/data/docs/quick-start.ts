import { WikiSection } from '@/data/wiki-content'

export const quickStartContent: WikiSection[] = [
  {
    id: 'intro',
    type: 'callout',
    content: {
      variant: 'blue',
      title: '🚀 Get Started in 5 Minutes',
      description: 'This guide will help you set up the Empathy Ledger platform quickly.'
    }
  },
  {
    id: 'prerequisites',
    title: 'Prerequisites',
    type: 'list',
    content: {
      ordered: false,
      items: [
        'Node.js 18+ installed',
        'Airtable account with API key',
        'Basic understanding of web development',
        'Git for version control'
      ]
    }
  },
  {
    id: 'installation',
    title: 'Installation',
    type: 'list',
    content: {
      ordered: true,
      items: [
        {
          title: 'Clone the repository',
          description: 'git clone https://github.com/orange-sky/empathy-ledger.git'
        },
        {
          title: 'Install dependencies',
          description: 'cd empathy-ledger && npm install'
        },
        {
          title: 'Set up environment variables',
          description: 'Copy .env.example to .env and add your API keys'
        },
        {
          title: 'Run the development server',
          description: 'npm run dev'
        }
      ]
    }
  }
]