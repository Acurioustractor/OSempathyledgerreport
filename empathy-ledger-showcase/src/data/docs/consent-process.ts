import { WikiSection } from '@/data/wiki-content'

export const consentProcessContent: WikiSection[] = [
  {
    id: 'intro',
    type: 'callout',
    content: {
      variant: 'blue',
      title: '🛡️ Consent is Everything',
      text: 'Our three-tier consent model ensures storytellers have complete control over how their stories are shared. This guide explains the process and provides all necessary forms.'
    }
  },
  {
    id: 'philosophy',
    title: 'Our Consent Philosophy',
    type: 'text',
    content: {
      paragraphs: [
        'At the heart of the Empathy Ledger is a deep respect for individual agency and dignity. We believe that stories belong to their tellers, and consent must be informed, ongoing, and revocable.',
        'Our consent process goes beyond legal compliance - it\'s about building trust, ensuring understanding, and empowering storytellers to share on their own terms.'
      ]
    }
  },
  {
    id: 'consent-levels',
    title: 'Three Consent Levels',
    type: 'grid',
    content: {
      columns: 1,
      items: [
        {
          icon: 'Lock',
          iconColor: 'orange',
          title: 'Level 1: Internal Use Only',
          description: 'Stories are used solely for internal reflection, training, and service improvement within Orange Sky. No external sharing, complete privacy maintained. Perfect for those who want to contribute to organizational learning without public exposure.'
        },
        {
          icon: 'UserX',
          iconColor: 'blue',
          title: 'Level 2: Anonymous Sharing',
          description: 'Stories can be shared externally with all identifying information removed. Names, locations, and specific details are anonymized. Focuses on themes, insights, and collective experiences while protecting individual identity.'
        },
        {
          icon: 'Award',
          iconColor: 'green',
          title: 'Level 3: Full Attribution',
          description: 'Stories are shared with full attribution as chosen by the storyteller. This celebrates individual experiences and allows storytellers to own their narrative publicly. Includes options for using real name, chosen name, or initials.'
        }
      ]
    }
  },
  {
    id: 'consent-forms',
    title: 'Available Consent Forms',
    type: 'callout',
    content: {
      variant: 'purple',
      title: '📄 Downloadable Forms',
      text: 'We provide multiple consent form options to suit different situations and preferences. All forms are legally reviewed and designed for clarity.'
    }
  },
  {
    id: 'form-types',
    type: 'list',
    content: {
      ordered: false,
      items: [
        {
          title: 'Standard Consent Form',
          description: 'AU_Friend Consent Form_2025 - The primary form with comprehensive options and clear language'
        },
        {
          title: 'Visual Consent Form',
          description: 'Media Consent Form - VISUAL - Uses icons and graphics for easier understanding'
        },
        {
          title: 'Empathy Ledger Draft',
          description: 'Orange Sky Pilot: Sharing Your Story, Your Way - Simplified version for quick consent'
        }
      ]
    }
  },
  {
    id: 'consent-process-steps',
    title: 'The Consent Process',
    type: 'list',
    content: {
      ordered: true,
      items: [
        {
          title: 'Introduction',
          description: 'Explain who you are, why you\'re collecting stories, and how they might be used'
        },
        {
          title: 'Options Explanation',
          description: 'Walk through the three consent levels using visual aids if helpful'
        },
        {
          title: 'Questions & Clarification',
          description: 'Ensure the storyteller fully understands their options and can ask questions'
        },
        {
          title: 'Choice & Documentation',
          description: 'Record their consent choice and any specific restrictions or preferences'
        },
        {
          title: 'Confirmation',
          description: 'Provide a copy of the consent form and explain how they can change their mind later'
        }
      ]
    }
  },
  {
    id: 'visual-guide',
    title: 'Visual Consent Guide',
    type: 'text',
    content: {
      paragraphs: [
        'For storytellers who prefer visual communication, we\'ve developed a consent form that uses icons and simple graphics to explain each consent level. This is particularly helpful for:',
        '• People with literacy challenges\n• Non-native English speakers\n• Those who process information better visually\n• Quick consent situations during busy shifts'
      ]
    }
  },
  {
    id: 'changing-consent',
    title: 'Changing Your Mind',
    type: 'callout',
    content: {
      variant: 'green',
      title: '♻️ Consent is Always Revocable',
      text: 'Storytellers can change their consent level at any time. This includes withdrawing consent entirely, upgrading to allow more sharing, or downgrading for more privacy.'
    }
  },
  {
    id: 'privacy-protection',
    title: 'Privacy First',
    type: 'grid',
    content: {
      columns: 2,
      items: [
        {
          icon: 'Database',
          iconColor: 'blue',
          title: 'Secure Storage',
          description: 'All consent forms are digitally stored with encryption and access controls'
        },
        {
          icon: 'Search',
          iconColor: 'purple',
          title: 'Audit Trail',
          description: 'Every consent change is logged with timestamp and reason'
        },
        {
          icon: 'Bell',
          iconColor: 'orange',
          title: 'Notifications',
          description: 'Storytellers can opt-in to updates about how their stories are used'
        },
        {
          icon: 'Shield',
          iconColor: 'green',
          title: 'Legal Compliance',
          description: 'Forms meet all Australian privacy laws and best practices'
        }
      ]
    }
  },
  {
    id: 'special-considerations',
    title: 'Special Considerations',
    type: 'text',
    content: {
      paragraphs: [
        'Some situations require extra care in the consent process:',
        '• **Vulnerable individuals**: Take extra time to ensure understanding\n• **Group stories**: Get individual consent from each person\n• **Minors**: Require guardian consent in addition to minor\'s assent\n• **Mental health concerns**: Consider capacity and seek support if needed\n• **Cultural sensitivity**: Respect cultural approaches to storytelling and sharing'
      ]
    }
  },
  {
    id: 'app-integration',
    title: 'App Integration',
    type: 'text',
    content: {
      paragraphs: [
        'The photographer app streamlines consent capture with:',
        '• Digital consent form completion\n• Photo capture of paper forms\n• Digital signature options\n• Automatic linking to storyteller records\n• Real-time sync with the database'
      ]
    }
  },
  {
    id: 'download-forms',
    type: 'callout',
    content: {
      variant: 'blue',
      title: '⬇️ Download Forms',
      text: 'Visit the Resources section to download all consent forms, including translated versions and accessibility formats.'
    }
  }
]