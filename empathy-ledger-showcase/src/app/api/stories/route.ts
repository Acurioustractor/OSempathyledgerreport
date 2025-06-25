import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs/promises'
import path from 'path'

// Cache the stories data in memory for 5 minutes
let cachedData: any = null
let cacheTime = 0
const CACHE_DURATION = 5 * 60 * 1000 // 5 minutes

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    // Check if we have cached data that's still fresh
    if (cachedData && Date.now() - cacheTime < CACHE_DURATION) {
      return NextResponse.json(cachedData, {
        headers: {
          'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
          'X-Cache': 'HIT'
        }
      })
    }

    // Read stories from file system
    const dataPath = path.join(process.cwd(), 'public', 'data', 'stories.json')
    const storiesData = await fs.readFile(dataPath, 'utf-8')
    const stories = JSON.parse(storiesData)

    // Apply filters from query params
    const searchParams = request.nextUrl.searchParams
    const theme = searchParams.get('theme')
    const location = searchParams.get('location')
    const featured = searchParams.get('featured')
    const limit = searchParams.get('limit')

    let filteredStories = stories

    if (theme) {
      filteredStories = filteredStories.filter((story: any) => 
        story.themes?.includes(theme)
      )
    }

    if (location) {
      filteredStories = filteredStories.filter((story: any) => 
        story.location === location
      )
    }

    if (featured === 'true') {
      filteredStories = filteredStories.filter((story: any) => 
        story.featured === true
      )
    }

    if (limit) {
      filteredStories = filteredStories.slice(0, parseInt(limit))
    }

    // Update cache
    cachedData = filteredStories
    cacheTime = Date.now()

    return NextResponse.json(filteredStories, {
      headers: {
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
        'X-Cache': 'MISS'
      }
    })
  } catch (error) {
    console.error('Error fetching stories:', error)
    return NextResponse.json(
      { error: 'Failed to fetch stories' },
      { status: 500 }
    )
  }
}