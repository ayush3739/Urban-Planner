"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Bell } from "lucide-react"
import { DisasterAlerts } from "@/components/disaster-alerts"

export default function AlertsPage() {
  const router = useRouter()

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
              <div className="flex items-center gap-2">
                <Bell className="w-6 h-6 text-red-500" />
                <h1 className="text-2xl font-bold">Disaster Alert System</h1>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              <span className="text-sm text-muted-foreground">Real-time monitoring</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="space-y-6">
          <div>
            <h2 className="text-3xl font-bold tracking-tight mb-2">NASA Disaster Monitoring</h2>
            <p className="text-muted-foreground">
              Real-time disaster alerts powered by NASA satellite data including FIRMS fire detection, 
              GPM precipitation monitoring, and MODIS environmental analysis.
            </p>
          </div>
          <DisasterAlerts />
        </div>
      </main>
    </div>
  )
}
