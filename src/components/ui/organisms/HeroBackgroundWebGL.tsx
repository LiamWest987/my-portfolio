'use client'

import { useEffect, useRef, useState } from 'react'
import { GlassGridRenderer } from '@/lib/webgl/GlassGridRenderer'
import BackgroundAnimation from './BackgroundAnimation'

/**
 * Props for HeroBackgroundWebGL component
 */
export interface HeroBackgroundWebGLProps {
  /** Animation intensity (0-1 scale) */
  intensity?: number
  /** Additional CSS classes */
  className?: string
  /** Grid spacing in pixels */
  gridSpacing?: number
}

/**
 * WebGL-based hero background animation with blueprint aesthetic
 * and glass refraction effects.
 *
 * Features:
 * - Interactive grid with mouse-reactive distortion
 * - Spring physics for magnetic snap-back behavior
 * - Breathing animation with Perlin noise
 * - Glass overlay with refractive distortion
 * - Specular highlights simulating glass surface
 * - Respects prefers-reduced-motion
 * - Falls back to BackgroundAnimation if WebGL unavailable
 */
export default function HeroBackgroundWebGL({
  intensity = 1.0,
  className = '',
  gridSpacing = 30,
}: HeroBackgroundWebGLProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const rendererRef = useRef<GlassGridRenderer | null>(null)
  const animationFrameRef = useRef<number | null>(null)
  const lastTimeRef = useRef<number>(0)
  const [webglSupported, setWebglSupported] = useState<boolean | null>(null)
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)

  // Check for reduced motion preference
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    setPrefersReducedMotion(mediaQuery.matches)

    const handleChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches)
    }

    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [])

  // Initialize WebGL renderer
  useEffect(() => {
    if (prefersReducedMotion) {
      setWebglSupported(false)
      return
    }

    const canvas = canvasRef.current
    if (!canvas) return

    // Set canvas size to match display size
    const dpr = window.devicePixelRatio || 1
    const rect = canvas.getBoundingClientRect()
    canvas.width = rect.width * dpr
    canvas.height = rect.height * dpr

    // Check WebGL support
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl')
    if (!gl) {
      console.warn('WebGL not supported, falling back to CSS animation')
      setWebglSupported(false)
      return
    }

    setWebglSupported(true)

    // Create renderer
    try {
      const renderer = new GlassGridRenderer(canvas, {
        gridSpacing,
        nodeColor: [0.4, 0.6, 0.9],
        glowColor: [0.6, 0.9, 1.0],
      })
      rendererRef.current = renderer
    } catch (error) {
      console.error('Failed to initialize WebGL renderer:', error)
      setWebglSupported(false)
      return
    }

    // Animation loop
    const animate = (time: number) => {
      if (!rendererRef.current) return

      const deltaTime = lastTimeRef.current ? (time - lastTimeRef.current) / 1000 : 0.016
      lastTimeRef.current = time

      // Update physics and render
      rendererRef.current.update(deltaTime * intensity)
      rendererRef.current.render(time / 1000)

      animationFrameRef.current = requestAnimationFrame(animate)
    }

    // Start animation
    animationFrameRef.current = requestAnimationFrame(animate)

    // Cleanup
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
      if (rendererRef.current) {
        rendererRef.current.destroy()
        rendererRef.current = null
      }
    }
  }, [intensity, gridSpacing, prefersReducedMotion])

  // Handle mouse movement
  useEffect(() => {
    if (!rendererRef.current || prefersReducedMotion) return

    let lastMouseTime = performance.now()

    const handleMouseMove = (e: MouseEvent) => {
      if (!rendererRef.current) return

      const currentTime = performance.now()
      const deltaTime = (currentTime - lastMouseTime) / 1000
      lastMouseTime = currentTime

      // Use clientX/clientY since canvas is fixed to viewport
      rendererRef.current.updateMouse(e.clientX, e.clientY, deltaTime)
    }

    const handleMouseLeave = () => {
      if (!rendererRef.current) return
      rendererRef.current.deactivateMouse()
    }

    window.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseleave', handleMouseLeave)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseleave', handleMouseLeave)
    }
  }, [prefersReducedMotion])

  // Handle window resize
  useEffect(() => {
    if (!rendererRef.current || prefersReducedMotion) return

    let resizeTimeout: NodeJS.Timeout

    const handleResize = () => {
      // Debounce resize events
      clearTimeout(resizeTimeout)
      resizeTimeout = setTimeout(() => {
        if (rendererRef.current) {
          rendererRef.current.resize()
        }
      }, 300)
    }

    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
      clearTimeout(resizeTimeout)
    }
  }, [prefersReducedMotion])

  // Handle visibility change (pause when tab hidden)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        // Pause animation
        if (animationFrameRef.current) {
          cancelAnimationFrame(animationFrameRef.current)
          animationFrameRef.current = null
        }
      } else {
        // Resume animation
        if (rendererRef.current && !animationFrameRef.current) {
          lastTimeRef.current = 0 // Reset time to avoid large delta
          const animate = (time: number) => {
            if (!rendererRef.current) return

            const deltaTime = lastTimeRef.current ? (time - lastTimeRef.current) / 1000 : 0.016
            lastTimeRef.current = time

            rendererRef.current.update(deltaTime * intensity)
            rendererRef.current.render(time / 1000)

            animationFrameRef.current = requestAnimationFrame(animate)
          }
          animationFrameRef.current = requestAnimationFrame(animate)
        }
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [intensity])

  // Fallback to CSS animation if WebGL not supported or reduced motion
  if (webglSupported === false || prefersReducedMotion) {
    return <BackgroundAnimation variant="full" className={className} />
  }

  // Always render canvas (will initialize via useEffect)
  return (
    <canvas
      ref={canvasRef}
      className={`fixed left-0 top-0 -z-10 h-full w-full ${className}`}
      aria-hidden="true"
      style={{
        pointerEvents: 'none',
      }}
    />
  )
}
