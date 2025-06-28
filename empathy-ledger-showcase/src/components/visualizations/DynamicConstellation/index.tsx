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

// Theme groups for better visualization and analysis
const THEME_GROUPS = {
  'Volunteering & Service': {
    keywords: ['Volunteering', 'Volunteer', 'Community Service', 'Community Engagement', 'Volunteerism', 'Orange Sky'],
    color: '#FF6347' // Orange-red
  },
  'Personal Journey': {
    keywords: ['Personal Background', 'Personal', 'Introduction', 'Career', 'Transformation', 'Life'],
    color: '#7B68EE' // Medium slate blue
  },
  'Community & Connection': {
    keywords: ['Community', 'Friendship', 'Connection', 'Relationships', 'Social'],
    color: '#32CD32' // Lime green
  },
  'Social Issues': {
    keywords: ['Homelessness', 'Struggles', 'Assistance', 'Support Services', 'Crisis'],
    color: '#FF1493' // Deep pink
  },
  'Faith & Values': {
    keywords: ['Faith', 'Spirituality', 'Values', 'Compassion', 'Giving'],
    color: '#FFD700' // Gold
  },
  'Work & Retirement': {
    keywords: ['Profession', 'Work', 'Employment', 'Retirement', 'Career'],
    color: '#00CED1' // Dark turquoise
  },
  'Youth & Education': {
    keywords: ['Youth', 'Education', 'Learning', 'Development'],
    color: '#9370DB' // Medium purple
  },
  'COVID Impact': {
    keywords: ['COVID', 'Pandemic', 'Impact'],
    color: '#DC143C' // Crimson
  }
}

// Function to categorize a theme into a group
function categorizeTheme(themeName: string): { group: string, color: string } {
  const theme = themeName.toLowerCase()
  
  for (const [groupName, groupData] of Object.entries(THEME_GROUPS)) {
    if (groupData.keywords.some(keyword => theme.includes(keyword.toLowerCase()))) {
      return { group: groupName, color: groupData.color }
    }
  }
  
  // Default group for uncategorized themes
  return { group: 'Other', color: '#20B2AA' } // Light sea green
}

