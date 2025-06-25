'use client'

import { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Save, X, FileText, Eye } from 'lucide-react'
import { toast } from 'sonner'

// Dynamically import the markdown editor to avoid SSR issues
const MDEditor = dynamic(
  () => import('@uiw/react-md-editor'),
  { ssr: false }
)

interface MarkdownEditorProps {
  slug: string
  initialTitle?: string
  initialContent?: string
  onSave?: (content: string, title: string) => void
  onCancel?: () => void
}

export function MarkdownEditor({ 
  slug, 
  initialTitle = '', 
  initialContent = '', 
  onSave, 
  onCancel 
}: MarkdownEditorProps) {
  const [content, setContent] = useState(initialContent)
  const [title, setTitle] = useState(initialTitle)
  const [isSaving, setIsSaving] = useState(false)
  const [isPreview, setIsPreview] = useState(false)

  // Auto-save to localStorage every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      if (content && content !== initialContent) {
        localStorage.setItem(`markdown-backup-${slug}`, JSON.stringify({
          content,
          title,
          timestamp: new Date().toISOString()
        }))
      }
    }, 30000)

    return () => clearInterval(interval)
  }, [content, title, slug, initialContent])

  // Check for backup on load
  useEffect(() => {
    const backup = localStorage.getItem(`markdown-backup-${slug}`)
    if (backup) {
      try {
        const { content: backupContent, title: backupTitle, timestamp } = JSON.parse(backup)
        const backupTime = new Date(timestamp)
        const isRecent = Date.now() - backupTime.getTime() < 24 * 60 * 60 * 1000 // 24 hours
        
        if (isRecent && backupContent !== initialContent) {
          const restore = confirm(`Found unsaved changes from ${backupTime.toLocaleString()}. Restore them?`)
          if (restore) {
            setContent(backupContent)
            setTitle(backupTitle)
            toast.info('Restored from backup')
          }
        }
      } catch (e) {
        console.error('Failed to parse backup:', e)
      }
    }
  }, [slug, initialContent])

  // Load content from file if not provided
  useEffect(() => {
    if (!initialContent && slug) {
      loadMarkdownContent()
    }
  }, [slug, initialContent])

  const loadMarkdownContent = async () => {
    try {
      const response = await fetch(`/api/docs/${slug}/markdown`)
      if (response.ok) {
        const data = await response.json()
        setContent(data.content)
        setTitle(data.title || slug)
      }
    } catch (error) {
      console.error('Failed to load markdown content:', error)
    }
  }

  const handleSave = async () => {
    setIsSaving(true)
    try {
      const response = await fetch(`/api/docs/${slug}/save-markdown`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title,
          content,
          slug
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to save')
      }

      toast.success('Document saved successfully!')
      // Clear backup after successful save
      localStorage.removeItem(`markdown-backup-${slug}`)
      onSave?.(content, title)
    } catch (error) {
      console.error('Error saving:', error)
      toast.error('Failed to save document')
    } finally {
      setIsSaving(false)
    }
  }

  const handleCancel = () => {
    setContent(initialContent)
    setTitle(initialTitle)
    onCancel?.()
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <div className="flex items-center space-x-2">
              <FileText className="h-5 w-5" />
              <CardTitle>Edit Documentation</CardTitle>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsPreview(!isPreview)}
              >
                <Eye className="h-4 w-4 mr-2" />
                {isPreview ? 'Edit' : 'Preview'}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleCancel}
              >
                <X className="h-4 w-4 mr-2" />
                Cancel
              </Button>
              <Button
                size="sm"
                onClick={handleSave}
                disabled={isSaving}
              >
                <Save className="h-4 w-4 mr-2" />
                {isSaving ? 'Saving...' : 'Save'}
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Title Input */}
              <div>
                <label htmlFor="title" className="block text-sm font-medium mb-2">
                  Document Title
                </label>
                <input
                  id="title"
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder="Enter document title..."
                />
              </div>

              {/* Markdown Editor */}
              <div className="border rounded-lg overflow-hidden">
                <MDEditor
                  value={content}
                  onChange={(val) => setContent(val || '')}
                  preview={isPreview ? 'preview' : 'edit'}
                  height={600}
                  data-color-mode="light"
                  hideToolbar={isPreview}
                  visibleDragbar={false}
                />
              </div>

              {/* Help Text */}
              <div className="text-sm text-muted-foreground space-y-2">
                <p><strong>Markdown Features Supported:</strong></p>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li><code>:::info[Title]</code> - Info callout boxes</li>
                  <li><code>:::success[Title]</code> - Success callout boxes</li>
                  <li><code>:::warning[Title]</code> - Warning callout boxes</li>
                  <li><code>:::danger[Title]</code> - Danger callout boxes</li>
                  <li><code>## Headings</code> - Various heading levels</li>
                  <li><code>**Bold** and *Italic*</code> - Text formatting</li>
                  <li><code>- Lists</code> - Bullet and numbered lists</li>
                  <li><code>[Links](url)</code> - External and internal links</li>
                  <li><code>```code```</code> - Code blocks with syntax highlighting</li>
                  <li><code>&lt;div className="grid"&gt;</code> - Custom components</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}