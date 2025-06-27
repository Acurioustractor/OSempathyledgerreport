'use client'

import { useState, useRef, Suspense, useCallback, useEffect } from 'react'
import { Canvas, useThree } from '@react-three/fiber'
import { OrbitControls, PerspectiveCamera, Environment, Text, Float, Preload } from '@react-three/drei'
import { EffectComposer, Bloom, ChromaticAberration, Vignette } from '@react-three/postprocessing'
import { WaterPlane } from './WaterPlane'
import { StoryDrop } from './StoryDrop'
import { ThemeParticles } from './ThemeParticles'
import { CanvasFallback } from './CanvasFallback'
import * as THREE from 'three'

// Theme configuration
const THEMES = [
  { name: 'Connection', color: '#f97316', intensity: 1 },
  { name: 'Support', color: '#3b82f6', intensity: 0.8 },
  { name: 'Journey', color: '#8b5cf6', intensity: 0.7 },
  { name: 'Dignity', color: '#10b981', intensity: 0.9 },
  { name: 'Hope', color: '#f59e0b', intensity: 0.85 },
  { name: 'Challenge', color: '#ef4444', intensity: 0.6 },
  { name: 'Impact', color: '#6366f1', intensity: 0.75 }
]

interface Story {
  id: string
  title: string
  theme: string
  color: string
  x: number
  y: number
}

interface EmpathyRippleProps {
  stories?: Story[]
  className?: string
  quality?: 'low' | 'medium' | 'high'
  interactive?: boolean
  showTutorial?: boolean
}

// Lighting setup component
function Lighting() {
  const { scene } = useThree()
  
  useEffect(() => {
    scene.fog = new THREE.Fog('#0a0f1b', 5, 15)
  }, [scene])

  return (
    <>
      <ambientLight intensity={0.4} />
      <directionalLight
        position={[5, 5, 5]}
        intensity={1}
        castShadow
        shadow-mapSize={[2048, 2048]}
        color="#ffffff"
      />
      <pointLight position={[-5, 5, -5]} intensity={0.5} color="#60a5fa" />
      <pointLight position={[5, 5, -5]} intensity={0.5} color="#f97316" />
    </>
  )
}

