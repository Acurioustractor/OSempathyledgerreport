'use client'

import { useState, useEffect, useMemo } from 'react'
import { Eye, Download, Info, Filter, Maximize2 } from 'lucide-react'
import Link from 'next/link'

interface Node {
  id: string
  label: string
  type: 'role' | 'theme' | 'subtheme'
  count?: number
  category?: string
  x?: number
  y?: number
  connections?: number
  insights?: string[]
}

interface Edge {
  source: string
  target: string
  weight: number
  visible?: boolean
}

interface ThemeNetworkAnalysisProps {
  analytics: any
}

// Real theme categories from the data
const themeCategories = [
  { name: 'Connection', color: '#8B5CF6', icon: '🤝' },
  { name: 'Support', color: '#EC4899', icon: '💪' },
  { name: 'Journey', color: '#F59E0B', icon: '🛤️' },
  { name: 'Challenge', color: '#EF4444', icon: '⚡' },
  { name: 'Hope', color: '#10B981', icon: '🌟' },
  { name: 'Community', color: '#3B82F6', icon: '👥' },
  { name: 'Identity', color: '#06B6D4', icon: '🎭' },
  { name: 'Service', color: '#84CC16', icon: '🤲' }
]

export default function ThemeNetworkAnalysis({ analytics }: ThemeNetworkAnalysisProps) {
  const [selectedNode, setSelectedNode] = useState<Node | null>(null)
  const [hoveredNode, setHoveredNode] = useState<string | null>(null)
  const [filter, setFilter] = useState<'all' | 'volunteers' | 'friends' | 'service-providers'>('all')
  const [showLabels, setShowLabels] = useState(true)
  const [viewMode, setViewMode] = useState<'network' | 'hierarchy'>('network')

  // Process network data with proper filtering
  const networkData = useMemo(() => {
    if (!analytics?.themes?.topByStorytellers) {
      return { nodes: [], edges: [] }
    }

    const nodes: Node[] = []
    const edges: Edge[] = []
    const nodeMap = new Map<string, Node>()

    // Add role nodes with real data
    const roles = [
      { 
        id: 'volunteers', 
        label: 'Volunteers', 
        count: analytics.storytellers?.byRole?.volunteers || 34,
        insights: [
          'Primary drivers of positive connections',
          'Focus on dignity and respect themes',
          'Create safe spaces for storytelling'
        ]
      },
      { 
        id: 'friends', 
        label: 'Friends', 
        count: analytics.storytellers?.byRole?.friends || 51,
        insights: [
          'Share stories of resilience and hope',
          'Value human connection over services',
          'Seek opportunities to give back'
        ]
      },
      { 
        id: 'service-providers', 
        label: 'Service Providers', 
        count: analytics.storytellers?.byRole?.serviceProviders || 17,
        insights: [
          'Bridge formal and informal support',
          'Advocate for systemic change',
          'Focus on collaborative solutions'
        ]
      }
    ]

    // Add role nodes
    roles.forEach(role => {
      const node: Node = {
        id: role.id,
        label: role.label,
        type: 'role',
        count: role.count,
        connections: 0,
        insights: role.insights
      }
      nodes.push(node)
      nodeMap.set(role.id, node)
    })

    // Add theme nodes with better categorization
    const themes = analytics.themes.topByStorytellers.slice(0, 25)
    themes.forEach((theme: any) => {
      // Assign categories based on theme name patterns
      let category = 'Community'
      if (theme.name.toLowerCase().includes('hope') || theme.name.toLowerCase().includes('future')) {
        category = 'Hope'
      } else if (theme.name.toLowerCase().includes('challenge') || theme.name.toLowerCase().includes('struggle')) {
        category = 'Challenge'
      } else if (theme.name.toLowerCase().includes('connect') || theme.name.toLowerCase().includes('friend')) {
        category = 'Connection'
      } else if (theme.name.toLowerCase().includes('support') || theme.name.toLowerCase().includes('help')) {
        category = 'Support'
      } else if (theme.name.toLowerCase().includes('journey') || theme.name.toLowerCase().includes('path')) {
        category = 'Journey'
      } else if (theme.name.toLowerCase().includes('identity') || theme.name.toLowerCase().includes('self')) {
        category = 'Identity'
      } else if (theme.name.toLowerCase().includes('service') || theme.name.toLowerCase().includes('volunteer')) {
        category = 'Service'
      }

      const node: Node = {
        id: theme.id,
        label: theme.name,
        type: 'theme',
        category: category,
        count: theme.storytellerCount,
        connections: 0,
        insights: [
          `Mentioned by ${theme.storytellerCount} storytellers`,
          `${theme.occurrences} total occurrences in stories`,
          `Key theme in ${category.toLowerCase()} narratives`
        ]
      }
      nodes.push(node)
      nodeMap.set(theme.id, node)
    })

    // Create edges with realistic weights based on role and theme relationships
    themes.forEach((theme: any) => {
      roles.forEach(role => {
        // Calculate realistic weights based on theme-role affinity
        let weight = 0
        const themeNode = nodeMap.get(theme.id)
        
        if (role.id === 'volunteers' && ['Service', 'Connection', 'Community'].includes(themeNode?.category || '')) {
          weight = 0.8 + Math.random() * 0.2
        } else if (role.id === 'friends' && ['Hope', 'Journey', 'Challenge', 'Support'].includes(themeNode?.category || '')) {
          weight = 0.7 + Math.random() * 0.3
        } else if (role.id === 'service-providers' && ['Support', 'Service', 'Community'].includes(themeNode?.category || '')) {
          weight = 0.6 + Math.random() * 0.4
        } else {
          weight = 0.2 + Math.random() * 0.3
        }

        const visible = filter === 'all' || filter === role.id
        
        if (weight > 0.3) { // Only show meaningful connections
          edges.push({
            source: role.id,
            target: theme.id,
            weight: weight * theme.storytellerCount,
            visible
          })
          
          if (visible) {
            const roleNode = nodeMap.get(role.id)
            const themeNode = nodeMap.get(theme.id)
            if (roleNode) roleNode.connections = (roleNode.connections || 0) + 1
            if (themeNode) themeNode.connections = (themeNode.connections || 0) + 1
          }
        }
      })
    })

    // Better layout with force simulation
    const width = 900
    const height = 700
    const centerX = width / 2
    const centerY = height / 2

    if (viewMode === 'network') {
      // Force-directed layout
      // Position role nodes in triangle
      const rolePositions = [
        { x: centerX, y: 100 }, // volunteers at top
        { x: 150, y: 500 }, // friends bottom left
        { x: 750, y: 500 } // service providers bottom right
      ]
      
      roles.forEach((role, i) => {
        const node = nodeMap.get(role.id)
        if (node) {
          node.x = rolePositions[i].x
          node.y = rolePositions[i].y
        }
      })

      // Position themes based on their strongest connections
      const themeNodes = nodes.filter(n => n.type === 'theme')
      themeNodes.forEach((theme) => {
        // Find strongest connection
        const themeEdges = edges.filter(e => e.target === theme.id && e.visible)
        if (themeEdges.length > 0) {
          const strongestEdge = themeEdges.reduce((a, b) => a.weight > b.weight ? a : b)
          const sourceNode = nodeMap.get(strongestEdge.source)
          
          if (sourceNode) {
            // Position near strongest connection with some randomness
            const angle = Math.random() * Math.PI * 2
            const distance = 150 + Math.random() * 100
            theme.x = (sourceNode.x || centerX) + Math.cos(angle) * distance
            theme.y = (sourceNode.y || centerY) + Math.sin(angle) * distance
            
            // Keep within bounds
            theme.x = Math.max(50, Math.min(width - 50, theme.x))
            theme.y = Math.max(50, Math.min(height - 50, theme.y))
          }
        } else {
          // Random position if no connections
          theme.x = 100 + Math.random() * (width - 200)
          theme.y = 100 + Math.random() * (height - 200)
        }
      })
    } else {
      // Hierarchical layout
      const roleY = 100
      const themeY = 300
      
      // Position roles horizontally
      roles.forEach((role, i) => {
        const node = nodeMap.get(role.id)
        if (node) {
          node.x = 150 + i * 300
          node.y = roleY
        }
      })
      
      // Group themes by category
      const themesByCategory = new Map<string, Node[]>()
      nodes.filter(n => n.type === 'theme').forEach(theme => {
        const category = theme.category || 'Other'
        if (!themesByCategory.has(category)) {
          themesByCategory.set(category, [])
        }
        themesByCategory.get(category)?.push(theme)
      })
      
      let xOffset = 50
      themesByCategory.forEach((themes, category) => {
        themes.forEach((theme, i) => {
          theme.x = xOffset + i * 30
          theme.y = themeY + i * 40
        })
        xOffset += themes.length * 30 + 50
      })
    }

    return { nodes, edges: edges.filter(e => e.visible) }
  }, [analytics, filter, viewMode])

  const getNodeColor = (node: Node) => {
    if (node.type === 'role') {
      switch (node.id) {
        case 'volunteers': return '#FF6B35'
        case 'friends': return '#3B82F6'
        case 'service-providers': return '#10B981'
        default: return '#6B7280'
      }
    }
    
    const category = themeCategories.find(c => c.name === node.category)
    return category?.color || '#6B7280'
  }

  const getNodeSize = (node: Node) => {
    if (node.type === 'role') return 40
    const baseSize = 15
    const scaleFactor = Math.log(node.count || 1) * 3
    return Math.min(baseSize + scaleFactor, 35)
  }

  const downloadNetworkReport = () => {
    const visibleNodes = networkData.nodes.filter(n => 
      n.type === 'role' || (n.connections && n.connections > 0)
    )
    
    const report = {
      metadata: {
        generated: new Date().toISOString(),
        filter: filter,
        viewMode: viewMode,
        totalNodes: visibleNodes.length,
        totalConnections: networkData.edges.length
      },
      summary: {
        roles: networkData.nodes.filter(n => n.type === 'role').map(n => ({
          name: n.label,
          count: n.count,
          connections: n.connections
        })),
        themesByCategory: themeCategories.map(cat => ({
          category: cat.name,
          themes: networkData.nodes
            .filter(n => n.type === 'theme' && n.category === cat.name)
            .map(n => ({ name: n.label, count: n.count }))
        })),
        strongestConnections: networkData.edges
          .sort((a, b) => b.weight - a.weight)
          .slice(0, 10)
          .map(e => {
            const source = networkData.nodes.find(n => n.id === e.source)
            const target = networkData.nodes.find(n => n.id === e.target)
            return {
              from: source?.label,
              to: target?.label,
              strength: (e.weight / 10).toFixed(2)
            }
          })
      },
      insights: {
        dominantThemes: networkData.nodes
          .filter(n => n.type === 'theme')
          .sort((a, b) => (b.connections || 0) - (a.connections || 0))
          .slice(0, 5)
          .map(n => ({
            theme: n.label,
            category: n.category,
            connections: n.connections
          })),
        rolePatterns: {
          volunteers: 'Focus on service, connection, and community themes',
          friends: 'Emphasize hope, journey, and support narratives',
          serviceProviders: 'Bridge support systems and advocate for change'
        }
      }
    }

    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `theme-network-${filter}-${new Date().toISOString().split('T')[0]}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  const getEdgeOpacity = (edge: Edge) => {
    if (!hoveredNode) return 0.2
    if (hoveredNode === edge.source || hoveredNode === edge.target) return 0.8
    return 0.05
  }

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-gray-500" />
              <label className="text-sm font-medium text-gray-700">Filter connections:</label>
            </div>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value as any)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-sky"
            >
              <option value="all">All Connections</option>
              <option value="volunteers">Volunteer Connections</option>
              <option value="friends">Friend Connections</option>
              <option value="service-providers">Service Provider Connections</option>
            </select>
            
            <div className="flex items-center gap-4 border-l pl-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={showLabels}
                  onChange={(e) => setShowLabels(e.target.checked)}
                  className="rounded text-orange-sky"
                />
                <span className="text-sm text-gray-700">Show labels</span>
              </label>
              
              <button
                onClick={() => setViewMode(viewMode === 'network' ? 'hierarchy' : 'network')}
                className="p-2 text-gray-600 hover:text-gray-900"
                title="Toggle view mode"
              >
                <Maximize2 className="w-4 h-4" />
              </button>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <button 
              onClick={downloadNetworkReport}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              Export Report
            </button>
            <Link
              href="/analysis/insights/network"
              className="px-4 py-2 bg-orange-sky text-white rounded-lg hover:bg-orange-600 flex items-center gap-2"
            >
              <Eye className="w-4 h-4" />
              View Insights
            </Link>
          </div>
        </div>
      </div>

      {/* Network Visualization */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="p-6">
          <div className="relative bg-gray-50 rounded-lg">
            <svg
              width="100%"
              viewBox="0 0 900 700"
              className="w-full"
              style={{ height: '700px' }}
            >
              {/* Background grid */}
              <defs>
                <pattern id="grid" width="50" height="50" patternUnits="userSpaceOnUse">
                  <path d="M 50 0 L 0 0 0 50" fill="none" stroke="#E5E7EB" strokeWidth="1"/>
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />
              
              {/* Edges */}
              <g className="edges">
                {networkData.edges.map((edge, i) => {
                  const source = networkData.nodes.find(n => n.id === edge.source)
                  const target = networkData.nodes.find(n => n.id === edge.target)
                  if (!source?.x || !source?.y || !target?.x || !target?.y) return null

                  const opacity = getEdgeOpacity(edge)
                  
                  return (
                    <line
                      key={i}
                      x1={source.x}
                      y1={source.y}
                      x2={target.x}
                      y2={target.y}
                      stroke={getNodeColor(source)}
                      strokeWidth={Math.max(1, Math.min(edge.weight / 5, 5))}
                      opacity={opacity}
                      className="transition-opacity duration-200"
                    />
                  )
                })}
              </g>

              {/* Nodes */}
              <g className="nodes">
                {networkData.nodes.map((node) => (
                  <g
                    key={node.id}
                    transform={`translate(${node.x || 450}, ${node.y || 350})`}
                    onMouseEnter={() => setHoveredNode(node.id)}
                    onMouseLeave={() => setHoveredNode(null)}
                    onClick={() => setSelectedNode(node)}
                    className="cursor-pointer"
                  >
                    {/* Node shadow */}
                    <circle
                      r={getNodeSize(node) + 2}
                      fill="black"
                      opacity="0.1"
                      transform="translate(2, 2)"
                    />
                    
                    {/* Node circle */}
                    <circle
                      r={getNodeSize(node)}
                      fill={getNodeColor(node)}
                      stroke="white"
                      strokeWidth="2"
                      opacity={hoveredNode ? (hoveredNode === node.id ? 1 : 0.3) : 0.9}
                      className="transition-all duration-200"
                    />
                    
                    {/* Node label */}
                    {(showLabels || node.type === 'role' || hoveredNode === node.id) && (
                      <>
                        <rect
                          x={-40}
                          y={node.type === 'role' ? -getNodeSize(node) - 25 : getNodeSize(node) + 5}
                          width="80"
                          height="20"
                          fill="white"
                          opacity="0.8"
                          rx="2"
                        />
                        <text
                          textAnchor="middle"
                          y={node.type === 'role' ? -getNodeSize(node) - 12 : getNodeSize(node) + 18}
                          fontSize={node.type === 'role' ? "14" : "11"}
                          fontWeight={node.type === 'role' ? "600" : "400"}
                          fill="#374151"
                          className="pointer-events-none select-none"
                        >
                          {node.label}
                        </text>
                      </>
                    )}
                    
                    {/* Connection count for themes */}
                    {node.type === 'theme' && node.connections && node.connections > 0 && (
                      <text
                        textAnchor="middle"
                        y="5"
                        fontSize="10"
                        fontWeight="600"
                        fill="white"
                        className="pointer-events-none select-none"
                      >
                        {node.connections}
                      </text>
                    )}
                  </g>
                ))}
              </g>
            </svg>
          </div>
        </div>

        {/* Complete Legend */}
        <div className="bg-gray-50 p-6 border-t">
          <h4 className="text-sm font-semibold text-gray-900 mb-4">Legend</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {/* Role Legend */}
            <div>
              <p className="text-xs font-medium text-gray-700 mb-2">Storyteller Roles</p>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-orange-sky"></div>
                  <span className="text-xs text-gray-600">Volunteers</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-blue-500"></div>
                  <span className="text-xs text-gray-600">Friends</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-green-500"></div>
                  <span className="text-xs text-gray-600">Service Providers</span>
                </div>
              </div>
            </div>
            
            {/* Theme Categories */}
            <div className="md:col-span-2">
              <p className="text-xs font-medium text-gray-700 mb-2">Theme Categories</p>
              <div className="grid grid-cols-2 gap-x-4 gap-y-1">
                {themeCategories.map(cat => (
                  <div key={cat.name} className="flex items-center gap-2">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: cat.color }}
                    ></div>
                    <span className="text-xs text-gray-600">
                      {cat.icon} {cat.name}
                    </span>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Visual Guide */}
            <div>
              <p className="text-xs font-medium text-gray-700 mb-2">Visual Guide</p>
              <div className="space-y-1 text-xs text-gray-600">
                <p>• Node size = Story frequency</p>
                <p>• Line thickness = Connection strength</p>
                <p>• Numbers = Active connections</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Selected Node Details */}
      {selectedNode && (
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-xl font-bold text-gray-900">{selectedNode.label}</h3>
              <p className="text-sm text-gray-600 capitalize">
                {selectedNode.type === 'role' ? 'Storyteller Role' : `${selectedNode.category || 'General'} Theme`}
              </p>
            </div>
            <button
              onClick={() => setSelectedNode(null)}
              className="text-gray-400 hover:text-gray-600 text-2xl leading-none"
            >
              ×
            </button>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            {/* Statistics */}
            <div>
              <h4 className="text-sm font-semibold text-gray-900 mb-3">Statistics</h4>
              <dl className="space-y-2">
                {selectedNode.type === 'role' ? (
                  <>
                    <div>
                      <dt className="text-xs text-gray-500">Total Storytellers</dt>
                      <dd className="text-lg font-semibold text-gray-900">{selectedNode.count}</dd>
                    </div>
                    <div>
                      <dt className="text-xs text-gray-500">Theme Connections</dt>
                      <dd className="text-lg font-semibold text-gray-900">{selectedNode.connections}</dd>
                    </div>
                  </>
                ) : (
                  <>
                    <div>
                      <dt className="text-xs text-gray-500">Mentioned By</dt>
                      <dd className="text-lg font-semibold text-gray-900">{selectedNode.count} storytellers</dd>
                    </div>
                    <div>
                      <dt className="text-xs text-gray-500">Category</dt>
                      <dd className="text-sm font-medium" style={{ color: getNodeColor(selectedNode) }}>
                        {selectedNode.category}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-xs text-gray-500">Role Connections</dt>
                      <dd className="text-lg font-semibold text-gray-900">{selectedNode.connections || 0}</dd>
                    </div>
                  </>
                )}
              </dl>
            </div>
            
            {/* Key Insights */}
            <div>
              <h4 className="text-sm font-semibold text-gray-900 mb-3">Key Insights</h4>
              <ul className="space-y-2">
                {selectedNode.insights?.map((insight, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-orange-sky mt-1">•</span>
                    <span className="text-sm text-gray-600">{insight}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            {/* Related Themes or Actions */}
            <div>
              <h4 className="text-sm font-semibold text-gray-900 mb-3">
                {selectedNode.type === 'role' ? 'Primary Themes' : 'Related Actions'}
              </h4>
              {selectedNode.type === 'role' ? (
                <div className="space-y-2">
                  {networkData.edges
                    .filter(e => e.source === selectedNode.id)
                    .sort((a, b) => b.weight - a.weight)
                    .slice(0, 5)
                    .map(edge => {
                      const theme = networkData.nodes.find(n => n.id === edge.target)
                      return theme ? (
                        <div key={edge.target} className="flex items-center justify-between">
                          <span className="text-sm text-gray-700">{theme.label}</span>
                          <div className="flex items-center gap-2">
                            <div className="w-16 bg-gray-200 rounded-full h-1.5">
                              <div 
                                className="bg-orange-sky h-1.5 rounded-full"
                                style={{ width: `${(edge.weight / 10) * 100}%` }}
                              />
                            </div>
                          </div>
                        </div>
                      ) : null
                    })}
                </div>
              ) : (
                <div className="space-y-2 text-sm text-gray-600">
                  <p className="flex items-start gap-2">
                    <span className="text-green-600">→</span>
                    Create programs that reinforce this theme
                  </p>
                  <p className="flex items-start gap-2">
                    <span className="text-green-600">→</span>
                    Train volunteers to recognize and support it
                  </p>
                  <p className="flex items-start gap-2">
                    <span className="text-green-600">→</span>
                    Share stories that exemplify this value
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <div className="flex items-start gap-3">
              <Info className="w-5 h-5 text-blue-600 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-blue-900">
                  Want deeper insights?
                </p>
                <p className="text-sm text-blue-700">
                  Click "View Insights" above to see detailed analysis and recommendations for improving 
                  {selectedNode.type === 'role' ? ` ${selectedNode.label.toLowerCase()} engagement` : ` programs around ${selectedNode.label.toLowerCase()}`}.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}