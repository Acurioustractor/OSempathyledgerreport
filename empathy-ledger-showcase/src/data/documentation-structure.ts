// Complete documentation structure for GitBook-style navigation
export interface DocSection {
  title: string
  icon?: string
  pages: DocPage[]
}

export interface DocPage {
  title: string
  slug: string
  description?: string
  sections?: string[] // For table of contents
}

export const documentationStructure: DocSection[] = [
  {
    title: 'Getting Started',
    icon: 'Rocket',
    pages: [
      {
        title: 'Welcome',
        slug: 'introduction',
        description: 'Understanding the Empathy Ledger',
        sections: ['What is the Empathy Ledger?', 'Orange Sky Partnership', 'Impact & Vision', 'Choose Your Path']
      },
      {
        title: 'Quick Start Guide',
        slug: 'quick-start',
        description: 'Get started based on your role',
        sections: ['For Storytellers', 'For Photographers', 'For Administrators', 'For Developers']
      },
      {
        title: 'Project Overview',
        slug: 'project-overview',
        description: 'Key components and systems',
        sections: ['Story Gallery', 'Technical Stack', 'Project Phases', 'Success Metrics']
      }
    ]
  },
  {
    title: 'For Storytellers',
    icon: 'Heart',
    pages: [
      {
        title: 'Your Story Matters',
        slug: 'your-story-matters',
        description: 'Why sharing creates change',
        sections: ['Power of Stories', 'Your Rights', 'Privacy Protection', 'Making an Impact']
      },
      {
        title: 'Consent Process',
        slug: 'consent-process',
        description: 'Understanding your choices',
        sections: ['Three Consent Levels', 'Visual Consent Guide', 'Changing Your Mind', 'Privacy First']
      },
      {
        title: 'Sharing Your Story',
        slug: 'sharing-story',
        description: 'Different ways to share',
        sections: ['During a Shift', 'Through the App', 'Audio & Video', 'Written Stories']
      }
    ]
  },
  {
    title: 'For Photographers',
    icon: 'Camera',
    pages: [
      {
        title: 'Photographer Workflow',
        slug: 'photographer-workflow',
        description: 'Complete shift process',
        sections: ['Claiming Shifts', 'Pre-Shift Prep', 'During the Shift', 'Post-Shift Tasks']
      },
      {
        title: 'App Screens Guide',
        slug: 'app-screens',
        description: 'Using the mobile app',
        sections: ['Shift Marketplace', 'On-Shift Dashboard', 'Consent Capture', 'Media Upload']
      },
      {
        title: 'Storytelling Best Practices',
        slug: 'storytelling-practices',
        description: 'Ethical content creation',
        sections: ['Building Trust', 'Interview Techniques', 'Trauma-Informed Approach', 'Quality Standards']
      },
      {
        title: 'Creating In-House Stories',
        slug: 'inhouse-stories',
        description: 'Staff and volunteer stories',
        sections: ['Guidelines', 'Process', 'Review & Approval', 'Publishing']
      }
    ]
  },
  {
    title: 'Platform & Tools',
    icon: 'Settings',
    pages: [
      {
        title: 'Airtable System',
        slug: 'airtable-system',
        description: 'Database management',
        sections: ['Base Structure', 'Story Tables', 'Automation', 'Scripting']
      },
      {
        title: 'Descript Workflow',
        slug: 'descript-workflow',
        description: 'Video & audio processing',
        sections: ['Project Setup', 'Transcription', 'Editing', 'Export & Share']
      },
      {
        title: 'AI Integration',
        slug: 'ai-integration',
        description: 'Using AI for analysis',
        sections: ['Theme Analysis', 'Sentiment Detection', 'Pattern Recognition', 'API Setup']
      },
      {
        title: 'Make Automation',
        slug: 'make-automation',
        description: 'Workflow automation',
        sections: ['Scenarios', 'Triggers', 'Data Processing', 'Integration']
      }
    ]
  },
  {
    title: 'Content & Publishing',
    icon: 'Globe',
    pages: [
      {
        title: 'Story Website',
        slug: 'story-website',
        description: 'Public-facing content',
        sections: ['Website Structure', 'Content Management', 'Story Display', 'Updates']
      },
      {
        title: 'Social Media Integration',
        slug: 'social-media',
        description: 'Sharing stories online',
        sections: ['Platform Strategy', 'Content Adaptation', 'Scheduling', 'Analytics']
      },
      {
        title: 'Content Moderation',
        slug: 'content-moderation',
        description: 'Review and approval',
        sections: ['Review Process', 'Privacy Checks', 'Quality Control', 'Publishing']
      }
    ]
  },
  {
    title: 'Resources',
    icon: 'Download',
    pages: [
      {
        title: 'Consent Forms',
        slug: 'consent-forms',
        description: 'Downloadable forms',
        sections: ['Standard Consent', 'Visual Consent', 'Digital Options', 'Special Cases']
      },
      {
        title: 'Templates & Guides',
        slug: 'templates',
        description: 'Ready-to-use resources',
        sections: ['Interview Guides', 'Checklists', 'Reports', 'Training Materials']
      },
      {
        title: 'Content Guide',
        slug: 'content-guide',
        description: 'How to add documentation',
        sections: ['Text', 'Videos', 'Images', 'Code', 'Tables']
      }
    ]
  },
  {
    title: 'Analytics & Impact',
    icon: 'BarChart',
    pages: [
      {
        title: 'Story Analytics',
        slug: 'story-analytics',
        description: 'Understanding your data',
        sections: ['Theme Analysis', 'Geographic Insights', 'Temporal Patterns', 'Demographics']
      },
      {
        title: 'Impact Measurement',
        slug: 'impact-measurement',
        description: 'Measuring success',
        sections: ['Key Metrics', 'Outcomes', 'ROI', 'Reports']
      },
      {
        title: 'Project Tracking',
        slug: 'project-tracking',
        description: 'Progress monitoring',
        sections: ['Milestones', 'Deliverables', 'Timeline', 'Updates']
      }
    ]
  }
]

// Helper to get all pages flat
export const getAllPages = () => {
  return documentationStructure.flatMap(section => 
    section.pages.map(page => ({
      ...page,
      sectionTitle: section.title
    }))
  )
}

// Helper to find a page by slug
export const getPageBySlug = (slug: string) => {
  return getAllPages().find(page => page.slug === slug)
}

// Helper to get next/previous pages
export const getAdjacentPages = (currentSlug: string) => {
  const allPages = getAllPages()
  const currentIndex = allPages.findIndex(page => page.slug === currentSlug)
  
  return {
    previous: currentIndex > 0 ? allPages[currentIndex - 1] : null,
    next: currentIndex < allPages.length - 1 ? allPages[currentIndex + 1] : null
  }
}