'use client'

import dynamic from 'next/dynamic'

const SimpleConstellation = dynamic(
  () => import('./SimpleConstellation').then(mod => mod.SimpleConstellation),
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

export default SimpleConstellation