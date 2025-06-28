'use client'

import { useState, useEffect } from 'react'
import WikiLayout from '@/components/wiki/WikiLayout'
import { Edit, Save, X } from 'lucide-react'
import dynamic from 'next/dynamic'

// Dynamically import the markdown editor to avoid SSR issues
const MDEditor = dynamic(
  () => import('@uiw/react-md-editor'),
  { ssr: false }
)

const defaultMarkdownContent = `# What is the Empathy Ledger?

The Empathy Ledger is a privacy-first storytelling platform that enables organizations to collect, analyze, and share human stories with dignity and respect.

Born from Orange Sky's commitment to positive conversations, it demonstrates how technology can amplify human connection while protecting individual privacy.

## Core Principles

### Human-Centered Design
Every feature prioritizes the storyteller's dignity, comfort, and control over their narrative.

### Privacy by Design
Built from the ground up with privacy protection, consent management, and data minimization.

### Storyteller Agency
Storytellers maintain control over their stories, choosing what to share and how it's used.

### Transparency
Clear communication about data usage, storage, and the impact of sharing stories.

## Privacy & Consent Framework

### Three-Tier Consent Model

1. **Initial Consent** - Verbal agreement to participate in the interview, with clear explanation of the process.

2. **Recording Consent** - Explicit permission for audio/video recording, with options for different levels of identification.

3. **Usage Consent** - Granular control over how stories are shared - internally, publicly, or for specific purposes.

### Data Protection
- Encrypted storage and transmission
- Regular security audits
- Automatic data expiration options
- Right to deletion at any time

### Ethical Guidelines
- No exploitation of vulnerability
- Trauma-informed approach
- Cultural sensitivity training
- Regular ethics reviews

## Platform Features

- **Story Collection** - Intuitive interview tools with consent tracking, recording capabilities, and real-time transcription.

- **Smart Organization** - AI-powered tagging, theme extraction, and searchable database of anonymized insights.

- **Ethical Sharing** - Consent-based publishing with automatic privacy protection and impact tracking.

- **Impact Analytics** - Measure story reach, engagement, and outcomes while maintaining storyteller privacy.

- **Access Control** - Role-based permissions ensuring only authorized staff access sensitive information.

- **Cloud Native** - Scalable architecture supporting organizations from small nonprofits to large enterprises.

## Airtable Setup

The Empathy Ledger uses Airtable as its backend, providing a flexible, no-code database solution that organizations can customize to their needs.

### Base Structure

- **Stories Base** - Main table for story content with fields for quotes, themes, and metadata
- **Storytellers Base** - Profile information, consent records, and story relationships
- **Media Base** - Audio recordings, transcripts, photos, and video content
- **Analytics Base** - Impact metrics, engagement data, and outcome tracking

**Pro Tip:** Use Airtable's automation features to trigger consent reminders, archive old stories, and generate impact reports automatically.

## Interview Process

### 1. Pre-Interview Preparation
- Review consent forms and privacy policies
- Prepare open-ended questions focused on experiences
- Test recording equipment and backup systems
- Create a comfortable, private environment

### 2. During the Interview
- Begin with casual conversation to build rapport
- Explain the process and obtain verbal consent
- Use active listening and follow the storyteller's lead
- Respect boundaries and pause if needed

### 3. Post-Interview
- Thank the storyteller and explain next steps
- Complete consent documentation
- Process and tag content while memories are fresh
- Follow up with any promised resources or support

## Technical Stack

### Frontend
- Next.js 14 with App Router
- TypeScript for type safety
- Tailwind CSS for styling
- React 18 with Server Components

### Backend & Infrastructure
- Airtable for data storage
- Vercel for hosting and edge functions
- Cloudinary for media optimization
- OpenAI for content analysis

Key Technical Features: Server-side rendering for SEO, progressive enhancement for accessibility, responsive design for mobile access, and automatic image optimization for performance.

## Future Vision

The Empathy Ledger is designed to evolve with advancing technology while maintaining its ethical foundation. Here's what's on the horizon:

- **AI-Powered Insights** - Advanced theme detection and pattern recognition while preserving individual privacy
- **Multi-Language Support** - Real-time translation and culturally-aware content adaptation
- **Blockchain Consent** - Immutable consent records giving storytellers permanent control
- **Impact Marketplace** - Connect stories with resources, support, and opportunities for change

## Ready to Get Started?

Join the movement to share stories with dignity and create meaningful change.

[Quick Start Guide](/docs/quick-start) | [Content Guide](/wiki/content-guide)
`;

