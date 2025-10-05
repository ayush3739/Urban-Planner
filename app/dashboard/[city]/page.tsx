"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MapVisualization } from "@/components/dashboard/google-map-visualization"
import { MetricCard } from "@/components/dashboard/metric-card"
import { LayerTabs } from "@/components/dashboard/layer-tabs"
import { SimulationPanel } from "@/components/dashboard/simulation-panel"
import { DataCharts } from "@/components/dashboard/data-charts"
import { AirQualityPanel } from "@/components/dashboard/air-quality-panel"
import { ApiStatusIndicator } from "@/components/api-status-indicator"
import { ArrowLeft, Flame, Leaf, Droplets, Wind, BarChart3, Map, Info, Search } from "lucide-react"
import { getCityById, cities } from "@/lib/cities-data"
import {
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from "@/components/ui/command"

type DataLayer = "heat" | "green" | "water" | "aqi"

export default function DashboardPage() {
  const params = useParams()
  const router = useRouter()
  const cityId = params.city as string
  const city = getCityById(cityId)
  const [mounted, setMounted] = useState(false)

  const [activeLayer, setActiveLayer] = useState<DataLayer>("heat")
  const [activeTab, setActiveTab] = useState("map")
  const [realTimeAQI, setRealTimeAQI] = useState<number | undefined>(undefined)
  const [citySearchOpen, setCitySearchOpen] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (mounted && !city) {
      router.push("/")
    }
  }, [mounted, city, router])

  if (!mounted || !city) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/30 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" onClick={() => router.push("/")}>
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <div>
                <h1 className="text-2xl font-bold">
                  {city.name}, {city.country}
                </h1>
                <p className="text-sm text-muted-foreground">
                  {city.continent} • Population: {(city.population / 1000000).toFixed(2)}M
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setCitySearchOpen(true)}
                className="inline-flex items-center gap-2 rounded-md border border-border bg-card px-3 py-2 text-sm hover:bg-accent/50"
                aria-label="Search City"
                title="Search City"
              >
                <Search className="w-4 h-4" />
                <span>Search City</span>
              </button>
              <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
              <span className="text-sm text-muted-foreground">Live Data</span>
            </div>
          </div>
        </div>
      </header>

      <CommandDialog open={citySearchOpen} onOpenChange={setCitySearchOpen} title="Search Cities">
        <CommandInput placeholder="Type a city name..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Cities">
            {cities.map((c) => (
              <CommandItem
                key={c.id}
                value={c.id}
                onSelect={(value) => {
                  // navigate to the selected city dashboard
                  router.push(`/dashboard/${value}`)
                  setCitySearchOpen(false)
                }}
              >
                <div className="flex items-center gap-2">
                  <span className="font-medium">{c.name}</span>
                  <span className="text-muted-foreground text-xs">• {c.country}</span>
                </div>
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </CommandDialog>

      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* Metrics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard
            icon={Flame}
            label="Urban Heat Index"
            value={city.metrics.heat.toString()}
            unit="°C"
            trend="up"
            trendValue="0.3°C"
            color="heat"
          />
          <MetricCard
            icon={Leaf}
            label="Green Cover"
            value={city.metrics.green.toString()}
            unit="%"
            trend="down"
            trendValue="2%"
            color="green"
          />
          <MetricCard icon={Droplets} label="Flood Risk" value={city.metrics.water} unit="" color="water" />
          <MetricCard
            icon={Wind}
            label="Air Quality Index"
            value={(realTimeAQI ?? city.metrics.aqi).toString()}
            unit="AQI"
            trend="up"
            trendValue="5"
            color="aqi"
          />
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <div className="flex items-center justify-between">
            <TabsList>
              <TabsTrigger value="map" className="gap-2">
                <Map className="w-4 h-4" />
                Map View
              </TabsTrigger>
              <TabsTrigger value="charts" className="gap-2">
                <BarChart3 className="w-4 h-4" />
                Charts & Analytics
              </TabsTrigger>
              <TabsTrigger value="details" className="gap-2">
                <Info className="w-4 h-4" />
                View Details
              </TabsTrigger>
            </TabsList>
            <LayerTabs activeLayer={activeLayer} onLayerChange={setActiveLayer} />
          </div>

          <TabsContent value="map" className="space-y-4">
            <div className="grid lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <div className="h-[600px]">
                  <MapVisualization
                    layer={activeLayer}
                    latitude={city.coordinates.lat}
                    longitude={city.coordinates.lng}
                    locationName={`${city.name}, ${city.country}`}
                  />
                </div>
              </div>
              <div className="lg:col-span-1">
                <SimulationPanel onSimulate={(state) => console.log("Simulation:", state)} />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="charts" className="space-y-4">
            <DataCharts city={city} activeLayer={activeLayer} />
            <div className="mt-8">
              <h3 className="text-xl font-semibold mb-4">Real-Time Air Quality Data</h3>
              <AirQualityPanel cityName={city.name} onDataFetched={setRealTimeAQI} />
            </div>
          </TabsContent>

          <TabsContent value="details" className="space-y-4">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-6">
                <ApiStatusIndicator />
                <div className="rounded-xl bg-card border border-border p-6">
                  <h3 className="text-lg font-semibold mb-4">Location Details</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">City</span>
                      <span className="font-medium">{city.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Country</span>
                      <span className="font-medium">{city.country}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Continent</span>
                      <span className="font-medium">{city.continent}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Population</span>
                      <span className="font-medium">{city.population.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Latitude</span>
                      <span className="font-mono text-sm">{city.coordinates.lat.toFixed(4)}°</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Longitude</span>
                      <span className="font-mono text-sm">{city.coordinates.lng.toFixed(4)}°</span>
                    </div>
                  </div>
                </div>

                <div className="rounded-xl bg-card border border-border p-6">
                  <h3 className="text-lg font-semibold mb-4">Environmental Metrics</h3>
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-muted-foreground">Urban Heat Island</span>
                        <span className="font-medium">{city.metrics.heat}°C</span>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div className="h-full bg-chart-3" style={{ width: `${(city.metrics.heat / 6) * 100}%` }} />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-muted-foreground">Green Cover</span>
                        <span className="font-medium">{city.metrics.green}%</span>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div className="h-full bg-chart-2" style={{ width: `${city.metrics.green}%` }} />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-muted-foreground">Air Quality Index</span>
                        <span className="font-medium">{realTimeAQI ?? city.metrics.aqi} AQI</span>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-full bg-chart-5"
                          style={{ width: `${Math.min(((realTimeAQI ?? city.metrics.aqi) / 200) * 100, 100)}%` }}
                        />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-muted-foreground">Flood Risk</span>
                        <span className="font-medium">{city.metrics.water}</span>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-full bg-chart-1"
                          style={{
                            width:
                              city.metrics.water === "Low" ? "33%" : city.metrics.water === "Medium" ? "66%" : "100%",
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="rounded-xl bg-card border border-border p-6">
                  <h3 className="text-lg font-semibold mb-4">Data Sources</h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 rounded-full bg-primary mt-1.5" />
                      <div>
                        <div className="font-medium">NASA MODIS</div>
                        <div className="text-muted-foreground">Land Surface Temperature & Vegetation Index</div>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 rounded-full bg-primary mt-1.5" />
                      <div>
                        <div className="font-medium">Landsat 8/9</div>
                        <div className="text-muted-foreground">Urban Growth & Land Cover Analysis</div>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 rounded-full bg-primary mt-1.5" />
                      <div>
                        <div className="font-medium">GPM IMERG</div>
                        <div className="text-muted-foreground">Precipitation & Flood Risk Data</div>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 rounded-full bg-primary mt-1.5" />
                      <div>
                        <div className="font-medium">Sentinel-5P</div>
                        <div className="text-muted-foreground">Air Quality & Pollution Monitoring</div>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 rounded-full bg-accent mt-1.5" />
                      <div>
                        <div className="font-medium">OpenAQ</div>
                        <div className="text-muted-foreground">Real-time Air Quality Measurements</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="rounded-xl bg-card border border-border p-6">
                  <h3 className="text-lg font-semibold mb-4">Key Insights</h3>
                  <div className="space-y-3 text-sm">
                    {city.metrics.heat > 4 && (
                      <div className="flex items-start gap-3 p-3 rounded-lg bg-chart-3/10">
                        <Flame className="w-4 h-4 text-chart-3 mt-0.5" />
                        <div>
                          <div className="font-medium">High Heat Island Effect</div>
                          <div className="text-muted-foreground">
                            Temperature is {city.metrics.heat}°C above surrounding areas
                          </div>
                        </div>
                      </div>
                    )}
                    {city.metrics.green < 25 && (
                      <div className="flex items-start gap-3 p-3 rounded-lg bg-chart-2/10">
                        <Leaf className="w-4 h-4 text-chart-2 mt-0.5" />
                        <div>
                          <div className="font-medium">Low Green Cover</div>
                          <div className="text-muted-foreground">
                            Only {city.metrics.green}% vegetation coverage detected
                          </div>
                        </div>
                      </div>
                    )}
                    {(realTimeAQI ?? city.metrics.aqi) > 100 && (
                      <div className="flex items-start gap-3 p-3 rounded-lg bg-chart-5/10">
                        <Wind className="w-4 h-4 text-chart-5 mt-0.5" />
                        <div>
                          <div className="font-medium">Poor Air Quality</div>
                          <div className="text-muted-foreground">
                            AQI of {realTimeAQI ?? city.metrics.aqi} indicates unhealthy air
                          </div>
                        </div>
                      </div>
                    )}
                    {city.metrics.water === "High" && (
                      <div className="flex items-start gap-3 p-3 rounded-lg bg-chart-1/10">
                        <Droplets className="w-4 h-4 text-chart-1 mt-0.5" />
                        <div>
                          <div className="font-medium">High Flood Risk</div>
                          <div className="text-muted-foreground">Elevated risk of flooding in this region</div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        {/* Legend */}
        <div className="flex flex-wrap items-center justify-center gap-6 p-6 rounded-xl bg-card/30 backdrop-blur-sm border border-border">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-chart-3" />
            <span className="text-sm text-muted-foreground">High Heat</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-chart-2" />
            <span className="text-sm text-muted-foreground">Green Areas</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-chart-1" />
            <span className="text-sm text-muted-foreground">Water Risk</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-chart-5" />
            <span className="text-sm text-muted-foreground">Poor Air Quality</span>
          </div>
        </div>
      </div>
    </div>
  )
}
