'use client'

import { useEffect, useRef, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Stars, Text, Line } from '@react-three/drei'
import * as THREE from 'three'

interface Storyteller {
  id: string
  name: string
  role: 'volunteer' | 'friend' | 'service-provider'
  themes: string[]
  location: string
  position?: THREE.Vector3
}

interface Theme {
  id: string
  name: string
  color: string
  center: THREE.Vector3
  storytellers: string[]
}

interface StoryConstellationProps {
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
  '#e11d48', // Rose
  '#db2777', // Pink
  '#9333ea', // Purple
  '#7c3aed', // Violet
  '#6366f1', // Indigo
  '#3b82f6', // Blue
  '#0ea5e9', // Sky
  '#06b6d4', // Cyan
  '#14b8a6', // Teal
  '#10b981', // Emerald
  '#84cc16', // Lime
  '#f59e0b', // Amber
  '#f97316', // Orange
  '#ef4444', // Red
]

function StarField({ storytellers, themes, onStarHover, onStarClick }: {
  storytellers: Storyteller[]
  themes: Theme[]
  onStarHover: (storyteller: Storyteller | null) => void
  onStarClick: (storyteller: Storyteller) => void
}) {
  const starsRef = useRef<THREE.Group>(null)

  useFrame((state) => {
    if (starsRef.current) {
      // Gentle rotation
      starsRef.current.rotation.y = state.clock.elapsedTime * 0.02
    }
  })

  // Calculate connections between storytellers who share themes
  const connections: Array<[THREE.Vector3, THREE.Vector3]> = []
  storytellers.forEach((storyteller1, i) => {
    storytellers.slice(i + 1).forEach((storyteller2) => {
      const sharedThemes = storyteller1.themes.filter(t => 
        storyteller2.themes.includes(t)
      )
      if (sharedThemes.length > 0 && storyteller1.position && storyteller2.position) {
        connections.push([storyteller1.position, storyteller2.position])
      }
    })
  })

  return (
    <group ref={starsRef}>
      {/* Background stars */}
      <Stars 
        radius={100} 
        depth={50} 
        count={5000} 
        factor={4} 
        saturation={0} 
        fade 
        speed={0.5}
      />

      {/* Theme labels (galaxies) */}
      {themes.map((theme) => (
        <group key={theme.id}>
          <Text
            position={[theme.center.x, theme.center.y + 2, theme.center.z]}
            fontSize={0.5}
            color={theme.color}
            anchorX="center"
            anchorY="middle"
          >
            {theme.name}
          </Text>
        </group>
      ))}

      {/* Connections between storytellers */}
      {connections.map((connection, index) => (
        <Line
          key={index}
          points={connection}
          color="#ffffff"
          lineWidth={0.5}
        />
      ))}

      {/* Storyteller stars */}
      {storytellers.map((storyteller) => (
        <group key={storyteller.id} position={storyteller.position}>
          {/* Star mesh */}
          <mesh
            onPointerOver={() => onStarHover(storyteller)}
            onPointerOut={() => onStarHover(null)}
            onClick={() => onStarClick(storyteller)}
          >
            <sphereGeometry args={[0.2, 16, 16]} />
            <meshBasicMaterial 
              color={ROLE_COLORS[storyteller.role]}
              emissive={ROLE_COLORS[storyteller.role]}
              emissiveIntensity={0.5}
            />
          </mesh>
          
          {/* Glow effect */}
          <pointLight
            color={ROLE_COLORS[storyteller.role]}
            intensity={0.5}
            distance={2}
          />
        </group>
      ))}
    </group>
  )
}

export function StoryConstellation({ storytellers = [], className = '' }: StoryConstellationProps) {
  const [hoveredStoryteller, setHoveredStoryteller] = useState<Storyteller | null>(null)
  const [selectedStoryteller, setSelectedStoryteller] = useState<Storyteller | null>(null)
  const [processedData, setProcessedData] = useState<{
    storytellers: Storyteller[]
    themes: Theme[]
  }>({ storytellers: [], themes: [] })

  useEffect(() => {
    // Process storytellers and calculate positions based on themes
    const themeMap = new Map<string, Theme>()
    const processedStorytellers: Storyteller[] = []

    // First pass: collect all themes
    storytellers.forEach((storyteller) => {
      storyteller.themes.forEach((themeName) => {
        if (!themeMap.has(themeName)) {
          const angle = (themeMap.size / 10) * Math.PI * 2
          const radius = 5 + Math.random() * 3
          themeMap.set(themeName, {
            id: themeName.toLowerCase().replace(/\s+/g, '-'),
            name: themeName,
            color: THEME_COLORS[themeMap.size % THEME_COLORS.length],
            center: new THREE.Vector3(
              Math.cos(angle) * radius,
              (Math.random() - 0.5) * 2,
              Math.sin(angle) * radius
            ),
            storytellers: []
          })
        }
        themeMap.get(themeName)!.storytellers.push(storyteller.id)
      })
    })

    // Second pass: position storytellers near their theme centers
    storytellers.forEach((storyteller) => {
      // Calculate average position based on all themes
      let avgX = 0, avgY = 0, avgZ = 0
      storyteller.themes.forEach((themeName) => {
        const theme = themeMap.get(themeName)!
        avgX += theme.center.x
        avgY += theme.center.y
        avgZ += theme.center.z
      })
      
      avgX /= storyteller.themes.length
      avgY /= storyteller.themes.length
      avgZ /= storyteller.themes.length

      // Add some randomness to avoid overlapping
      const position = new THREE.Vector3(
        avgX + (Math.random() - 0.5) * 2,
        avgY + (Math.random() - 0.5) * 1,
        avgZ + (Math.random() - 0.5) * 2
      )

      processedStorytellers.push({
        ...storyteller,
        position
      })
    })

    setProcessedData({
      storytellers: processedStorytellers,
      themes: Array.from(themeMap.values())
    })
  }, [storytellers])

  return (
    <div className={`relative w-full h-full bg-gray-900 ${className}`}>
      <Canvas
        camera={{ position: [0, 0, 15], fov: 75 }}
        gl={{ antialias: true }}
      >
        <ambientLight intensity={0.2} />
        <pointLight position={[10, 10, 10]} intensity={0.5} />
        
        <StarField
          storytellers={processedData.storytellers}
          themes={processedData.themes}
          onStarHover={setHoveredStoryteller}
          onStarClick={setSelectedStoryteller}
        />
        
        <OrbitControls
          enablePan={true}
          enableZoom={true}
          minDistance={5}
          maxDistance={30}
          autoRotate={true}
          autoRotateSpeed={0.5}
        />
      </Canvas>

      {/* Legend */}
      <div className="absolute top-4 left-4 bg-black/70 backdrop-blur-sm rounded-lg p-4">
        <h3 className="text-white font-semibold mb-3">Community Connections</h3>
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

      {/* Tutorial */}
      <div className="absolute bottom-4 right-4 bg-black/70 backdrop-blur-sm rounded-lg p-3 text-white text-sm">
        <p>Drag to rotate • Scroll to zoom • Click stars for details</p>
      </div>
    </div>
  )
}