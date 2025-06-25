import { WikiSection } from '@/data/wiki-content'

export const appScreensContent: WikiSection[] = [
  {
    id: 'mobile-app-guide',
    title: 'Mobile App Screens Guide',
    type: 'text',
    content: {
      paragraphs: [
        'The Empathy Ledger mobile app is designed to make story collection seamless and respectful. This guide walks through each screen and its purpose.',
        'All interactions are designed with consent and dignity at their core, ensuring storytellers always feel in control of their narrative.'
      ]
    }
  },
  {
    id: 'app-screens',
    title: 'Key App Screens',
    type: 'list',
    content: {
      ordered: true,
      items: [
        {
          title: 'Shift Marketplace',
          description: 'Browse and claim available photography shifts in your area'
        },
        {
          title: 'On-Shift Dashboard',
          description: 'Access all tools needed during an active shift'
        },
        {
          title: 'Consent Capture',
          description: 'Digital consent forms with clear visual guides'
        },
        {
          title: 'Media Upload',
          description: 'Secure upload of stories, photos, and media'
        }
      ]
    }
  }
]