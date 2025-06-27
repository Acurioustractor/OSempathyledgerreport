'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Calendar, Users, Video, FileText } from 'lucide-react'
import { Story } from '@/types'
import { useState } from 'react'

interface StoryCardProps {
  story: Story
}

export default function StoryCard({ story }: StoryCardProps) {
  const [imageError, setImageError] = useState(false)
  return (
    <Link href={`/stories/${story.id}`}>
      <article className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden h-full flex flex-col">
        {/* Image or Video Thumbnail */}
        {(story.image?.url || story.profileImage) && !imageError ? (
          <div className="relative h-48 w-full">
            <Image
              src={story.image?.url || story.profileImage || ''}
              alt={story.title}
              fill
              className="object-cover"
              onError={() => setImageError(true)}
            />
            {story.hasVideo && (
              <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30">
                <Video className="w-12 h-12 text-white" />
              </div>
            )}
          </div>
        ) : story.hasVideo ? (
          <div className="h-48 bg-gradient-to-br from-orange-100 to-orange-50 flex items-center justify-center">
            <Video className="w-16 h-16 text-orange-sky" />
          </div>
        ) : (
          <div className="h-48 bg-gradient-to-br from-gray-100 to-gray-50 flex items-center justify-center">
            <FileText className="w-16 h-16 text-gray-400" />
          </div>
        )}

        {/* Content */}
        <div className="p-6 flex-1 flex flex-col">
          <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
            {story.title}
          </h3>
          
          <p className="text-gray-600 text-sm mb-4 line-clamp-3 flex-1">
            {story.storyCopy || story.excerpt}
          </p>

          {/* Metadata */}
          <div className="space-y-2 text-sm text-gray-500">
            {/* Storytellers */}
            {story.storytellerNames && story.storytellerNames.length > 0 && (
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                <span className="truncate">
                  {story.storytellerNames.join(', ')}
                </span>
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
            <div className="flex gap-4 pt-2">
              {story.hasVideo && (
                <span className="flex items-center gap-1 text-orange-sky">
                  <Video className="w-4 h-4" />
                  <span className="text-xs">Video</span>
                </span>
              )}
              {story.transcript && (
                <span className="flex items-center gap-1 text-gray-500">
                  <FileText className="w-4 h-4" />
                  <span className="text-xs">Transcript</span>
                </span>
              )}
            </div>
          </div>
        </div>
      </article>
    </Link>
  )
}