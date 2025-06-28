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

const defaultMarkdownContent = `# Wiki Content Guide

> This page demonstrates all the different content types you can use in the wiki. Simply copy these examples to add your own content!

## Text Content

This is a simple text section. You can add multiple paragraphs easily.

Each paragraph is automatically styled with proper spacing and typography. This makes it easy to write long-form content without worrying about formatting.

## Video Content

Videos can be embedded using iframe markdown:

\`\`\`html
<iframe src="https://www.youtube.com/embed/dQw4w9WgXcQ" width="560" height="315" frameborder="0" allowfullscreen></iframe>
\`\`\`

## Callout Boxes

You can create callout boxes using blockquotes:

> **Important:** This is an important callout - great for warnings or important notes!

> **Tip:** This is a helpful tip for users.

> **Note:** This is a general note or additional information.

## Lists

### Unordered Lists
- First item
- Second item
  - Nested item
  - Another nested item
- Third item

### Ordered Lists
1. First step
2. Second step
   1. Sub-step A
   2. Sub-step B
3. Third step

### Task Lists
- [x] Completed task
- [ ] Incomplete task
- [ ] Another task to do

## Code Blocks

### Inline Code
Use \`backticks\` for inline code snippets.

### Code Blocks with Syntax Highlighting

\`\`\`javascript
// JavaScript example
function greet(name) {
  console.log(\`Hello, \${name}!\`);
}

greet('World');
\`\`\`

\`\`\`python
# Python example
def greet(name):
    print(f"Hello, {name}!")

greet("World")
\`\`\`

## Tables

| Feature | Description | Status |
|---------|-------------|--------|
| Markdown Support | Full markdown editing | ✅ Complete |
| Live Preview | See changes as you type | ✅ Complete |
| Local Storage | Auto-save your work | ✅ Complete |
| Export | Export to various formats | ⏳ Coming Soon |

## Images

You can embed images using standard markdown syntax:

\`![Alt text](https://via.placeholder.com/600x400)\`

## Links

- [Internal Link](/wiki/overview)
- [External Link](https://example.com)
- [Link with Title](https://example.com "Visit Example")

## Horizontal Rules

Use three dashes, asterisks, or underscores:

---

## Block Quotes

> This is a blockquote. It can contain multiple paragraphs.
>
> It's great for highlighting important information or quotes from other sources.

## Advanced Formatting

### Definition Lists

Term 1
: Definition for term 1

Term 2
: Definition for term 2
: Another definition for term 2

### Footnotes

Here's a sentence with a footnote[^1].

[^1]: This is the footnote text.

### Abbreviations

The HTML specification is maintained by the W3C.

*[HTML]: HyperText Markup Language
*[W3C]: World Wide Web Consortium

## Best Practices

1. **Keep it Simple**: Use clear, concise language
2. **Structure Content**: Use headings to organize information
3. **Visual Hierarchy**: Use formatting to guide readers
4. **Accessibility**: Include alt text for images
5. **Consistency**: Maintain consistent formatting throughout

## Tips for Wiki Editors

- **Save Often**: Your work is automatically saved to browser storage
- **Preview Mode**: Toggle between edit and preview to see how content will appear
- **Markdown Reference**: Keep this guide handy for markdown syntax
- **Version History**: Currently stored locally - consider backing up important changes

## Need Help?

If you need help with markdown syntax or wiki editing:

1. Refer to this guide
2. Check the [Markdown Guide](https://www.markdownguide.org/)
3. Contact the administrator for assistance
`;

export default function ContentGuidePage() {
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
      const savedContent = localStorage.getItem('wiki-content-content-guide')
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
      localStorage.setItem('wiki-content-content-guide', JSON.stringify({
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
      <WikiLayout currentSlug="content-guide" pageTitle="Content Guide">
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-500">Loading...</div>
        </div>
      </WikiLayout>
    )
  }

  return (
    <WikiLayout currentSlug="content-guide" pageTitle="Content Guide">
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
              <MDPreview source={content} />
            </div>
          )}
        </div>
      </div>
    </WikiLayout>
  )
}