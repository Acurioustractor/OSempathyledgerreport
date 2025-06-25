import { NextRequest, NextResponse } from 'next/server'
import { readFileSync, existsSync } from 'fs'
import { join } from 'path'
import matter from 'gray-matter'

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params
    
    // Check for markdown file first
    const markdownPath = join(process.cwd(), 'content', 'docs', `${slug}.md`)
    
    if (existsSync(markdownPath)) {
      // Load from markdown file
      const fileContent = readFileSync(markdownPath, 'utf8')
      const { data: frontmatter, content } = matter(fileContent)
      
      return NextResponse.json({
        title: frontmatter.title || slug,
        content,
        source: 'markdown',
        lastModified: frontmatter.lastModified
      })
    }
    
    // Fallback: convert from existing JSON structure if available
    try {
      const { introductionContent } = await import(`@/data/docs/${slug}`)
      
      // Convert JSON to markdown (basic conversion)
      let markdownContent = `# ${slug.charAt(0).toUpperCase() + slug.slice(1)}\n\n`
      
      for (const section of introductionContent) {
        if (section.title) {
          markdownContent += `## ${section.title}\n\n`
        }
        
        if (section.type === 'text' && section.content.paragraphs) {
          markdownContent += section.content.paragraphs.join('\n\n') + '\n\n'
        } else if (section.type === 'callout') {
          const variant = section.content.variant || 'info'
          markdownContent += `:::${variant}[${section.content.title}]\n${section.content.text}\n:::\n\n`
        }
      }
      
      return NextResponse.json({
        title: slug.charAt(0).toUpperCase() + slug.slice(1),
        content: markdownContent,
        source: 'converted-from-json'
      })
    } catch (importError) {
      return NextResponse.json({
        title: slug.charAt(0).toUpperCase() + slug.slice(1),
        content: `# ${slug.charAt(0).toUpperCase() + slug.slice(1)}\n\nStart writing your documentation here...`,
        source: 'template'
      })
    }
  } catch (error) {
    console.error('Error loading markdown:', error)
    return NextResponse.json(
      { error: 'Failed to load document' },
      { status: 500 }
    )
  }
}