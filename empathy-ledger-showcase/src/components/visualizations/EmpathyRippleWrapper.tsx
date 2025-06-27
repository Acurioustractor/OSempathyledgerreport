'use client'

import dynamic from 'next/dynamic'

// Dynamically import the EmpathyRipple component to avoid SSR issues with Three.js
const EmpathyRipple = dynamic(
  () => import('./EmpathyRipple').then(mod => mod.EmpathyRipple),
  { 
    ssr: false,
    loading: () => (
      <div className="w-full h-full flex items-center justify-center bg-gradient-to-b from-gray-900 to-black">
        <div className="text-white text-center">
          <div className="animate-pulse">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-white/20" />
            <p className="text-sm opacity-60">Loading visualization...</p>
          </div>
        </div>
      </div>
    )
  }
)

export default EmpathyRipple