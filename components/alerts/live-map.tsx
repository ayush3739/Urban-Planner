"use client"

import { useEffect, useRef } from "react"

interface LiveMapProps {
  alerts: Array<{
    id: string
    type: "fire" | "flood" | "storm" | "heatwave"
    lat: number
    lon: number
  }>
}

export function LiveMap({ alerts }: LiveMapProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    let animationFrameId: number
    let pulseTime = 0

    const resize = () => {
      canvas.width = canvas.offsetWidth * window.devicePixelRatio
      canvas.height = canvas.offsetHeight * window.devicePixelRatio
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio)
    }

    resize()
    window.addEventListener("resize", resize)

    const drawMap = () => {
      const width = canvas.offsetWidth
      const height = canvas.offsetHeight

      // Clear canvas
      ctx.fillStyle = "oklch(0.15 0 0)"
      ctx.fillRect(0, 0, width, height)

      // Draw grid
      ctx.strokeStyle = "oklch(0.22 0 0 / 0.5)"
      ctx.lineWidth = 1
      for (let x = 0; x < width; x += 50) {
        ctx.beginPath()
        ctx.moveTo(x, 0)
        ctx.lineTo(x, height)
        ctx.stroke()
      }
      for (let y = 0; y < height; y += 50) {
        ctx.beginPath()
        ctx.moveTo(0, y)
        ctx.lineTo(width, y)
        ctx.stroke()
      }

      // Draw city outline
      ctx.strokeStyle = "oklch(0.3 0 0)"
      ctx.lineWidth = 2
      ctx.strokeRect(width * 0.1, height * 0.1, width * 0.8, height * 0.8)

      // Draw zones
      const zones = [
        { x: 0.15, y: 0.15, w: 0.3, h: 0.25, label: "Zone A" },
        { x: 0.5, y: 0.15, w: 0.35, h: 0.3, label: "Zone B" },
        { x: 0.15, y: 0.45, w: 0.25, h: 0.4, label: "Zone C" },
        { x: 0.45, y: 0.5, w: 0.4, h: 0.35, label: "Zone D" },
      ]

      zones.forEach((zone) => {
        const x = zone.x * width
        const y = zone.y * height
        const w = zone.w * width
        const h = zone.h * height

        ctx.fillStyle = "oklch(0.2 0 0 / 0.5)"
        ctx.fillRect(x, y, w, h)
        ctx.strokeStyle = "oklch(0.3 0 0)"
        ctx.strokeRect(x, y, w, h)

        ctx.fillStyle = "oklch(0.6 0 0 / 0.5)"
        ctx.font = "12px sans-serif"
        ctx.fillText(zone.label, x + 10, y + 20)
      })

      // Draw alert points
      alerts.forEach((alert, i) => {
        const x = alert.lon * width
        const y = alert.lat * height
        const pulse = Math.sin(pulseTime * 2 + i) * 0.5 + 0.5

        let color = ""
        switch (alert.type) {
          case "fire":
            color = "oklch(0.6 0.22 30)"
            break
          case "flood":
            color = "oklch(0.65 0.2 180)"
            break
          case "storm":
            color = "oklch(0.5 0.15 280)"
            break
          case "heatwave":
            color = "oklch(0.6 0.22 30)"
            break
        }

        // Outer pulse
        ctx.beginPath()
        ctx.arc(x, y, 20 + pulse * 10, 0, Math.PI * 2)
        ctx.fillStyle = `${color.slice(0, -1)} / ${0.1 + pulse * 0.1})`
        ctx.fill()

        // Middle ring
        ctx.beginPath()
        ctx.arc(x, y, 12, 0, Math.PI * 2)
        ctx.fillStyle = `${color.slice(0, -1)} / 0.3)`
        ctx.fill()

        // Inner dot
        ctx.beginPath()
        ctx.arc(x, y, 6, 0, Math.PI * 2)
        ctx.fillStyle = color
        ctx.fill()

        // Glow
        ctx.beginPath()
        ctx.arc(x, y, 8, 0, Math.PI * 2)
        ctx.strokeStyle = `${color.slice(0, -1)} / ${0.5 + pulse * 0.3})`
        ctx.lineWidth = 2
        ctx.stroke()
      })

      pulseTime += 0.03
      animationFrameId = requestAnimationFrame(drawMap)
    }

    drawMap()

    return () => {
      window.removeEventListener("resize", resize)
      cancelAnimationFrame(animationFrameId)
    }
  }, [alerts])

  return (
    <div className="relative w-full h-full rounded-2xl overflow-hidden bg-card border border-border">
      <canvas ref={canvasRef} className="w-full h-full" style={{ width: "100%", height: "100%" }} />
      <div className="absolute top-4 left-4 bg-card/80 backdrop-blur-sm px-3 py-2 rounded-lg border border-border">
        <p className="text-xs font-medium">Live NASA Data Feed</p>
      </div>
    </div>
  )
}
