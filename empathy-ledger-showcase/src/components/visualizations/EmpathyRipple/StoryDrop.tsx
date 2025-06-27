import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { Text, Sphere } from '@react-three/drei'

interface StoryDropProps {
  story: {
    id: string
    title: string
    theme: string
    color: string
    x: number
    y: number
  }
  onImpact: (x: number, y: number) => void
}

export function StoryDrop({ story, onImpact }: StoryDropProps) {
  const groupRef = useRef<THREE.Group>(null)
  const sphereRef = useRef<THREE.Mesh>(null)
  const trailRef = useRef<THREE.Points>(null)
  const hasImpacted = useRef(false)
  const startY = 8
  const targetY = 0.1
  const fallDuration = 5 // Slower fall
  const startTime = useRef(0)

  useFrame((state) => {
    if (!groupRef.current || hasImpacted.current) return

    // Initialize start time
    if (startTime.current === 0) {
      startTime.current = state.clock.elapsedTime
    }

    const elapsed = state.clock.elapsedTime - startTime.current
    const progress = Math.min(elapsed / fallDuration, 1)
    
    // Easing function for natural fall
    const easeOut = 1 - Math.pow(1 - progress, 3)
    
    // Update position
    groupRef.current.position.y = startY + (targetY - startY) * easeOut
    
    // Add subtle rotation
    if (sphereRef.current) {
      sphereRef.current.rotation.x += 0.02
      sphereRef.current.rotation.z += 0.01
    }

    // Check for impact
    if (progress >= 0.98 && !hasImpacted.current) {
      hasImpacted.current = true
      onImpact(story.x, story.y)
      
      // Start fade out after impact
      setTimeout(() => {
        if (groupRef.current) {
          groupRef.current.visible = false
        }
      }, 1000)
    }
  })

  return (
    <group ref={groupRef} position={[(story.x - 0.5) * 8, startY, (story.y - 0.5) * 8]}>
      <Sphere ref={sphereRef} args={[0.3, 32, 32]}> {/* Larger sphere */}
        <meshStandardMaterial
          color={story.color}
          emissive={story.color}
          emissiveIntensity={0.5}
          metalness={0.8}
          roughness={0.2}
        />
      </Sphere>
      
      {/* Enhanced glow effect */}
      <pointLight
        color={story.color}
        intensity={5}
        distance={3}
      />
      
      {/* Additional rim light */}
      <Sphere args={[0.35, 32, 32]}>
        <meshBasicMaterial
          color={story.color}
          transparent
          opacity={0.3}
        />
      </Sphere>
      
      {/* Story label (always visible) */}
      <Text
        position={[0, 0.6, 0]}
        fontSize={0.2}
        color="white"
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.02}
        outlineColor="black"
      >
        {story.theme}
      </Text>
    </group>
  )
}