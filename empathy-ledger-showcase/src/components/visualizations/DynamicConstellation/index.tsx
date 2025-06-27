'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { Storyteller } from '@/types'

interface Node {
  id: string
  x: number
  y: number
  vx: number
  vy: number
  role: 'volunteer' | 'friend' | 'service-provider'
  themes: string[]
  fixed?: boolean
  fx?: number | null
  fy?: number | null
}

interface Theme {
  id: string
  name: string
  x: number
  y: number
  count: number
  color: string
}

interface DynamicConstellationProps {
  storytellers: Storyteller[]
  className?: string
}

// Role colors - more vibrant
const ROLE_COLORS = {
  volunteer: '#FFD700', // Gold
  friend: '#00BFFF', // Deep Sky Blue
  'service-provider': '#32CD32' // Lime Green
}

// Theme colors - galaxy-like
const THEME_COLORS = [
  '#FF1493', '#FF6347', '#FFD700', '#00CED1', '#7B68EE', 
  '#32CD32', '#FF69B4', '#1E90FF', '#FF4500', '#9370DB',
  '#00FA9A', '#DC143C', '#4682B4', '#FFB6C1', '#20B2AA'
]

export function DynamicConstellation({ storytellers = [], className = '' }: DynamicConstellationProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number>()
  const [nodes, setNodes] = useState<Node[]>([])
  const [themes, setThemes] = useState<Theme[]>([])
  const [selectedTheme, setSelectedTheme] = useState<string | null>(null)
  const [hoveredNode, setHoveredNode] = useState<Node | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [draggedNode, setDraggedNode] = useState<Node | null>(null)
  const mouseRef = useRef({ x: 0, y: 0 })

  // Initialize nodes and themes
  useEffect(() => {
    if (storytellers.length === 0) return

    // Create theme map
    const themeMap = new Map<string, { count: number, storytellers: Set<string> }>()
    
    storytellers.forEach(st => {
      st.themes?.forEach(theme => {
        if (!themeMap.has(theme)) {
          themeMap.set(theme, { count: 0, storytellers: new Set() })
        }
        const data = themeMap.get(theme)!
        data.count++
        data.storytellers.add(st.id)
      })
    })

    // Create theme positions in a circle
    const themeArray = Array.from(themeMap.entries())
      .sort((a, b) => b[1].count - a[1].count)
      .slice(0, 20) // Top 20 themes

    const centerX = 400
    const centerY = 300
    const radius = 250

    const processedThemes = themeArray.map(([ name, data ], i) => {
      const angle = (i / themeArray.length) * Math.PI * 2
      return {
        id: name.toLowerCase().replace(/\s+/g, '-'),
        name,
        x: centerX + Math.cos(angle) * radius,
        y: centerY + Math.sin(angle) * radius,
        count: data.count,
        color: THEME_COLORS[i % THEME_COLORS.length]
      }
    })

    // Create nodes with physics
    const processedNodes = storytellers.map((st, i) => {
      // Position near themes they belong to
      let x = Math.random() * 800
      let y = Math.random() * 600
      
      if (st.themes && st.themes.length > 0) {
        const relevantThemes = processedThemes.filter(t => 
          st.themes.includes(t.name)
        )
        if (relevantThemes.length > 0) {
          x = relevantThemes.reduce((sum, t) => sum + t.x, 0) / relevantThemes.length
          y = relevantThemes.reduce((sum, t) => sum + t.y, 0) / relevantThemes.length
          // Add some randomness
          x += (Math.random() - 0.5) * 100
          y += (Math.random() - 0.5) * 100
        }
      }

      return {
        id: st.id,
        x,
        y,
        vx: 0,
        vy: 0,
        role: st.role === 'volunteer' ? 'volunteer' : 
              st.role === 'service provider' ? 'service-provider' : 'friend',
        themes: st.themes || []
      }
    })

    setThemes(processedThemes)
    setNodes(processedNodes)
  }, [storytellers])

  // Physics simulation
  const simulate = useCallback(() => {
    setNodes(prevNodes => {
      const newNodes = [...prevNodes]
      
      // Apply forces
      for (let i = 0; i < newNodes.length; i++) {
        const node = newNodes[i]
        
        if (node.fixed) {
          node.x = node.fx || node.x
          node.y = node.fy || node.y
          continue
        }

        // Reset forces
        let fx = 0
        let fy = 0

        // Repulsion between nodes
        for (let j = 0; j < newNodes.length; j++) {
          if (i === j) continue
          const other = newNodes[j]
          const dx = node.x - other.x
          const dy = node.y - other.y
          const distance = Math.sqrt(dx * dx + dy * dy) || 1
          const force = 30 / (distance * distance)
          fx += (dx / distance) * force
          fy += (dy / distance) * force
        }

        // Attraction to theme centers
        if (selectedTheme) {
          if (node.themes.includes(selectedTheme)) {
            const theme = themes.find(t => t.name === selectedTheme)
            if (theme) {
              const dx = theme.x - node.x
              const dy = theme.y - node.y
              const distance = Math.sqrt(dx * dx + dy * dy)
              fx += dx * 0.01
              fy += dy * 0.01
            }
          }
        } else {
          // Gentle center gravity
          fx += (400 - node.x) * 0.0001
          fy += (300 - node.y) * 0.0001
        }

        // Apply velocity
        node.vx = (node.vx + fx) * 0.9 // Damping
        node.vy = (node.vy + fy) * 0.9
        
        // Update position
        node.x += node.vx
        node.y += node.vy

        // Bounds
        node.x = Math.max(20, Math.min(780, node.x))
        node.y = Math.max(20, Math.min(580, node.y))
      }

      return newNodes
    })
  }, [selectedTheme, themes])

  // Animation loop
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const animate = () => {
      // Resize canvas
      const rect = canvas.getBoundingClientRect()
      if (canvas.width !== rect.width || canvas.height !== rect.height) {
        canvas.width = rect.width
        canvas.height = rect.height
      }

      const scaleX = canvas.width / 800
      const scaleY = canvas.height / 600

      // Clear
      ctx.fillStyle = '#0a0a0a'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Draw starfield
      ctx.fillStyle = 'rgba(255, 255, 255, 0.1)'
      for (let i = 0; i < 200; i++) {
        const x = (Math.sin(i * 1234.5) + 1) * 0.5 * canvas.width
        const y = (Math.cos(i * 5678.9) + 1) * 0.5 * canvas.height
        const size = (Math.sin(i * 91.2) + 1) * 0.5 + 0.5
        ctx.beginPath()
        ctx.arc(x, y, size, 0, Math.PI * 2)
        ctx.fill()
      }

      // Draw theme labels (galaxies)
      themes.forEach(theme => {
        const x = theme.x * scaleX
        const y = theme.y * scaleY
        
        // Galaxy glow
        const gradient = ctx.createRadialGradient(x, y, 0, x, y, 60)
        gradient.addColorStop(0, theme.color + '40')
        gradient.addColorStop(0.5, theme.color + '20')
        gradient.addColorStop(1, 'transparent')
        ctx.fillStyle = gradient
        ctx.beginPath()
        ctx.arc(x, y, 60, 0, Math.PI * 2)
        ctx.fill()

        // Theme name
        ctx.fillStyle = selectedTheme === theme.name ? theme.color : theme.color + '99'
        ctx.font = selectedTheme === theme.name ? 'bold 14px Arial' : '12px Arial'
        ctx.textAlign = 'center'
        ctx.fillText(theme.name, x, y)
        ctx.font = '10px Arial'
        ctx.fillStyle = theme.color + '66'
        ctx.fillText(`(${theme.count})`, x, y + 15)
      })

      // Draw connections
      nodes.forEach((node, i) => {
        nodes.slice(i + 1).forEach(other => {
          const sharedThemes = node.themes.filter(t => other.themes.includes(t))
          if (sharedThemes.length > 0) {
            const opacity = selectedTheme 
              ? (sharedThemes.includes(selectedTheme) ? 0.6 : 0.1)
              : Math.min(0.2 * sharedThemes.length, 0.6)
            
            ctx.strokeStyle = `rgba(255, 255, 255, ${opacity})`
            ctx.lineWidth = Math.min(sharedThemes.length, 3)
            ctx.beginPath()
            ctx.moveTo(node.x * scaleX, node.y * scaleY)
            ctx.lineTo(other.x * scaleX, other.y * scaleY)
            ctx.stroke()
          }
        })
      })

      // Draw nodes (stars)
      nodes.forEach(node => {
        const x = node.x * scaleX
        const y = node.y * scaleY
        const isHighlighted = !selectedTheme || node.themes.includes(selectedTheme)
        const size = hoveredNode?.id === node.id ? 8 : 5
        
        // Star glow
        const gradient = ctx.createRadialGradient(x, y, 0, x, y, size * 3)
        const color = ROLE_COLORS[node.role]
        gradient.addColorStop(0, isHighlighted ? color : color + '40')
        gradient.addColorStop(0.4, isHighlighted ? color + '80' : color + '20')
        gradient.addColorStop(1, 'transparent')
        ctx.fillStyle = gradient
        ctx.beginPath()
        ctx.arc(x, y, size * 3, 0, Math.PI * 2)
        ctx.fill()

        // Star core
        ctx.fillStyle = isHighlighted ? color : color + '60'
        ctx.beginPath()
        ctx.arc(x, y, size, 0, Math.PI * 2)
        ctx.fill()
      })

      // Draw hover info
      if (hoveredNode && !isDragging) {
        const x = hoveredNode.x * scaleX
        const y = hoveredNode.y * scaleY
        
        // Background
        ctx.fillStyle = 'rgba(0, 0, 0, 0.8)'
        ctx.strokeStyle = ROLE_COLORS[hoveredNode.role]
        ctx.lineWidth = 2
        const padding = 10
        const boxWidth = 200
        const boxHeight = 60
        ctx.beginPath()
        ctx.roundRect(x - boxWidth/2, y - boxHeight - 20, boxWidth, boxHeight, 5)
        ctx.fill()
        ctx.stroke()

        // Text
        ctx.fillStyle = 'white'
        ctx.font = 'bold 14px Arial'
        ctx.textAlign = 'center'
        const roleText = hoveredNode.role === 'service-provider' ? 'Service Provider' : 
                         hoveredNode.role.charAt(0).toUpperCase() + hoveredNode.role.slice(1)
        ctx.fillText(roleText, x, y - boxHeight + 5)
        
        ctx.font = '11px Arial'
        ctx.fillStyle = '#ccc'
        const themeText = hoveredNode.themes.slice(0, 3).join(', ')
        ctx.fillText(themeText, x, y - boxHeight + 25)
        if (hoveredNode.themes.length > 3) {
          ctx.fillText(`+${hoveredNode.themes.length - 3} more themes`, x, y - boxHeight + 40)
        }
      }

      simulate()
      animationRef.current = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [nodes, themes, selectedTheme, hoveredNode, isDragging, simulate])

  // Mouse handlers
  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * 800
    const y = ((e.clientY - rect.top) / rect.height) * 600
    
    mouseRef.current = { x, y }

    if (isDragging && draggedNode) {
      setNodes(prevNodes => {
        const newNodes = [...prevNodes]
        const node = newNodes.find(n => n.id === draggedNode.id)
        if (node) {
          node.fx = x
          node.fy = y
          node.fixed = true
        }
        return newNodes
      })
    } else {
      // Find hovered node
      const hovered = nodes.find(node => {
        const dx = node.x - x
        const dy = node.y - y
        return Math.sqrt(dx * dx + dy * dy) < 15
      })
      setHoveredNode(hovered || null)
    }
  }, [nodes, isDragging, draggedNode])

  const handleMouseDown = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    if (hoveredNode) {
      setIsDragging(true)
      setDraggedNode(hoveredNode)
    }
  }, [hoveredNode])

  const handleMouseUp = useCallback(() => {
    if (draggedNode) {
      setNodes(prevNodes => {
        const newNodes = [...prevNodes]
        const node = newNodes.find(n => n.id === draggedNode.id)
        if (node) {
          node.fixed = false
          node.fx = null
          node.fy = null
        }
        return newNodes
      })
    }
    setIsDragging(false)
    setDraggedNode(null)
  }, [draggedNode])

  return (
    <div className={`relative w-full h-full ${className}`}>
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full cursor-move"
        onMouseMove={handleMouseMove}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseLeave={() => {
          setHoveredNode(null)
          handleMouseUp()
        }}
      />

      {/* Interactive Legend */}
      <div className="absolute top-4 left-4 bg-black/80 backdrop-blur-sm rounded-lg p-4 max-w-xs">
        <h3 className="text-white font-bold mb-3 text-lg">Community Constellation</h3>
        
        {/* Roles */}
        <div className="mb-4">
          <h4 className="text-white/80 text-sm mb-2">Stars by Role</h4>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: ROLE_COLORS.volunteer }}></div>
              <span className="text-white/70 text-sm">Volunteers</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: ROLE_COLORS.friend }}></div>
              <span className="text-white/70 text-sm">Friends</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: ROLE_COLORS['service-provider'] }}></div>
              <span className="text-white/70 text-sm">Service Providers</span>
            </div>
          </div>
        </div>

        {/* Theme Filter */}
        <div>
          <h4 className="text-white/80 text-sm mb-2">Filter by Theme</h4>
          <select 
            className="w-full bg-white/10 text-white text-sm rounded px-2 py-1 border border-white/20"
            value={selectedTheme || ''}
            onChange={(e) => setSelectedTheme(e.target.value || null)}
          >
            <option value="">All Themes</option>
            {themes.map(theme => (
              <option key={theme.id} value={theme.name}>
                {theme.name} ({theme.count})
              </option>
            ))}
          </select>
        </div>

        <p className="text-white/50 text-xs mt-3">
          Drag stars to explore • Lines show shared themes
        </p>
      </div>

      {/* Stats */}
      <div className="absolute bottom-4 right-4 bg-black/80 backdrop-blur-sm rounded-lg px-4 py-2">
        <div className="text-white/70 text-sm">
          {nodes.length} storytellers • {themes.length} themes
        </div>
      </div>
    </div>
  )
}