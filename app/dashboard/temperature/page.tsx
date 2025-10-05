'use client'

import { TemperatureChart } from '@/components/temperature-chart'
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

export default function TemperaturePage() {
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
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-bold">Temperature Analysis</h1>
            <span className="text-sm text-muted-foreground">NASA POWER API Data</span>
          </div>
          <div className="w-24" />
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="space-y-6">
          <div>
            <h2 className="text-3xl font-bold tracking-tight mb-2">Temperature Data Visualization</h2>
            <p className="text-muted-foreground">
              Fetch and visualize 2-meter air temperature data from NASA's POWER API with interactive charts and statistics.
            </p>
          </div>
          <TemperatureChart />
        </div>
      </main>
    </div>
  )
}