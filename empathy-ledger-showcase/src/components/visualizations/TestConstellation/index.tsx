'use client'

import { useEffect, useRef } from 'react'

export function TestConstellation({ className = '' }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  // Test data
  const storytellers = [
    { id: '1', name: 'Sarah Johnson', role: 'volunteer', themes: ['Community', 'Support', 'Hope'], location: 'Brisbane', x: 200, y: 150 },
    { id: '2', name: 'Mike Chen', role: 'friend', themes: ['Connection', 'Journey', 'Support'], location: 'Sydney', x: 400, y: 200 },
    { id: '3', name: 'Emma Wilson', role: 'service-provider', themes: ['Dignity', 'Service', 'Community'], location: 'Melbourne', x: 300, y: 300 },
    { id: '4', name: 'James Smith', role: 'volunteer', themes: ['Hope', 'Growth', 'Connection'], location: 'Perth', x: 500, y: 250 },
    { id: '5', name: 'Lisa Brown', role: 'friend', themes: ['Friendship', 'Support', 'Journey'], location: 'Adelaide', x: 250, y: 400 },
  ]

  const roleColors = {
    volunteer: '#f59e0b',
    friend: '#3b82f6',
    'service-provider': '#10b981'
  }

  const themes = [
    { name: 'Community', x: 300, y: 100, color: '#e11d48' },
    { name: 'Support', x: 200, y: 300, color: '#db2777' },
    { name: 'Connection', x: 450, y: 150, color: '#9333ea' },
    { name: 'Hope', x: 350, y: 250, color: '#7c3aed' },
    { name: 'Journey', x: 400, y: 350, color: '#6366f1' },
  ]

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Set canvas size to match display size
    const resizeCanvas = () => {
      const rect = canvas.getBoundingClientRect()
      canvas.width = rect.width * window.devicePixelRatio
      canvas.height = rect.height * window.devicePixelRatio
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio)
      draw()
    }

    window.addEventListener('resize', resizeCanvas)
    resizeCanvas()

    // Animation loop
    function draw() {
      const displayWidth = canvas.width / window.devicePixelRatio
      const displayHeight = canvas.height / window.devicePixelRatio
      
      // Clear canvas
      ctx.fillStyle = '#0f172a'
      ctx.fillRect(0, 0, displayWidth, displayHeight)

      // Draw background stars
      ctx.fillStyle = 'rgba(255, 255, 255, 0.3)'
      for (let i = 0; i < 100; i++) {
        const x = Math.random() * displayWidth
        const y = Math.random() * displayHeight
        ctx.beginPath()
        ctx.arc(x, y, Math.random() * 2, 0, Math.PI * 2)
        ctx.fill()
      }

      // Scale positions to canvas size
      const scaleX = displayWidth / 600
      const scaleY = displayHeight / 500

      // Draw connections
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)'
      ctx.lineWidth = 1
      storytellers.forEach((s1, i) => {
        storytellers.slice(i + 1).forEach((s2) => {
          const sharedThemes = s1.themes.filter(t => s2.themes.includes(t))
          if (sharedThemes.length > 0) {
            ctx.beginPath()
            ctx.moveTo(s1.x * scaleX, s1.y * scaleY)
            ctx.lineTo(s2.x * scaleX, s2.y * scaleY)
            ctx.stroke()
          }
        })
      })

      // Draw theme labels
      ctx.font = 'bold 16px Arial'
      ctx.textAlign = 'center'
      themes.forEach((theme) => {
        ctx.fillStyle = theme.color + 'DD'
        ctx.fillText(theme.name, theme.x * scaleX, theme.y * scaleY)
      })

      // Draw storytellers
      storytellers.forEach((storyteller) => {
        const x = storyteller.x * scaleX
        const y = storyteller.y * scaleY
        const color = roleColors[storyteller.role as keyof typeof roleColors]
        
        // Glow effect
        const gradient = ctx.createRadialGradient(x, y, 0, x, y, 20)
        gradient.addColorStop(0, color + 'FF')
        gradient.addColorStop(0.5, color + '40')
        gradient.addColorStop(1, 'transparent')
        ctx.fillStyle = gradient
        ctx.beginPath()
        ctx.arc(x, y, 20, 0, Math.PI * 2)
        ctx.fill()
        
        // Star center
        ctx.fillStyle = color
        ctx.beginPath()
        ctx.arc(x, y, 4, 0, Math.PI * 2)
        ctx.fill()
        
        // Name label
        ctx.fillStyle = 'white'
        ctx.font = '12px Arial'
        ctx.fillText(storyteller.name, x, y + 30)
      })
    }

    return () => {
      window.removeEventListener('resize', resizeCanvas)
    }
  }, [])

  return (
    <div className={`relative w-full h-full ${className}`}>
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
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
      </div>
    </div>
  )
}