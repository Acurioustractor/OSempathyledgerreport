'use client'

import { useEffect, useRef, useState } from 'react'

interface Ripple {
  x: number
  y: number
  radius: number
  maxRadius: number
  opacity: number
  color: string
}

interface CanvasFallbackProps {
  className?: string
  onAddRipple?: (x: number, y: number) => void
}

export function CanvasFallback({ className = '', onAddRipple }: CanvasFallbackProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [ripples, setRipples] = useState<Ripple[]>([])
  const animationRef = useRef<number>()

  const colors = ['#f97316', '#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444', '#6366f1']

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = canvas.offsetWidth * window.devicePixelRatio
      canvas.height = canvas.offsetHeight * window.devicePixelRatio
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio)
    }
    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)

    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.offsetWidth, canvas.offsetHeight)

      // Draw gradient background
      const gradient = ctx.createRadialGradient(
        canvas.offsetWidth / 2,
        canvas.offsetHeight / 2,
        0,
        canvas.offsetWidth / 2,
        canvas.offsetHeight / 2,
        canvas.offsetWidth / 2
      )
      gradient.addColorStop(0, '#1e40af20')
      gradient.addColorStop(1, '#0a0f1b')
      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, canvas.offsetWidth, canvas.offsetHeight)

      // Update and draw ripples
      setRipples(prevRipples => {
        const updatedRipples = prevRipples
          .map(ripple => ({
            ...ripple,
            radius: ripple.radius + 2,
            opacity: Math.max(0, ripple.opacity - 0.01)
          }))
          .filter(ripple => ripple.opacity > 0)

        updatedRipples.forEach(ripple => {
          ctx.beginPath()
          ctx.arc(ripple.x, ripple.y, ripple.radius, 0, Math.PI * 2)
          ctx.strokeStyle = `${ripple.color}${Math.floor(ripple.opacity * 255).toString(16).padStart(2, '0')}`
          ctx.lineWidth = 2
          ctx.stroke()

          // Inner glow
          const innerGradient = ctx.createRadialGradient(
            ripple.x,
            ripple.y,
            0,
            ripple.x,
            ripple.y,
            ripple.radius
          )
          innerGradient.addColorStop(0, `${ripple.color}40`)
          innerGradient.addColorStop(1, `${ripple.color}00`)
          ctx.fillStyle = innerGradient
          ctx.fill()
        })

        return updatedRipples
      })

      animationRef.current = requestAnimationFrame(animate)
    }

    animate()

    // Auto-generate ripples
    const interval = setInterval(() => {
      const x = Math.random() * canvas.offsetWidth
      const y = Math.random() * canvas.offsetHeight
      const color = colors[Math.floor(Math.random() * colors.length)]
      
      setRipples(prev => [...prev, {
        x,
        y,
        radius: 0,
        maxRadius: 200,
        opacity: 0.8,
        color
      }])
    }, 2000)

    // Handle clicks
    const handleClick = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top
      const color = colors[Math.floor(Math.random() * colors.length)]
      
      setRipples(prev => [...prev, {
        x,
        y,
        radius: 0,
        maxRadius: 300,
        opacity: 1,
        color
      }])

      if (onAddRipple) {
        onAddRipple(x / canvas.offsetWidth, y / canvas.offsetHeight)
      }
    }

    canvas.addEventListener('click', handleClick)

    return () => {
      window.removeEventListener('resize', resizeCanvas)
      canvas.removeEventListener('click', handleClick)
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
      clearInterval(interval)
    }
  }, [colors, onAddRipple])

  return (
    <div className={`relative w-full h-full ${className}`}>
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full cursor-pointer"
      />
      
      {/* Title overlay */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="text-center">
          <h2 className="text-4xl font-bold text-white mb-4 drop-shadow-lg">
            Every Story Creates Ripples of Change
          </h2>
          <p className="text-white/60 text-sm">
            Click anywhere to create your own ripple
          </p>
        </div>
      </div>
    </div>
  )
}