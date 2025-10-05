import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowRight, TrendingDown, TrendingUp } from "lucide-react"
import type { LucideIcon } from "lucide-react"

interface RecommendationCardProps {
  icon: LucideIcon
  title: string
  description: string
  impact: {
    metric: string
    value: string
    direction: "up" | "down"
  }
  priority: "high" | "medium" | "low"
  cost: string
  timeframe: string
  category: "heat" | "green" | "water" | "aqi"
}

const categoryColors = {
  heat: "border-chart-3/30 bg-chart-3/5",
  green: "border-chart-2/30 bg-chart-2/5",
  water: "border-chart-1/30 bg-chart-1/5",
  aqi: "border-chart-5/30 bg-chart-5/5",
}

const priorityConfig = {
  high: { label: "High Priority", variant: "destructive" as const },
  medium: { label: "Medium Priority", variant: "default" as const },
  low: { label: "Low Priority", variant: "secondary" as const },
}

export function RecommendationCard({
  icon: Icon,
  title,
  description,
  impact,
  priority,
  cost,
  timeframe,
  category,
}: RecommendationCardProps) {
  const priorityInfo = priorityConfig[priority]

  return (
    <Card className={`p-6 border-2 ${categoryColors[category]} backdrop-blur-sm hover:scale-[1.02] transition-all`}>
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3 flex-1">
            <div className={`p-3 rounded-xl ${categoryColors[category]} border-2`}>
              <Icon className="w-6 h-6" />
            </div>
            <div className="space-y-2 flex-1">
              <h3 className="font-semibold text-lg leading-tight">{title}</h3>
              <Badge variant={priorityInfo.variant} className="text-xs">
                {priorityInfo.label}
              </Badge>
            </div>
          </div>
        </div>

        {/* Description */}
        <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>

        {/* Impact */}
        <div className="p-4 rounded-lg bg-card border border-border">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">Expected Impact</p>
              <p className="text-sm font-medium">{impact.metric}</p>
            </div>
            <div className="flex items-center gap-2">
              {impact.direction === "down" ? (
                <TrendingDown className="w-5 h-5 text-accent" />
              ) : (
                <TrendingUp className="w-5 h-5 text-chart-2" />
              )}
              <span className="text-2xl font-bold">{impact.value}</span>
            </div>
          </div>
        </div>

        {/* Details */}
        <div className="grid grid-cols-2 gap-4 pt-2">
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">Estimated Cost</p>
            <p className="text-sm font-medium">{cost}</p>
          </div>
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">Timeframe</p>
            <p className="text-sm font-medium">{timeframe}</p>
          </div>
        </div>

        {/* Action */}
        <Button className="w-full gap-2 bg-transparent" variant="outline">
          View Details
          <ArrowRight className="w-4 h-4" />
        </Button>
      </div>
    </Card>
  )
}
