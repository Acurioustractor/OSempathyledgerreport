'use client'

import dynamic from 'next/dynamic'

const StoryConstellation = dynamic(
  () => import('./StoryConstellation').then(mod => mod.StoryConstellation),
  { 
    ssr: false,
    loading: () => (
      <div className="w-full h-full bg-gray-900 flex items-center justify-center">
        <div className="text-white">
          <div className="animate-pulse">Loading constellation...</div>
        </div>
      </div>
    )
  }
)

export default StoryConstellation