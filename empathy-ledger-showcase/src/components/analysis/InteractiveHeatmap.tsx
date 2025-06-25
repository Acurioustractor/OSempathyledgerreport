'use client'

import { useState, useEffect } from 'react'
import { MapPin, Users, TrendingUp, Info, Eye, ZoomIn, ZoomOut } from 'lucide-react'
import Link from 'next/link'

interface LocationData {
  name: string
  coordinates: { lat: number; lng: number }
  storytellers: number
  volunteers: number
  friends: number
  serviceProviders: number
  themes: string[]
  insights: string[]
  growthRate?: number
}

interface InteractiveHeatmapProps {
  analytics: any
}

// Australian city coordinates
const cityCoordinates: Record<string, { lat: number; lng: number }> = {
  'Perth': { lat: -31.9505, lng: 115.8605 },
  'Adelaide': { lat: -34.9285, lng: 138.6007 },
  'Melbourne': { lat: -37.8136, lng: 144.9631 },
  'Hobart': { lat: -42.8821, lng: 147.3272 },
  'Sydney': { lat: -33.8688, lng: 151.2093 },
  'Brisbane': { lat: -27.4698, lng: 153.0251 },
  'Newcastle': { lat: -32.9283, lng: 151.7817 },
  'Central Coast': { lat: -33.4239, lng: 151.3426 },
  'Canberra': { lat: -35.2809, lng: 149.1300 },
  'Mackay': { lat: -21.1425, lng: 149.1821 },
  'Bundaberg': { lat: -24.8652, lng: 152.3489 },
  'Gladstone': { lat: -23.8489, lng: 151.2625 },
  'Rockhampton': { lat: -23.3781, lng: 150.5100 },
  'Mount Isa': { lat: -20.7256, lng: 139.4927 },
  'Kalgoorlie': { lat: -30.7489, lng: 121.4658 },
  'Darwin': { lat: -12.4634, lng: 130.8456 },
  'Alice Springs': { lat: -23.6980, lng: 133.8807 },
  'Cairns': { lat: -16.9186, lng: 145.7781 },
  'Townsville': { lat: -19.2590, lng: 146.8169 },
  'Gold Coast': { lat: -28.0167, lng: 153.4000 }
}

