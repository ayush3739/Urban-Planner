'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
// import { GoogleDisasterMap } from '@/components/alerts/google-disaster-map'
import { 
  Flame, 
  Droplets, 
  Wind, 
  Thermometer, 
  AlertTriangle, 
  Satellite,
  MapPin,
  Clock,
  RefreshCw,
  Loader2,
  Map
} from 'lucide-react'

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

interface DisasterResponse {
  city: string
  location: { latitude: number; longitude: number }
  alerts: DisasterAlert[]
  metadata: {
    total: number
    fires: number
    floods: number
    storms: number
    heatwaves: number
    lastUpdated: string
  }
}

export function DisasterAlerts() {
  const [alerts, setAlerts] = useState<DisasterAlert[]>([])
  const [metadata, setMetadata] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [activeFilter, setActiveFilter] = useState<string>('all')
  const [city, setCity] = useState('Delhi')
  const [latitude, setLatitude] = useState('28.61')
  const [longitude, setLongitude] = useState('77.23')
  const [showMap, setShowMap] = useState(false)
  const [selectedAlertForMap, setSelectedAlertForMap] = useState<DisasterAlert | null>(null)

  // City presets
  const cityPresets = [
    { name: 'Delhi, India', lat: '28.61', lng: '77.23' },
    { name: 'New York, USA', lat: '40.71', lng: '-74.01' },
    { name: 'London, UK', lat: '51.51', lng: '-0.13' },
    { name: 'Tokyo, Japan', lat: '35.68', lng: '139.69' },
    { name: 'Sydney, Australia', lat: '-33.87', lng: '151.21' },
    { name: 'São Paulo, Brazil', lat: '-23.55', lng: '-46.64' },
    { name: 'Los Angeles, USA', lat: '34.05', lng: '-118.24' },
    { name: 'Mumbai, India', lat: '19.08', lng: '72.88' }
  ]

  const setCityPreset = (preset: typeof cityPresets[0]) => {
    setCity(preset.name.split(',')[0])
    setLatitude(preset.lat)
    setLongitude(preset.lng)
  }

  const fetchDisasterAlerts = async () => {
    setLoading(true)
    setError(null)
    
    try {
      const url = `/api/disaster-alerts?latitude=${latitude}&longitude=${longitude}&city=${city}&radius=50`
      console.log('Fetching disaster alerts from:', url)
      
      const response = await fetch(url)
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || `API error: ${response.status}`)
      }
      
      const data: DisasterResponse = await response.json()
      
      console.log(`Successfully loaded ${data.alerts.length} disaster alerts for ${data.city}`)
      setAlerts(data.alerts)
      setMetadata(data.metadata)
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred'
      console.error('Error fetching disaster alerts:', errorMessage)
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const handleRefresh = () => {
    fetchDisasterAlerts()
  }

  const getFilteredAlerts = () => {
    if (activeFilter === 'all') return alerts
    return alerts.filter(alert => alert.type === activeFilter)
  }

  const handleViewOnMap = (alert: DisasterAlert) => {
    // Open Google Maps in a new tab with the alert location
    const googleMapsUrl = `https://www.google.com/maps/@${alert.lat},${alert.lon},15z`
    window.open(googleMapsUrl, '_blank')
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'fire': return 'text-red-600 bg-red-50 border-red-200'
      case 'flood': return 'text-blue-600 bg-blue-50 border-blue-200'
      case 'storm': return 'text-gray-600 bg-gray-50 border-gray-200'
      case 'heatwave': return 'text-orange-600 bg-orange-50 border-orange-200'
      default: return 'text-gray-600 bg-gray-50 border-gray-200'
    }
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'destructive'
      case 'medium': return 'secondary'
      case 'low': return 'outline'
      default: return 'outline'
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'fire': return <Flame className="w-4 h-4" />
      case 'flood': return <Droplets className="w-4 h-4" />
      case 'storm': return <Wind className="w-4 h-4" />
      case 'heatwave': return <Thermometer className="w-4 h-4" />
      default: return <AlertTriangle className="w-4 h-4" />
    }
  }

  // Auto-fetch on component mount and location change
  useEffect(() => {
    fetchDisasterAlerts()
  }, [latitude, longitude, city])

  const filteredAlerts = getFilteredAlerts()

  return (
    <div className="w-full space-y-6">
      {/* Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Satellite className="w-5 h-5 text-blue-500" />
            NASA Disaster Alert System
          </CardTitle>
          <CardDescription>
            Real-time disaster monitoring using NASA FIRMS fire data and satellite imagery
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* City Presets */}
          <div className="space-y-2">
            <Label>Quick City Selection</Label>
            <div className="flex flex-wrap gap-2">
              {cityPresets.map((preset) => (
                <Button
                  key={preset.name}
                  variant={city === preset.name.split(',')[0] ? "default" : "outline"}
                  size="sm"
                  onClick={() => setCityPreset(preset)}
                >
                  {preset.name}
                </Button>
              ))}
            </div>
          </div>
          
          {/* Manual Coordinates */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="city">City Name</Label>
              <Input
                id="city"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="Delhi"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="latitude">Latitude</Label>
              <Input
                id="latitude"
                type="number"
                step="any"
                value={latitude}
                onChange={(e) => setLatitude(e.target.value)}
                placeholder="28.61"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="longitude">Longitude</Label>
              <Input
                id="longitude"
                type="number"
                step="any"
                value={longitude}
                onChange={(e) => setLongitude(e.target.value)}
                placeholder="77.23"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            <Button onClick={handleRefresh} disabled={loading} className="flex items-center gap-2">
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
              {loading ? 'Loading...' : 'Fetch Alerts'}
            </Button>
            <Button 
              onClick={() => setShowMap(!showMap)} 
              variant="outline" 
              className="flex items-center gap-2"
            >
              <Map className="w-4 h-4" />
              {showMap ? 'Hide Map' : 'Show Map'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Error Message */}
      {error && (
        <Alert variant="destructive">
          <AlertTriangle className="w-4 h-4" />
          <AlertDescription>
            Failed to fetch disaster alerts: {error}
          </AlertDescription>
        </Alert>
      )}

      {/* Statistics */}
      {metadata && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Alert Statistics for {city}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <div className="text-center p-3 bg-blue-50 rounded-lg border">
                <div className="text-2xl font-bold text-blue-600">{metadata.total}</div>
                <div className="text-sm text-blue-600">Total Alerts</div>
              </div>
              <div className="text-center p-3 bg-red-50 rounded-lg border">
                <div className="text-2xl font-bold text-red-600">{metadata.fires}</div>
                <div className="text-sm text-red-600">🔥 Fires</div>
              </div>
              <div className="text-center p-3 bg-blue-50 rounded-lg border">
                <div className="text-2xl font-bold text-blue-600">{metadata.floods}</div>
                <div className="text-sm text-blue-600">💧 Floods</div>
              </div>
              <div className="text-center p-3 bg-gray-50 rounded-lg border">
                <div className="text-2xl font-bold text-gray-600">{metadata.storms}</div>
                <div className="text-sm text-gray-600">🌪️ Storms</div>
              </div>
              <div className="text-center p-3 bg-orange-50 rounded-lg border">
                <div className="text-2xl font-bold text-orange-600">{metadata.heatwaves}</div>
                <div className="text-sm text-orange-600">🌡️ Heat</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Google Map */}
      {showMap && alerts.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-green-500" />
              Live Disaster Map
            </CardTitle>
            <CardDescription>
              Interactive satellite map showing real-time disaster locations
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="w-full h-[600px] bg-muted rounded-lg flex items-center justify-center">
              <div className="text-center">
                <MapPin className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-sm text-muted-foreground">
                  Google Maps integration coming soon...
                </p>
                <p className="text-xs text-muted-foreground mt-2">
                  {filteredAlerts.length} alerts ready to display
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Filter Tabs */}
      <Tabs value={activeFilter} onValueChange={setActiveFilter}>
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="all">All ({alerts.length})</TabsTrigger>
          <TabsTrigger value="fire">🔥 Fires ({alerts.filter(a => a.type === 'fire').length})</TabsTrigger>
          <TabsTrigger value="flood">💧 Floods ({alerts.filter(a => a.type === 'flood').length})</TabsTrigger>
          <TabsTrigger value="storm">🌪️ Storms ({alerts.filter(a => a.type === 'storm').length})</TabsTrigger>
          <TabsTrigger value="heatwave">🌡️ Heat ({alerts.filter(a => a.type === 'heatwave').length})</TabsTrigger>
        </TabsList>

        <TabsContent value={activeFilter} className="space-y-4">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
              <span className="ml-2 text-muted-foreground">Loading disaster alerts...</span>
            </div>
          ) : filteredAlerts.length === 0 ? (
            <div className="text-center py-8">
              <AlertTriangle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-muted-foreground">No Alerts Found</h3>
              <p className="text-sm text-muted-foreground">
                No {activeFilter === 'all' ? '' : activeFilter} disasters detected in this area.
              </p>
            </div>
          ) : (
            <div className="grid gap-4">
              {filteredAlerts.map((alert) => (
                <Card key={alert.id} className={`border-l-4 ${getTypeColor(alert.type)}`}>
                  <CardContent className="p-4">
                    <div className="space-y-3">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-lg bg-background">
                            {getTypeIcon(alert.type)}
                          </div>
                          <div>
                            <CardTitle className="text-lg">{alert.title}</CardTitle>
                            <div className="flex items-center gap-2 mt-1">
                              <MapPin className="w-3 h-3" />
                              <span className="text-sm text-muted-foreground">{alert.location}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant={getSeverityColor(alert.severity) as any}>
                            {alert.severity.toUpperCase()}
                          </Badge>
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Clock className="w-3 h-3" />
                            {alert.time}
                          </div>
                        </div>
                      </div>
                      
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {alert.description}
                      </p>
                      
                      {(alert.confidence || alert.frp || alert.satellite) && (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 p-3 bg-muted/50 rounded-lg">
                          {alert.confidence && (
                            <div>
                              <p className="text-xs text-muted-foreground">Confidence</p>
                              <p className="text-sm font-medium">{alert.confidence}%</p>
                            </div>
                          )}
                          {alert.frp && (
                            <div>
                              <p className="text-xs text-muted-foreground">Fire Power</p>
                              <p className="text-sm font-medium">{alert.frp} MW</p>
                            </div>
                          )}
                          {alert.satellite && (
                            <div>
                              <p className="text-xs text-muted-foreground">Satellite</p>
                              <p className="text-sm font-medium">{alert.satellite}</p>
                            </div>
                          )}
                        </div>
                      )}
                      
                      <div className="flex items-center justify-between pt-3 border-t border-border">
                        <div className="text-xs text-muted-foreground">
                          📍 {alert.lat.toFixed(4)}, {alert.lon.toFixed(4)}
                        </div>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleViewOnMap(alert)}
                        >
                          View on Map
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Last Updated */}
      {metadata && (
        <Card>
          <CardContent className="p-3">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>📡 Data from NASA FIRMS & Earthdata APIs</span>
              <span>Last updated: {new Date(metadata.lastUpdated).toLocaleString()}</span>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}