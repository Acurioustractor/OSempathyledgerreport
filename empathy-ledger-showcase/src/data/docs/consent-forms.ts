import { WikiSection } from '@/data/wiki-content'

export const consentFormsContent: WikiSection[] = [
  {
    id: 'intro',
    type: 'callout',
    content: {
      variant: 'blue',
      title: '📄 Consent Forms Download Center',
      text: 'All consent forms are available here for download. Choose the format that best suits your needs and the preferences of your storytellers.'
    }
  },
  {
    id: 'standard-consent',
    title: 'Standard Consent Form',
    type: 'text',
    content: {
      paragraphs: [
        'The AU_Friend Consent Form_2025 is our primary consent document. It provides comprehensive coverage of all consent options in clear, accessible language.',
        'This form is recommended for most situations and has been legally reviewed to ensure compliance with Australian privacy laws.'
      ]
    }
  },
  {
    id: 'standard-features',
    type: 'grid',
    content: {
      columns: 2,
      items: [
        {
          icon: 'FileCheck',
          iconColor: 'blue',
          title: 'Comprehensive Coverage',
          description: 'Covers all consent levels and usage scenarios'
        },
        {
          icon: 'Shield',
          iconColor: 'green',
          title: 'Legally Reviewed',
          description: 'Complies with Australian privacy regulations'
        },
        {
          icon: 'Users',
          iconColor: 'purple',
          title: 'Clear Language',
          description: 'Written in plain English for easy understanding'
        },
        {
          icon: 'Download',
          iconColor: 'orange',
          title: 'Print Ready',
          description: 'Formatted for easy printing and handling'
        }
      ]
    }
  },
  {
    id: 'download-standard',
    type: 'callout',
    content: {
      variant: 'green',
      title: '⬇️ Download Standard Form',
      text: 'AU_Friend Consent Form_2025.pdf - Click to download the standard consent form'
    }
  },
  {
    id: 'visual-consent',
    title: 'Visual Consent Form',
    type: 'text',
    content: {
      paragraphs: [
        'The Media Consent Form - VISUAL uses icons, graphics, and visual elements to communicate consent options. This form is ideal for:',
        '• People with literacy challenges\n• Visual learners\n• Non-native English speakers\n• Quick consent situations'
      ]
    }
  },
  {
    id: 'visual-features',
    type: 'grid',
    content: {
      columns: 2,
      items: [
        {
          icon: 'Image',
          iconColor: 'purple',
          title: 'Icon-Based',
          description: 'Uses universally understood symbols'
        },
        {
          icon: 'Zap',
          iconColor: 'orange',
          title: 'Quick to Complete',
          description: 'Faster processing with visual cues'
        },
        {
          icon: 'Globe',
          iconColor: 'blue',
          title: 'Language Neutral',
          description: 'Reduces language barriers'
        },
        {
          icon: 'Accessibility',
          iconColor: 'green',
          title: 'Accessible Design',
          description: 'Large print and clear visuals'
        }
      ]
    }
  },
  {
    id: 'download-visual',
    type: 'callout',
    content: {
      variant: 'purple',
      title: '⬇️ Download Visual Form',
      text: 'Media Consent Form - VISUAL (Print).pdf - Click to download the visual consent form'
    }
  },
  {
    id: 'pilot-form',
    title: 'Orange Sky Pilot Form',
    type: 'text',
    content: {
      paragraphs: [
        'The Orange Sky Pilot: Sharing Your Story, Your Way form is a simplified version designed specifically for the Empathy Ledger pilot program.',
        'This streamlined form focuses on the essential consent elements while maintaining full legal compliance.'
      ]
    }
  },
  {
    id: 'download-pilot',
    type: 'callout',
    content: {
      variant: 'orange',
      title: '⬇️ Download Pilot Form',
      text: 'Orange Sky Pilot_ Sharing Your Story, Your Way.pdf - Click to download the pilot consent form'
    }
  },
  {
    id: 'digital-options',
    title: 'Digital Options',
    type: 'text',
    content: {
      paragraphs: [
        'In addition to paper forms, the Empathy Ledger platform supports digital consent capture through:',
        '• Mobile app with digital signature\n• Photo capture of signed paper forms\n• Online consent portal (coming soon)\n• QR code linking to digital forms'
      ]
    }
  },
  {
    id: 'special-cases',
    title: 'Special Cases',
    type: 'grid',
    content: {
      columns: 2,
      items: [
        {
          icon: 'Users',
          iconColor: 'blue',
          title: 'Group Consent',
          description: 'When multiple people share a story together'
        },
        {
          icon: 'UserCheck',
          iconColor: 'green',
          title: 'Guardian Consent',
          description: 'For minors or those requiring support'
        },
        {
          icon: 'RefreshCw',
          iconColor: 'purple',
          title: 'Ongoing Consent',
          description: 'For regular storytellers over time'
        },
        {
          icon: 'AlertCircle',
          iconColor: 'orange',
          title: 'Emergency Consent',
          description: 'Simplified process for urgent situations'
        }
      ]
    }
  },
  {
    id: 'best-practices',
    title: 'Form Usage Best Practices',
    type: 'list',
    content: {
      ordered: true,
      items: [
        'Always have multiple copies of forms available',
        'Keep completed forms secure and confidential',
        'Provide a copy to the storyteller if requested',
        'Use the visual form when language might be a barrier',
        'Take a clear photo of completed forms for backup',
        'Store originals in a locked, secure location'
      ]
    }
  },
  {
    id: 'translations',
    type: 'callout',
    content: {
      variant: 'blue',
      title: '🌐 Need Translations?',
      text: 'Contact the Orange Sky team for consent forms in other languages. We currently have forms available in Arabic, Vietnamese, and Simplified Chinese.'
    }
  }
]