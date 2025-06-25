import { NextRequest, NextResponse } from 'next/server'
import { writeFileSync, existsSync, mkdirSync } from 'fs'
import { join } from 'path'
import matter from 'gray-matter'

export async function POST(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const { title, content, slug } = await request.json()
    
    // Validate input
    if (!title || !content || !slug) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Create content directory if it doesn't exist
    const contentDir = join(process.cwd(), 'content', 'docs')
    if (!existsSync(contentDir)) {
      mkdirSync(contentDir, { recursive: true })
    }

    // Prepare frontmatter
    const frontmatter = {
      title,
      slug,
      lastModified: new Date().toISOString(),
      editedVia: 'markdown-editor'
    }

    // Create markdown file with frontmatter
    const markdownContent = matter.stringify(content, frontmatter)
    
    // Write to file
    const filePath = join(contentDir, `${slug}.md`)
    writeFileSync(filePath, markdownContent, 'utf8')

    return NextResponse.json({ 
      success: true, 
      message: 'Document saved successfully',
      filePath: filePath.replace(process.cwd(), '')
    })
  } catch (error) {
    console.error('Error saving markdown:', error)
    return NextResponse.json(
      { error: 'Failed to save document' },
      { status: 500 }
    )
  }
}