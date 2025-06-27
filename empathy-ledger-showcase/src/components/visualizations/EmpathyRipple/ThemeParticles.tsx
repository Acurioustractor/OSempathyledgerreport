import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { particleVertexShader, particleFragmentShader } from './shaders/waterShader'

interface ThemeParticlesProps {
  count?: number
  themes: Array<{
    name: string
    color: string
    intensity: number
  }>
}

export function ThemeParticles({ count = 500, themes }: ThemeParticlesProps) {
  const pointsRef = useRef<THREE.Points>(null)
  const materialRef = useRef<THREE.ShaderMaterial>(null)

  // Generate particles
  const particles = useMemo(() => {
    const positions = new Float32Array(count * 3)
    const colors = new Float32Array(count * 3)
    const scales = new Float32Array(count)
    const randomness = new Float32Array(count * 3)
    const speeds = new Float32Array(count)

    for (let i = 0; i < count; i++) {
      // Position in a circular area
      const angle = Math.random() * Math.PI * 2
      const radius = Math.sqrt(Math.random()) * 4
      positions[i * 3] = Math.cos(angle) * radius
      positions[i * 3 + 1] = 0.1 + Math.random() * 0.2
      positions[i * 3 + 2] = Math.sin(angle) * radius

      // Assign theme colors
      const theme = themes[Math.floor(Math.random() * themes.length)]
      const color = new THREE.Color(theme.color)
      colors[i * 3] = color.r
      colors[i * 3 + 1] = color.g
      colors[i * 3 + 2] = color.b

      // Random properties
      scales[i] = 0.5 + Math.random() * 1.5
      randomness[i * 3] = Math.random()
      randomness[i * 3 + 1] = Math.random()
      randomness[i * 3 + 2] = Math.random()
      speeds[i] = 0.2 + Math.random() * 0.8
    }

    return {
      positions,
      colors,
      scales,
      randomness,
      speeds
    }
  }, [count, themes])

  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
    uSize: { value: 30 }
  }), [])

  useFrame((state) => {
    if (!materialRef.current) return
    materialRef.current.uniforms.uTime.value = state.clock.elapsedTime

    // Update particle positions based on ripples
    if (pointsRef.current) {
      const positions = pointsRef.current.geometry.attributes.position
      const time = state.clock.elapsedTime

      for (let i = 0; i < count; i++) {
        const i3 = i * 3
        const x = positions.array[i3]
        const z = positions.array[i3 + 2]
        
        // Create flowing motion
        const angle = Math.atan2(z, x)
        const radius = Math.sqrt(x * x + z * z)
        const flowSpeed = 0.1
        
        // Spiral outward motion
        const newRadius = radius + flowSpeed * 0.01
        const newAngle = angle + flowSpeed * 0.02
        
        // Update positions with bounds checking
        if (newRadius < 5) {
          positions.array[i3] = Math.cos(newAngle) * newRadius
          positions.array[i3 + 2] = Math.sin(newAngle) * newRadius
        } else {
          // Reset to center
          const resetAngle = Math.random() * Math.PI * 2
          const resetRadius = Math.random() * 0.5
          positions.array[i3] = Math.cos(resetAngle) * resetRadius
          positions.array[i3 + 2] = Math.sin(resetAngle) * resetRadius
        }
      }

      positions.needsUpdate = true
    }
  })

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={particles.positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={count}
          array={particles.colors}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-aScale"
          count={count}
          array={particles.scales}
          itemSize={1}
        />
        <bufferAttribute
          attach="attributes-aRandomness"
          count={count}
          array={particles.randomness}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-aSpeed"
          count={count}
          array={particles.speeds}
          itemSize={1}
        />
      </bufferGeometry>
      <shaderMaterial
        ref={materialRef}
        vertexShader={particleVertexShader}
        fragmentShader={particleFragmentShader}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        vertexColors
      />
    </points>
  )
}