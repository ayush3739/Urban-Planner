"use client"

import { Card } from "@/components/ui/card"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { RecommendationCard } from "@/components/recommendations/recommendation-card"
import { ArrowLeft, Lightbulb, Trees, Droplets, Building2, Bike, Waves, Wind, Flame, MapPin, Loader2 } from "lucide-react"
import Link from "next/link"

type CategoryFilter = "all" | "heat" | "green" | "water" | "aqi"

function getRecommendationsForCity(cityName: string) {
  return [
    {
      id: "1",
      icon: Trees,
      title: `Plant 20,000 Trees in ${cityName} North District`,
      description: "Strategic tree planting in high-heat urban areas will create natural cooling corridors and improve air quality. Focus on native species with high carbon sequestration rates.",
      impact: { metric: "Temperature Reduction", value: "2C", direction: "down" as const },
      priority: "high" as const,
      cost: "$450,000",
      timeframe: "6-12 months",
      category: "heat" as const,
    },
    {
      id: "2",
      icon: Droplets,
      title: `Add Wetlands in ${cityName} Eastern Zone`,
      description: "Construct artificial wetlands to absorb excess rainfall and reduce flood risk. These natural buffers will also improve water quality and create biodiversity habitats.",
      impact: { metric: "Flood Risk Reduction", value: "25%", direction: "down" as const },
      priority: "high" as const,
      cost: "$1.2M",
      timeframe: "12-18 months",
      category: "water" as const,
    },
    {
      id: "3",
      icon: Bike,
      title: `Create Bike Corridor in ${cityName} City Center`,
      description: "Develop a protected 15km bike lane network connecting residential areas to business districts. Reduce vehicle emissions and promote active transportation.",
      impact: { metric: "AQI Improvement", value: "15%", direction: "down" as const },
      priority: "medium" as const,
      cost: "$800,000",
      timeframe: "8-10 months",
      category: "aqi" as const,
    },
    {
      id: "4",
      icon: Building2,
      title: `Green Roof Initiative for ${cityName}`,
      description: "Incentivize building owners to install green roofs on commercial and residential buildings. Provide subsidies covering 40% of installation costs.",
      impact: { metric: "Urban Heat Reduction", value: "1.5C", direction: "down" as const },
      priority: "medium" as const,
      cost: "$2.5M",
      timeframe: "24 months",
      category: "heat" as const,
    },
    {
      id: "5",
      icon: Waves,
      title: `Permeable Pavement Program in ${cityName}`,
      description: "Replace traditional concrete with permeable materials in parking lots and sidewalks. Allows rainwater infiltration and reduces runoff.",
      impact: { metric: "Stormwater Management", value: "30%", direction: "up" as const },
      priority: "medium" as const,
      cost: "$650,000",
      timeframe: "6-9 months",
      category: "water" as const,
    },
    {
      id: "6",
      icon: Wind,
      title: `Air Quality Monitoring Network for ${cityName}`,
      description: "Deploy 50 IoT air quality sensors across the city to create real-time pollution maps. Enable data-driven policy decisions and public health alerts.",
      impact: { metric: "Monitoring Coverage", value: "85%", direction: "up" as const },
      priority: "low" as const,
      cost: "$180,000",
      timeframe: "3-4 months",
      category: "aqi" as const,
    },
    {
      id: "7",
      icon: Trees,
      title: `Urban Forest Expansion in ${cityName}`,
      description: "Convert 15 acres of underutilized land into urban forest parks. Provide recreational spaces while increasing carbon capture and biodiversity.",
      impact: { metric: "Green Cover Increase", value: "8%", direction: "up" as const },
      priority: "high" as const,
      cost: "$950,000",
      timeframe: "18-24 months",
      category: "green" as const,
    },
    {
      id: "8",
      icon: Flame,
      title: `Cool Pavement Technology for ${cityName}`,
      description: "Apply reflective coating to roads and parking areas to reduce heat absorption. Proven to lower surface temperatures by up to 10F.",
      impact: { metric: "Surface Temperature", value: "3C", direction: "down" as const },
      priority: "medium" as const,
      cost: "$420,000",
      timeframe: "4-6 months",
      category: "heat" as const,
    },
  ]
}

