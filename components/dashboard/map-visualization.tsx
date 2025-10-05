"use client"

import { useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Navigation, Loader2, MapPin } from "lucide-react"

type DataLayer = "heat" | "green" | "water" | "aqi"

interface MapVisualizationProps {
  layer: DataLayer
  latitude: number
  longitude: number
  locationName: string
}

export function MapVisualization({ layer, latitude, longitude, locationName }: MapVisualizationProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [userLocation, setUserLocation] = useState<{ lat: number, lng: number } | null>(null)
  const [locationLoading, setLocationLoading] = useState(false)
  const [showUserLocation, setShowUserLocation] = useState(false)

  const getCurrentLocation = () => {
    setLocationLoading(true)

    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser")
      setLocationLoading(false)
      return
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude: lat, longitude: lng } = position.coords
        setUserLocation({ lat, lng })
        setShowUserLocation(true)
        setLocationLoading(false)
      },
      (error) => {
        console.error("Error getting location:", error)
        alert("Unable to retrieve your location. Please enable location services.")
        setLocationLoading(false)
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    )
  }

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    let animationFrameId: number
    let time = 0

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
      ctx.strokeStyle = "oklch(0.22 0 0)"
      ctx.lineWidth = 1
      for (let x = 0; x < width; x += 40) {
        ctx.beginPath()
        ctx.moveTo(x, 0)
        ctx.lineTo(x, height)
        ctx.stroke()
      }
      for (let y = 0; y < height; y += 40) {
        ctx.beginPath()
        ctx.moveTo(0, y)
        ctx.lineTo(width, y)
        ctx.stroke()
      }

      const centerX = width / 2
      const centerY = height / 2

      ctx.beginPath()
      ctx.arc(centerX, centerY, 10, 0, Math.PI * 2)
      ctx.fillStyle = "oklch(0.7 0.25 180)"
      ctx.fill()
      ctx.strokeStyle = "oklch(0.9 0.25 180)"
      ctx.lineWidth = 3
      ctx.stroke()

      // Inner dot
      ctx.beginPath()
      ctx.arc(centerX, centerY, 4, 0, Math.PI * 2)
      ctx.fillStyle = "oklch(0.95 0.25 180)"
      ctx.fill()

      // Pulsing ring animation
      const pulseSize = 20 + Math.sin(time * 2) * 8
      ctx.beginPath()
      ctx.arc(centerX, centerY, pulseSize, 0, Math.PI * 2)
      ctx.strokeStyle = `oklch(0.7 0.25 180 / ${0.6 - Math.sin(time * 2) * 0.3})`
      ctx.lineWidth = 3
      ctx.stroke()

      // User location marker (if available and enabled)
      if (showUserLocation && userLocation) {
        // Calculate offset position for user location (top-right corner)
        const userX = width - 80
        const userY = 80

        // Draw user location marker
        ctx.beginPath()
        ctx.arc(userX, userY, 8, 0, Math.PI * 2)
        ctx.fillStyle = "oklch(0.8 0.3 15)" // Orange color
        ctx.fill()
        ctx.strokeStyle = "oklch(0.95 0.3 15)"
        ctx.lineWidth = 2
        ctx.stroke()

        // Inner dot for user location
        ctx.beginPath()
        ctx.arc(userX, userY, 3, 0, Math.PI * 2)
        ctx.fillStyle = "oklch(0.95 0.3 15)"
        ctx.fill()

        // User location label
        ctx.fillStyle = "oklch(0.9 0 0)"
        ctx.font = "bold 12px sans-serif"
        ctx.textAlign = "right"
        ctx.fillText("📱 My Location", userX - 15, userY - 15)

        ctx.font = "10px monospace"
        ctx.fillStyle = "oklch(0.65 0 0)"
        ctx.fillText(`${userLocation.lat.toFixed(4)}°, ${userLocation.lng.toFixed(4)}°`, userX - 15, userY - 2)
      }

      // Location name and coordinates
      ctx.fillStyle = "oklch(0.9 0 0)"
      ctx.font = "bold 18px sans-serif"
      ctx.textAlign = "center"
      ctx.fillText(locationName, centerX, centerY - 40)

      ctx.font = "13px monospace"
      ctx.fillStyle = "oklch(0.65 0 0)"
      ctx.fillText(`${latitude.toFixed(6)}°, ${longitude.toFixed(6)}°`, centerX, centerY - 22)

      // Draw city blocks with 3D effect
      const blocks = [
        { x: 0.2, y: 0.3, w: 0.15, h: 0.2, height: 40 },
        { x: 0.4, y: 0.25, w: 0.2, h: 0.15, height: 60 },
        { x: 0.65, y: 0.35, w: 0.15, h: 0.25, height: 50 },
        { x: 0.25, y: 0.55, w: 0.18, h: 0.2, height: 45 },
        { x: 0.5, y: 0.6, w: 0.2, h: 0.15, height: 55 },
        { x: 0.75, y: 0.65, w: 0.12, h: 0.18, height: 35 },
      ]

      blocks.forEach((block, i) => {
        const x = block.x * width
        const y = block.y * height
        const w = block.w * width
        const h = block.h * height
        const buildingHeight = block.height

        // 3D building effect
        const offsetX = -buildingHeight * 0.3
        const offsetY = -buildingHeight * 0.3

        // Side face
        ctx.fillStyle = "oklch(0.18 0 0)"
        ctx.beginPath()
        ctx.moveTo(x, y)
        ctx.lineTo(x + offsetX, y + offsetY)
        ctx.lineTo(x + offsetX, y + h + offsetY)
        ctx.lineTo(x, y + h)
        ctx.closePath()
        ctx.fill()

        // Top face
        ctx.fillStyle = "oklch(0.22 0 0)"
        ctx.beginPath()
        ctx.moveTo(x, y)
        ctx.lineTo(x + offsetX, y + offsetY)
        ctx.lineTo(x + w + offsetX, y + offsetY)
        ctx.lineTo(x + w, y)
        ctx.closePath()
        ctx.fill()

        // Front face
        ctx.fillStyle = "oklch(0.2 0 0)"
        ctx.fillRect(x, y, w, h)
        ctx.strokeStyle = "oklch(0.3 0 0)"
        ctx.strokeRect(x, y, w, h)

        let overlayColor = ""
        const intensity = 0.35 + Math.sin(time + i) * 0.15

        switch (layer) {
          case "heat":
            overlayColor = `oklch(0.6 0.22 30 / ${intensity})`
            break
          case "green":
            overlayColor = `oklch(0.6 0.2 140 / ${intensity})`
            break
          case "water":
            overlayColor = `oklch(0.65 0.2 220 / ${intensity})`
            break
          case "aqi":
            overlayColor = `oklch(0.5 0.15 280 / ${intensity})`
            break
        }

        ctx.fillStyle = overlayColor
        ctx.fillRect(x, y, w, h)

        // Glow effect
        const gradient = ctx.createRadialGradient(x + w / 2, y + h / 2, 0, x + w / 2, y + h / 2, Math.max(w, h))
        gradient.addColorStop(0, overlayColor)
        gradient.addColorStop(1, "transparent")
        ctx.fillStyle = gradient
        ctx.fillRect(x - w / 2, y - h / 2, w * 2, h * 2)
      })

      for (let i = 0; i < 25; i++) {
        const x = (Math.sin(i * 2.5 + time * 0.5) * 0.35 + 0.5) * width
        const y = (Math.cos(i * 1.8 + time * 0.3) * 0.35 + 0.5) * height
        const size = 3 + Math.sin(time * 2 + i) * 2

        let pointColor = ""
        switch (layer) {
          case "heat":
            pointColor = "oklch(0.65 0.25 30)"
            break
          case "green":
            pointColor = "oklch(0.65 0.22 140)"
            break
          case "water":
            pointColor = "oklch(0.7 0.22 220)"
            break
          case "aqi":
            pointColor = "oklch(0.6 0.18 280)"
            break
        }

        ctx.beginPath()
        ctx.arc(x, y, size, 0, Math.PI * 2)
        ctx.fillStyle = pointColor
        ctx.fill()

        // Pulse effect
        ctx.beginPath()
        ctx.arc(x, y, size + 5, 0, Math.PI * 2)
        ctx.strokeStyle = `${pointColor.slice(0, -1)} / 0.4)`
        ctx.lineWidth = 2
        ctx.stroke()
      }

      time += 0.02
      animationFrameId = requestAnimationFrame(drawMap)
    }

    setTimeout(() => setIsLoading(false), 500)
    drawMap()

    return () => {
      window.removeEventListener("resize", resize)
      cancelAnimationFrame(animationFrameId)
    }
  }, [layer, latitude, longitude, locationName])

  return (
    <div className="relative w-full h-[600px] rounded-2xl overflow-hidden bg-card border border-border">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-card/80 backdrop-blur-sm z-10">
          <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            <p className="text-sm text-muted-foreground">Loading NASA satellite data...</p>
          </div>
        </div>
      )}
      <canvas ref={canvasRef} className="w-full h-full" style={{ width: "100%", height: "100%" }} />

      {/* Location Controls */}
      <div className="absolute top-4 right-4">
        <Button
          onClick={getCurrentLocation}
          disabled={locationLoading}
          size="sm"
          variant={showUserLocation ? "default" : "outline"}
          className="gap-2 bg-card/90 backdrop-blur-sm border border-border"
        >
          {locationLoading ? (
            <>
              <Loader2 className="w-3 h-3 animate-spin" />
              Getting Location...
            </>
          ) : showUserLocation ? (
            <>
              <Navigation className="w-3 h-3" />
              My Location Active
            </>
          ) : (
            <>
              <Navigation className="w-3 h-3" />
              Use My Location
            </>
          )}
        </Button>
      </div>

      <div className="absolute bottom-4 left-4 right-4 bg-card/90 backdrop-blur-sm border border-border rounded-lg p-4">
        <div className="flex items-center justify-between text-sm">
          <div>
            <div className="font-semibold text-base">{locationName}</div>
            <div className="text-muted-foreground text-xs mt-1">
              Exact Location: {latitude.toFixed(6)}°, {longitude.toFixed(6)}°
            </div>
            {showUserLocation && userLocation && (
              <div className="text-muted-foreground text-xs mt-1">
                📱 Your Location: {userLocation.lat.toFixed(6)}°, {userLocation.lng.toFixed(6)}°
              </div>
            )}
          </div>
          <div className="text-right">
            <div className="text-xs text-muted-foreground">Data Layer</div>
            <div className="font-semibold text-sm capitalize">{layer === "aqi" ? "Air Quality" : layer}</div>
          </div>
        </div>
      </div>
    </div>
  )
}
