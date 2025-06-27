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
  const hasImpacted = useRef(false)
  const startY = 5
  const targetY = 0.1
  const fallDuration = 2

  useFrame((state) => {
    if (!groupRef.current || hasImpacted.current) return

    const elapsed = state.clock.elapsedTime
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
    <group ref={groupRef} position={[story.x * 5 - 2.5, startY, story.y * 5 - 2.5]}>
      <Sphere ref={sphereRef} args={[0.1, 32, 32]}>
        <meshStandardMaterial
          color={story.color}
          emissive={story.color}
          emissiveIntensity={0.5}
          metalness={0.8}
          roughness={0.2}
        />
      </Sphere>
      
      {/* Glow effect */}
      <pointLight
        color={story.color}
        intensity={2}
        distance={1}
      />
      
      {/* Story label (appears on hover) */}
      <Text
        position={[0, 0.3, 0]}
        fontSize={0.15}
        color="white"
        anchorX="center"
        anchorY="middle"
        visible={false} // Toggle on hover
      >
        {story.title}
      </Text>
    </group>
  )
}