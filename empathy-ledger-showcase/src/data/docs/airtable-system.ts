import { WikiSection } from '@/data/wiki-content'

export const airtableSystemContent: WikiSection[] = [
  {
    id: 'intro',
    type: 'callout',
    content: {
      variant: 'blue',
      title: '🗄️ Airtable: The Heart of Story Management',
      text: 'Airtable serves as the central database for all story data, consent tracking, and workflow automation in the Empathy Ledger system.'
    }
  },
  {
    id: 'overview',
    title: 'System Overview',
    type: 'text',
    content: {
      paragraphs: [
        'The Empathy Ledger uses Airtable as its primary database due to its flexibility, user-friendly interface, and powerful automation capabilities. The system manages everything from story collection to consent tracking, media storage, and analytics.',
        'Our Airtable base is structured to maintain data integrity while providing easy access for different user roles - from photographers in the field to administrators managing content.'
      ]
    }
  },
  {
    id: 'base-structure',
    title: 'Base Structure',
    type: 'grid',
    content: {
      columns: 2,
      items: [
        {
          icon: 'Users',
          iconColor: 'blue',
          title: 'Storytellers Table',
          description: 'Core profiles with consent preferences, contact info, and story count'
        },
        {
          icon: 'FileText',
          iconColor: 'green',
          title: 'Stories Table',
          description: 'Individual stories linked to storytellers with full content and metadata'
        },
        {
          icon: 'Camera',
          iconColor: 'purple',
          title: 'Media Table',
          description: 'Photos, videos, and audio files with processing status and links'
        },
        {
          icon: 'Calendar',
          iconColor: 'orange',
          title: 'Shifts Table',
          description: 'Scheduled story collection shifts with assignments and locations'
        },
        {
          icon: 'Shield',
          iconColor: 'blue',
          title: 'Consent Log',
          description: 'Audit trail of all consent changes with timestamps and reasons'
        },
        {
          icon: 'BarChart',
          iconColor: 'green',
          title: 'Analytics Views',
          description: 'Pre-built views for theme analysis and impact measurement'
        }
      ]
    }
  },
  {
    id: 'story-tables',
    title: 'Story Tables',
    type: 'text',
    content: {
      paragraphs: [
        'The Stories table is the core of our system, containing:',
        '• **Story Content**: Full text, quotes, and key moments\n• **Metadata**: Date, location, collector, themes\n• **Consent Level**: Current sharing permissions\n• **Processing Status**: Draft, review, approved, published\n• **Impact Metrics**: Views, shares, engagement'
      ]
    }
  },
  {
    id: 'relationships',
    type: 'callout',
    content: {
      variant: 'purple',
      title: '🔗 Table Relationships',
      text: 'Stories link to Storytellers (many-to-one) • Media links to Stories (many-to-one) • Shifts link to multiple Stories • Consent Log tracks all changes'
    }
  },
  {
    id: 'automation',
    title: 'Automation',
    type: 'list',
    content: {
      ordered: false,
      items: [
        {
          title: 'Consent Updates',
          description: 'Automatically log consent changes and notify relevant team members'
        },
        {
          title: 'Media Processing',
          description: 'Trigger Descript workflows when new video/audio is uploaded'
        },
        {
          title: 'Status Workflows',
          description: 'Move stories through review stages with automated notifications'
        },
        {
          title: 'Theme Detection',
          description: 'Use AI to suggest themes based on story content'
        },
        {
          title: 'Publishing Pipeline',
          description: 'Sync approved stories to website and social platforms'
        }
      ]
    }
  },
  {
    id: 'scripting',
    title: 'Custom Scripting',
    type: 'text',
    content: {
      paragraphs: [
        'Airtable\'s scripting block enables advanced functionality:',
        '• **Bulk Operations**: Update multiple records based on complex criteria\n• **Data Validation**: Ensure consent forms are complete before publishing\n• **Report Generation**: Create custom analytics and summaries\n• **API Integration**: Connect with external services like Make.com\n• **Privacy Checks**: Automated scanning for identifying information'
      ]
    }
  },
  {
    id: 'views-filters',
    title: 'Views & Filters',
    type: 'grid',
    content: {
      columns: 2,
      items: [
        {
          icon: 'Eye',
          iconColor: 'blue',
          title: 'Photographer View',
          description: 'Shows only assigned shifts and incomplete stories'
        },
        {
          icon: 'Edit',
          iconColor: 'green',
          title: 'Editor View',
          description: 'Stories pending review with editing tools'
        },
        {
          icon: 'Globe',
          iconColor: 'purple',
          title: 'Publisher View',
          description: 'Approved stories ready for sharing'
        },
        {
          icon: 'BarChart',
          iconColor: 'orange',
          title: 'Analytics View',
          description: 'Aggregated data for insights and reporting'
        }
      ]
    }
  },
  {
    id: 'security',
    title: 'Security & Access',
    type: 'callout',
    content: {
      variant: 'orange',
      title: '🔒 Data Protection',
      text: 'Role-based permissions • Field-level security • Encrypted attachments • Regular backups • Audit logging • GDPR compliance'
    }
  },
  {
    id: 'best-practices',
    title: 'Best Practices',
    type: 'list',
    content: {
      ordered: true,
      items: [
        'Regular backups of the entire base',
        'Use views instead of filters for consistent access',
        'Document all automations and scripts',
        'Test changes in a duplicate base first',
        'Maintain clear naming conventions',
        'Regular audit of user permissions',
        'Archive old records rather than delete'
      ]
    }
  },
  {
    id: 'integration',
    title: 'Integration Points',
    type: 'text',
    content: {
      paragraphs: [
        'Airtable connects with other tools in our ecosystem:',
        '• **Make.com**: Automated workflows and data processing\n• **Descript**: Video/audio file processing triggers\n• **Website**: API calls for story display\n• **Softr**: Mobile app data source\n• **AI Services**: Theme and sentiment analysis'
      ]
    }
  },
  {
    id: 'getting-started',
    type: 'callout',
    content: {
      variant: 'blue',
      title: '🚀 Getting Started',
      text: 'Request access to the Airtable base from your administrator. New users should complete the Airtable training module before gaining edit access.'
    }
  }
]