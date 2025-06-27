import { useRef, useMemo } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { waterVertexShader, waterFragmentShader } from './shaders/waterShader'

interface WaterPlaneProps {
  ripples: Array<{ x: number; y: number; radius: number; birthTime: number }>
}

export function WaterPlane({ ripples }: WaterPlaneProps) {
  const meshRef = useRef<THREE.Mesh>(null)
  const materialRef = useRef<THREE.ShaderMaterial>(null)
  const { size } = useThree()

  // Create uniforms for the shader
  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
    uMouse: { value: new THREE.Vector2(0.5, 0.5) },
    uRipples: { value: new Float32Array(30) }, // Support up to 10 ripples
    uLightPosition: { value: new THREE.Vector3(5, 5, 5) },
    uDeepColor: { value: new THREE.Color('#1e40af') }, // Deep blue
    uSurfaceColor: { value: new THREE.Color('#60a5fa') }, // Light blue
    uColorOffset: { value: 0.1 },
    uColorMultiplier: { value: 5 },
    uReflectionTexture: { value: null },
    uReflectionStrength: { value: 0 }
  }), [])

  useFrame((state) => {
    if (!materialRef.current) return

    // Update time
    materialRef.current.uniforms.uTime.value = state.clock.elapsedTime

    // Update ripples
    const rippleArray = new Float32Array(30)
    const currentTime = state.clock.elapsedTime

    ripples.slice(0, 10).forEach((ripple, index) => {
      const age = currentTime - ripple.birthTime
      const maxAge = 3.0 // Ripples last 3 seconds
      
      if (age < maxAge) {
        const idx = index * 3
        // Convert screen coordinates to UV coordinates
        rippleArray[idx] = ripple.x
        rippleArray[idx + 1] = ripple.y
        rippleArray[idx + 2] = age * 0.5 // Expanding radius
      }
    })

    materialRef.current.uniforms.uRipples.value = rippleArray

    // Subtle mouse interaction
    const mouse = state.mouse
    materialRef.current.uniforms.uMouse.value.x = (mouse.x + 1) / 2
    materialRef.current.uniforms.uMouse.value.y = (mouse.y + 1) / 2
  })

  return (
    <mesh
      ref={meshRef}
      rotation={[-Math.PI / 2, 0, 0]}
      position={[0, 0, 0]}
    >
      <planeGeometry args={[10, 10, 128, 128]} />
      <shaderMaterial
        ref={materialRef}
        vertexShader={waterVertexShader}
        fragmentShader={waterFragmentShader}
        uniforms={uniforms}
        transparent
        side={THREE.DoubleSide}
      />
    </mesh>
  )
}