import { promises as fs } from 'fs'
import path from 'path'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft, Play, FileText, User, MapPin, Calendar, Tag, Quote, Users, ArrowRight } from 'lucide-react'
import { Story, Storyteller, Theme } from '@/types'

async function getStoryData(id: string) {
  try {
    // Validate input
    if (!id || typeof id !== 'string' || id.trim() === '') {
      console.error('Invalid story ID provided:', id)
      return null
    }

    const [storiesData, storytellersData, themesData, analyticsData] = await Promise.all([
      fs.readFile(path.join(process.cwd(), 'public/data/stories.json'), 'utf8').then(data => JSON.parse(data)),
      fs.readFile(path.join(process.cwd(), 'public/data/storytellers.json'), 'utf8').then(data => JSON.parse(data)),
      fs.readFile(path.join(process.cwd(), 'public/data/themes.json'), 'utf8').then(data => JSON.parse(data)),
      fs.readFile(path.join(process.cwd(), 'public/data/analytics.json'), 'utf8').then(data => JSON.parse(data))
    ])

    // Validate data loaded successfully
    if (!Array.isArray(storiesData) || !Array.isArray(storytellersData) || !Array.isArray(themesData)) {
      console.error('Invalid data format loaded from files')
      return null
    }

    const story = storiesData.find((s: Story) => s.id === id)
    if (!story) {
      console.error('Story not found for ID:', id)
      return null
    }

    // Get related storytellers with safety checks
    const relatedStorytellers = Array.isArray(storytellersData) ? storytellersData.filter((st: Storyteller) => 
      story.storytellerIds && Array.isArray(story.storytellerIds) && story.storytellerIds.includes(st.id)
    ) : []

    // Get related themes with details and safety checks
    const relatedThemes = Array.isArray(themesData) ? themesData.filter((t: Theme) => 
      story.themeIds && Array.isArray(story.themeIds) && story.themeIds.includes(t.id)
    ) : []

    // Get suggested stories (same themes or storytellers) with safety checks
    const suggestedStories = Array.isArray(storiesData) ? storiesData
      .filter((s: Story) => 
        s.id !== id && (
          (Array.isArray(s.themeIds) && Array.isArray(story.themeIds) && s.themeIds.some(themeId => story.themeIds.includes(themeId))) ||
          (Array.isArray(s.storytellerIds) && Array.isArray(story.storytellerIds) && s.storytellerIds.some(stId => story.storytellerIds.includes(stId)))
        )
      )
      .slice(0, 4) : []

    return {
      story,
      relatedStorytellers,
      relatedThemes,
      suggestedStories,
      analytics: analyticsData
    }
  } catch (error) {
    console.error('Error loading story data:', error)
    console.error('Error details:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      storyId: id
    })
    return null
  }
}

