'use client'

import dynamic from 'next/dynamic'
import { Skeleton } from '@/components/ui/skeleton'
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

// Dynamically import the map component with no SSR
const MapVisualizationComponent = dynamic(
  () => import("../map-visualization").then(mod => ({ default: mod.default })),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-[600px] rounded-lg bg-muted flex items-center justify-center">
        <Skeleton className="w-full h-full" />
      </div>
    )
  }
)

export default function MapVisualizationPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/">
            <Button variant="ghost" size="sm" className="gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back to Home
            </Button>
          </Link>
          <h1 className="text-xl font-bold">NASA Map Visualization</h1>
          <div className="w-24" />
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold mb-2">Interactive NASA Data Map</h2>
            <p className="text-muted-foreground">
              Explore urban heat islands and water stress data with your current location
            </p>
          </div>
          <MapVisualizationComponent />
        </div>
      </main>
    </div>
  )
}