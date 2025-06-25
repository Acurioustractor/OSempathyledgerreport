"use client";

import DocsLayout from '@/components/docs/DocsLayout'
import WikiContentRenderer from '@/components/wiki/WikiContentRenderer'
import { MarkdownEditor } from '@/components/docs/MarkdownEditor'
import { MarkdownRenderer } from '@/components/docs/MarkdownRenderer'
import { WikiSection } from '@/data/wiki-content'
import React, { useState } from 'react'

interface DocPageClientProps {
  slug: string
  page: {
    title: string
    description?: string
  }
  content: WikiSection[]
}

export function DocPageClient({ slug, page, content }: DocPageClientProps) {
  // Edit mode state
  const [editMode, setEditMode] = useState(false)
  const [editorType, setEditorType] = useState<'json' | 'markdown'>('markdown')
  const [editorValue, setEditorValue] = useState(() => JSON.stringify(content, null, 2))
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleEdit = (type: 'json' | 'markdown' = 'markdown') => {
    setEditorType(type)
    if (type === 'json') {
      setEditorValue(JSON.stringify(content, null, 2))
    }
    setEditMode(true)
    setError(null)
  }
  const handleCancel = () => {
    setEditMode(false)
    setError(null)
  }
  const handleSave = async () => {
    setSaving(true)
    setError(null)
    try {
      const res = await fetch(`/api/docs/${slug}/save`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: editorValue })
      })
      if (!res.ok) throw new Error('Failed to save')
      setEditMode(false)
      window.location.reload()
    } catch (e: any) {
      setError(e.message || 'Error saving')
    } finally {
      setSaving(false)
    }
  }

  return (
    <DocsLayout currentSlug={slug} pageTitle={page.title}>
      {page.description && (
        <p className="text-xl text-gray-600 mb-8">{page.description}</p>
      )}
      {!editMode && (
        <div className="mb-4 flex justify-end gap-2">
          <button
            className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
            onClick={() => handleEdit('markdown')}
          >
            Edit with Markdown
          </button>
          <button
            className="px-4 py-2 rounded bg-gray-600 text-white hover:bg-gray-700"
            onClick={() => handleEdit('json')}
          >
            Edit JSON
          </button>
        </div>
      )}
      {editMode ? (
        editorType === 'markdown' ? (
          <MarkdownEditor
            slug={slug}
            initialTitle={page.title}
            onSave={() => {
              setEditMode(false)
              window.location.reload()
            }}
            onCancel={handleCancel}
          />
        ) : (
          <div className="mb-8">
            <textarea
              className="w-full h-96 font-mono p-2 border rounded mb-2"
              value={editorValue}
              onChange={e => setEditorValue(e.target.value)}
              disabled={saving}
            />
            <div className="flex gap-2">
              <button
                className="px-4 py-2 rounded bg-green-600 text-white hover:bg-green-700"
                onClick={handleSave}
                disabled={saving}
              >
                {saving ? 'Saving...' : 'Save'}
              </button>
              <button
                className="px-4 py-2 rounded bg-gray-300 text-gray-800 hover:bg-gray-400"
                onClick={handleCancel}
                disabled={saving}
              >
                Cancel
              </button>
            </div>
            {error && <div className="text-red-600 mt-2">{error}</div>}
          </div>
        )
      ) : (
        <MarkdownRenderer 
          slug={slug}
          fallbackContent={<WikiContentRenderer sections={content} />}
        />
      )}
    </DocsLayout>
  )
}