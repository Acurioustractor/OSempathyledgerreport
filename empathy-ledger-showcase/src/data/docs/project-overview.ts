import { WikiSection } from '@/data/wiki-content'

export const projectOverviewContent: WikiSection[] = [
  {
    id: 'intro',
    type: 'text',
    content: {
      paragraphs: [
        'The Empathy Ledger is a comprehensive ecosystem of tools and processes designed to ethically capture, manage, and share stories from people experiencing homelessness and hardship. This overview provides insight into the key components and systems that make the platform work.'
      ]
    }
  },
  {
    id: 'story-gallery',
    title: 'Story Gallery',
    type: 'callout',
    content: {
      variant: 'purple',
      title: '📚 Canberra Story Gallery',
      text: 'Our Airtable-powered gallery showcases stories collected across various locations, providing a searchable, filterable database of lived experiences while maintaining privacy and consent protocols.'
    }
  },
  {
    id: 'tech-stack',
    title: 'Technical Stack',
    type: 'grid',
    content: {
      columns: 2,
      items: [
        {
          icon: 'Database',
          iconColor: 'blue',
          title: 'Airtable',
          description: 'Central database for story management, consent tracking, and workflow automation with custom scripting capabilities.'
        },
        {
          icon: 'Video',
          iconColor: 'purple',
          title: 'Descript',
          description: 'Professional video and audio editing platform for processing stories, generating transcripts, and creating shareable content.'
        },
        {
          icon: 'Cpu',
          iconColor: 'green',
          title: 'AI Integration',
          description: 'OpenAI and Claude APIs for theme analysis, sentiment detection, and pattern recognition across story collections.'
        },
        {
          icon: 'Workflow',
          iconColor: 'orange',
          title: 'Make.com',
          description: 'Automation platform connecting different tools and creating efficient workflows for story processing.'
        },
        {
          icon: 'Globe',
          iconColor: 'blue',
          title: 'Custom Website',
          description: 'Next.js-based platform for public story display, built with AI assistance and custom development.'
        },
        {
          icon: 'Smartphone',
          iconColor: 'purple',
          title: 'Mobile Apps',
          description: 'Softr-powered mobile interfaces for field collection, consent capture, and media upload.'
        }
      ]
    }
  },
  {
    id: 'project-phases',
    title: 'Project Phases',
    type: 'list',
    content: {
      ordered: true,
      items: [
        {
          title: 'Phase 1: Foundation (April - Early May)',
          description: 'Establish ethical framework, create consent processes, set up basic Airtable structure, and build initial collection tools.'
        },
        {
          title: 'Phase 2: Testing & Development (Mid-May - Early June)',
          description: 'Test story collection in field, develop visualization prototypes, refine data processing workflows, and create initial analyses.'
        },
        {
          title: 'Phase 3: Refinement & Scale (Mid-June - June 30)',
          description: 'Finalize platform based on feedback, complete documentation suite, develop scaling strategy, and create handover materials.'
        }
      ]
    }
  },
  {
    id: 'project-tracking',
    title: 'Project Tracking',
    type: 'text',
    content: {
      paragraphs: [
        'The project utilizes comprehensive tracking systems to monitor progress across multiple workstreams. Visual dashboards provide real-time insights into story collection progress, platform development milestones, and overall project health.',
        'Key priorities for the second half of the project include finalizing the consent process, enhancing the photographer workflow app, and creating comprehensive documentation for future implementers.'
      ]
    }
  },
  {
    id: 'success-metrics',
    title: 'Success Metrics',
    type: 'table',
    content: {
      headers: ['Metric', 'Target', 'Current Status'],
      rows: [
        ['Stories Collected', '30+', '102'],
        ['Story Formats', '3+ types', 'Text, Audio, Video, Photo'],
        ['Consent Compliance', '100%', '100%'],
        ['Geographic Coverage', '5+ locations', 'Multiple cities'],
        ['Volunteer Photographers', '20+', '30+'],
        ['Identified Themes', '10+', '15+'],
        ['Platform Components', 'Fully functional', 'In progress'],
        ['Documentation', 'Comprehensive', 'In progress']
      ]
    }
  },
  {
    id: 'deliverables',
    title: 'End-of-Project Deliverables',
    type: 'grid',
    content: {
      columns: 3,
      items: [
        {
          icon: 'FileText',
          iconColor: 'blue',
          title: 'Documentation Suite',
          description: 'Ethical framework, methodology guides, user manuals, and technical documentation.'
        },
        {
          icon: 'Package',
          iconColor: 'green',
          title: 'Platform Components',
          description: 'Configured Airtable base, collection forms, visualization interfaces, and workflows.'
        },
        {
          icon: 'Target',
          iconColor: 'orange',
          title: 'Strategic Outputs',
          description: 'Impact framework, scaling strategy, implementation roadmap, and training materials.'
        }
      ]
    }
  },
  {
    id: 'next-steps',
    type: 'callout',
    content: {
      variant: 'blue',
      title: '🎯 Getting Started',
      text: 'Ready to dive deeper? Explore the documentation based on your role: Storyteller, Photographer, Administrator, or Developer.'
    }
  }
]