'use client'

import { useState } from 'react'
import { MapPin, Users, TrendingUp, Info, Eye } from 'lucide-react'
import Link from 'next/link'

interface LocationData {
  name: string
  coordinates: { x: number; y: number }
  storytellers: number
  volunteers: number
  friends: number
  serviceProviders: number
  themes: string[]
  insights: string[]
}

interface GeographicImpactProps {
  analytics: any
}

export default function GeographicImpact({ analytics }: GeographicImpactProps) {
  const [selectedLocation, setSelectedLocation] = useState<LocationData | null>(null)
  const [viewMode, setViewMode] = useState<'impact' | 'growth' | 'needs'>('impact')

  // Transform analytics data into location data
  const locations: LocationData[] = analytics?.storytellers?.byLocation?.map((loc: any, index: number) => {
    // Map Australian cities to approximate positions on a simplified map
    const cityCoordinates: Record<string, { x: number; y: number }> = {
      'Perth': { x: 20, y: 60 },
      'Adelaide': { x: 50, y: 65 },
      'Melbourne': { x: 60, y: 75 },
      'Hobart': { x: 62, y: 85 },
      'Sydney': { x: 70, y: 60 },
      'Brisbane': { x: 72, y: 45 },
      'Newcastle': { x: 71, y: 58 },
      'Central Coast': { x: 70, y: 56 },
      'Canberra': { x: 65, y: 68 },
      'Mackay': { x: 68, y: 30 },
      'Bundaburg': { x: 70, y: 40 },
      'Gladestone': { x: 70, y: 38 },
      'Rockhampton': { x: 68, y: 35 },
      'Mount Isa': { x: 50, y: 28 },
      'Kalgoorlie': { x: 35, y: 60 }
    }

    const coords = cityCoordinates[loc.location] || { x: 50 + index * 5, y: 50 + index * 3 }

    return {
      name: loc.location,
      coordinates: coords,
      storytellers: loc.count,
      volunteers: loc.roles?.volunteers || 0,
      friends: loc.roles?.friends || 0,
      serviceProviders: loc.count - (loc.roles?.volunteers || 0) - (loc.roles?.friends || 0),
      themes: ['Connection', 'Support', 'Community'], // Simulated
      insights: [
        `${loc.count} storytellers from this region`,
        `Strong volunteer presence` 
      ]
    }
  }) || []

  const getLocationSize = (location: LocationData) => {
    const base = 8
    const scale = location.storytellers / 2
    return Math.min(base + scale, 20)
  }

  const getLocationColor = (location: LocationData) => {
    if (viewMode === 'impact') {
      return location.storytellers > 10 ? '#FF6B35' : location.storytellers > 5 ? '#F59E0B' : '#10B981'
    } else if (viewMode === 'growth') {
      return location.volunteers > location.friends ? '#3B82F6' : '#10B981'
    } else {
      return location.friends > location.volunteers ? '#EF4444' : '#10B981'
    }
  }

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <label className="text-sm font-medium text-gray-700">View mode:</label>
            <select
              value={viewMode}
              onChange={(e) => setViewMode(e.target.value as any)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-sky"
            >
              <option value="impact">Overall Impact</option>
              <option value="growth">Growth Potential</option>
              <option value="needs">Service Needs</option>
            </select>
          </div>
          
          <Link
            href="/analysis/insights/geographic"
            className="px-4 py-2 bg-orange-sky text-white rounded-lg hover:bg-orange-600 flex items-center gap-2"
          >
            <Eye className="w-4 h-4" />
            View Regional Insights
          </Link>
        </div>
      </div>

      {/* Map Visualization */}
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <div className="relative bg-gray-50 rounded-lg overflow-hidden" style={{ paddingBottom: '60%' }}>
          <div className="absolute inset-0">
            {/* Simple Australia outline */}
            <svg viewBox="0 0 100 100" className="w-full h-full">
              {/* Simplified Australia shape */}
              <path
                d="M 15,50 Q 20,40 30,35 T 50,30 T 70,35 T 85,50 Q 85,65 75,70 T 60,80 Q 50,85 40,80 T 20,65 Z"
                fill="#E5E7EB"
                stroke="#9CA3AF"
                strokeWidth="0.5"
              />
              
              {/* Location markers */}
              {locations.map((location) => (
                <g
                  key={location.name}
                  transform={`translate(${location.coordinates.x}, ${location.coordinates.y})`}
                  onClick={() => setSelectedLocation(location)}
                  className="cursor-pointer group"
                >
                  <circle
                    r={getLocationSize(location)}
                    fill={getLocationColor(location)}
                    opacity="0.7"
                    className="transition-all duration-200 group-hover:opacity-100"
                  />
                  <text
                    textAnchor="middle"
                    dy="-15"
                    fontSize="8"
                    fill="#374151"
                    className="pointer-events-none select-none"
                  >
                    {location.name}
                  </text>
                  <text
                    textAnchor="middle"
                    dy="0"
                    fontSize="10"
                    fontWeight="bold"
                    fill="white"
                    className="pointer-events-none select-none"
                  >
                    {location.storytellers}
                  </text>
                </g>
              ))}
            </svg>
          </div>
        </div>

        {/* Legend */}
        <div className="mt-4 flex flex-wrap items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-orange-sky opacity-70"></div>
              <span className="text-sm text-gray-600">High Impact</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-yellow-500 opacity-70"></div>
              <span className="text-sm text-gray-600">Medium Impact</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-green-500 opacity-70"></div>
              <span className="text-sm text-gray-600">Growing Impact</span>
            </div>
          </div>
          <p className="text-sm text-gray-500">Circle size represents number of storytellers</p>
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
              className="text-gray-400 hover:text-gray-600"
            >
              ×
            </button>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {/* Participant Breakdown */}
            <div>
              <h4 className="text-sm font-semibold text-gray-900 mb-3">Community Breakdown</h4>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Volunteers</span>
                  <span className="text-sm font-semibold text-orange-sky">{selectedLocation.volunteers}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Friends</span>
                  <span className="text-sm font-semibold text-blue-500">{selectedLocation.friends}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Service Providers</span>
                  <span className="text-sm font-semibold text-green-500">{selectedLocation.serviceProviders}</span>
                </div>
              </div>
            </div>

            {/* Key Themes */}
            <div>
              <h4 className="text-sm font-semibold text-gray-900 mb-3">Prominent Themes</h4>
              <div className="flex flex-wrap gap-2">
                {selectedLocation.themes.map(theme => (
                  <span
                    key={theme}
                    className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs"
                  >
                    {theme}
                  </span>
                ))}
              </div>
            </div>

            {/* Local Insights */}
            <div>
              <h4 className="text-sm font-semibold text-gray-900 mb-3">Local Insights</h4>
              <ul className="space-y-1 text-sm text-gray-600">
                {selectedLocation.insights.map((insight, index) => (
                  <li key={index} className="flex items-start">
                    <span className="text-orange-sky mr-2">•</span>
                    {insight}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Regional Statistics */}
      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <MapPin className="w-8 h-8 text-orange-sky" />
            <div>
              <p className="text-2xl font-bold text-gray-900">{locations.length}</p>
              <p className="text-sm text-gray-600">Active Locations</p>
            </div>
          </div>
          <p className="text-xs text-gray-500">Orange Sky presence across Australia</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <Users className="w-8 h-8 text-blue-500" />
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {Math.round(locations.reduce((sum, loc) => sum + loc.storytellers, 0) / locations.length)}
              </p>
              <p className="text-sm text-gray-600">Avg. Storytellers/Location</p>
            </div>
          </div>
          <p className="text-xs text-gray-500">Community engagement level</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <TrendingUp className="w-8 h-8 text-green-500" />
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {locations.filter(loc => loc.storytellers > 10).length}
              </p>
              <p className="text-sm text-gray-600">High-Impact Locations</p>
            </div>
          </div>
          <p className="text-xs text-gray-500">Locations with 10+ storytellers</p>
        </div>
      </div>

      {/* Regional Insights CTA */}
      <div className="bg-gradient-to-r from-green-50 to-green-100 p-6 rounded-lg">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Regional Growth Opportunities
            </h3>
            <p className="text-gray-600">
              Discover how to expand impact and support communities in different regions
            </p>
          </div>
          <Link
            href="/analysis/insights/geographic"
            className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 flex items-center gap-2"
          >
            <MapPin className="w-5 h-5" />
            Explore Regional Strategies
          </Link>
        </div>
      </div>
    </div>
  )
}