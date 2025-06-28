'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Calendar, MapPin, Tag, Video, FileText, Users } from 'lucide-react'
import { Story } from '@/types'
import { useState } from 'react'

interface FeaturedStoriesProps {
  stories: Story[]
}

interface ImageErrorState {
  [key: string]: boolean
}

const FeaturedStories = ({ stories }: FeaturedStoriesProps) => {
  const [imageErrors, setImageErrors] = useState<ImageErrorState>({})
  if (!stories || stories.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">No featured stories available at this time.</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {stories.map((story, index) => (
        <div
          key={story.id}
          className="bg-white rounded-xl shadow-lg overflow-hidden card-hover animate-fade-in"
          style={{ animationDelay: `${index * 0.1}s` }}
        >
          {/* Story Image or Video Preview */}
          {(story.image?.url && !imageErrors[story.id]) ? (
            <div className="relative h-48 w-full">
              <Image
                src={story.image.url}
                alt={story.title || 'Story image'}
                fill
                className="object-cover"
                onError={() => {
                  console.error('Featured story image failed to load:', story.image?.url)
                  setImageErrors(prev => ({ ...prev, [story.id]: true }))
                }}
                unoptimized={true}
              />
              {story.hasVideo && (
                <div className="absolute top-4 right-4">
                  <span className="bg-orange-sky text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
                    <Video className="w-3 h-3" />
                    Video Story
                  </span>
                </div>
              )}
            </div>
          ) : story.hasVideo ? (
            <div className="relative h-48 bg-gradient-to-br from-orange-100 to-orange-50 flex items-center justify-center">
              <Video className="w-16 h-16 text-orange-sky" />
              <div className="absolute top-4 right-4">
                <span className="bg-orange-sky text-white text-xs px-2 py-1 rounded-full">
                  Video Story
                </span>
              </div>
            </div>
          ) : (
            <div className="h-48 bg-gradient-to-br from-gray-100 to-gray-50 flex items-center justify-center">
              <FileText className="w-16 h-16 text-gray-400" />
            </div>
          )}

          {/* Story Content */}
          <div className="p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-3 line-clamp-2">
              {story.title}
            </h3>
            
            {/* Storytellers with profile images */}
            {story.storytellerNames && story.storytellerNames.length > 0 && (
              <div className="flex items-center gap-2 mb-4">
                <Users className="w-4 h-4 text-gray-500" />
                <span className="text-sm text-gray-600">
                  {story.storytellerNames.join(', ')}
                </span>
              </div>
            )}
            
            {/* Story Metadata */}
            <div className="flex flex-wrap gap-3 text-sm text-gray-600 mb-4">
              {story.location && (
                <div className="flex items-center">
                  <MapPin className="w-4 h-4 mr-1" />
                  <span>{story.location}</span>
                </div>
              )}
              <div className="flex items-center">
                <Calendar className="w-4 h-4 mr-1" />
                <span>
                  {new Date(story.createdAt).toLocaleDateString('en-AU', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric'
                  })}
                </span>
              </div>
            </div>

            {/* Story Copy */}
            <p className="text-gray-700 leading-relaxed mb-4 line-clamp-3">
              {story.storyCopy || story.excerpt?.substring(0, 150) + '...'}
            </p>

            {/* Themes */}
            {story.themeNames && story.themeNames.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {story.themeNames.slice(0, 3).map((theme) => (
                  <span
                    key={theme}
                    className="inline-flex items-center px-2 py-1 bg-orange-50 text-orange-700 text-xs font-medium rounded-full"
                  >
                    <Tag className="w-3 h-3 mr-1" />
                    {theme}
                  </span>
                ))}
                {story.themeNames.length > 3 && (
                  <span className="text-xs text-gray-500 px-2 py-1">
                    +{story.themeNames.length - 3} more
                  </span>
                )}
              </div>
            )}

            {/* Media indicators */}
            <div className="flex gap-4 mb-4">
              {story.hasVideo && (
                <span className="flex items-center gap-1 text-orange-sky text-sm">
                  <Video className="w-4 h-4" />
                  <span>Video</span>
                </span>
              )}
              {story.storyTranscript && (
                <span className="flex items-center gap-1 text-gray-500 text-sm">
                  <FileText className="w-4 h-4" />
                  <span>Transcript</span>
                </span>
              )}
            </div>
          </div>

          {/* Story Footer */}
          <div className="px-6 pb-6">
            <Link
              href={`/stories/${story.id}`}
              className="block w-full text-center px-4 py-2 bg-orange-sky text-white font-medium rounded-lg hover:bg-orange-sky-dark transition-colors duration-200"
            >
              Read Full Story
            </Link>
          </div>
        </div>
      ))}
    </div>
  )
}

export default FeaturedStories