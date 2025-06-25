import { NextRequest } from 'next/server'
import path from 'path'
import fs from 'fs'

export async function POST(req: NextRequest, { params }: { params: { slug: string } }) {
  const { slug } = params
  if (slug !== 'introduction') {
    return new Response('Only introduction is editable in this demo.', { status: 400 })
  }
  try {
    const body = await req.json()
    const { content } = body
    if (!content) return new Response('Missing content', { status: 400 })
    // Validate JSON
    let parsed
    try {
      parsed = JSON.parse(content)
    } catch (e) {
      return new Response('Invalid JSON', { status: 400 })
    }
    // Write to file as a TypeScript export
    const filePath = path.join(process.cwd(), 'src', 'data', 'docs', `${slug}.ts`)
    const fileContent = `import { WikiSection } from '@/data/wiki-content'

export const ${slug}Content: WikiSection[] = ${JSON.stringify(parsed, null, 2)}
`
    fs.writeFileSync(filePath, fileContent, 'utf8')
    return new Response('OK', { status: 200 })
  } catch (e: any) {
    return new Response('Error: ' + e.message, { status: 500 })
  }
} 