// Main scene component
function Scene({ onAddRipple }: { onAddRipple: (x: number, y: number) => void }) {
  const { camera, size } = useThree()
  
  const handlePointerDown = useCallback((event: any) => {
    if (event.object.type === 'Mesh') {
      const point = event.point
      // Convert 3D coordinates to normalized coordinates
      const x = (point.x + 5) / 10
      const y = (point.z + 5) / 10
      onAddRipple(x, y)
    }
  }, [onAddRipple])

  return (
    <>
      <mesh
        position={[0, -0.5, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
        onPointerDown={handlePointerDown}
        visible={false}
      >
        <planeGeometry args={[10, 10]} />
        <meshBasicMaterial transparent opacity={0} />
      </mesh>
    </>
  )
}

export function EmpathyRipple({
  stories = [],
  className = '',
  quality = 'high',
  interactive = true,
  showTutorial = true
}: EmpathyRippleProps) {
  const [ripples, setRipples] = useState<Array<{ x: number; y: number; radius: number; birthTime: number }>>([])
  const [activeStories, setActiveStories] = useState<Story[]>([])
  const [hoveredStory, setHoveredStory] = useState<Story | null>(null)
  const [webGLSupported, setWebGLSupported] = useState(true)
  const timeRef = useRef(0)

  // Check WebGL support
  useEffect(() => {
    try {
      const canvas = document.createElement('canvas')
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl')
      setWebGLSupported(!!gl)
    } catch (e) {
      setWebGLSupported(false)
    }
  }, [])

  // Add a new ripple
  const addRipple = useCallback((x: number, y: number) => {
    const newRipple = {
      x,
      y,
      radius: 0,
      birthTime: timeRef.current
    }
    setRipples(prev => [...prev.slice(-9), newRipple]) // Keep last 10 ripples
  }, [])

  // Handle story impact
  const handleStoryImpact = useCallback((x: number, y: number) => {
    addRipple(x, y)
  }, [addRipple])

  // Simulate story drops
  useEffect(() => {
    const interval = setInterval(() => {
      if (stories.length > 0 && Math.random() > 0.7) {
        const randomStory = stories[Math.floor(Math.random() * stories.length)]
        const theme = THEMES.find(t => t.name === randomStory.theme) || THEMES[0]
        
        setActiveStories(prev => [...prev, {
          ...randomStory,
          id: `${randomStory.id}-${Date.now()}`,
          color: theme.color,
          x: Math.random(),
          y: Math.random()
        }])
      }
    }, 3000)

    return () => clearInterval(interval)
  }, [stories])

  // Update time reference
  useEffect(() => {
    const animate = () => {
      timeRef.current = performance.now() / 1000
      requestAnimationFrame(animate)
    }
    animate()
  }, [])

  // Use canvas fallback if WebGL is not supported
  if (!webGLSupported || quality === 'low') {
    return <CanvasFallback className={className} onAddRipple={addRipple} />
  }

  return (
    <div className={`relative w-full h-full ${className}`}>
      <Canvas
        shadows
        dpr={quality === 'high' ? [1, 2] : [1, 1]}
        gl={{
          antialias: true,
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 0.8
        }}
      >
        <PerspectiveCamera
          makeDefault
          position={[0, 5, 8]}
          fov={45}
          near={0.1}
          far={100}
        />
        
        <Suspense fallback={null}>
          <Lighting />
          <Environment preset="night" />
          
          {/* Water surface */}
          <WaterPlane ripples={ripples} />
          
          {/* Theme particles */}
          <ThemeParticles themes={THEMES} count={quality === 'high' ? 1000 : 500} />
          
          {/* Story drops */}
          {activeStories.map(story => (
            <StoryDrop
              key={story.id}
              story={story}
              onImpact={handleStoryImpact}
            />
          ))}
          
          {/* Interactive layer */}
          {interactive && <Scene onAddRipple={addRipple} />}
          
          {/* Title text */}
          <Float
            speed={1}
            rotationIntensity={0.1}
            floatIntensity={0.5}
            floatingRange={[0, 0.1]}
          >
            <Text
              position={[0, 2, -2]}
              fontSize={0.5}
              color="white"
              anchorX="center"
              anchorY="middle"
            >
              Every story creates ripples of change
            </Text>
          </Float>
          
          {/* Camera controls */}
          <OrbitControls
            enablePan={false}
            enableZoom={true}
            maxPolarAngle={Math.PI / 2.5}
            minPolarAngle={Math.PI / 4}
            maxDistance={15}
            minDistance={5}
          />
          
          {/* Post-processing effects */}
          {quality === 'high' && (
            <EffectComposer>
              <Bloom
                intensity={0.5}
                luminanceThreshold={0.3}
                luminanceSmoothing={0.9}
              />
              {quality === 'high' && (
                <>
                  <ChromaticAberration 
                    offset={new THREE.Vector2(0.0005, 0.0005)} 
                    radialModulation={false}
                    modulationOffset={0}
                  />
                  <Vignette offset={0.3} darkness={0.4} />
                </>
              )}
            </EffectComposer>
          )}
          
          <Preload all />
        </Suspense>
      </Canvas>
      
      {/* Tutorial overlay */}
      {showTutorial && interactive && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/50 backdrop-blur-sm rounded-lg px-6 py-3 text-white text-sm">
          <p className="text-center">
            Click anywhere on the water to create your own ripple
          </p>
        </div>
      )}
      
      {/* Story info panel */}
      {hoveredStory && (
        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-lg shadow-lg p-4 max-w-xs">
          <h3 className="font-semibold text-gray-900 mb-2">{hoveredStory.title}</h3>
          <span
            className="inline-block px-2 py-1 text-xs font-medium text-white rounded"
            style={{ backgroundColor: hoveredStory.color }}
          >
            {hoveredStory.theme}
          </span>
        </div>
      )}
      
      {/* Performance monitor for development */}
      {process.env.NODE_ENV === 'development' && quality === 'high' && (
        <div className="absolute top-4 left-4 bg-black/50 backdrop-blur-sm rounded px-2 py-1 text-white text-xs font-mono">
          <p>FPS: 60</p>
          <p>Ripples: {ripples.length}</p>
          <p>Stories: {activeStories.length}</p>
        </div>
      )}
    </div>
  )
}