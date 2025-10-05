"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Button } from "@/components/ui/button"
import { Trees, Home, Car, Droplets, RotateCcw, Play, TrendingDown, TrendingUp } from "lucide-react"

interface SimulationState {
  trees: number
  greenRoofs: number
  evs: number
  rainwater: number
}

interface SimulationPanelProps {
  onSimulate: (state: SimulationState) => void
}

export function SimulationPanel({ onSimulate }: SimulationPanelProps) {
  const [simulation, setSimulation] = useState<SimulationState>({
    trees: 0,
    greenRoofs: 0,
    evs: 0,
    rainwater: 0,
  })

  const [results, setResults] = useState<{
    tempDrop: number
    aqiImprovement: number
    floodReduction: number
    healthScore: number
  } | null>(null)

  const [isSimulating, setIsSimulating] = useState(false)

  const handleReset = () => {
    setSimulation({
      trees: 0,
      greenRoofs: 0,
      evs: 0,
      rainwater: 0,
    })
    setResults(null)
  }

  const handleSimulate = () => {
    setIsSimulating(true)

    // Simulate processing time
    setTimeout(() => {
      // Calculate simulation results based on inputs with realistic formulas
      const tempDrop = (simulation.trees * 0.025 + simulation.greenRoofs * 0.018 + simulation.evs * 0.005).toFixed(1)
      const aqiImprovement = (simulation.trees * 0.35 + simulation.evs * 0.45 + simulation.greenRoofs * 0.1).toFixed(0)
      const floodReduction = (
        simulation.rainwater * 0.6 +
        simulation.greenRoofs * 0.25 +
        simulation.trees * 0.1
      ).toFixed(0)
      const healthScore = (
        (Number.parseFloat(tempDrop) * 15 +
          Number.parseFloat(aqiImprovement) * 0.6 +
          Number.parseFloat(floodReduction) * 0.4) /
        3
      ).toFixed(0)

      setResults({
        tempDrop: Number.parseFloat(tempDrop),
        aqiImprovement: Number.parseFloat(aqiImprovement),
        floodReduction: Number.parseFloat(floodReduction),
        healthScore: Number.parseFloat(healthScore),
      })

      onSimulate(simulation)
      setIsSimulating(false)
    }, 1500)
  }

  const hasChanges = Object.values(simulation).some((val) => val > 0)

  return (
    <Card className="p-6 space-y-6 bg-card/50 backdrop-blur-sm border-border/50">
      <div className="space-y-2">
        <h3 className="text-xl font-semibold">What If? Simulation</h3>
        <p className="text-sm text-muted-foreground">
          Adjust urban planning strategies to see their impact on city health
        </p>
      </div>

      <div className="space-y-6">
        {/* Trees Slider */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label className="flex items-center gap-2 text-base">
              <Trees className="w-4 h-4 text-chart-2" />
              Add Trees / Green Cover
            </Label>
            <span className="text-sm font-medium text-muted-foreground">{simulation.trees}%</span>
          </div>
          <Slider
            value={[simulation.trees]}
            onValueChange={(value) => setSimulation({ ...simulation, trees: value[0] })}
            max={100}
            step={5}
            className="[&_[role=slider]]:bg-chart-2 [&_[role=slider]]:border-chart-2"
          />
        </div>

        {/* Green Roofs Slider */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label className="flex items-center gap-2 text-base">
              <Home className="w-4 h-4 text-chart-2" />
              Green Roofs Adoption
            </Label>
            <span className="text-sm font-medium text-muted-foreground">{simulation.greenRoofs}%</span>
          </div>
          <Slider
            value={[simulation.greenRoofs]}
            onValueChange={(value) => setSimulation({ ...simulation, greenRoofs: value[0] })}
            max={100}
            step={5}
            className="[&_[role=slider]]:bg-chart-2 [&_[role=slider]]:border-chart-2"
          />
        </div>

        {/* EVs Slider */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label className="flex items-center gap-2 text-base">
              <Car className="w-4 h-4 text-chart-1" />
              Shift Vehicles to EVs
            </Label>
            <span className="text-sm font-medium text-muted-foreground">{simulation.evs}%</span>
          </div>
          <Slider
            value={[simulation.evs]}
            onValueChange={(value) => setSimulation({ ...simulation, evs: value[0] })}
            max={100}
            step={5}
            className="[&_[role=slider]]:bg-chart-1 [&_[role=slider]]:border-chart-1"
          />
        </div>

        {/* Rainwater Harvesting Slider */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label className="flex items-center gap-2 text-base">
              <Droplets className="w-4 h-4 text-chart-1" />
              Rainwater Harvesting
            </Label>
            <span className="text-sm font-medium text-muted-foreground">{simulation.rainwater}%</span>
          </div>
          <Slider
            value={[simulation.rainwater]}
            onValueChange={(value) => setSimulation({ ...simulation, rainwater: value[0] })}
            max={100}
            step={5}
            className="[&_[role=slider]]:bg-chart-1 [&_[role=slider]]:border-chart-1"
          />
        </div>
      </div>

      <div className="flex gap-3 pt-4">
        <Button onClick={handleSimulate} disabled={!hasChanges || isSimulating} className="flex-1 gap-2" size="lg">
          {isSimulating ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Running Simulation...
            </>
          ) : (
            <>
              <Play className="w-4 h-4" />
              Run Simulation
            </>
          )}
        </Button>
        <Button onClick={handleReset} variant="outline" disabled={!hasChanges || isSimulating} size="lg">
          <RotateCcw className="w-4 h-4" />
        </Button>
      </div>

      {results && (
        <div className="space-y-4 pt-4 border-t border-border animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="flex items-center justify-between">
            <h4 className="font-semibold text-lg">Predicted Impact</h4>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              Simulation Complete
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded-lg bg-chart-3/10 border border-chart-3/20 hover:border-chart-3/40 transition-colors">
              <div className="flex items-center gap-2 mb-1">
                <TrendingDown className="w-4 h-4 text-chart-3" />
                <div className="text-2xl font-bold text-chart-3">-{results.tempDrop}°C</div>
              </div>
              <div className="text-sm text-muted-foreground">Temperature Drop</div>
            </div>
            <div className="p-4 rounded-lg bg-chart-5/10 border border-chart-5/20 hover:border-chart-5/40 transition-colors">
              <div className="flex items-center gap-2 mb-1">
                <TrendingUp className="w-4 h-4 text-chart-5" />
                <div className="text-2xl font-bold text-chart-5">+{results.aqiImprovement}%</div>
              </div>
              <div className="text-sm text-muted-foreground">AQI Improvement</div>
            </div>
            <div className="p-4 rounded-lg bg-chart-1/10 border border-chart-1/20 hover:border-chart-1/40 transition-colors">
              <div className="flex items-center gap-2 mb-1">
                <TrendingDown className="w-4 h-4 text-chart-1" />
                <div className="text-2xl font-bold text-chart-1">-{results.floodReduction}%</div>
              </div>
              <div className="text-sm text-muted-foreground">Flood Risk Reduction</div>
            </div>
            <div className="p-4 rounded-lg bg-chart-2/10 border border-chart-2/20 hover:border-chart-2/40 transition-colors">
              <div className="flex items-center gap-2 mb-1">
                <TrendingUp className="w-4 h-4 text-chart-2" />
                <div className="text-2xl font-bold text-chart-2">{results.healthScore}</div>
              </div>
              <div className="text-sm text-muted-foreground">Health Benefit Score</div>
            </div>
          </div>
        </div>
      )}
    </Card>
  )
}
