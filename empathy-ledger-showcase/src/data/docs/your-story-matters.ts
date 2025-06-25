import { WikiSection } from '@/data/wiki-content'

export const yourStoryMattersContent: WikiSection[] = [
  {
    id: 'power-of-stories',
    title: 'The Power of Your Story',
    type: 'text',
    content: {
      paragraphs: [
        'Every story has power. Your experiences, challenges, and moments of connection create ripples of understanding that extend far beyond their immediate telling.',
        'When you share your story through the Empathy Ledger, you\'re not just sharing words - you\'re creating bridges of understanding, challenging assumptions, and helping others feel less alone.'
      ]
    }
  },
  {
    id: 'your-rights',
    title: 'Your Rights as a Storyteller',
    type: 'grid',
    content: {
      columns: 2,
      items: [
        {
          icon: 'Shield',
          iconColor: 'blue',
          title: 'Consent Control',
          description: 'You choose exactly how your story is shared - from private to public.'
        },
        {
          icon: 'Users',
          iconColor: 'green',
          title: 'Attribution Rights',
          description: 'Your story belongs to you. You decide how you\'re credited.'
        },
        {
          icon: 'Settings',
          iconColor: 'purple',
          title: 'Change Your Mind',
          description: 'You can update your consent preferences at any time.'
        },
        {
          icon: 'Heart',
          iconColor: 'orange',
          title: 'Respect & Dignity',
          description: 'Your story will always be shared with respect and care.'
        }
      ]
    }
  }
]