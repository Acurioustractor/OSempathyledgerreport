'use client'

import { useState, useEffect } from 'react'
import { Heart, Users, Sparkles } from 'lucide-react'

interface ThemeNode {
  id: string
  name: string
  category: string
  storytellerCount: number
  quoteCount: number
  x?: number
  y?: number
  roles: {
    volunteers: number
    friends: number
    serviceProviders: number
  }
}

interface ConnectionLine {
  from: { x: number; y: number }
  to: { x: number; y: number }
  strength: number
  role: string
}

interface ThemeConnectionNetworkProps {
  themes?: ThemeNode[]
}

// Default theme data based on analytics
const DEFAULT_THEMES: ThemeNode[] = [
  { 
    id: '1', 
    name: 'Community Engagement', 
    category: 'Connection', 
    storytellerCount: 7, 
    quoteCount: 40,
    roles: { volunteers: 4, friends: 2, serviceProviders: 1 }
  },
  { 
    id: '2', 
    name: 'Volunteering Experience', 
    category: 'Support', 
    storytellerCount: 3, 
    quoteCount: 16,
    roles: { volunteers: 3, friends: 0, serviceProviders: 0 }
  },
  { 
    id: '3', 
    name: 'Human Connection', 
    category: 'Connection', 
    storytellerCount: 5, 
    quoteCount: 28,
    roles: { volunteers: 2, friends: 2, serviceProviders: 1 }
  },
  { 
    id: '4', 
    name: 'Personal Transformation', 
    category: 'Journey', 
    storytellerCount: 2, 
    quoteCount: 18,
    roles: { volunteers: 1, friends: 1, serviceProviders: 0 }
  },
  { 
    id: '5', 
    name: 'Dignity and Respect', 
    category: 'Dignity', 
    storytellerCount: 4, 
    quoteCount: 22,
    roles: { volunteers: 2, friends: 1, serviceProviders: 1 }
  },
  { 
    id: '6', 
    name: 'Hope and Resilience', 
    category: 'Hope', 
    storytellerCount: 3, 
    quoteCount: 19,
    roles: { volunteers: 1, friends: 2, serviceProviders: 0 }
  },
  { 
    id: '7', 
    name: 'Overcoming Challenges', 
    category: 'Challenge', 
    storytellerCount: 4, 
    quoteCount: 24,
    roles: { volunteers: 1, friends: 3, serviceProviders: 0 }
  },
  { 
    id: '8', 
    name: 'Service Impact', 
    category: 'Impact', 
    storytellerCount: 3, 
    quoteCount: 15,
    roles: { volunteers: 2, friends: 0, serviceProviders: 1 }
  }
]

const CATEGORY_COLORS: Record<string, string> = {
  Connection: '#f97316', // orange
  Support: '#3b82f6',    // blue
  Journey: '#8b5cf6',    // purple
  Dignity: '#10b981',    // emerald
  Hope: '#f59e0b',       // amber
  Challenge: '#ef4444',  // red
  Impact: '#6366f1',     // indigo
  Other: '#6b7280'       // gray
}