// Utility: Convert hex color to rgba string
function hexToRgba(hex: string, alpha: number): string {
  // Remove # if present
  hex = hex.replace('#', '')
  // Support short hex
  if (hex.length === 3) {
    hex = hex.split('').map(x => x + x).join('')
  }
  const r = parseInt(hex.substring(0, 2), 16)
  const g = parseInt(hex.substring(2, 4), 16)
  const b = parseInt(hex.substring(4, 6), 16)
  return `rgba(${r}, ${g}, ${b}, ${alpha})`
}

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

  console.log('DynamicConstellation received storytellers:', storytellers.length)

  // Initialize nodes and themes
  useEffect(() => {
    if (storytellers.length === 0) {
      console.log('No storytellers received')
      return
    }

    // Create theme group map instead of individual themes
    const themeGroupMap = new Map<string, { count: number, storytellers: Set<string>, themes: Set<string> }>()
    
    storytellers.forEach(st => {
      st.themes?.forEach(theme => {
        const { group, color } = categorizeTheme(theme)
        
        if (!themeGroupMap.has(group)) {
          themeGroupMap.set(group, { count: 0, storytellers: new Set(), themes: new Set() })
        }
        const data = themeGroupMap.get(group)!
        data.count++
        data.storytellers.add(st.id)
        data.themes.add(theme)
      })
    })

    // Create theme group positions in a spiral pattern
    const themeArray = Array.from(themeGroupMap.entries())
      .sort((a, b) => b[1].count - a[1].count)

    const centerX = 400
    const centerY = 300
    
    // Spiral layout for theme groups with larger spacing
    const processedThemes = themeArray.map(([ groupName, data ], i) => {
      const spiralRadius = 120 + (i * 80) // Larger spacing between groups
      const angle = (i * 1.2) // More spread out spiral
      const x = centerX + Math.cos(angle) * spiralRadius
      const y = centerY + Math.sin(angle) * spiralRadius
      
      const { color } = categorizeTheme(Array.from(data.themes)[0]) // Get color from first theme in group
      
      return {
        id: groupName.toLowerCase().replace(/\s+/g, '-'),
        name: groupName,
        x: Math.max(80, Math.min(720, x)), // Keep within bounds with more margin
        y: Math.max(80, Math.min(520, y)),
        count: data.count,
        color: color,
        themeCount: data.themes.size
      }
    })

    // Create nodes with physics
    const processedNodes = storytellers.map((st, i) => {
      // Position near themes they belong to
      let x = Math.random() * 800
      let y = Math.random() * 600
      
      if (st.themes && st.themes.length > 0) {
        // Find theme groups this storyteller belongs to
        const storytellerGroups = st.themes.map(theme => categorizeTheme(theme).group)
        const uniqueGroups = Array.from(new Set(storytellerGroups))
        
        const relevantThemes = processedThemes.filter(t => 
          uniqueGroups.includes(t.name)
        )
        
        if (relevantThemes.length > 0) {
          x = relevantThemes.reduce((sum, t) => sum + t.x, 0) / relevantThemes.length
          y = relevantThemes.reduce((sum, t) => sum + t.y, 0) / relevantThemes.length
          // Add some randomness but keep closer to theme groups
          x += (Math.random() - 0.5) * 60
          y += (Math.random() - 0.5) * 60
        }
      }

      return {
        id: st.id,
        x,
        y,
        vx: 0,
        vy: 0,
        role: (st.role === 'volunteer' ? 'volunteer' : 
              st.role === 'service provider' ? 'service-provider' : 'friend') as 'volunteer' | 'friend' | 'service-provider',
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

        // Attraction to theme group centers
        if (selectedTheme) {
          // Find if this node belongs to the selected theme group
          const nodeGroups = node.themes.map(theme => categorizeTheme(theme).group)
          if (nodeGroups.includes(selectedTheme)) {
            const theme = themes.find(t => t.name === selectedTheme)
            if (theme) {
              const dx = theme.x - node.x
              const dy = theme.y - node.y
              fx += dx * 0.01
              fy += dy * 0.01
            }
          }
        } else {
          // Gentle attraction to relevant theme groups
          const nodeGroups = node.themes.map(theme => categorizeTheme(theme).group)
          const uniqueGroups = Array.from(new Set(nodeGroups))
          
          uniqueGroups.forEach(groupName => {
            const theme = themes.find(t => t.name === groupName)
            if (theme) {
              const dx = theme.x - node.x
              const dy = theme.y - node.y
              fx += dx * 0.0005
              fy += dy * 0.0005
            }
          })
          
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

      // Draw theme areas (galaxies) with shared relationship intensity
      themes.forEach(theme => {
        const x = theme.x * scaleX
        const y = theme.y * scaleY
        
        // Calculate how many roles this theme group appears in
        const roleGroups: Record<string, Set<string>> = {
          volunteer: new Set(),
          friend: new Set(),
          'service-provider': new Set()
        }
        
        nodes.forEach(node => {
          node.themes.forEach(t => {
            const { group } = categorizeTheme(t)
            if (group === theme.name) {
              roleGroups[node.role].add(group)
            }
          })
        })
        
        const roleCount = [roleGroups.volunteer.has(theme.name), roleGroups.friend.has(theme.name), roleGroups['service-provider'].has(theme.name)].filter(Boolean).length
        
        // Intensity based on how shared the theme group is
        const baseIntensity = Math.min(roleCount * 0.15, 0.4) // More intense if shared across more roles
        const selectedIntensity = selectedTheme === theme.name ? 0.6 : baseIntensity
        
        // Larger radius for more shared themes
        const radius = 30 + (roleCount * 15)
        
        // Enhanced glow for shared themes
        const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius)
        gradient.addColorStop(0, hexToRgba(theme.color, selectedIntensity))
        gradient.addColorStop(0.5, hexToRgba(theme.color, selectedIntensity * 0.5))
        gradient.addColorStop(1, 'transparent')
        ctx.fillStyle = gradient
        ctx.beginPath()
        ctx.arc(x, y, radius, 0, Math.PI * 2)
        ctx.fill()
        
        // Add pulse effect for highly shared themes
        if (roleCount >= 2) {
          const pulseRadius = radius + Math.sin(Date.now() * 0.003) * 10
          const pulseGradient = ctx.createRadialGradient(x, y, radius * 0.8, x, y, pulseRadius)
          pulseGradient.addColorStop(0, 'transparent')
          pulseGradient.addColorStop(1, hexToRgba(theme.color, 0.125)) // 0.125 ~ 20/255
          ctx.fillStyle = pulseGradient
          ctx.beginPath()
          ctx.arc(x, y, pulseRadius, 0, Math.PI * 2)
          ctx.fill()
        }
      })

      // Draw connections based on shared theme groups
      nodes.forEach((node, i) => {
        nodes.slice(i + 1).forEach(other => {
          // Get theme groups for each node
          const nodeGroups = node.themes.map(theme => categorizeTheme(theme).group)
          const otherGroups = other.themes.map(theme => categorizeTheme(theme).group)
          
          // Find shared groups
          const sharedGroups = nodeGroups.filter(group => otherGroups.includes(group))
          
          if (sharedGroups.length > 0) {
            // Use the color of the most prominent shared group
            const primaryGroup = sharedGroups[0]
            const groupColor = categorizeTheme(node.themes.find(t => categorizeTheme(t).group === primaryGroup) || '').color
            
            const opacity = selectedTheme 
              ? (sharedGroups.includes(selectedTheme) ? 0.8 : 0.1)
              : Math.min(0.3 * sharedGroups.length, 0.7)
            
            // Convert hex color to RGB for opacity
            const hex = groupColor.replace('#', '')
            const r = parseInt(hex.substr(0, 2), 16)
            const g = parseInt(hex.substr(2, 2), 16)
            const b = parseInt(hex.substr(4, 2), 16)
            
            ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, ${opacity})`
            ctx.lineWidth = Math.min(sharedGroups.length * 1.5, 4)
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
        // Check if node belongs to selected theme group
        const nodeGroups = node.themes.map(theme => categorizeTheme(theme).group)
        const isHighlighted = !selectedTheme || nodeGroups.includes(selectedTheme)
        const size = hoveredNode?.id === node.id ? 8 : 5
        
        // Calculate connection intensity for this node
        const connectionCount = nodes.filter(other => {
          if (other.id === node.id) return false
          const otherGroups = other.themes.map(theme => categorizeTheme(theme).group)
          return nodeGroups.some(group => otherGroups.includes(group))
        }).length
        
        // Enhanced glow based on connections and role
        const connectionIntensity = Math.min(connectionCount * 0.1, 0.8)
        const glowSize = size * (3 + connectionIntensity * 2)
        
        // Star glow
        const gradient = ctx.createRadialGradient(x, y, 0, x, y, glowSize)
        const color = ROLE_COLORS[node.role]
        const baseOpacity = isHighlighted ? 0.5 : 0.25 // 0.5 ~ 80/255, 0.25 ~ 40/255
        const glowOpacity = isHighlighted ? (0.8 + connectionIntensity * 0.4) : 0.125 // 0.125 ~ 20/255
        gradient.addColorStop(0, hexToRgba(color, glowOpacity))
        gradient.addColorStop(0.4, hexToRgba(color, baseOpacity))
        gradient.addColorStop(1, 'transparent')
        ctx.fillStyle = gradient
        ctx.beginPath()
        ctx.arc(x, y, glowSize, 0, Math.PI * 2)
        ctx.fill()

        // Star core with connection-based sizing
        const coreSize = size + (connectionIntensity * 2)
        ctx.fillStyle = isHighlighted ? color : hexToRgba(color, 0.375) // 0.375 ~ 60/255
        ctx.beginPath()
        ctx.arc(x, y, coreSize, 0, Math.PI * 2)
        ctx.fill()
        
        // Add subtle ring for highly connected nodes
        if (connectionCount > 3) {
          ctx.strokeStyle = hexToRgba(color, 0.375) // 0.375 ~ 60/255
          ctx.lineWidth = 1
          ctx.beginPath()
          ctx.arc(x, y, coreSize + 3, 0, Math.PI * 2)
          ctx.stroke()
        }
      })

      // Draw hover info
      if (hoveredNode && !isDragging) {
        const x = hoveredNode.x * scaleX
        const y = hoveredNode.y * scaleY
        
        // Calculate box dimensions based on content
        ctx.font = 'bold 14px Arial'
        const roleText = hoveredNode.role === 'service-provider' ? 'Service Provider' : 
                         hoveredNode.role.charAt(0).toUpperCase() + hoveredNode.role.slice(1)
        const roleWidth = ctx.measureText(roleText).width
        
        ctx.font = '11px Arial'
        // Show theme groups instead of individual themes
        const nodeGroups = hoveredNode.themes.map(theme => categorizeTheme(theme).group)
        const uniqueGroups = Array.from(new Set(nodeGroups)).slice(0, 2)
        const maxThemeWidth = Math.max(...uniqueGroups.map(g => ctx.measureText(g).width))
        
        const padding = 15
        const boxWidth = Math.max(roleWidth, maxThemeWidth) + padding * 2
        const lineHeight = 18
        const totalGroups = Array.from(new Set(hoveredNode.themes.map(theme => categorizeTheme(theme).group))).length
        const boxHeight = padding * 2 + lineHeight * (1 + Math.min(uniqueGroups.length, 2) + (totalGroups > 2 ? 1 : 0))
        
        // Position box above node
        const boxX = x - boxWidth / 2
        const boxY = y - boxHeight - 30
        
        // Background
        ctx.fillStyle = 'rgba(10, 10, 10, 0.9)'
        ctx.strokeStyle = ROLE_COLORS[hoveredNode.role]
        ctx.lineWidth = 2
        ctx.beginPath()
        ctx.roundRect(boxX, boxY, boxWidth, boxHeight, 8)
        ctx.fill()
        ctx.stroke()

        // Text
        ctx.fillStyle = 'white'
        ctx.font = 'bold 14px Arial'
        ctx.textAlign = 'center'
        ctx.fillText(roleText, x, boxY + padding + 14)
        
        ctx.font = '11px Arial'
        ctx.fillStyle = '#ddd'
        uniqueGroups.forEach((group, i) => {
          ctx.fillText(group, x, boxY + padding + 14 + (i + 1) * lineHeight)
        })
        
        if (totalGroups > 2) {
          ctx.fillStyle = '#999'
          ctx.fillText(`+${totalGroups - 2} more groups`, x, boxY + padding + 14 + 3 * lineHeight)
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

  // Calculate crossover metrics - theme groups shared between at least 2 roles
  const calculateCrossover = () => {
    const roleGroups: Record<string, Set<string>> = {
      volunteer: new Set(),
      friend: new Set(),
      'service-provider': new Set()
    }
    
    nodes.forEach(node => {
      node.themes.forEach(theme => {
        const { group } = categorizeTheme(theme)
        roleGroups[node.role].add(group)
      })
    })
    
    // Get all unique theme groups
    const allGroups = new Set([
      ...Array.from(roleGroups.volunteer),
      ...Array.from(roleGroups.friend),
      ...Array.from(roleGroups['service-provider'])
    ])
    
    // Count theme groups that appear in at least 2 roles
    let sharedGroups = 0
    allGroups.forEach(group => {
      let roleCount = 0
      if (roleGroups.volunteer.has(group)) roleCount++
      if (roleGroups.friend.has(group)) roleCount++
      if (roleGroups['service-provider'].has(group)) roleCount++
      
      if (roleCount >= 2) {
        sharedGroups++
      }
    })
    
    return sharedGroups
  }

  // Get unique locations count from storytellers prop
  const uniqueLocations = new Set(storytellers.map(st => st.location).filter(Boolean)).size

  return (
    <div className={`relative w-full h-full ${className}`}>
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full cursor-move z-0"
        onMouseMove={handleMouseMove}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseLeave={() => {
          setHoveredNode(null)
          handleMouseUp()
        }}
      />

      {/* Legend */}
      <div className="absolute top-4 left-4 bg-black/80 backdrop-blur-sm rounded-lg p-3 z-10">
        <h3 className="text-white font-bold mb-2">Community Constellation</h3>
        <div className="flex gap-4 text-xs">
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: ROLE_COLORS.volunteer }}></div>
            <span className="text-white/70">Volunteers</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: ROLE_COLORS.friend }}></div>
            <span className="text-white/70">Friends</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: ROLE_COLORS['service-provider'] }}></div>
            <span className="text-white/70">Service Providers</span>
          </div>
        </div>
      </div>

      {/* Metrics Bar */}
      <div className="absolute bottom-0 left-0 right-0 bg-black/90 backdrop-blur-sm border-t border-white/10 z-20">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="grid grid-cols-5 gap-6 text-center">
            <div>
              <div className="text-2xl font-bold text-white">{nodes.length}</div>
              <div className="text-xs text-white/60">Storytellers</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-white">{themes.length}</div>
              <div className="text-xs text-white/60">Unique Themes</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-white">590</div>
              <div className="text-xs text-white/60">Total Quotes</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-white">{uniqueLocations}</div>
              <div className="text-xs text-white/60">Locations</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-white">{calculateCrossover()}</div>
              <div className="text-xs text-white/60">Shared Groups</div>
              <div className="text-xs text-white/40 mt-1">across roles</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}