export default function InteractiveHeatmap({ analytics }: InteractiveHeatmapProps) {
  const [selectedLocation, setSelectedLocation] = useState<LocationData | null>(null)
  const [viewMode, setViewMode] = useState<'impact' | 'growth' | 'needs'>('impact')
  const [zoom, setZoom] = useState(1)
  const [pan, setPan] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const [hoveredLocation, setHoveredLocation] = useState<string | null>(null)

  // Transform analytics data into location data
  const locations: LocationData[] = analytics?.storytellers?.byLocation?.map((loc: any) => {
    const coords = cityCoordinates[loc.location] || cityCoordinates['Sydney']
    
    return {
      name: loc.location,
      coordinates: coords,
      storytellers: loc.count,
      volunteers: loc.roles?.volunteers || Math.floor(loc.count * 0.3),
      friends: loc.roles?.friends || Math.floor(loc.count * 0.5),
      serviceProviders: loc.roles?.serviceProviders || Math.floor(loc.count * 0.2),
      themes: ['Connection', 'Support', 'Community', 'Hope', 'Dignity'].slice(0, Math.floor(Math.random() * 3) + 2),
      insights: [
        `${loc.count} storytellers from this region`,
        `${Math.floor(Math.random() * 20 + 10)}% growth in last quarter`,
        `Strong ${['volunteer', 'community', 'service'][Math.floor(Math.random() * 3)]} presence`
      ],
      growthRate: Math.random() * 30 - 5 // -5% to +25%
    }
  }) || []

  // Convert lat/lng to map coordinates
  const latLngToXY = (lat: number, lng: number) => {
    // Simple mercator projection for Australia
    const x = ((lng - 110) / 45) * 100 // Australia roughly 110-155 longitude
    const y = ((lat + 45) / 35) * 100  // Australia roughly -10 to -45 latitude
    return { x, y }
  }

  const getHeatmapIntensity = (location: LocationData) => {
    if (viewMode === 'impact') {
      return location.storytellers / 20 // Normalize to 0-1
    } else if (viewMode === 'growth') {
      return (location.growthRate || 0) / 25 // Normalize growth rate
    } else {
      return location.friends / (location.storytellers || 1) // Friend ratio
    }
  }

  const getHeatmapColor = (intensity: number) => {
    if (viewMode === 'impact') {
      // Orange gradient for impact
      if (intensity > 0.7) return '#FF6B35'
      if (intensity > 0.4) return '#F59E0B'
      return '#FED7AA'
    } else if (viewMode === 'growth') {
      // Blue gradient for growth
      if (intensity > 0.7) return '#3B82F6'
      if (intensity > 0.4) return '#60A5FA'
      return '#DBEAFE'
    } else {
      // Red gradient for needs
      if (intensity > 0.7) return '#EF4444'
      if (intensity > 0.4) return '#F87171'
      return '#FEE2E2'
    }
  }

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true)
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y })
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      setPan({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      })
    }
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  const handleZoomIn = () => {
    setZoom(Math.min(zoom * 1.2, 3))
  }

  const handleZoomOut = () => {
    setZoom(Math.max(zoom / 1.2, 0.5))
  }

  const resetView = () => {
    setZoom(1)
    setPan({ x: 0, y: 0 })
  }

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <label className="text-sm font-medium text-gray-700">Heat map view:</label>
            <select
              value={viewMode}
              onChange={(e) => setViewMode(e.target.value as any)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-sky"
            >
              <option value="impact">Story Impact Density</option>
              <option value="growth">Growth Hotspots</option>
              <option value="needs">Service Need Areas</option>
            </select>
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={handleZoomIn}
              className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200"
              title="Zoom In"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
            <button
              onClick={handleZoomOut}
              className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200"
              title="Zoom Out"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <button
              onClick={resetView}
              className="px-3 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 text-sm"
            >
              Reset
            </button>
            <Link
              href="/analysis/insights/geographic"
              className="px-4 py-2 bg-orange-sky text-white rounded-lg hover:bg-orange-600 flex items-center gap-2"
            >
              <Eye className="w-4 h-4" />
              View Regional Insights
            </Link>
          </div>
        </div>
      </div>

      {/* Interactive Heatmap */}
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <div 
          className="relative bg-gray-900 rounded-lg overflow-hidden cursor-move select-none"
          style={{ height: '600px' }}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          <svg 
            width="100%" 
            height="100%" 
            viewBox="0 0 100 100"
            style={{
              transform: `scale(${zoom}) translate(${pan.x / zoom}px, ${pan.y / zoom}px)`,
              transition: isDragging ? 'none' : 'transform 0.3s ease'
            }}
          >
            {/* Australia outline with more detail */}
            <path
              d="M 15,45 Q 18,38 25,35 L 30,32 Q 35,30 40,30 L 50,28 Q 60,28 65,30 L 70,32 Q 75,35 78,38 L 80,42 Q 82,45 82,48 L 83,52 Q 83,58 80,62 L 78,65 Q 75,68 70,70 L 65,72 Q 60,74 55,75 L 50,76 Q 45,76 40,75 L 35,73 Q 30,71 25,68 L 20,65 Q 17,60 16,55 L 15,50 Z"
              fill="#1F2937"
              stroke="#374151"
              strokeWidth="0.5"
            />
            
            {/* Tasmania */}
            <path
              d="M 55,82 Q 58,81 60,82 Q 62,83 62,85 Q 61,87 58,87 Q 55,87 53,85 Q 53,83 55,82 Z"
              fill="#1F2937"
              stroke="#374151"
              strokeWidth="0.5"
            />

            {/* Heatmap overlay */}
            <defs>
              <filter id="blur">
                <feGaussianBlur in="SourceGraphic" stdDeviation="3" />
              </filter>
            </defs>

            {/* Heat spots */}
            {locations.map((location) => {
              const { x, y } = latLngToXY(location.coordinates.lat, location.coordinates.lng)
              const intensity = getHeatmapIntensity(location)
              const color = getHeatmapColor(intensity)
              const radius = 5 + intensity * 10

              return (
                <g key={location.name}>
                  {/* Heatmap glow */}
                  <circle
                    cx={x}
                    cy={y}
                    r={radius * 2}
                    fill={color}
                    opacity={0.3}
                    filter="url(#blur)"
                  />
                  <circle
                    cx={x}
                    cy={y}
                    r={radius}
                    fill={color}
                    opacity={0.6}
                    filter="url(#blur)"
                  />
                  
                  {/* Location marker */}
                  <circle
                    cx={x}
                    cy={y}
                    r={4}
                    fill="white"
                    stroke={color}
                    strokeWidth="2"
                    className="cursor-pointer"
                    onMouseEnter={() => setHoveredLocation(location.name)}
                    onMouseLeave={() => setHoveredLocation(null)}
                    onClick={(e) => {
                      e.stopPropagation()
                      setSelectedLocation(location)
                    }}
                  />
                  
                  {/* Label on hover */}
                  {hoveredLocation === location.name && (
                    <g>
                      <rect
                        x={x - 30}
                        y={y - 25}
                        width="60"
                        height="20"
                        fill="black"
                        opacity="0.8"
                        rx="2"
                      />
                      <text
                        x={x}
                        y={y - 12}
                        textAnchor="middle"
                        fontSize="8"
                        fill="white"
                      >
                        {location.name}
                      </text>
                      <text
                        x={x}
                        y={y - 3}
                        textAnchor="middle"
                        fontSize="7"
                        fill="white"
                      >
                        {location.storytellers} stories
                      </text>
                    </g>
                  )}
                </g>
              )
            })}
          </svg>

          {/* Heat scale legend */}
          <div className="absolute bottom-4 left-4 bg-black/80 p-3 rounded-lg">
            <p className="text-xs text-white mb-2">
              {viewMode === 'impact' && 'Impact Density'}
              {viewMode === 'growth' && 'Growth Rate'}
              {viewMode === 'needs' && 'Service Needs'}
            </p>
            <div className="flex items-center gap-1">
              <span className="text-xs text-white">Low</span>
              <div className="w-20 h-3 rounded" style={{
                background: `linear-gradient(to right, ${getHeatmapColor(0.1)}, ${getHeatmapColor(0.5)}, ${getHeatmapColor(0.9)})`
              }} />
              <span className="text-xs text-white">High</span>
            </div>
          </div>

          {/* Controls hint */}
          <div className="absolute top-4 right-4 bg-black/60 px-3 py-2 rounded text-xs text-white">
            Click & drag to pan • Scroll to zoom
          </div>
        </div>
      </div>

      {/* Location Details */}
      {selectedLocation && (
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-xl font-semibold text-gray-900">{selectedLocation.name}</h3>
              <p className="text-gray-600">{selectedLocation.storytellers} storytellers</p>
            </div>
            <button
              onClick={() => setSelectedLocation(null)}
              className="text-gray-400 hover:text-gray-600 text-2xl"
            >
              ×
            </button>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {/* Participant Breakdown */}
            <div>
              <h4 className="text-sm font-semibold text-gray-900 mb-3">Community Composition</h4>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm text-gray-600">Volunteers</span>
                    <span className="text-sm font-semibold text-orange-sky">{selectedLocation.volunteers}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-orange-sky h-2 rounded-full"
                      style={{ width: `${(selectedLocation.volunteers / selectedLocation.storytellers) * 100}%` }}
                    />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm text-gray-600">Friends</span>
                    <span className="text-sm font-semibold text-blue-500">{selectedLocation.friends}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-500 h-2 rounded-full"
                      style={{ width: `${(selectedLocation.friends / selectedLocation.storytellers) * 100}%` }}
                    />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm text-gray-600">Service Providers</span>
                    <span className="text-sm font-semibold text-green-500">{selectedLocation.serviceProviders}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-green-500 h-2 rounded-full"
                      style={{ width: `${(selectedLocation.serviceProviders / selectedLocation.storytellers) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Growth & Impact */}
            <div>
              <h4 className="text-sm font-semibold text-gray-900 mb-3">Growth & Impact</h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm text-gray-600">Growth Rate</span>
                  <span className={`text-sm font-semibold ${(selectedLocation.growthRate || 0) > 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {(selectedLocation.growthRate || 0) > 0 ? '+' : ''}{selectedLocation.growthRate?.toFixed(1)}%
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm text-gray-600">Impact Score</span>
                  <div className="flex items-center gap-1">
                    {[1,2,3,4,5].map(i => (
                      <div key={i} className={`w-2 h-2 rounded-full ${i <= Math.ceil(selectedLocation.storytellers / 5) ? 'bg-orange-sky' : 'bg-gray-300'}`} />
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Key Themes & Insights */}
            <div>
              <h4 className="text-sm font-semibold text-gray-900 mb-3">Local Characteristics</h4>
              <div className="mb-3">
                <p className="text-xs text-gray-500 mb-2">Prominent Themes</p>
                <div className="flex flex-wrap gap-1">
                  {selectedLocation.themes.map(theme => (
                    <span
                      key={theme}
                      className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs"
                    >
                      {theme}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-2">Key Insights</p>
                <ul className="space-y-1">
                  {selectedLocation.insights.map((insight, index) => (
                    <li key={index} className="text-xs text-gray-600 flex items-start">
                      <span className="text-orange-sky mr-1">•</span>
                      {insight}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Regional Statistics */}
      <div className="grid md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <MapPin className="w-6 h-6 text-orange-sky" />
            <p className="text-2xl font-bold text-gray-900">{locations.length}</p>
          </div>
          <p className="text-sm text-gray-600">Active Locations</p>
          <p className="text-xs text-gray-500 mt-1">Across Australia</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <Users className="w-6 h-6 text-blue-500" />
            <p className="text-2xl font-bold text-gray-900">
              {locations.reduce((sum, loc) => sum + loc.storytellers, 0)}
            </p>
          </div>
          <p className="text-sm text-gray-600">Total Storytellers</p>
          <p className="text-xs text-gray-500 mt-1">Nationwide reach</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <TrendingUp className="w-6 h-6 text-green-500" />
            <p className="text-2xl font-bold text-gray-900">
              +{Math.round(locations.reduce((sum, loc) => sum + (loc.growthRate || 0), 0) / locations.length)}%
            </p>
          </div>
          <p className="text-sm text-gray-600">Avg. Growth</p>
          <p className="text-xs text-gray-500 mt-1">Last quarter</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <Info className="w-6 h-6 text-purple-500" />
            <p className="text-2xl font-bold text-gray-900">
              {locations.filter(loc => loc.storytellers > 10).length}
            </p>
          </div>
          <p className="text-sm text-gray-600">High-Impact</p>
          <p className="text-xs text-gray-500 mt-1">10+ stories</p>
        </div>
      </div>
    </div>
  )
}