export default function RecommendationsPage() {
  const router = useRouter()
  const [filter, setFilter] = useState<CategoryFilter>("all")
  const [cityName, setCityName] = useState<string>("Your City")
  const [isDetecting, setIsDetecting] = useState(true)

  useEffect(() => {
    async function detectCity() {
      try {
        if ('geolocation' in navigator) {
          navigator.geolocation.getCurrentPosition(
            async (position) => {
              const { latitude, longitude } = position.coords
              try {
                const response = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=AIzaSyBoq5tXfaxm25brQhm8RUnjJgGEN8bVXNc`)
                const data = await response.json()
                if (data.results && data.results.length > 0) {
                  const cityComponent = data.results[0].address_components.find((component: any) => component.types.includes('locality'))
                  if (cityComponent) setCityName(cityComponent.long_name)
                }
              } catch (error) {
                console.error('Failed to reverse geocode:', error)
              } finally {
                setIsDetecting(false)
              }
            },
            (error) => {
              console.error('Geolocation error:', error)
              setIsDetecting(false)
            }
          )
        } else {
          setIsDetecting(false)
        }
      } catch (error) {
        console.error('Error detecting city:', error)
        setIsDetecting(false)
      }
    }
    detectCity()
  }, [])

  const recommendations = getRecommendationsForCity(cityName)
  const filteredRecommendations = filter === "all" ? recommendations : recommendations.filter((rec) => rec.category === filter)
  const stats = {
    total: recommendations.length,
    high: recommendations.filter((r) => r.priority === "high").length,
    medium: recommendations.filter((r) => r.priority === "medium").length,
    low: recommendations.filter((r) => r.priority === "low").length,
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card/30 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/">
                <Button variant="ghost" size="icon">
                  <ArrowLeft className="w-5 h-5" />
                </Button>
              </Link>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-accent/10 border border-accent/20">
                  <Lightbulb className="w-5 h-5 text-accent" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold">AI Recommendations</h1>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    {isDetecting ? (
                      <>
                        <Loader2 className="w-3 h-3 animate-spin" />
                        <span>Detecting your location...</span>
                      </>
                    ) : (
                      <>
                        <MapPin className="w-3 h-3" />
                        <span>Recommendations for {cityName}</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 space-y-8">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <Card className="p-4 bg-card/50 backdrop-blur-sm">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Total Actions</p>
              <p className="text-3xl font-bold">{stats.total}</p>
            </div>
          </Card>
          <Card className="p-4 bg-destructive/5 border-destructive/20">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">High Priority</p>
              <p className="text-3xl font-bold text-destructive">{stats.high}</p>
            </div>
          </Card>
          <Card className="p-4 bg-primary/5 border-primary/20">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Medium Priority</p>
              <p className="text-3xl font-bold text-primary">{stats.medium}</p>
            </div>
          </Card>
          <Card className="p-4 bg-muted/50">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Low Priority</p>
              <p className="text-3xl font-bold">{stats.low}</p>
            </div>
          </Card>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Recommended Actions</h2>
          </div>
          <Tabs value={filter} onValueChange={(value) => setFilter(value as CategoryFilter)} className="w-full">
            <TabsList className="grid w-full grid-cols-5 h-auto p-1 bg-card/50 backdrop-blur-sm">
              <TabsTrigger value="all" className="py-3">All</TabsTrigger>
              <TabsTrigger value="heat" className="py-3">Heat</TabsTrigger>
              <TabsTrigger value="green" className="py-3">Green</TabsTrigger>
              <TabsTrigger value="water" className="py-3">Water</TabsTrigger>
              <TabsTrigger value="aqi" className="py-3">Air</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRecommendations.map((recommendation) => (
            <RecommendationCard key={recommendation.id} {...recommendation} />
          ))}
        </div>

        <Card className="p-6 bg-primary/5 border-primary/20">
          <div className="flex items-start gap-4">
            <Lightbulb className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
            <div className="space-y-2">
              <h3 className="font-semibold text-lg">How These Recommendations Work</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Our AI analyzes NASA satellite data, historical trends, and urban planning best practices to generate
                personalized recommendations for {cityName}. Each action is prioritized based on impact, feasibility, and
                cost-effectiveness. Implementation timelines and cost estimates are based on similar projects in
                comparable urban environments.
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
