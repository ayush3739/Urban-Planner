"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Line,
  LineChart,
  Bar,
  BarChart,
  Area,
  AreaChart,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import type { City } from "@/lib/cities-data"

interface DataChartsProps {
  city: City
  activeLayer: "heat" | "green" | "water" | "aqi"
}

export function DataCharts({ city, activeLayer }: DataChartsProps) {
  const getChartConfig = () => {
    switch (activeLayer) {
      case "heat":
        return {
          heat: { label: "Heat Index (°C)", color: "hsl(var(--chart-3))" },
        }
      case "green":
        return {
          green: { label: "Green Cover (%)", color: "hsl(var(--chart-2))" },
        }
      case "water":
        return {
          rainfall: { label: "Rainfall (mm)", color: "hsl(var(--chart-1))" },
        }
      case "aqi":
        return {
          aqi: { label: "Air Quality Index", color: "hsl(var(--chart-5))" },
        }
    }
  }

  const getChartData = () => {
    return city.historicalData
  }

  const getDataKey = () => {
    return activeLayer === "water" ? "rainfall" : activeLayer
  }

  const getChartTitle = () => {
    switch (activeLayer) {
      case "heat":
        return "Urban Heat Island Trend"
      case "green":
        return "Green Cover Analysis"
      case "water":
        return "Rainfall & Flood Risk"
      case "aqi":
        return "Air Quality Monitoring"
    }
  }

  const getChartDescription = () => {
    switch (activeLayer) {
      case "heat":
        return "Temperature increase above surrounding rural areas"
      case "green":
        return "Percentage of city area covered by vegetation"
      case "water":
        return "Monthly precipitation levels affecting flood risk"
      case "aqi":
        return "Air pollution levels (lower is better)"
    }
  }

  return (
    <div className="grid gap-6">
      {/* Main Trend Chart */}
      <Card>
        <CardHeader>
          <CardTitle>{getChartTitle()}</CardTitle>
          <CardDescription>{getChartDescription()}</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={getChartConfig()} className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={getChartData()}>
                <defs>
                  <linearGradient id={`gradient-${activeLayer}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={`var(--color-${getDataKey()})`} stopOpacity={0.3} />
                    <stop offset="95%" stopColor={`var(--color-${getDataKey()})`} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="month" className="text-xs" />
                <YAxis className="text-xs" />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Area
                  type="monotone"
                  dataKey={getDataKey()}
                  stroke={`var(--color-${getDataKey()})`}
                  fill={`url(#gradient-${activeLayer})`}
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Comparison Charts */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Monthly Comparison</CardTitle>
            <CardDescription>Bar chart view of the data</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={getChartConfig()} className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={getChartData()}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="month" className="text-xs" />
                  <YAxis className="text-xs" />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey={getDataKey()} fill={`var(--color-${getDataKey()})`} radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">All Metrics Overview</CardTitle>
            <CardDescription>Combined environmental data</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                heat: { label: "Heat", color: "hsl(var(--chart-3))" },
                green: { label: "Green", color: "hsl(var(--chart-2))" },
                aqi: { label: "AQI", color: "hsl(var(--chart-5))" },
              }}
              className="h-[200px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={getChartData()}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="month" className="text-xs" />
                  <YAxis className="text-xs" />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Line type="monotone" dataKey="heat" stroke="var(--color-heat)" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="green" stroke="var(--color-green)" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="aqi" stroke="var(--color-aqi)" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
