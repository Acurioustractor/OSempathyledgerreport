'use client'

import { useEffect, useState } from 'react'
import WikiContentRenderer from '@/components/wiki/WikiContentRenderer'
import { WikiSection } from '@/data/wiki-content'

interface MarkdownRendererProps {
  slug: string
  fallbackContent?: React.ReactNode
}

export function MarkdownRenderer({ slug, fallbackContent }: MarkdownRendererProps) {
  const [content, setContent] = useState<WikiSection[] | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadContent = async () => {
      try {
        const response = await fetch(`/api/docs/${slug}/markdown`)
        if (response.ok) {
          const { content: markdownContent, source } = await response.json()
          
          if (source === 'markdown' && markdownContent) {
            // Convert markdown back to WikiSection format for consistent styling
            const convertedContent = convertMarkdownToWikiSections(markdownContent)
            setContent(convertedContent)
          } else {
            setContent(null)
          }
        } else {
          setContent(null)
        }
      } catch (err) {
        console.error('Error loading markdown:', err)
        setContent(null)
      } finally {
        setLoading(false)
      }
    }

    loadContent()
  }, [slug])

  if (loading) {
    return <div className="animate-pulse">Loading...</div>
  }

  if (content) {
    return <WikiContentRenderer sections={content} />
  }

  // Fallback to original content
  return <>{fallbackContent}</>
}

function convertMarkdownToWikiSections(markdown: string): WikiSection[] {
  const sections: WikiSection[] = []
  const lines = markdown.split('\n')
  let currentSection: Partial<WikiSection> = {}
  let currentParagraphs: string[] = []
  let inCallout = false
  let calloutContent = ''
  let calloutType = ''
  let calloutTitle = ''
  let inGrid = false
  let gridItems: any[] = []

  const flushParagraphs = () => {
    if (currentParagraphs.length > 0) {
      sections.push({
        id: `section-${sections.length}`,
        type: 'text',
        content: {
          paragraphs: currentParagraphs.filter(p => p.trim())
        }
      } as WikiSection)
      currentParagraphs = []
    }
  }

  const flushGrid = () => {
    if (gridItems.length > 0) {
      sections.push({
        id: `grid-${sections.length}`,
        type: 'grid',
        content: {
          columns: 3,
          items: gridItems
        }
      } as WikiSection)
      gridItems = []
      inGrid = false
    }
  }

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    
    // Handle callouts
    if (line.startsWith(':::')) {
      if (inCallout) {
        // End callout
        sections.push({
          id: `callout-${sections.length}`,
          type: 'callout',
          content: {
            variant: calloutType,
            title: calloutTitle,
            text: calloutContent.trim()
          }
        } as WikiSection)
        inCallout = false
        calloutContent = ''
        continue
      } else {
        // Start callout
        flushParagraphs()
        const match = line.match(/:::(\w+)\[([^\]]+)\]/)
        if (match) {
          calloutType = match[1]
          calloutTitle = match[2]
          inCallout = true
          continue
        }
      }
    }
    
    if (inCallout) {
      if (line.trim()) {
        calloutContent += line + '\n'
      }
      continue
    }

    // Handle grid start
    if (line.includes('<div className="grid')) {
      flushParagraphs()
      inGrid = true
      continue
    }

    // Handle grid end
    if (line.includes('</div>') && inGrid) {
      flushGrid()
      continue
    }

    // Handle grid items (### headings within grid)
    if (inGrid && line.startsWith('### ')) {
      const title = line.replace('### ', '').replace(/^[^\s]*\s/, '') // Remove emoji
      const emoji = line.match(/### ([^\s]*)/)?.[1] || ''
      
      // Look ahead for description
      let description = ''
      if (i + 1 < lines.length && !lines[i + 1].startsWith('#') && lines[i + 1].trim()) {
        description = lines[i + 1].trim()
        i++ // Skip next line
      }
      
      gridItems.push({
        icon: getIconFromEmoji(emoji),
        iconColor: getColorFromContext(title),
        title: title,
        description: description
      })
      continue
    }

    // Handle headings
    if (line.startsWith('## ')) {
      flushParagraphs()
      const title = line.replace('## ', '')
      currentSection = {
        id: `heading-${sections.length}`,
        title: title,
        type: 'text'
      }
      continue
    }

    // Handle regular content
    if (line.trim() && !line.startsWith('#') && !inGrid) {
      if (currentSection.title) {
        // We have a heading, this is content for that section
        currentParagraphs.push(line.trim())
      } else {
        // No heading, just add as paragraph
        currentParagraphs.push(line.trim())
      }
    } else if (!line.trim() && currentParagraphs.length > 0) {
      // Empty line, flush current paragraphs if we have a heading
      if (currentSection.title) {
        sections.push({
          ...currentSection,
          content: {
            paragraphs: currentParagraphs.filter(p => p.trim())
          }
        } as WikiSection)
        currentSection = {}
        currentParagraphs = []
      }
    }
  }

  // Flush any remaining content
  flushParagraphs()
  flushGrid()

  return sections
}

function getIconFromEmoji(emoji: string): string {
  const iconMap: Record<string, string> = {
    '🛡️': 'Shield',
    '🗄️': 'Database', 
    '📷': 'Camera',
    '📊': 'BarChart',
    '👥': 'Users',
    '🌐': 'Globe',
    '💜': 'Heart',
    '⚙️': 'Settings',
    '💻': 'Code'
  }
  return iconMap[emoji] || 'Circle'
}

function getColorFromContext(title: string): string {
  if (title.toLowerCase().includes('consent') || title.toLowerCase().includes('photographer')) return 'blue'
  if (title.toLowerCase().includes('management') || title.toLowerCase().includes('developer')) return 'green'
  if (title.toLowerCase().includes('capture') || title.toLowerCase().includes('storyteller')) return 'purple'
  if (title.toLowerCase().includes('analytics') || title.toLowerCase().includes('administrator')) return 'orange'
  return 'blue'
}