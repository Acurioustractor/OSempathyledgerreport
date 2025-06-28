'use client'

import { useState, useEffect } from 'react'
import WikiLayout from '@/components/wiki/WikiLayout'
import { wikiStructure } from '@/data/wiki-structure'
import { notFound } from 'next/navigation'
import { Edit, Save, X, Eye } from 'lucide-react'
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

export default function WikiPage({ params }: { params: { slug: string } }) {
  const [isEditMode, setIsEditMode] = useState(false)
  const [content, setContent] = useState('')
  const [title, setTitle] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)

  // Find the page in the wiki structure
  let pageInfo = null
  for (const section of wikiStructure) {
    const page = section.pages.find(p => p.slug === params.slug)
    if (page) {
      pageInfo = page
      break
    }
  }

  if (!pageInfo) {
    notFound()
  }

  // Load content on mount
  useEffect(() => {
    loadContent()
  }, [params.slug])

  const loadContent = async () => {
    try {
      // Try to load from localStorage first
      const savedContent = localStorage.getItem(`wiki-content-${params.slug}`)
      if (savedContent) {
        const parsed = JSON.parse(savedContent)
        setContent(parsed.content)
        setTitle(parsed.title || pageInfo?.title || '')
      } else {
        // Set default content
        setContent(getDefaultContent())
        setTitle(pageInfo?.title || '')
      }
    } catch (error) {
      console.error('Error loading content:', error)
      setContent(getDefaultContent())
      setTitle(pageInfo?.title || '')
    } finally {
      setIsLoading(false)
    }
  }

  const getDefaultContent = () => {
    return `# ${pageInfo?.title}

This page is about ${pageInfo?.title.toLowerCase()}.

## Overview

Add your content here...

## Key Points

- Point 1
- Point 2
- Point 3

## Details

More detailed information goes here.
`
  }

  const handleSave = async () => {
    setIsSaving(true)
    try {
      // Save to localStorage
      localStorage.setItem(`wiki-content-${params.slug}`, JSON.stringify({
        content,
        title,
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
      <WikiLayout currentSlug={params.slug} pageTitle={pageInfo?.title || ''}>
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-500">Loading...</div>
        </div>
      </WikiLayout>
    )
  }

  return (
    <WikiLayout currentSlug={params.slug} pageTitle={title}>
      <div className="relative">
        {/* Edit/View Toggle Button */}
        <div className="absolute top-0 right-0 flex gap-2">
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
              {/* Title Editor */}
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-2 text-2xl font-bold border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-sky"
                placeholder="Page Title"
              />
              
              {/* Markdown Editor */}
              <div className="border border-gray-300 rounded-lg overflow-hidden" data-color-mode="light">
                <MDEditor
                  value={content}
                  onChange={(val) => setContent(val || '')}
                  height={600}
                  preview="live"
                  data-color-mode="light"
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
            <div className="prose prose-lg max-w-none" data-color-mode="light">
              <MDPreview source={content} style={{ backgroundColor: 'transparent' }} />
            </div>
          )}
        </div>
      </div>
    </WikiLayout>
  )
}