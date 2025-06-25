import Link from 'next/link'
import Image from 'next/image'
import { User, MapPin, BookOpen, Quote } from 'lucide-react'
import { Storyteller } from '@/types'

interface StorytellerCardProps {
  storyteller: Storyteller
}

export default function StorytellerCard({ storyteller }: StorytellerCardProps) {
  const initials = storyteller.name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)

  return (
    <Link href={`/storytellers/${storyteller.id}`}>
      <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden cursor-pointer">
      {/* Profile Section */}
      <div className="p-6">
        <div className="flex items-start gap-4">
          {/* Profile Image or Initials */}
          <div className="flex-shrink-0">
            {storyteller.profileImage && typeof storyteller.profileImage === 'string' ? (
              <div className="relative w-16 h-16 rounded-full overflow-hidden">
                <Image
                  src={storyteller.profileImage}
                  alt={storyteller.name}
                  fill
                  className="object-cover"
                  sizes="64px"
                />
              </div>
            ) : (
              <div className="w-16 h-16 rounded-full bg-orange-100 flex items-center justify-center">
                <span className="text-xl font-semibold text-orange-sky">
                  {initials}
                </span>
              </div>
            )}
          </div>

          {/* Name and Role */}
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900">
              {storyteller.name}
            </h3>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <User className="w-4 h-4" />
              <span>{storyteller.role}</span>
            </div>
            {storyteller.location && (
              <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                <MapPin className="w-4 h-4" />
                <span>{storyteller.location}</span>
              </div>
            )}
          </div>
        </div>

        {/* Summary or Quote */}
        {storyteller.summary && (
          <div className="mt-4">
            <p className="text-sm text-gray-700 line-clamp-3">
              {storyteller.summary}
            </p>
          </div>
        )}

        {/* Quotes Preview */}
        {storyteller.quotes && storyteller.quotes.length > 0 && (
          <div className="mt-4 p-3 bg-gray-50 rounded-lg">
            <Quote className="w-4 h-4 text-gray-400 mb-1" />
            <p className="text-sm text-gray-600 italic line-clamp-2">
              "{typeof storyteller.quotes[0] === 'string' ? storyteller.quotes[0] : `Has shared ${storyteller.quotes.length} meaningful insights about their journey with Orange Sky`}"
            </p>
          </div>
        )}

        {/* Stats */}
        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-center gap-4 text-sm">
            {storyteller.storyCount > 0 && (
              <div className="flex items-center gap-1 text-gray-600">
                <BookOpen className="w-4 h-4" />
                <span>{storyteller.storyCount} {storyteller.storyCount === 1 ? 'story' : 'stories'}</span>
              </div>
            )}
            {storyteller.themes && storyteller.themes.length > 0 && (
              <div className="text-gray-600">
                {storyteller.themes.length} themes
              </div>
            )}
          </div>
        </div>

        {/* View Profile Link */}
        <div className="mt-4">
          <div className="text-sm font-medium text-orange-sky">
            View profile →
          </div>
        </div>
      </div>
      </div>
    </Link>
  )
}