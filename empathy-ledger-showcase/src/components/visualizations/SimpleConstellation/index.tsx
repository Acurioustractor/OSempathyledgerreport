'use client'

import { useEffect, useRef, useState } from 'react'

interface Storyteller {
  id: string
  name: string
  role: 'volunteer' | 'friend' | 'service-provider'
  themes: string[]
  location: string
  x?: number
  y?: number
}

interface Theme {
  id: string
  name: string
  color: string
  x: number
  y: number
  storytellers: string[]
}

interface SimpleConstellationProps {
  storytellers: Storyteller[]
  className?: string
}

// Role colors
const ROLE_COLORS = {
  volunteer: '#f59e0b', // Warm gold
  friend: '#3b82f6', // Bright blue
  'service-provider': '#10b981' // Emerald green
}

// Theme colors
const THEME_COLORS = [
  '#e11d48', '#db2777', '#9333ea', '#7c3aed', '#6366f1', '#3b82f6',
  '#0ea5e9', '#06b6d4', '#14b8a6', '#10b981', '#84cc16', '#f59e0b',
  '#f97316', '#ef4444'
]

export function SimpleConstellation({ storytellers = [], className = '' }: SimpleConstellationProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [hoveredStoryteller, setHoveredStoryteller] = useState<Storyteller | null>(null)
  const [processedData, setProcessedData] = useState<{
    storytellers: Storyteller[]
    themes: Theme[]
  }>({ storytellers: [], themes: [] })

  // Process data
  useEffect(() => {
    const themeMap = new Map<string, Theme>()
    const processedStorytellers: Storyteller[] = []
    
    // Collect themes
    storytellers.forEach((storyteller) => {
      storyteller.themes.forEach((themeName) => {
        if (!themeMap.has(themeName)) {
          const angle = (themeMap.size / 15) * Math.PI * 2
          const radius = 200 + Math.random() * 100
          themeMap.set(themeName, {
            id: themeName.toLowerCase().replace(/\s+/g, '-'),
            name: themeName,
            color: THEME_COLORS[themeMap.size % THEME_COLORS.length],
            x: Math.cos(angle) * radius + 400,
            y: Math.sin(angle) * radius + 300,
            storytellers: []
          })
        }
        themeMap.get(themeName)!.storytellers.push(storyteller.id)
      })
    })

    // Position storytellers
    storytellers.forEach((storyteller) => {
      let avgX = 0, avgY = 0
      storyteller.themes.forEach((themeName) => {
        const theme = themeMap.get(themeName)!
        avgX += theme.x
        avgY += theme.y
      })
      
      avgX /= storyteller.themes.length
      avgY /= storyteller.themes.length

      // Add randomness
      const x = avgX + (Math.random() - 0.5) * 80
      const y = avgY + (Math.random() - 0.5) * 80

      processedStorytellers.push({
        ...storyteller,
        x,
        y
      })
    })

    setProcessedData({
      storytellers: processedStorytellers,
      themes: Array.from(themeMap.values())
    })
  }, [storytellers])

  // Draw constellation
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Resize canvas
    canvas.width = canvas.offsetWidth
    canvas.height = canvas.offsetHeight

    // Clear canvas
    ctx.fillStyle = '#111827'
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // Draw connections
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)'
    ctx.lineWidth = 1
    processedData.storytellers.forEach((s1, i) => {
      processedData.storytellers.slice(i + 1).forEach((s2) => {
        const sharedThemes = s1.themes.filter(t => s2.themes.includes(t))
        if (sharedThemes.length > 0 && s1.x && s1.y && s2.x && s2.y) {
          ctx.beginPath()
          ctx.moveTo(s1.x, s1.y)
          ctx.lineTo(s2.x, s2.y)
          ctx.stroke()
        }
      })
    })

    // Draw theme labels
    ctx.font = '14px Arial'
    ctx.textAlign = 'center'
    processedData.themes.forEach((theme) => {
      ctx.fillStyle = theme.color + '80' // Semi-transparent
      ctx.fillText(theme.name, theme.x, theme.y - 20)
    })

    // Draw storyteller stars
    processedData.storytellers.forEach((storyteller) => {
      if (!storyteller.x || !storyteller.y) return
      
      // Star glow
      const gradient = ctx.createRadialGradient(storyteller.x, storyteller.y, 0, storyteller.x, storyteller.y, 10)
      gradient.addColorStop(0, ROLE_COLORS[storyteller.role])
      gradient.addColorStop(1, 'transparent')
      ctx.fillStyle = gradient
      ctx.fillRect(storyteller.x - 10, storyteller.y - 10, 20, 20)
      
      // Star center
      ctx.fillStyle = ROLE_COLORS[storyteller.role]
      ctx.beginPath()
      ctx.arc(storyteller.x, storyteller.y, 3, 0, Math.PI * 2)
      ctx.fill()
    })

  }, [processedData])

  // Handle mouse events
  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    const hoveredSt = processedData.storytellers.find(st => {
      if (!st.x || !st.y) return false
      const distance = Math.sqrt((st.x - x) ** 2 + (st.y - y) ** 2)
      return distance < 10
    })

    setHoveredStoryteller(hoveredSt || null)
  }

  return (
    <div className={`relative w-full h-full bg-gray-900 ${className}`}>
      <canvas
        ref={canvasRef}
        className="w-full h-full cursor-crosshair"
        onMouseMove={handleMouseMove}
        onMouseLeave={() => setHoveredStoryteller(null)}
      />

      {/* Legend */}
      <div className="absolute top-4 left-4 bg-black/70 backdrop-blur-sm rounded-lg p-4">
        <h3 className="text-white font-semibold mb-3">Community Constellation</h3>
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-amber-500"></div>
            <span className="text-white text-sm">Volunteers</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-blue-500"></div>
            <span className="text-white text-sm">Friends</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
            <span className="text-white text-sm">Service Providers</span>
          </div>
        </div>
        <p className="text-white/60 text-xs mt-3">
          Lines connect people who share themes
        </p>
      </div>

      {/* Hover info */}
      {hoveredStoryteller && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-white/90 backdrop-blur-sm rounded-lg shadow-lg p-4">
          <h4 className="font-semibold text-gray-900">{hoveredStoryteller.name}</h4>
          <p className="text-sm text-gray-600 capitalize">{hoveredStoryteller.role.replace('-', ' ')}</p>
          <p className="text-sm text-gray-500">{hoveredStoryteller.location}</p>
          <div className="mt-2 flex flex-wrap gap-1">
            {hoveredStoryteller.themes.map((theme) => (
              <span
                key={theme}
                className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded-full"
              >
                {theme}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}