import type { LucideIcon } from "lucide-react"
import { Card } from "@/components/ui/card"

interface MetricCardProps {
  icon: LucideIcon
  label: string
  value: string
  unit: string
  trend?: "up" | "down" | "neutral"
  trendValue?: string
  color: "heat" | "green" | "water" | "aqi"
}

const colorClasses = {
  heat: "text-chart-3 bg-chart-3/10 border-chart-3/20",
  green: "text-chart-2 bg-chart-2/10 border-chart-2/20",
  water: "text-chart-1 bg-chart-1/10 border-chart-1/20",
  aqi: "text-chart-5 bg-chart-5/10 border-chart-5/20",
}

export function MetricCard({ icon: Icon, label, value, unit, trend, trendValue, color }: MetricCardProps) {
  return (
    <Card className={`p-6 border-2 ${colorClasses[color]} backdrop-blur-sm transition-all hover:scale-105`}>
      <div className="flex items-start justify-between">
        <div className="space-y-3 flex-1">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${colorClasses[color]}`}>
              <Icon className="w-5 h-5" />
            </div>
            <span className="text-sm font-medium text-muted-foreground">{label}</span>
          </div>
          <div className="space-y-1">
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold">{value}</span>
              <span className="text-lg text-muted-foreground">{unit}</span>
            </div>
            {trend && trendValue && (
              <div className="flex items-center gap-1 text-sm">
                <span className={trend === "up" ? "text-destructive" : "text-accent"}>
                  {trend === "up" ? "↑" : "↓"} {trendValue}
                </span>
                <span className="text-muted-foreground">vs last month</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </Card>
  )
}