export default function ThemeConnectionNetwork({ themes = DEFAULT_THEMES }: ThemeConnectionNetworkProps) {
  const [selectedTheme, setSelectedTheme] = useState<ThemeNode | null>(null)
  const [hoveredTheme, setHoveredTheme] = useState<ThemeNode | null>(null)
  const [animatedThemes, setAnimatedThemes] = useState<ThemeNode[]>([])
  const [connections, setConnections] = useState<ConnectionLine[]>([])

  // Role anchor positions
  const roleAnchors = {
    volunteers: { x: 20, y: 50, label: 'Volunteers', count: 51, icon: Heart },
    friends: { x: 80, y: 50, label: 'Friends', count: 30, icon: Users },
    serviceProviders: { x: 50, y: 85, label: 'Service Providers', count: 26, icon: Sparkles }
  }

  // Position themes in a circular pattern around the center
  useEffect(() => {
    const positionedThemes = themes.map((theme, index) => {
      const angle = (index / themes.length) * 2 * Math.PI - Math.PI / 2
      const radius = 25
      const centerX = 50
      const centerY = 50
      
      return {
        ...theme,
        x: centerX + radius * Math.cos(angle),
        y: centerY + radius * Math.sin(angle)
      }
    })

    // Create connections between themes and roles
    const newConnections: ConnectionLine[] = []
    positionedThemes.forEach(theme => {
      // Connect to volunteers if they discuss this theme
      if (theme.roles.volunteers > 0) {
        newConnections.push({
          from: { x: theme.x!, y: theme.y! },
          to: roleAnchors.volunteers,
          strength: theme.roles.volunteers / theme.storytellerCount,
          role: 'volunteers'
        })
      }
      // Connect to friends
      if (theme.roles.friends > 0) {
        newConnections.push({
          from: { x: theme.x!, y: theme.y! },
          to: roleAnchors.friends,
          strength: theme.roles.friends / theme.storytellerCount,
          role: 'friends'
        })
      }
      // Connect to service providers
      if (theme.roles.serviceProviders > 0) {
        newConnections.push({
          from: { x: theme.x!, y: theme.y! },
          to: roleAnchors.serviceProviders,
          strength: theme.roles.serviceProviders / theme.storytellerCount,
          role: 'serviceProviders'
        })
      }
    })

    setAnimatedThemes(positionedThemes)
    setConnections(newConnections)
  }, [themes])

  const currentTheme = hoveredTheme || selectedTheme

  return (
    <div className="w-full h-96 relative bg-gradient-to-br from-orange-50 to-blue-50 rounded-xl overflow-hidden">
      {/* SVG Visualization */}
      <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet">
        {/* Connection lines */}
        <g className="opacity-20">
          {connections.map((connection, index) => (
            <line
              key={index}
              x1={connection.from.x}
              y1={connection.from.y}
              x2={connection.to.x}
              y2={connection.to.y}
              stroke={connection.role === 'volunteers' ? '#f97316' : connection.role === 'friends' ? '#3b82f6' : '#8b5cf6'}
              strokeWidth={connection.strength * 2}
              className={`transition-all duration-300 ${
                currentTheme && connections.find(c => 
                  c.from.x === currentTheme.x && c.from.y === currentTheme.y && c.role === connection.role
                ) ? 'opacity-100' : ''
              }`}
            />
          ))}
        </g>

        {/* Role Anchors */}
        {Object.entries(roleAnchors).map(([role, anchor]) => {
          const Icon = anchor.icon
          const isHighlighted = currentTheme && currentTheme.roles[role as keyof typeof currentTheme.roles] > 0
          
          return (
            <g key={role} className="cursor-pointer">
              <circle
                cx={anchor.x}
                cy={anchor.y}
                r="8"
                fill={role === 'volunteers' ? '#f97316' : role === 'friends' ? '#3b82f6' : '#8b5cf6'}
                className={`transition-all duration-300 ${isHighlighted ? 'opacity-100' : 'opacity-80'}`}
              />
              <text
                x={anchor.x}
                y={anchor.y - 10}
                textAnchor="middle"
                className={`text-xs font-semibold fill-gray-700 transition-all duration-300 ${
                  isHighlighted ? 'opacity-100' : 'opacity-70'
                }`}
                style={{ fontSize: '3px' }}
              >
                {anchor.label}
              </text>
              <text
                x={anchor.x}
                y={anchor.y + 12}
                textAnchor="middle"
                className="text-xs font-bold fill-gray-900"
                style={{ fontSize: '2.5px' }}
              >
                {anchor.count}
              </text>
            </g>
          )
        })}

        {/* Theme Nodes */}
        {animatedThemes.map((theme) => {
          const radius = Math.max(2, Math.min(6, theme.storytellerCount))
          const isActive = currentTheme?.id === theme.id
          
          return (
            <g key={theme.id}>
              <circle
                cx={theme.x}
                cy={theme.y}
                r={radius}
                fill={CATEGORY_COLORS[theme.category] || CATEGORY_COLORS.Other}
                stroke={isActive ? '#1f2937' : 'transparent'}
                strokeWidth="0.5"
                className="cursor-pointer hover:opacity-90 transition-all duration-300 drop-shadow-sm"
                onMouseEnter={() => setHoveredTheme(theme)}
                onMouseLeave={() => setHoveredTheme(null)}
                onClick={() => setSelectedTheme(selectedTheme?.id === theme.id ? null : theme)}
              />
              <text
                x={theme.x}
                y={theme.y! - radius - 1}
                textAnchor="middle"
                className={`text-xs font-medium pointer-events-none transition-all duration-300 ${
                  isActive ? 'opacity-100 fill-gray-900' : 'opacity-0'
                }`}
                style={{ fontSize: '2px' }}
              >
                {theme.name}
              </text>
            </g>
          )
        })}

        {/* Center Text */}
        <text
          x="50"
          y="50"
          textAnchor="middle"
          className="text-xs font-semibold fill-gray-700"
          style={{ fontSize: '3px' }}
        >
          The Power of Conversation
        </text>
      </svg>

      {/* Info Panel */}
      {currentTheme && (
        <div className="absolute top-4 right-4 bg-white rounded-lg shadow-lg p-4 max-w-xs border animate-fade-in">
          <div className="mb-3">
            <h3 className="font-semibold text-gray-900 text-lg">{currentTheme.name}</h3>
            <span 
              className="inline-block px-2 py-1 text-xs font-medium text-white rounded mt-1"
              style={{ backgroundColor: CATEGORY_COLORS[currentTheme.category] || CATEGORY_COLORS.Other }}
            >
              {currentTheme.category}
            </span>
          </div>
          
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Storytellers:</span>
              <span className="font-semibold">{currentTheme.storytellerCount}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Quotes:</span>
              <span className="font-semibold">{currentTheme.quoteCount}</span>
            </div>
            
            <div className="pt-2 border-t mt-3">
              <p className="text-xs font-medium text-gray-700 mb-2">Discussed by:</p>
              <div className="space-y-1">
                {currentTheme.roles.volunteers > 0 && (
                  <div className="flex justify-between text-xs">
                    <span className="text-orange-600">Volunteers</span>
                    <span className="font-medium">{currentTheme.roles.volunteers}</span>
                  </div>
                )}
                {currentTheme.roles.friends > 0 && (
                  <div className="flex justify-between text-xs">
                    <span className="text-blue-600">Friends</span>
                    <span className="font-medium">{currentTheme.roles.friends}</span>
                  </div>
                )}
                {currentTheme.roles.serviceProviders > 0 && (
                  <div className="flex justify-between text-xs">
                    <span className="text-purple-600">Service Providers</span>
                    <span className="font-medium">{currentTheme.roles.serviceProviders}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Legend */}
      <div className="absolute bottom-4 left-4 bg-white/90 rounded-lg shadow-lg p-3 text-xs">
        <h4 className="font-semibold text-gray-900 mb-2">Theme Categories</h4>
        <div className="grid grid-cols-2 gap-x-4 gap-y-1">
          {Object.entries(CATEGORY_COLORS).slice(0, -1).map(([category, color]) => (
            <div key={category} className="flex items-center gap-2">
              <div 
                className="w-3 h-3 rounded-full" 
                style={{ backgroundColor: color }}
              />
              <span className="text-gray-600">{category}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Instructions */}
      {!currentTheme && (
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-white/90 rounded-lg p-3 text-center">
          <p className="text-gray-600 text-sm">
            Hover over themes to see connections • Click to explore details
          </p>
        </div>
      )}
    </div>
  )
}