import { WikiSection } from '@/data/wiki-content'

export const ethicalFrameworkContent: WikiSection[] = [
  {
    id: 'intro',
    type: 'text',
    content: {
      paragraphs: [
        'Our ethical framework is built on respect, consent, and dignity. Every interaction is guided by these principles to ensure we honor the stories shared with us.'
      ]
    }
  },
  {
    id: 'principles',
    title: 'Core Ethical Principles',
    type: 'grid',
    content: {
      columns: 2,
      items: [
        {
          icon: 'Shield',
          iconColor: 'blue',
          title: 'Informed Consent',
          description: 'Storytellers understand exactly how their stories will be used and have complete control over sharing permissions.'
        },
        {
          icon: 'Heart',
          iconColor: 'green',
          title: 'Ongoing Agency',
          description: 'Consent can be modified or withdrawn at any time, with immediate effect across all systems.'
        },
        {
          icon: 'Users',
          iconColor: 'purple',
          title: 'Transparency',
          description: 'Clear communication about data handling, storage, and usage at every step.'
        },
        {
          icon: 'Book',
          iconColor: 'orange',
          title: 'Benefit Sharing',
          description: 'Stories create value for the community, not just the organization collecting them.'
        }
      ]
    }
  }
]