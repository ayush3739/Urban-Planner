"use client"

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Flame, Leaf, Droplets, Wind } from "lucide-react"

type DataLayer = "heat" | "green" | "water" | "aqi"

interface LayerTabsProps {
  activeLayer: DataLayer
  onLayerChange: (layer: DataLayer) => void
}

export function LayerTabs({ activeLayer, onLayerChange }: LayerTabsProps) {
  return (
    <Tabs value={activeLayer} onValueChange={(value) => onLayerChange(value as DataLayer)} className="w-full">
      <TabsList className="grid w-full grid-cols-4 h-auto p-1 bg-card/50 backdrop-blur-sm">
        <TabsTrigger value="heat" className="flex items-center gap-2 py-3 data-[state=active]:bg-chart-3/20">
          <Flame className="w-4 h-4" />
          <span className="hidden sm:inline">Heat</span>
        </TabsTrigger>
        <TabsTrigger value="green" className="flex items-center gap-2 py-3 data-[state=active]:bg-chart-2/20">
          <Leaf className="w-4 h-4" />
          <span className="hidden sm:inline">Green Cover</span>
        </TabsTrigger>
        <TabsTrigger value="water" className="flex items-center gap-2 py-3 data-[state=active]:bg-chart-1/20">
          <Droplets className="w-4 h-4" />
          <span className="hidden sm:inline">Water Risk</span>
        </TabsTrigger>
        <TabsTrigger value="aqi" className="flex items-center gap-2 py-3 data-[state=active]:bg-chart-5/20">
          <Wind className="w-4 h-4" />
          <span className="hidden sm:inline">Air Quality</span>
        </TabsTrigger>
      </TabsList>
    </Tabs>
  )
}
