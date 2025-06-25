import { WikiSection } from '@/data/wiki-content'

export const inhouseStoriesContent: WikiSection[] = [
  {
    id: 'inhouse-overview',
    title: 'Creating In-House Stories',
    type: 'text',
    content: {
      paragraphs: [
        'In-house stories from staff and volunteers provide important context and perspective to complement guest stories.',
        'These stories help show the full picture of Orange Sky\'s impact and the dedicated people who make the service possible.'
      ]
    }
  },
  {
    id: 'process',
    title: 'Creation Process',
    type: 'list',
    content: {
      ordered: true,
      items: [
        {
          title: 'Guidelines Review',
          description: 'Understand the ethical framework and consent requirements'
        },
        {
          title: 'Story Collection',
          description: 'Interview staff/volunteers using approved techniques'
        },
        {
          title: 'Review & Approval',
          description: 'Internal review process for accuracy and appropriateness'
        },
        {
          title: 'Publishing',
          description: 'Add to the Empathy Ledger platform with proper attribution'
        }
      ]
    }
  }
]