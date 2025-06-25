import { WikiSection } from '@/data/wiki-content'

export const introductionContent: WikiSection[] = [
  {
    id: 'hero',
    type: 'callout',
    content: {
      variant: 'blue',
      title: '🌟 Welcome to the Empathy Ledger',
      text: 'A revolutionary platform that transforms personal stories into powerful catalysts for social change, built on dignity, consent, and authentic human connection.'
    }
  },
  {
    id: 'what-is',
    title: 'What is the Empathy Ledger?',
    type: 'text',
    content: {
      paragraphs: [
        'The Empathy Ledger is an innovative storytelling platform that ethically collects, manages, and shares the lived experiences of people experiencing homelessness and hardship. By treating stories as valuable assets that belong to their tellers, we create a new paradigm for organizational empathy and social impact.',
        'Built in partnership with Orange Sky, who provide free laundry and shower services across Australia, the Empathy Ledger ensures that every story is shared with explicit consent, proper attribution, and genuine respect for the storyteller\'s agency.'
      ]
    }
  },
  {
    id: 'key-features',
    title: 'Key Features',
    type: 'grid',
    content: {
      columns: 3,
      items: [
        {
          icon: 'Shield',
          iconColor: 'blue',
          title: 'Three-Tier Consent',
          description: 'Storytellers choose exactly how their stories are shared - from internal use only to full public attribution.'
        },
        {
          icon: 'Database',
          iconColor: 'green',
          title: 'Story Management',
          description: 'Comprehensive system for collecting, organizing, and analyzing stories using Airtable and AI.'
        },
        {
          icon: 'Camera',
          iconColor: 'purple',
          title: 'Multi-Format Capture',
          description: 'Support for text, audio, video, and photo stories through mobile-friendly interfaces.'
        },
        {
          icon: 'BarChart',
          iconColor: 'orange',
          title: 'Impact Analytics',
          description: 'Track themes, measure impact, and understand patterns across all collected stories.'
        },
        {
          icon: 'Users',
          iconColor: 'blue',
          title: 'Community Driven',
          description: 'Built with and for the community, ensuring stories benefit those who share them.'
        },
        {
          icon: 'Globe',
          iconColor: 'green',
          title: 'Publishing Platform',
          description: 'Beautiful story galleries and social media integration to amplify voices that matter.'
        }
      ]
    }
  },
  {
    id: 'orange-sky',
    title: 'Orange Sky Partnership',
    type: 'text',
    content: {
      paragraphs: [
        'Orange Sky is a world-first free mobile laundry service for people experiencing homelessness. Since 2014, they have been creating a safe, positive, and supportive environment for people who are too often ignored or feel disconnected from the wider community.',
        'The Empathy Ledger was developed to capture and honor the incredible stories shared during Orange Sky shifts - the conversations that happen while the washing is on. These stories of resilience, hope, and humanity deserve to be preserved and shared in a way that respects and empowers the storytellers.'
      ]
    }
  },
  {
    id: 'impact-stats',
    type: 'callout',
    content: {
      variant: 'green',
      title: '📊 Current Impact',
      text: '102 stories collected across multiple locations • 30+ volunteer photographers trained • 15+ themes identified • Countless lives touched'
    }
  },
  {
    id: 'vision',
    title: 'Impact & Vision',
    type: 'text',
    content: {
      paragraphs: [
        'Our vision is to create a world where every person\'s story is valued, where lived experience drives policy and practice, and where organizations build genuine empathy through authentic human connection.',
        'By treating stories as assets that belong to their tellers, we\'re creating a new model for ethical storytelling that can be adopted by organizations worldwide. The Empathy Ledger isn\'t just a platform - it\'s a movement toward more dignified, consent-based, and impactful storytelling.'
      ]
    }
  },
  {
    id: 'choose-path',
    title: 'Choose Your Path',
    type: 'grid',
    content: {
      columns: 2,
      items: [
        {
          icon: 'Heart',
          iconColor: 'purple',
          title: 'I\'m a Storyteller',
          description: 'Learn how to share your story safely and see the impact it creates.'
        },
        {
          icon: 'Camera',
          iconColor: 'blue',
          title: 'I\'m a Photographer',
          description: 'Discover how to capture stories ethically during Orange Sky shifts.'
        },
        {
          icon: 'Settings',
          iconColor: 'orange',
          title: 'I\'m an Administrator',
          description: 'Set up and manage the Empathy Ledger platform for your organization.'
        },
        {
          icon: 'Code',
          iconColor: 'green',
          title: 'I\'m a Developer',
          description: 'Technical documentation for implementing and extending the platform.'
        }
      ]
    }
  },
  {
    id: 'next-steps',
    type: 'callout',
    content: {
      variant: 'blue',
      title: '🚀 Ready to Get Started?',
      text: 'Head to our Quick Start Guide to begin your journey with the Empathy Ledger.'
    }
  }
]