'use client'

import { useState } from 'react'
import { MapPin } from 'lucide-react'

interface LocationData {
  name: string
  coordinates: [number, number] // [x, y] as percentage of viewBox
  storytellerCount: number
  volunteerCount: number
  friendCount: number
}

interface AustraliaMapProps {
  locationData?: LocationData[]
}

const DEFAULT_LOCATIONS: LocationData[] = [
  { name: 'Perth', coordinates: [8, 52], storytellerCount: 10, volunteerCount: 7, friendCount: 2 },
  { name: 'Adelaide', coordinates: [73, 68], storytellerCount: 8, volunteerCount: 6, friendCount: 2 },
  { name: 'Melbourne', coordinates: [85, 78], storytellerCount: 9, volunteerCount: 0, friendCount: 6 },
  { name: 'Brisbane', coordinates: [87, 35], storytellerCount: 4, volunteerCount: 0, friendCount: 3 },
  { name: 'Newcastle', coordinates: [88, 58], storytellerCount: 10, volunteerCount: 5, friendCount: 4 },
  { name: 'Central Coast', coordinates: [87, 60], storytellerCount: 10, volunteerCount: 4, friendCount: 4 },
  { name: 'Canberra', coordinates: [85, 65], storytellerCount: 9, volunteerCount: 5, friendCount: 3 },
  { name: 'Hobart', coordinates: [85, 88], storytellerCount: 14, volunteerCount: 11, friendCount: 2 },
  { name: 'Mackay', coordinates: [85, 25], storytellerCount: 14, volunteerCount: 6, friendCount: 3 },
  { name: 'Kalgoorlie', coordinates: [60, 48], storytellerCount: 8, volunteerCount: 1, friendCount: 0 },
  { name: 'Bundaburg', coordinates: [85, 32], storytellerCount: 4, volunteerCount: 4, friendCount: 0 },
  { name: 'Gladstone', coordinates: [85, 30], storytellerCount: 3, volunteerCount: 1, friendCount: 1 },
  { name: 'Mount Isa', coordinates: [76, 25], storytellerCount: 3, volunteerCount: 0, friendCount: 0 },
  { name: 'Rockhampton', coordinates: [85, 28], storytellerCount: 2, volunteerCount: 1, friendCount: 0 }
]

export default function AustraliaMap({ locationData = DEFAULT_LOCATIONS }: AustraliaMapProps) {
  const [selectedLocation, setSelectedLocation] = useState<LocationData | null>(null)
  const [hoveredLocation, setHoveredLocation] = useState<LocationData | null>(null)

  const currentLocation = hoveredLocation || selectedLocation

  return (
    <div className="w-full h-96 relative bg-blue-50 rounded-lg overflow-hidden">
      {/* Simple Australia SVG outline */}
      <svg 
        className="w-full h-full" 
        viewBox="0 0 100 100" 
        preserveAspectRatio="xMidYMid meet"
      >
        {/* Simplified Australia outline */}
        <path 
          d="M 15,45 Q 10,40 12,35 Q 15,30 20,28 Q 30,25 40,22 Q 50,20 60,18 Q 70,16 80,18 Q 88,20 92,25 Q 95,30 94,35 Q 93,40 90,45 Q 88,50 85,55 Q 82,60 85,65 Q 88,70 86,75 Q 83,80 78,82 Q 70,85 60,86 Q 50,87 40,85 Q 30,83 25,80 Q 20,75 18,70 Q 15,65 16,60 Q 17,55 15,50 Z M 82,83 Q 85,86 88,90 Q 86,92 83,91 Q 80,89 82,86 Z"
          fill="#e0f2fe" 
          stroke="#0284c7" 
          strokeWidth="0.5"
          className="drop-shadow-sm"
        />
        
        {/* Location markers */}
        {locationData.map((location) => (
          <g key={location.name}>
            <circle
              cx={location.coordinates[0]}
              cy={location.coordinates[1]}
              r={Math.max(1.5, Math.min(4, location.storytellerCount / 3))}
              fill="#f97316"
              stroke="#ea580c"
              strokeWidth="0.3"
              className="cursor-pointer hover:fill-orange-600 transition-colors drop-shadow-sm"
              onMouseEnter={() => setHoveredLocation(location)}
              onMouseLeave={() => setHoveredLocation(null)}
              onClick={() => setSelectedLocation(selectedLocation?.name === location.name ? null : location)}
            />
            <text
              x={location.coordinates[0]}
              y={location.coordinates[1] - 2}
              textAnchor="middle"
              className="text-xs fill-gray-700 font-medium pointer-events-none"
              style={{ fontSize: '2px' }}
            >
              {location.name}
            </text>
          </g>
        ))}
      </svg>

      {/* Info tooltip/panel */}
      {currentLocation && (
        <div className="absolute top-4 right-4 bg-white rounded-lg shadow-lg p-4 min-w-48 border">
          <div className="flex items-start gap-2">
            <MapPin className="w-4 h-4 text-orange-sky mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="font-semibold text-gray-900">{currentLocation.name}</h3>
              <div className="mt-2 space-y-1 text-sm text-gray-600">
                <div className="flex justify-between">
                  <span>Total Storytellers:</span>
                  <span className="font-medium text-orange-sky">{currentLocation.storytellerCount}</span>
                </div>
                <div className="flex justify-between">
                  <span>Volunteers:</span>
                  <span className="font-medium">{currentLocation.volunteerCount}</span>
                </div>
                <div className="flex justify-between">
                  <span>Friends:</span>
                  <span className="font-medium">{currentLocation.friendCount}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Legend */}
      <div className="absolute bottom-4 left-4 bg-white rounded-lg shadow-lg p-3 text-xs">
        <h4 className="font-semibold text-gray-900 mb-2">Map Legend</h4>
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-orange-500"></div>
            <span className="text-gray-600">Orange Sky Locations</span>
          </div>
          <div className="text-gray-500 text-xs">
            Circle size indicates storyteller count
          </div>
        </div>
      </div>

      {/* Instructions */}
      {!currentLocation && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="bg-white/90 rounded-lg p-4 text-center">
            <p className="text-gray-600 text-sm">
              Click or hover over orange markers to see storyteller details
            </p>
          </div>
        </div>
      )}
    </div>
  )
}