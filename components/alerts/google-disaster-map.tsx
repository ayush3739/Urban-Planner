"use client"

import { useState, useCallback } from "react"
import { GoogleMap, Marker, InfoWindow, useJsApiLoader } from "@react-google-maps/api"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Flame, Droplets, Wind, Thermometer } from "lucide-react"

const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ""

interface DisasterAlert {
  id: string
  type: 'fire' | 'flood' | 'storm' | 'heatwave'
  severity: 'low' | 'medium' | 'high'
  title: string
  location: string
  description: string
  time: string
  lat: number
  lon: number
  confidence?: number
  frp?: number
  satellite?: string
}

interface GoogleDisasterMapProps {
  alerts: DisasterAlert[]
  center?: { lat: number; lng: number }
}

const mapContainerStyle = {
  width: '100%',
  height: '600px'
}

const defaultCenter = {
  lat: 28.6139,
  lng: 77.209
}

const mapOptions = {
  disableDefaultUI: false,
  zoomControl: true,
  scrollwheel: true,
  disableDoubleClickZoom: false,
  mapTypeId: 'satellite' as google.maps.MapTypeId
}

const getAlertIcon = (type: string) => {
  switch (type) {
    case 'fire':
      return <Flame className="w-4 h-4" />
    case 'flood':
      return <Droplets className="w-4 h-4" />
    case 'storm':
      return <Wind className="w-4 h-4" />
    case 'heatwave':
      return <Thermometer className="w-4 h-4" />
    default:
      return <Flame className="w-4 h-4" />
  }
}

const getSeverityColor = (severity: string) => {
  switch (severity) {
    case 'high':
      return 'destructive'
    case 'medium':
      return 'orange'
    case 'low':
      return 'secondary'
    default:
      return 'secondary'
  }
}

const getMarkerColor = (type: string, severity: string) => {
  if (severity === 'high') {
    return '#ef4444' // red
  } else if (severity === 'medium') {
    return '#f97316' // orange
  } else {
    return '#eab308' // yellow
  }
}

export function GoogleDisasterMap({ alerts, center = defaultCenter }: GoogleDisasterMapProps) {
  const [selectedAlert, setSelectedAlert] = useState<DisasterAlert | null>(null)
  
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: GOOGLE_MAPS_API_KEY,
  })

  const onMarkerClick = useCallback((alert: DisasterAlert) => {
    setSelectedAlert(alert)
  }, [])

  const onInfoWindowClose = useCallback(() => {
    setSelectedAlert(null)
  }, [])

  if (!isLoaded) {
    return (
      <div className="w-full h-[600px] bg-muted rounded-lg flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
          <p className="text-sm text-muted-foreground">Loading map...</p>
        </div>
      </div>
    )
  }

  return (
    <GoogleMap
      mapContainerStyle={mapContainerStyle}
      center={center}
      zoom={10}
      options={mapOptions}
    >
      {alerts.map((alert) => (
        <Marker
          key={alert.id}
          position={{ lat: alert.lat, lng: alert.lon }}
          onClick={() => onMarkerClick(alert)}
          icon={{
            path: google.maps.SymbolPath.CIRCLE,
            scale: 8,
            fillColor: getMarkerColor(alert.type, alert.severity),
            fillOpacity: 0.8,
            strokeColor: '#ffffff',
            strokeWeight: 2,
          }}
        />
      ))}

      {selectedAlert && (
        <InfoWindow
          position={{ lat: selectedAlert.lat, lng: selectedAlert.lon }}
          onCloseClick={onInfoWindowClose}
        >
          <Card className="w-80 border-0 shadow-none">
            <CardContent className="p-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {getAlertIcon(selectedAlert.type)}
                    <h3 className="font-semibold text-sm">{selectedAlert.title}</h3>
                  </div>
                  <Badge variant={getSeverityColor(selectedAlert.severity) as any}>
                    {selectedAlert.severity.toUpperCase()}
                  </Badge>
                </div>
                
                <div className="space-y-2">
                  <p className="text-xs text-muted-foreground">📍 {selectedAlert.location}</p>
                  <p className="text-sm">{selectedAlert.description}</p>
                  
                  {selectedAlert.confidence && (
                    <p className="text-xs text-muted-foreground">
                      Confidence: {selectedAlert.confidence}%
                    </p>
                  )}
                  
                  {selectedAlert.frp && (
                    <p className="text-xs text-muted-foreground">
                      Fire Radiative Power: {selectedAlert.frp} MW
                    </p>
                  )}
                  
                  <p className="text-xs text-muted-foreground">
                    📡 {selectedAlert.satellite || 'NASA FIRMS'}
                  </p>
                  
                  <p className="text-xs text-muted-foreground">
                    🕒 {selectedAlert.time}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </InfoWindow>
      )}
    </GoogleMap>
  )
}