export default async function StoryProfilePage({ params }: { params: { id: string } }) {
  try {
    // Validate params
    if (!params || !params.id) {
      console.error('Missing params or params.id')
      notFound()
    }

    const data = await getStoryData(params.id)
    
    if (!data) {
      notFound()
    }

    const { story, relatedStorytellers, relatedThemes, suggestedStories } = data

    // Additional validation
    if (!story || !story.id || !story.title) {
      console.error('Invalid story data structure')
      notFound()
    }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link
            href="/stories"
            className="inline-flex items-center text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Stories
          </Link>
        </div>
      </div>

      {/* Hero Section */}
      <section className="bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            {/* Story Content */}
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-6">
                {story.title}
              </h1>
              
              {/* Metadata */}
              <div className="flex flex-wrap items-center gap-6 text-sm text-gray-600 mb-6">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <time dateTime={story.createdAt || ''}>
                    {story.createdAt ? new Date(story.createdAt).toLocaleDateString('en-AU', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    }) : 'Date unknown'}
                  </time>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  <span>{story.location}</span>
                </div>
                {story.hasVideo && (
                  <div className="flex items-center gap-2 text-orange-sky">
                    <Play className="w-4 h-4" />
                    <span>Video Available</span>
                  </div>
                )}
              </div>

              {/* Story Content */}
              {story.storyCopy && (
                <div className="prose prose-lg max-w-none mb-8">
                  <div className="text-gray-700 leading-relaxed whitespace-pre-line">
                    {story.storyCopy}
                  </div>
                </div>
              )}

              {/* Video Link */}
              {story.hasVideo && story.videoStoryLink && (
                <div className="mb-8">
                  <a
                    href={story.videoStoryLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-6 py-3 bg-orange-sky text-white font-semibold rounded-lg hover:bg-orange-sky-dark transition-colors"
                  >
                    <Play className="w-5 h-5 mr-2" />
                    Watch Video Story
                  </a>
                </div>
              )}
            </div>

            {/* Storyteller Profile */}
            <div className="lg:sticky lg:top-8">
              <div className="bg-gray-50 rounded-xl p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">
                  {story.storytellerNames && Array.isArray(story.storytellerNames) && story.storytellerNames.length > 1 ? 'Storytellers' : 'Storyteller'}
                </h2>
                
                <div className="space-y-6">
                  {relatedStorytellers.map((storyteller) => (
                    <div key={storyteller.id} className="flex items-start gap-4">
                      {/* Profile Image */}
                      <div className="flex-shrink-0">
                        {storyteller.profileImage ? (
                          <div className="relative w-16 h-16 rounded-full overflow-hidden">
                            <Image
                              src={storyteller.profileImage}
                              alt={storyteller.name || 'Storyteller'}
                              fill
                              className="object-cover"
                              sizes="64px"
                            />
                          </div>
                        ) : (
                          <div className="w-16 h-16 rounded-full bg-orange-100 flex items-center justify-center">
                            <span className="text-lg font-semibold text-orange-sky">
                              {storyteller.name ? storyteller.name.split(' ').map(n => n[0] || '').join('').toUpperCase().slice(0, 2) : 'ST'}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Storyteller Info */}
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 mb-1">
                          {storyteller.name}
                        </h3>
                        <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                          <User className="w-4 h-4" />
                          <span className="capitalize">{storyteller.role}</span>
                        </div>
                        {storyteller.location && (
                          <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
                            <MapPin className="w-4 h-4" />
                            <span>{storyteller.location}</span>
                          </div>
                        )}
                        
                        {storyteller.summary && (
                          <p className="text-sm text-gray-700 line-clamp-3 mb-3">
                            {storyteller.summary}
                          </p>
                        )}

                        <Link
                          href={`/storytellers/${storyteller.id}`}
                          className="inline-flex items-center text-sm font-medium text-orange-sky hover:text-orange-sky-dark"
                        >
                          View Full Profile
                          <ArrowRight className="w-4 h-4 ml-1" />
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Themes & Analysis Section */}
      <section className="py-12 bg-white border-t">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Related Themes */}
            <div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center">
                <Tag className="w-6 h-6 mr-3 text-orange-sky" />
                Key Themes
              </h2>
              
              <div className="space-y-4">
                {relatedThemes.map((theme) => (
                  <div key={theme.id} className="bg-gray-50 rounded-lg p-4">
                    <h3 className="font-semibold text-gray-900 mb-2">
                      {theme.name}
                    </h3>
                    {theme.description && (
                      <p className="text-sm text-gray-700">
                        {theme.description}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Story Transcript Preview */}
            {story.storyTranscript && (
              <div>
                <h2 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center">
                  <FileText className="w-6 h-6 mr-3 text-orange-sky" />
                  Story Transcript
                </h2>
                
                <div className="bg-gray-50 rounded-lg p-6">
                  <div className="prose prose-sm max-w-none">
                    <div className="text-gray-700 leading-relaxed whitespace-pre-line line-clamp-12">
                      {story.storyTranscript && typeof story.storyTranscript === 'string' ? story.storyTranscript.slice(0, 800) : ''}
                      {story.storyTranscript && story.storyTranscript.length > 800 && '...'}
                    </div>
                  </div>
                  
                  {story.storyTranscript && story.storyTranscript.length > 800 && (
                    <button className="mt-4 text-sm font-medium text-orange-sky hover:text-orange-sky-dark">
                      Read Full Transcript
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Related Stories Section */}
      {suggestedStories.length > 0 && (
        <section className="py-12 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-8 flex items-center">
              <Users className="w-6 h-6 mr-3 text-orange-sky" />
              Related Stories
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {suggestedStories.map((relatedStory: Story) => (
                <Link key={relatedStory.id} href={`/stories/${relatedStory.id}`}>
                  <article className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden h-full">
                    {/* Image */}
                    {relatedStory.profileImage && (
                      <div className="relative h-48 w-full">
                        <Image
                          src={relatedStory.profileImage}
                          alt={relatedStory.title || 'Story'}
                          fill
                          className="object-cover"
                        />
                        {relatedStory.hasVideo && (
                          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30">
                            <Play className="w-8 h-8 text-white" />
                          </div>
                        )}
                      </div>
                    )}
                    
                    {/* Content */}
                    <div className="p-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                        {relatedStory.title}
                      </h3>
                      
                      <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                        {relatedStory.excerpt}
                      </p>

                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <div className="flex items-center gap-1">
                          <User className="w-3 h-3" />
                          <span>{relatedStory.storytellerNames && Array.isArray(relatedStory.storytellerNames) && relatedStory.storytellerNames.length > 0 ? relatedStory.storytellerNames.join(', ') : 'Unknown'}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          <span>{relatedStory.location}</span>
                        </div>
                      </div>
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  )
  } catch (error) {
    console.error('Error in StoryProfilePage component:', error)
    notFound()
  }
}