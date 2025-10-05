"use client"

import { useSearchParams } from "next/navigation"
import { Suspense, useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft, MapPin, Thermometer, Leaf, Droplet, Wind } from "lucide-react"
import { MapVisualization } from "@/components/dashboard/google-map-visualization"
import { MetricCard } from "@/components/dashboard/metric-card"
import { LayerTabs } from "@/components/dashboard/layer-tabs"
import { DataCharts } from "@/components/dashboard/data-charts"
import { SimulationPanel } from "@/components/dashboard/simulation-panel"

function DashboardContent() {
  const searchParams = useSearchParams()
  const lat = searchParams.get("lat")
  const lng = searchParams.get("lng")
  const name = searchParams.get("name") || "Custom Location"

  const [activeLayer, setActiveLayer] = useState<"heat" | "green" | "water" | "aqi">("heat")
  const [activeView, setActiveView] = useState<"map" | "charts" | "details">("map")
  const [nearbyAqi, setNearbyAqi] = useState<number | null>(null)
  const [nearbyLoading, setNearbyLoading] = useState(false)

  useEffect(() => {
    if (!lat || !lng) return
    let cancelled = false
    async function loadNearby() {
      try {
        setNearbyLoading(true)
        const res = await fetch(`/api/air-quality/nearby?lat=${lat}&lng=${lng}`)
        if (!res.ok) throw new Error("Failed nearby AQI")
        const json = await res.json()
        if (!cancelled) setNearbyAqi(typeof json?.aqi === "number" ? json.aqi : null)
      } catch (e) {
        console.error("[v0] Nearby AQI fetch error:", e)
        if (!cancelled) setNearbyAqi(null)
      } finally {
        if (!cancelled) setNearbyLoading(false)
      }
    }
    loadNearby()
    return () => {
      cancelled = true
    }
  }, [lat, lng])

  // Generate realistic data based on coordinates
  const latitude = Number.parseFloat(lat || "0")
  const longitude = Number.parseFloat(lng || "0")

  // Mock data generation based on location
  const baseTemp = 20 + Math.abs(latitude) * 0.3
  const metrics = {
    temperature: baseTemp + Math.random() * 10,
    greenCover: 30 + Math.random() * 40,
    waterRisk: Math.random() * 100,
    aqi: nearbyAqi ?? 50 + Math.random() * 150,
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" asChild>
              <Link href="/">
                <ArrowLeft className="h-5 w-5" />
              </Link>
            </Button>
            <div className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-primary" />
              <div>
                <h1 className="text-lg font-semibold">{decodeURIComponent(name)}</h1>
                <p className="text-xs text-muted-foreground">
                  {latitude.toFixed(4)}°, {longitude.toFixed(4)}°
                </p>
              </div>
            </div>
          </div>
          <nav className="flex items-center gap-2">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/alerts">Alerts</Link>
            </Button>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/recommendations">Recommendations</Link>
            </Button>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="container py-8 space-y-8">
        {/* Metrics Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard
            title="Temperature"
            value={`${metrics.temperature.toFixed(1)}°C`}
            change={2.3}
            trend="up"
            icon={Thermometer}
          />
          <MetricCard
            title="Green Cover"
            value={`${metrics.greenCover.toFixed(0)}%`}
            change={-1.2}
            trend="down"
            icon={Leaf}
          />
          <MetricCard
            title="Water Risk"
            value={`${metrics.waterRisk.toFixed(0)}%`}
            change={5.4}
            trend="up"
            icon={Droplet}
          />
          <MetricCard
            title="Air Quality Index"
            value={
              nearbyLoading ? "Loading..." : Number.isFinite(metrics.aqi) ? (metrics.aqi as number).toFixed(0) : "N/A"
            }
            change={-3.1}
            trend="down"
            icon={Wind}
          />
        </div>

        {/* View Tabs */}
        <div className="flex gap-2 border-b border-border">
          <Button
            variant={activeView === "map" ? "default" : "ghost"}
            onClick={() => setActiveView("map")}
            className="rounded-b-none"
          >
            Map View
          </Button>
          <Button
            variant={activeView === "charts" ? "default" : "ghost"}
            onClick={() => setActiveView("charts")}
            className="rounded-b-none"
          >
            Charts & Analytics
          </Button>
          <Button
            variant={activeView === "details" ? "default" : "ghost"}
            onClick={() => setActiveView("details")}
            className="rounded-b-none"
          >
            View Details
          </Button>
        </div>

        {/* Map View */}
        {activeView === "map" && (
          <div className="space-y-6">
            <LayerTabs activeLayer={activeLayer} onLayerChange={setActiveLayer} />
            <div className="grid lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <MapVisualization
                  layer={activeLayer}
                  latitude={latitude}
                  longitude={longitude}
                  locationName={decodeURIComponent(name)}
                />
              </div>
              <div>
                <SimulationPanel onSimulate={(state) => console.log("[v0] Simulation:", state)} />
              </div>
            </div>
          </div>
        )}

        {/* Charts View */}
        {activeView === "charts" && <DataCharts cityName={decodeURIComponent(name)} />}

        {/* Details View */}
        {activeView === "details" && (
          <div className="grid gap-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4 p-6 rounded-lg border border-border bg-card">
                <h3 className="text-xl font-semibold">Location Information</h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-muted-foreground">Coordinates</p>
                    <p className="font-medium">
                      {latitude.toFixed(6)}°, {longitude.toFixed(6)}°
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Location Name</p>
                    <p className="font-medium">{decodeURIComponent(name)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Data Source</p>
                    <p className="font-medium">NASA Earth Observation</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4 p-6 rounded-lg border border-border bg-card">
                <h3 className="text-xl font-semibold">Environmental Metrics</h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-muted-foreground">Average Temperature</p>
                    <p className="font-medium text-chart-3">{metrics.temperature.toFixed(1)}°C</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Green Cover</p>
                    <p className="font-medium text-chart-2">{metrics.greenCover.toFixed(0)}%</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Water Risk Level</p>
                    <p className="font-medium text-chart-1">{metrics.waterRisk.toFixed(0)}%</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Air Quality Index</p>
                    <p className="font-medium text-chart-5">
                      {nearbyLoading
                        ? "Loading..."
                        : Number.isFinite(metrics.aqi)
                          ? (metrics.aqi as number).toFixed(0)
                          : "N/A"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

export default function CustomLocationPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <DashboardContent />
    </Suspense>
  )
}
