'use client'

import { useState, useEffect } from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Thermometer, MapPin, Calendar, TrendingUp } from 'lucide-react'

interface TemperatureData {
  date: string
  temperature: number
  formattedDate: string
}

interface NASAPowerResponse {
  properties: {
    parameter: {
      T2M: Record<string, number>
    }
  }
}

export function TemperatureChart() {
  const [temperatureData, setTemperatureData] = useState<TemperatureData[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [latitude, setLatitude] = useState('28.61')
  const [longitude, setLongitude] = useState('77.23')
  const [startDate, setStartDate] = useState('20251001')
  const [endDate, setEndDate] = useState('20251004')

  // Location presets
  const locationPresets = [
    { name: 'Delhi, India', lat: '28.61', lng: '77.23' },
    { name: 'New York, USA', lat: '40.71', lng: '-74.01' },
    { name: 'London, UK', lat: '51.51', lng: '-0.13' },
    { name: 'Tokyo, Japan', lat: '35.68', lng: '139.69' },
    { name: 'Sydney, Australia', lat: '-33.87', lng: '151.21' },
    { name: 'São Paulo, Brazil', lat: '-23.55', lng: '-46.64' }
  ]

  const setLocationPreset = (preset: typeof locationPresets[0]) => {
    setLatitude(preset.lat)
    setLongitude(preset.lng)
  }

  const fetchTemperatureData = async () => {
    setLoading(true)
    setError(null)
    
    try {
      const url = `/api/temperature?latitude=${latitude}&longitude=${longitude}&start=${startDate}&end=${endDate}`
      
      console.log('Fetching from API route:', url)
      
      const response = await fetch(url)
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || `API error: ${response.status}`)
      }
      
      const data: NASAPowerResponse = await response.json()
      
      if (!data.properties?.parameter?.T2M) {
        throw new Error('No temperature data found in response')
      }
      
      const temperatureEntries = Object.entries(data.properties.parameter.T2M)
        .filter(([_, temp]) => temp !== -999) // Filter out invalid values
        .map(([date, temp]) => ({
          date,
          temperature: Math.round(temp * 100) / 100, // Round to 2 decimal places
          formattedDate: formatDate(date)
        }))
        .sort((a, b) => a.date.localeCompare(b.date)) // Sort by date
      
      console.log(`Successfully loaded ${temperatureEntries.length} temperature data points`)
      setTemperatureData(temperatureEntries)
      
    } catch (err) {
      console.error('Error fetching temperature data:', err)
      setError(err instanceof Error ? err.message : 'Failed to fetch temperature data')
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateStr: string): string => {
    // Convert YYYYMMDD to readable format
    const year = dateStr.substring(0, 4)
    const month = dateStr.substring(4, 6)
    const day = dateStr.substring(6, 8)
    const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day))
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric'
    })
  }

  const getLocationName = (): string => {
    // Check if current coordinates match any preset
    const preset = locationPresets.find(p => p.lat === latitude && p.lng === longitude)
    if (preset) {
      return preset.name
    }
    return `${parseFloat(latitude).toFixed(2)}°${parseFloat(latitude) >= 0 ? 'N' : 'S'}, ${parseFloat(longitude).toFixed(2)}°${parseFloat(longitude) >= 0 ? 'E' : 'W'}`
  }

  const getAverageTemp = (): number => {
    if (temperatureData.length === 0) return 0
    const sum = temperatureData.reduce((acc, data) => acc + data.temperature, 0)
    return Math.round((sum / temperatureData.length) * 100) / 100
  }

  const getMinMaxTemp = (): { min: number; max: number } => {
    if (temperatureData.length === 0) return { min: 0, max: 0 }
    const temps = temperatureData.map(d => d.temperature)
    return {
      min: Math.min(...temps),
      max: Math.max(...temps)
    }
  }

  useEffect(() => {
    fetchTemperatureData()
  }, [])

  const { min, max } = getMinMaxTemp()

  return (
    <div className="w-full space-y-6">
      {/* Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Thermometer className="w-5 h-5 text-orange-500" />
            NASA POWER Temperature Data
          </CardTitle>
          <CardDescription>
            Fetch 2-meter air temperature data from NASA's POWER API
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Location Presets */}
          <div className="space-y-2">
            <Label>Quick Location Presets</Label>
            <div className="flex flex-wrap gap-2">
              {locationPresets.map((preset) => (
                <Button
                  key={preset.name}
                  variant={latitude === preset.lat && longitude === preset.lng ? "default" : "outline"}
                  size="sm"
                  onClick={() => setLocationPreset(preset)}
                >
                  {preset.name}
                </Button>
              ))}
            </div>
          </div>
          
          {/* Manual Coordinates */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label htmlFor="latitude">Latitude</Label>
              <Input
                id="latitude"
                type="number"
                step="0.01"
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
                step="0.01"
                value={longitude}
                onChange={(e) => setLongitude(e.target.value)}
                placeholder="77.23"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="startDate">Start Date</Label>
              <Input
                id="startDate"
                type="text"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                placeholder="YYYYMMDD"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="endDate">End Date</Label>
              <Input
                id="endDate"
                type="text"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                placeholder="YYYYMMDD"
              />
            </div>
          </div>
          <Button onClick={fetchTemperatureData} disabled={loading} className="w-full">
            {loading ? 'Fetching...' : 'Fetch Temperature Data'}
          </Button>
        </CardContent>
      </Card>

      {/* Error Display */}
      {error && (
        <Card className="border-destructive">
          <CardContent className="pt-6">
            <p className="text-destructive">{error}</p>
          </CardContent>
        </Card>
      )}

      {/* Statistics */}
      {temperatureData.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-blue-500" />
                <div>
                  <p className="text-sm font-medium">Location</p>
                  <p className="text-2xl font-bold">{getLocationName()}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-green-500" />
                <div>
                  <p className="text-sm font-medium">Average</p>
                  <p className="text-2xl font-bold">{getAverageTemp()}°C</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-2">
                <Thermometer className="w-4 h-4 text-blue-500" />
                <div>
                  <p className="text-sm font-medium">Min Temp</p>
                  <p className="text-2xl font-bold">{min}°C</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-2">
                <Thermometer className="w-4 h-4 text-red-500" />
                <div>
                  <p className="text-sm font-medium">Max Temp</p>
                  <p className="text-2xl font-bold">{max}°C</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Temperature Chart */}
      {temperatureData.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-blue-500" />
              Temperature Trend - {getLocationName()}
            </CardTitle>
            <CardDescription>
              2-meter air temperature data from NASA POWER API ({temperatureData.length} data points)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[400px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={temperatureData}
                  margin={{
                    top: 20,
                    right: 30,
                    left: 20,
                    bottom: 20,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis 
                    dataKey="formattedDate" 
                    stroke="hsl(var(--foreground))"
                    fontSize={12}
                    tickMargin={10}
                  />
                  <YAxis 
                    stroke="hsl(var(--foreground))"
                    fontSize={12}
                    tickMargin={10}
                    label={{ 
                      value: 'Temperature (°C)', 
                      angle: -90, 
                      position: 'insideLeft',
                      style: { textAnchor: 'middle' }
                    }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--background))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '6px',
                      color: 'hsl(var(--foreground))'
                    }}
                    formatter={(value: number) => [`${value}°C`, 'Temperature']}
                    labelFormatter={(label) => `Date: ${label}`}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="temperature"
                    stroke="#ef4444"
                    strokeWidth={3}
                    dot={{ fill: '#ef4444', strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6, stroke: '#ef4444', strokeWidth: 2 }}
                    name="Temperature (°C)"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Data Table */}
      {temperatureData.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Temperature Data Table</CardTitle>
            <CardDescription>
              Raw temperature readings (filtered to exclude -999 values)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-2 font-medium">Date</th>
                    <th className="text-left p-2 font-medium">Temperature (°C)</th>
                  </tr>
                </thead>
                <tbody>
                  {temperatureData.map((data, index) => (
                    <tr key={data.date} className={index % 2 === 0 ? 'bg-muted/50' : ''}>
                      <td className="p-2">{data.formattedDate}</td>
                      <td className="p-2 font-mono">{data.temperature}°C</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}