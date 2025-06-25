import { WikiSection } from '@/data/wiki-content'

export const storytellingPracticesContent: WikiSection[] = [
  {
    id: 'ethical-storytelling',
    title: 'Ethical Storytelling Best Practices',
    type: 'text',
    content: {
      paragraphs: [
        'Ethical storytelling puts the storyteller first. Every interaction should be built on respect, consent, and genuine human connection.',
        'These practices ensure that stories are collected and shared in ways that empower rather than exploit, that build dignity rather than diminish it.'
      ]
    }
  },
  {
    id: 'core-principles',
    title: 'Core Principles',
    type: 'list',
    content: {
      ordered: false,
      items: [
        {
          title: 'Consent First',
          description: 'Always ensure clear, informed consent before any story collection'
        },
        {
          title: 'Trauma-Informed',
          description: 'Recognize that everyone has a story and some stories carry trauma'
        },
        {
          title: 'Dignity Centered',
          description: 'Every person deserves to be treated with respect and dignity'
        },
        {
          title: 'Community Benefit',
          description: 'Stories should benefit the storyteller and their community'
        }
      ]
    }
  }
]