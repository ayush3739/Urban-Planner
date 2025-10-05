"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { Wind, Activity, Droplets, Flame, AlertCircle, CheckCircle2, Loader2 } from "lucide-react"
import type { AirQualityData } from "@/lib/actions/air-quality"

interface AirQualityPanelProps {
  cityName: string
  onDataFetched?: (aqi: number | undefined) => void
}

const parameterIcons: Record<string, any> = {
  pm25: Wind,
  pm10: Wind,
  o3: Activity,
  no2: Flame,
  so2: Droplets,
  co: AlertCircle,
}

const parameterLabels: Record<string, string> = {
  pm25: "PM2.5",
  pm10: "PM10",
  o3: "Ozone",
  no2: "Nitrogen Dioxide",
  so2: "Sulfur Dioxide",
  co: "Carbon Monoxide",
}

function getAQILevel(aqi: number) {
  if (aqi <= 50) return { label: "Good", color: "text-chart-2", bg: "bg-chart-2/10" }
  if (aqi <= 100) return { label: "Moderate", color: "text-yellow-500", bg: "bg-yellow-500/10" }
  if (aqi <= 150) return { label: "Unhealthy for Sensitive", color: "text-orange-500", bg: "bg-orange-500/10" }
  if (aqi <= 200) return { label: "Unhealthy", color: "text-chart-3", bg: "bg-chart-3/10" }
  if (aqi <= 300) return { label: "Very Unhealthy", color: "text-purple-500", bg: "bg-purple-500/10" }
  return { label: "Hazardous", color: "text-destructive", bg: "bg-destructive/10" }
}

export function AirQualityPanel({ cityName, onDataFetched }: AirQualityPanelProps) {
  const [data, setData] = useState<AirQualityData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    async function loadData() {
      setLoading(true)
      setError(false)

      try {
        const response = await fetch(`/api/air-quality?city=${encodeURIComponent(cityName)}`)
        if (!response.ok) throw new Error("Failed to fetch")

        const result = await response.json()
        setData(result)
        onDataFetched?.(result?.aqi)
      } catch (err) {
        console.error("[v0] Error loading air quality:", err)
        setError(true)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [cityName, onDataFetched])

  if (loading) {
    return (
      <Card className="p-6 border-2 border-chart-5/20 bg-chart-5/5">
        <div className="flex items-center justify-center gap-3 py-8">
          <Loader2 className="w-5 h-5 animate-spin text-chart-5" />
          <span className="text-muted-foreground">Loading real-time air quality data...</span>
        </div>
      </Card>
    )
  }

  if (error || !data) {
    return (
      <Card className="p-6 border-2 border-muted bg-muted/5">
        <div className="flex items-center gap-3 text-muted-foreground">
          <AlertCircle className="w-5 h-5" />
          <span>No real-time air quality data available for this location</span>
        </div>
      </Card>
    )
  }

  const aqiLevel = data.aqi ? getAQILevel(data.aqi) : null

  return (
    <div className="space-y-4">
      {/* AQI Summary Card */}
      {data.aqi && (
        <Card className={`p-6 border-2 ${aqiLevel?.bg} border-${aqiLevel?.color}/20`}>
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Wind className={`w-5 h-5 ${aqiLevel?.color}`} />
                <span className="text-sm font-medium text-muted-foreground">Air Quality Index</span>
              </div>
              <div className="flex items-baseline gap-3">
                <span className="text-4xl font-bold">{data.aqi}</span>
                <span className={`text-lg font-semibold ${aqiLevel?.color}`}>{aqiLevel?.label}</span>
              </div>
              <p className="text-sm text-muted-foreground">Real-time data from {data.location}</p>
            </div>
            {data.aqi <= 50 ? (
              <CheckCircle2 className={`w-12 h-12 ${aqiLevel?.color}`} />
            ) : (
              <AlertCircle className={`w-12 h-12 ${aqiLevel?.color}`} />
            )}
          </div>
        </Card>
      )}

      {/* Pollutant Measurements */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {data.measurements.map((measurement, index) => {
          const Icon = parameterIcons[measurement.parameter] || Activity
          const label = parameterLabels[measurement.parameter] || measurement.parameter.toUpperCase()

          return (
            <Card key={index} className="p-4 border border-border bg-card/50 hover:bg-card transition-colors">
              <div className="flex items-start justify-between">
                <div className="space-y-2 flex-1">
                  <div className="flex items-center gap-2">
                    <Icon className="w-4 h-4 text-chart-5" />
                    <span className="text-sm font-medium">{label}</span>
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-bold">{measurement.value.toFixed(1)}</span>
                    <span className="text-sm text-muted-foreground">{measurement.unit}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Updated: {new Date(measurement.lastUpdated).toLocaleTimeString()}
                  </p>
                </div>
              </div>
            </Card>
          )
        })}
      </div>

      {/* Data Source Info */}
      <Card className="p-4 border border-border bg-card/30">
        <div className="flex items-start gap-3 text-sm">
          <Activity className="w-4 h-4 text-primary mt-0.5" />
          <div>
            <div className="font-medium">Data Source: Google Air Quality</div>
            <div className="text-muted-foreground">
              Real-time air quality measurements from Google’s Air Quality API
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}
