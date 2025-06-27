'use client'

import { useState, useRef, Suspense, useCallback, useEffect } from 'react'
import { Canvas, useThree } from '@react-three/fiber'
import { PerspectiveCamera, Environment, Text, Float, Preload, OrbitControls } from '@react-three/drei'
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
function Scene({ onAddRipple, onMouseMove }: { 
  onAddRipple: (x: number, y: number) => void
  onMouseMove: (x: number, y: number) => void 
}) {
  const { camera, raycaster, mouse } = useThree()
  const planeRef = useRef<THREE.Mesh>(null)
  
  const handlePointerDown = useCallback((event: any) => {
    event.stopPropagation()
    const point = event.point
    // Convert 3D coordinates to normalized coordinates (0-1)
    const x = (point.x + 5) / 10
    const y = (point.z + 5) / 10
    onAddRipple(x, y)
  }, [onAddRipple])

  const handlePointerMove = useCallback((event: any) => {
    if (planeRef.current) {
      // Update raycaster
      raycaster.setFromCamera(mouse, camera)
      
      // Create a plane at y=0
      const plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0)
      const intersection = new THREE.Vector3()
      
      if (raycaster.ray.intersectPlane(plane, intersection)) {
        // Convert world coordinates to normalized coordinates (0-1)
        const x = (intersection.x + 5) / 10
        const y = (intersection.z + 5) / 10
        onMouseMove(x, y)
      }
    }
  }, [camera, raycaster, mouse, onMouseMove])

  return (
    <>
      <mesh
        ref={planeRef}
        position={[0, 0, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
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
  const [impactedStories, setImpactedStories] = useState<Story[]>([])
  const [webGLSupported, setWebGLSupported] = useState(true)
  const [mousePosition, setMousePosition] = useState({ x: 0.5, y: 0.5 })
  const timeRef = useRef(0)
  const lastRippleTime = useRef(0)

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
  const handleStoryImpact = useCallback((x: number, y: number, story: Story) => {
    addRipple(x, y)
    
    // Add to impacted stories for display
    setImpactedStories(prev => {
      const newStories = [...prev, story]
      // Keep only last 3 stories
      return newStories.slice(-3)
    })
    
    // Remove after 5 seconds
    setTimeout(() => {
      setImpactedStories(prev => prev.filter(s => s.id !== story.id))
    }, 5000)
  }, [addRipple])

  // Handle mouse movement
  const handleMouseMove = useCallback((x: number, y: number) => {
    setMousePosition({ x, y })
    
    // Create ripples as mouse moves (throttled)
    const currentTime = timeRef.current
    if (currentTime - lastRippleTime.current > 0.1) { // Create ripple every 100ms
      lastRippleTime.current = currentTime
      addRipple(x, y)
    }
  }, [addRipple])

  // Simulate story drops
  useEffect(() => {
    // Drop a story immediately if we have any
    if (stories.length > 0) {
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

    const interval = setInterval(() => {
      if (stories.length > 0) {
        const randomStory = stories[Math.floor(Math.random() * stories.length)]
        const theme = THEMES.find(t => t.name === randomStory.theme) || THEMES[0]
        
        setActiveStories(prev => {
          // Keep only last 5 stories to avoid performance issues
          const newStories = [...prev, {
            ...randomStory,
            id: `${randomStory.id}-${Date.now()}`,
            color: theme.color,
            x: Math.random(),
            y: Math.random()
          }]
          return newStories.slice(-5)
        })
      }
    }, 2000) // Drop every 2 seconds

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
          position={[0, 10, 0]}
          rotation={[-Math.PI / 2, 0, 0]}
          fov={50}
          near={0.1}
          far={100}
        />
        
        <Suspense fallback={null}>
          <Lighting />
          <Environment preset="night" />
          
          {/* Water surface */}
          <WaterPlane ripples={ripples} mousePosition={mousePosition} />
          
          {/* Theme particles */}
          <ThemeParticles themes={THEMES} count={quality === 'high' ? 1000 : 500} />
          
          {/* Story drops */}
          {activeStories.map(story => (
            <StoryDrop
              key={story.id}
              story={story}
              onImpact={(x, y) => handleStoryImpact(x, y, story)}
            />
          ))}
          
          {/* Interactive layer */}
          {interactive && <Scene onAddRipple={addRipple} onMouseMove={handleMouseMove} />}
          
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
          
          {/* Camera is fixed - no controls */}
          
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
      
      {/* Story impact panels */}
      <div className="absolute bottom-20 left-0 right-0 flex justify-center gap-4 px-4">
        {impactedStories.map((story, index) => (
          <div
            key={story.id}
            className="bg-black/80 backdrop-blur-sm rounded-lg shadow-xl p-4 max-w-sm animate-fade-in"
            style={{
              animation: 'fadeIn 0.5s ease-out',
              animationDelay: `${index * 0.1}s`
            }}
          >
            <h3 className="font-semibold text-white mb-2">{story.title}</h3>
            <span
              className="inline-block px-3 py-1 text-sm font-medium text-white rounded-full"
              style={{ backgroundColor: story.color }}
            >
              {story.theme}
            </span>
          </div>
        ))}
      </div>
      
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