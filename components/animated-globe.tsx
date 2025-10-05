"use client"

import { useEffect, useRef } from "react"

export function AnimatedGlobe() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    let animationFrameId: number
    let rotation = 0

    const resize = () => {
      canvas.width = canvas.offsetWidth * window.devicePixelRatio
      canvas.height = canvas.offsetHeight * window.devicePixelRatio
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio)
    }

    resize()
    window.addEventListener("resize", resize)

    const drawGlobe = () => {
      const width = canvas.offsetWidth
      const height = canvas.offsetHeight
      const centerX = width / 2
      const centerY = height / 2
      const radius = Math.min(width, height) * 0.35

      ctx.clearRect(0, 0, width, height)

      // Draw globe outline - Enhanced with brighter colors
      ctx.beginPath()
      ctx.arc(centerX, centerY, radius, 0, Math.PI * 2)
      ctx.strokeStyle = "oklch(0.75 0.25 200 / 0.7)"
      ctx.lineWidth = 3
      ctx.stroke()

      // Draw latitude lines - Enhanced visibility
      for (let i = -2; i <= 2; i++) {
        ctx.beginPath()
        const y = centerY + (i * radius) / 3
        const width = Math.sqrt(radius * radius - ((i * radius) / 3) ** 2) * 2
        ctx.ellipse(centerX, y, width / 2, radius / 8, 0, 0, Math.PI * 2)
        ctx.strokeStyle = "oklch(0.7 0.22 190 / 0.5)"
        ctx.lineWidth = 1.5
        ctx.stroke()
      }

      // Draw longitude lines - Enhanced visibility
      for (let i = 0; i < 8; i++) {
        const angle = (i * Math.PI) / 4 + rotation
        ctx.beginPath()
        ctx.ellipse(centerX, centerY, radius * Math.abs(Math.cos(angle)), radius, 0, 0, Math.PI * 2)
        ctx.strokeStyle = "oklch(0.7 0.22 190 / 0.5)"
        ctx.lineWidth = 1.5
        ctx.stroke()
      }

      // Draw city points
      const cities = [
        { lat: 0.3, lon: 0.2 + rotation },
        { lat: -0.4, lon: 0.8 + rotation },
        { lat: 0.6, lon: 1.5 + rotation },
        { lat: -0.2, lon: 2.3 + rotation },
        { lat: 0.5, lon: 3.0 + rotation },
      ]

      cities.forEach((city) => {
        const x = centerX + radius * Math.cos(city.lat) * Math.sin(city.lon)
        const y = centerY + radius * Math.sin(city.lat)
        const z = radius * Math.cos(city.lat) * Math.cos(city.lon)

        if (z > 0) {
          // Enhanced city points with brighter colors
          ctx.beginPath()
          ctx.arc(x, y, 5, 0, Math.PI * 2)
          ctx.fillStyle = "oklch(0.75 0.25 140)"
          ctx.fill()

          // Enhanced glow effect
          ctx.beginPath()
          ctx.arc(x, y, 10, 0, Math.PI * 2)
          ctx.fillStyle = "oklch(0.7 0.25 140 / 0.4)"
          ctx.fill()
        }
      })

      rotation += 0.003
      animationFrameId = requestAnimationFrame(drawGlobe)
    }

    drawGlobe()

    return () => {
      window.removeEventListener("resize", resize)
      cancelAnimationFrame(animationFrameId)
    }
  }, [])

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" style={{ width: "100%", height: "100%" }} />
}
