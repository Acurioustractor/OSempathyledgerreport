import { WikiSection } from '@/data/wiki-content'

export const sharingStoryContent: WikiSection[] = [
  {
    id: 'ways-to-share',
    title: 'Different Ways to Share Your Story',
    type: 'grid',
    content: {
      columns: 2,
      items: [
        {
          icon: 'Users',
          iconColor: 'blue',
          title: 'During a Shift',
          description: 'Share naturally while the washing is on with trained photographers'
        },
        {
          icon: 'Camera',
          iconColor: 'green',
          title: 'Through the App',
          description: 'Use our mobile app to record your story privately'
        },
        {
          icon: 'Mic',
          iconColor: 'purple',
          title: 'Audio & Video',
          description: 'Tell your story in your own voice, your own way'
        },
        {
          icon: 'PenTool',
          iconColor: 'orange',
          title: 'Written Stories',
          description: 'Write your story in your own words and time'
        }
      ]
    }
  }
]