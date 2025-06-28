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

// Import markdown preview separately
const MDPreview = dynamic(
  () => import('@uiw/react-md-editor').then(mod => mod.default.Markdown),
  { ssr: false }
)

const defaultMarkdownContent = `# Empathy Ledger Wiki

Welcome to the Empathy Ledger Wiki - your comprehensive guide to ethical storytelling and platform documentation.

## 📚 Wiki Areas

### [Platform Overview](/wiki/overview)
Complete guide to the Empathy Ledger platform, including core principles, technical implementation, and ethical frameworks.

**Key Topics:**
- Core principles
- Privacy framework  
- Platform features
- Technical architecture

### [Content Guide](/wiki/content-guide)
Best practices for creating, editing, and managing storyteller content with respect and dignity.

**Key Topics:**
- Story management
- Interview techniques
- Media guidelines
- Ethical considerations

### [Technical Docs](/docs/introduction)
Detailed technical documentation, setup guides, and system architecture information.

**Key Topics:**
- Development guide
- System architecture
- Performance optimization
- Security practices

## 🌟 Featured Stories

The Empathy Ledger is about real people and their stories. Here are some featured examples that demonstrate the power of ethical storytelling.

## 🚀 Quick Links

- **[What is the Empathy Ledger?](/wiki/overview)** - Start here if you're new
- **[Privacy & Consent Framework](/wiki/overview#privacy-consent)** - Understanding our ethical approach
- **[Airtable Setup Guide](/wiki/overview#airtable-setup)** - Technical implementation
- **[Interview Process](/wiki/overview#interview-process)** - Best practices for story collection

## 💡 Contributing to the Wiki

This wiki uses a simple markdown-based editing system. To edit any page:

1. Navigate to the page you want to edit
2. Click the "Edit Page" button in the top-right corner
3. Make your changes using markdown syntax
4. Preview your changes in real-time
5. Click "Save" to store your changes locally

## 🔒 Privacy First

The Empathy Ledger prioritizes storyteller privacy and dignity above all else. Every feature and process is designed with consent, control, and respect at its core.

## 📞 Need Help?

- Check the [Content Guide](/wiki/content-guide) for markdown syntax help
- Review the [Platform Overview](/wiki/overview) for general questions
- Visit the [Technical Docs](/docs/introduction) for development support

---

*The Empathy Ledger Wiki is a living document. We encourage contributions that improve clarity, accuracy, and accessibility.*
`;

export default function WikiLandingPage() {
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
      const savedContent = localStorage.getItem('wiki-content-home')
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
      localStorage.setItem('wiki-content-home', JSON.stringify({
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
      <WikiLayout currentSlug="" pageTitle="Wiki Home">
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-500">Loading...</div>
        </div>
      </WikiLayout>
    )
  }

  return (
    <WikiLayout currentSlug="" pageTitle="Wiki Home">
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
                  <li>• Insert code blocks with ```</li>
                </ul>
              </div>
            </div>
          ) : (
            <div className="prose prose-lg max-w-none">
              <MDPreview source={content} />
            </div>
          )}
        </div>
      </div>
    </WikiLayout>
  )
}