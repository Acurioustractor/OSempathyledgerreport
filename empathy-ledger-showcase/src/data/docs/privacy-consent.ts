import { WikiSection } from '@/data/wiki-content'

export const privacyConsentContent: WikiSection[] = [
  {
    id: 'intro',
    type: 'text',
    content: {
      paragraphs: [
        'Our three-tier consent model ensures storytellers have complete control over how their stories are shared.'
      ]
    }
  },
  {
    id: 'consent-levels',
    title: 'Three-Tier Consent Model',
    type: 'list',
    content: {
      ordered: false,
      items: [
        {
          title: 'Level 1: Internal Use Only',
          description: 'Stories used for internal reflection, training, and service improvement. No external sharing.'
        },
        {
          title: 'Level 2: Anonymous Sharing',
          description: 'Stories can be shared externally with all identifying information removed. Focus on themes and insights.'
        },
        {
          title: 'Level 3: Full Attribution',
          description: 'Stories shared with full attribution as chosen by the storyteller. Celebrates individual experiences.'
        }
      ]
    }
  }
]