export default function WikiOverviewPage() {
  const [isEditMode, setIsEditMode] = useState(false)
  const [content, setContent] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)

  // Load content on mount
  useEffect(() => {
    loadContent()
  }, [])

  const loadContent = async () => {
    try {
      // Try to load from localStorage first
      const savedContent = localStorage.getItem('wiki-content-overview')
      if (savedContent) {
        const parsed = JSON.parse(savedContent)
        setContent(parsed.content)
      } else {
        // Use default content
        setContent(defaultMarkdownContent)
      }
    } catch (error) {
      console.error('Error loading content:', error)
      setContent(defaultMarkdownContent)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSave = async () => {
    setIsSaving(true)
    try {
      // Save to localStorage
      localStorage.setItem('wiki-content-overview', JSON.stringify({
        content,
        lastUpdated: new Date().toISOString()
      }))
      
      // Exit edit mode
      setIsEditMode(false)
    } catch (error) {
      console.error('Error saving:', error)
      alert('Failed to save content')
    } finally {
      setIsSaving(false)
    }
  }

  const handleCancel = () => {
    // Reload content and exit edit mode
    loadContent()
    setIsEditMode(false)
  }

  if (isLoading) {
    return (
      <WikiLayout currentSlug="overview" pageTitle="What is the Empathy Ledger?">
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-500">Loading...</div>
        </div>
      </WikiLayout>
    )
  }

  return (
    <WikiLayout currentSlug="overview" pageTitle="What is the Empathy Ledger?">
      <div className="relative">
        {/* Edit/View Toggle Button */}
        <div className="absolute top-0 right-0 flex gap-2 z-10">
          {!isEditMode ? (
            <button
              onClick={() => setIsEditMode(true)}
              className="flex items-center gap-2 px-3 py-1.5 text-sm bg-orange-sky text-white rounded-lg hover:bg-orange-600 transition-colors"
            >
              <Edit className="w-4 h-4" />
              Edit Page
            </button>
          ) : (
            <>
              <button
                onClick={handleCancel}
                className="flex items-center gap-2 px-3 py-1.5 text-sm bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
              >
                <X className="w-4 h-4" />
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="flex items-center gap-2 px-3 py-1.5 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                {isSaving ? 'Saving...' : 'Save'}
              </button>
            </>
          )}
        </div>

        {/* Content Area */}
        <div className="mt-12">
          {isEditMode ? (
            <div className="space-y-4">
              {/* Markdown Editor */}
              <div className="border border-gray-300 rounded-lg overflow-hidden">
                <MDEditor
                  value={content}
                  onChange={(val) => setContent(val || '')}
                  height={600}
                  preview="live"
                />
              </div>
              
              {/* Help Text */}
              <div className="text-sm text-gray-600 bg-gray-50 rounded-lg p-4">
                <p className="font-semibold mb-2">Markdown Tips:</p>
                <ul className="space-y-1 text-xs">
                  <li>• Use # for headings (## for h2, ### for h3)</li>
                  <li>• Use **bold** and *italic* for emphasis</li>
                  <li>• Create lists with - or 1. 2. 3.</li>
                  <li>• Add links with [text](url)</li>
                  <li>• Insert code blocks with \`\`\`</li>
                </ul>
              </div>
            </div>
          ) : (
            <div className="prose prose-lg max-w-none">
              <MDEditor.Markdown source={content} />
            </div>
          )}
        </div>
      </div>
    </WikiLayout>
  )
}