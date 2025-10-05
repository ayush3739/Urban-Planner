"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { MapPin, Loader2, Navigation, AlertCircle } from "lucide-react"
import { useRouter } from "next/navigation"

interface LocationData {
  latitude: number
  longitude: number
  city?: string
  country?: string
  address?: string
}

export function LocationDetector() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [location, setLocation] = useState<LocationData | null>(null)
  const router = useRouter()

  const detectLocation = () => {
    setLoading(true)
    setError(null)

    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser")
      setLoading(false)
      return
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords

        try {
          // Reverse geocoding to get address details
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`,
          )
          const data = await response.json()

          const locationData: LocationData = {
            latitude,
            longitude,
            city: data.address?.city || data.address?.town || data.address?.village || "Unknown",
            country: data.address?.country || "Unknown",
            address: data.display_name || `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`,
          }

          setLocation(locationData)
          setLoading(false)

          // Navigate to dashboard with exact coordinates
          router.push(
            `/dashboard/custom?lat=${latitude}&lng=${longitude}&name=${encodeURIComponent(locationData.city || "My Location")}`,
          )
        } catch (err) {
          console.error("Geocoding error:", err)
          // Still navigate even if geocoding fails
          router.push(`/dashboard/custom?lat=${latitude}&lng=${longitude}&name=My Location`)
          setLoading(false)
        }
      },
      (err) => {
        // Better error handling based on error code
        let errorMessage = "Unable to retrieve your location. "
        
        switch (err.code) {
          case err.PERMISSION_DENIED:
            errorMessage += "Please allow location access in your browser settings."
            break
          case err.POSITION_UNAVAILABLE:
            errorMessage += "Location information is unavailable. Please try again."
            break
          case err.TIMEOUT:
            errorMessage += "Location request timed out. Please try again."
            break
          default:
            errorMessage += "An unknown error occurred. Please try again."
        }
        
        console.warn("Geolocation error:", {
          code: err.code,
          message: err.message,
          suggestion: errorMessage
        })
        
        setError(errorMessage)
        setLoading(false)
      },
      {
        enableHighAccuracy: true,
        timeout: 15000, // Increased timeout to 15 seconds
        maximumAge: 60000, // Cache position for 1 minute
      },
    )
  }

  return (
    <Card className="p-6 bg-card/50 backdrop-blur-sm border-border/50">
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-full bg-primary/10">
            <MapPin className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-lg">Use My Location</h3>
            <p className="text-sm text-muted-foreground">Get exact data for your current location</p>
          </div>
        </div>

        <Button onClick={detectLocation} disabled={loading} className="w-full gap-2" size="lg">
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Detecting Location...
            </>
          ) : (
            <>
              <Navigation className="w-4 h-4" />
              Detect My Location
            </>
          )}
        </Button>

        {error && (
          <div className="p-4 rounded-lg bg-destructive/10 border border-destructive/20 space-y-3">
            <div className="flex items-start gap-2">
              <div className="text-destructive">⚠️</div>
              <div className="flex-1">
                <p className="text-sm font-medium text-destructive mb-1">Location Access Error</p>
                <p className="text-sm text-destructive/90">{error}</p>
              </div>
            </div>
            
            <div className="text-xs text-muted-foreground space-y-1 pl-6">
              <p className="font-medium">How to fix this:</p>
              <ul className="list-disc pl-4 space-y-1">
                <li>Click the location icon in your browser's address bar</li>
                <li>Select "Allow" for location access</li>
                <li>Refresh the page and try again</li>
              </ul>
            </div>
            
            <Button 
              variant="outline" 
              size="sm" 
              onClick={detectLocation}
              className="w-full"
            >
              <Navigation className="w-3 h-3 mr-2" />
              Retry
            </Button>
          </div>
        )}

        {location && (
          <div className="p-3 rounded-lg bg-primary/10 border border-primary/20">
            <p className="text-sm font-medium">
              ✓ {location.city}, {location.country}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              {location.latitude.toFixed(6)}, {location.longitude.toFixed(6)}
            </p>
          </div>
        )}
      </div>
    </Card>
  )
}
