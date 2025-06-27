'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Calendar, Users, Video, FileText } from 'lucide-react'
import { Story } from '@/types'
import { useState } from 'react'

interface StoryListProps {
  story: Story
}

export default function StoryList({ story }: StoryListProps) {
  const [imageError, setImageError] = useState(false)
  return (
    <Link href={`/stories/${story.id}`}>
      <article className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 p-6">
        <div className="flex gap-6">
          {/* Thumbnail */}
          <div className="flex-shrink-0">
            {story.image && !imageError ? (
              <div className="relative w-32 h-32 rounded-lg overflow-hidden">
                <Image
                  src={story.image.thumbnails?.small?.url || story.image.url}
                  alt={story.title || 'Story image'}
                  fill
                  className="object-cover"
                  onError={() => setImageError(true)}
                  unoptimized={true}
                />
                {story.hasVideo && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30">
                    <Video className="w-8 h-8 text-white" />
                  </div>
                )}
              </div>
            ) : story.hasVideo ? (
              <div className="w-32 h-32 rounded-lg bg-gradient-to-br from-orange-100 to-orange-50 flex items-center justify-center">
                <Video className="w-12 h-12 text-orange-sky" />
              </div>
            ) : (
              <div className="w-32 h-32 rounded-lg bg-gradient-to-br from-gray-100 to-gray-50 flex items-center justify-center">
                <FileText className="w-12 h-12 text-gray-400" />
              </div>
            )}
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {story.title}
            </h3>
            
            <p className="text-gray-600 mb-3 line-clamp-2">
              {story.excerpt}
            </p>

            {/* Metadata */}
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
              {/* Storytellers */}
              {story.storytellerNames && story.storytellerNames.length > 0 && (
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  <span>{story.storytellerNames.join(', ')}</span>
                </div>
              )}

              {/* Date */}
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <time dateTime={story.createdAt}>
                  {new Date(story.createdAt).toLocaleDateString('en-AU', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric'
                  })}
                </time>
              </div>

              {/* Media indicators */}
              {story.hasVideo && (
                <span className="flex items-center gap-1 text-orange-sky">
                  <Video className="w-4 h-4" />
                  <span>Video Story</span>
                </span>
              )}
              {story.transcript && (
                <span className="flex items-center gap-1">
                  <FileText className="w-4 h-4" />
                  <span>Transcript Available</span>
                </span>
              )}
            </div>
          </div>
        </div>
      </article>
    </Link>
  )
}