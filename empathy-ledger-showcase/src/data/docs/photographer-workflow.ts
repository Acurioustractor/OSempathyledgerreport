import { WikiSection } from '@/data/wiki-content'

export const photographerWorkflowContent: WikiSection[] = [
  {
    id: 'intro',
    type: 'callout',
    content: {
      variant: 'blue',
      title: '📸 Photographer Journey',
      text: 'This guide walks through the complete process of capturing stories during Orange Sky shifts, from claiming a shift to uploading content.'
    }
  },
  {
    id: 'workflow-overview',
    title: 'Complete Shift Process',
    type: 'list',
    content: {
      ordered: true,
      items: [
        {
          title: 'Discover & Claim Shift',
          description: 'Browse available shifts in the marketplace and claim based on your availability'
        },
        {
          title: 'Prepare for Shift',
          description: 'Review shift details, check equipment, and plan your approach'
        },
        {
          title: 'On-Shift: Capture Stories',
          description: 'Meet storytellers, obtain consent, and capture their experiences'
        },
        {
          title: 'Post-Shift: Reflect & Upload',
          description: 'Record reflections and upload all media to the platform'
        },
        {
          title: 'Follow-Up & Impact',
          description: 'See published stories and track their impact'
        }
      ]
    }
  },
  {
    id: 'claiming-shifts',
    title: 'Claiming Shifts',
    type: 'text',
    content: {
      paragraphs: [
        'The shift marketplace shows all available storytelling opportunities across different Orange Sky locations. Each shift displays key information including date, time, location, expected number of storytellers, and compensation type (volunteer or paid).',
        'Once you claim a shift, you\'ll receive a magic link with all the details you need to prepare.'
      ]
    }
  },
  {
    id: 'shift-marketplace',
    type: 'callout',
    content: {
      variant: 'purple',
      title: '📱 Shift Marketplace Screen',
      text: 'View available shifts with date, time, location • See expected storyteller count • Check compensation details • One-click claiming • Track your upcoming shifts'
    }
  },
  {
    id: 'pre-shift',
    title: 'Pre-Shift Prep',
    type: 'grid',
    content: {
      columns: 2,
      items: [
        {
          icon: 'MapPin',
          iconColor: 'blue',
          title: 'Location Details',
          description: 'Get exact location with map and directions to the shift site'
        },
        {
          icon: 'Phone',
          iconColor: 'green',
          title: 'Contact Info',
          description: 'Team leader and Orange Sky contact details for the shift'
        },
        {
          icon: 'Camera',
          iconColor: 'purple',
          title: 'Equipment Check',
          description: 'Ensure camera, audio recorder, and consent forms are ready'
        },
        {
          icon: 'FileText',
          iconColor: 'orange',
          title: 'Special Notes',
          description: 'Review any specific focus areas or instructions for this shift'
        }
      ]
    }
  },
  {
    id: 'during-shift',
    title: 'During the Shift',
    type: 'text',
    content: {
      paragraphs: [
        'Once on-shift, your focus is on building connections and capturing stories ethically. The app provides a streamlined workflow for adding storytellers, obtaining consent, and capturing media.',
        'Remember: relationship first, story second. Take time to connect with each person before discussing their story.'
      ]
    }
  },
  {
    id: 'on-shift-dashboard',
    type: 'callout',
    content: {
      variant: 'green',
      title: '📊 On-Shift Dashboard',
      text: 'Active shift timer • Storyteller count tracker • Quick media capture buttons • Add new storyteller • View shift progress • End shift option'
    }
  },
  {
    id: 'consent-capture',
    title: 'Consent Capture',
    type: 'list',
    content: {
      ordered: true,
      items: [
        {
          title: 'Add Storyteller Information',
          description: 'Capture name, preferred publication name, and contact details if provided'
        },
        {
          title: 'Explain Consent Options',
          description: 'Walk through the three consent levels and what each means'
        },
        {
          title: 'Document Consent',
          description: 'Use visual consent form, capture photo of signed form, or use digital signature'
        },
        {
          title: 'Set Permissions',
          description: 'Record specific permissions for photos, video, audio, quotes, and usage contexts'
        }
      ]
    }
  },
  {
    id: 'consent-screens',
    type: 'grid',
    content: {
      columns: 2,
      items: [
        {
          icon: 'UserPlus',
          iconColor: 'blue',
          title: 'Add Storyteller Screen',
          description: 'Basic info, anonymity preferences, notification settings'
        },
        {
          icon: 'Shield',
          iconColor: 'green',
          title: 'Consent Screen',
          description: 'Permission checkboxes, consent form capture, digital signature'
        }
      ]
    }
  },
  {
    id: 'post-shift',
    title: 'Post-Shift Tasks',
    type: 'text',
    content: {
      paragraphs: [
        'After completing your shift, take time to reflect on the experience. Your insights help improve the program and provide context for the content team.',
        'Upload all media files and ensure they\'re properly linked to the correct storytellers. Create a Descript project for any video content that needs processing.'
      ]
    }
  },
  {
    id: 'reflection-upload',
    type: 'grid',
    content: {
      columns: 2,
      items: [
        {
          icon: 'Mic',
          iconColor: 'purple',
          title: 'Reflection Screen',
          description: 'Audio recording interface, written notes option, guided prompts'
        },
        {
          icon: 'Upload',
          iconColor: 'orange',
          title: 'Media Upload Screen',
          description: 'Drag & drop files, upload progress tracking, Descript integration'
        }
      ]
    }
  },
  {
    id: 'best-practices',
    title: 'Photography Best Practices',
    type: 'callout',
    content: {
      variant: 'orange',
      title: '⭐ Remember',
      text: 'Always prioritize dignity and respect • Get consent before any photos • Focus on authentic moments • Capture environment context • Document the full story, not just hardship'
    }
  },
  {
    id: 'technical-tips',
    title: 'Technical Tips',
    type: 'list',
    content: {
      ordered: false,
      items: [
        'Use natural lighting when possible',
        'Capture both wide shots and details',
        'Record ambient sound for context',
        'Take photos of consent forms clearly',
        'Label files with date and location',
        'Back up media before leaving site'
      ]
    }
  },
  {
    id: 'next-steps',
    type: 'callout',
    content: {
      variant: 'blue',
      title: '📚 Learn More',
      text: 'Explore our Storytelling Best Practices guide for in-depth interview techniques and ethical considerations.'
    }
  }
]