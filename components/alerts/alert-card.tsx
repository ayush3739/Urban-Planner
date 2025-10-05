import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AlertTriangle, Flame, CloudRain, Wind } from "lucide-react"
import type { LucideIcon } from "lucide-react"

type AlertType = "fire" | "flood" | "storm" | "heatwave"
type AlertSeverity = "high" | "medium" | "low"

interface AlertCardProps {
  type: AlertType
  severity: AlertSeverity
  title: string
  location: string
  description: string
  time: string
}

const alertConfig: Record<
  AlertType,
  {
    icon: LucideIcon
    color: string
    bgColor: string
    borderColor: string
  }
> = {
  fire: {
    icon: Flame,
    color: "text-chart-3",
    bgColor: "bg-chart-3/10",
    borderColor: "border-chart-3/30",
  },
  flood: {
    icon: CloudRain,
    color: "text-chart-1",
    bgColor: "bg-chart-1/10",
    borderColor: "border-chart-1/30",
  },
  storm: {
    icon: Wind,
    color: "text-chart-5",
    bgColor: "bg-chart-5/10",
    borderColor: "border-chart-5/30",
  },
  heatwave: {
    icon: AlertTriangle,
    color: "text-chart-3",
    bgColor: "bg-chart-3/10",
    borderColor: "border-chart-3/30",
  },
}

const severityConfig: Record<AlertSeverity, { label: string; variant: "default" | "destructive" | "secondary" }> = {
  high: { label: "High Risk", variant: "destructive" },
  medium: { label: "Medium Risk", variant: "default" },
  low: { label: "Low Risk", variant: "secondary" },
}

export function AlertCard({ type, severity, title, location, description, time }: AlertCardProps) {
  const config = alertConfig[type]
  const Icon = config.icon
  const severityInfo = severityConfig[severity]

  return (
    <Card className={`p-6 border-2 ${config.borderColor} ${config.bgColor} backdrop-blur-sm animate-in fade-in-50`}>
      <div className="space-y-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3 flex-1">
            <div className={`p-2 rounded-lg ${config.bgColor} ${config.borderColor} border`}>
              <Icon className={`w-5 h-5 ${config.color}`} />
            </div>
            <div className="space-y-1 flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="font-semibold text-lg">{title}</h3>
                <Badge variant={severityInfo.variant} className="text-xs">
                  {severityInfo.label}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">{location}</p>
            </div>
          </div>
          <div className="text-xs text-muted-foreground whitespace-nowrap">{time}</div>
        </div>

        <p className="text-sm leading-relaxed">{description}</p>

        {severity === "high" && (
          <div className="flex items-center gap-2 p-3 rounded-lg bg-destructive/10 border border-destructive/20">
            <AlertTriangle className="w-4 h-4 text-destructive flex-shrink-0" />
            <p className="text-xs text-destructive font-medium">Immediate action recommended</p>
          </div>
        )}
      </div>
    </Card>
  )
}
