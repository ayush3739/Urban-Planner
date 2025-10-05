"use client"

import { useEffect, useState, useMemo } from "react"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Wind, MapPin, Loader2, AlertCircle, Search } from "lucide-react"
import type { AirQualityData } from "@/lib/actions/air-quality"
import Link from "next/link"

function getAQILevel(aqi: number) {
  if (aqi <= 50) return { label: "Good", color: "text-chart-2", bg: "bg-chart-2/10", border: "border-chart-2/20" }
  if (aqi <= 100)
    return { label: "Moderate", color: "text-yellow-500", bg: "bg-yellow-500/10", border: "border-yellow-500/20" }
  if (aqi <= 150)
    return {
      label: "Unhealthy for Sensitive",
      color: "text-orange-500",
      bg: "bg-orange-500/10",
      border: "border-orange-500/20",
    }
  if (aqi <= 200) return { label: "Unhealthy", color: "text-chart-3", bg: "bg-chart-3/10", border: "border-chart-3/20" }
  if (aqi <= 300)
    return { label: "Very Unhealthy", color: "text-purple-500", bg: "bg-purple-500/10", border: "border-purple-500/20" }
  return { label: "Hazardous", color: "text-destructive", bg: "bg-destructive/10", border: "border-destructive/20" }
}

export function GlobalAirQuality() {
  const [data, setData] = useState<AirQualityData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCountry, setSelectedCountry] = useState<string>("all")
  const [aqiFilter, setAqiFilter] = useState<string>("all")
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 24

  useEffect(() => {
    async function loadData() {
      setLoading(true)
      setError(false)

      try {
        const response = await fetch("/api/air-quality/global")
        if (!response.ok) throw new Error("Failed to fetch")

        const result = await response.json()
        
        // Check if result is an array and has data
        if (Array.isArray(result) && result.length > 0) {
          setData(result)
          setError(false)
        } else {
          setError(true)
        }
      } catch (err) {
        setError(true)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  const filteredData = useMemo(() => {
    let filtered = data

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(
        (location) =>
          location.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
          location.country.toLowerCase().includes(searchQuery.toLowerCase()) ||
          location.location.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    }

    // Country filter
    if (selectedCountry !== "all") {
      filtered = filtered.filter((location) => location.country === selectedCountry)
    }

    // AQI filter
    if (aqiFilter !== "all") {
      filtered = filtered.filter((location) => {
        if (!location.aqi) return false
        if (aqiFilter === "good") return location.aqi <= 50
        if (aqiFilter === "moderate") return location.aqi > 50 && location.aqi <= 100
        if (aqiFilter === "unhealthy") return location.aqi > 100 && location.aqi <= 200
        if (aqiFilter === "hazardous") return location.aqi > 200
        return true
      })
    }

    return filtered
  }, [data, searchQuery, selectedCountry, aqiFilter])

  const totalPages = Math.ceil(filteredData.length / itemsPerPage)
  const paginatedData = filteredData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  // Get unique countries for filter
  const countries = useMemo(() => {
    const uniqueCountries = Array.from(new Set(data.map((location) => location.country))).sort()
    return uniqueCountries
  }, [data])

  if (loading) {
    return (
      <Card className="p-8 border-2 border-chart-5/20 bg-chart-5/5">
        <div className="flex items-center justify-center gap-3">
          <Loader2 className="w-6 h-6 animate-spin text-chart-5" />
          <span className="text-lg text-muted-foreground">Loading global air quality data...</span>
        </div>
      </Card>
    )
  }

  if (error || data.length === 0) {
    return (
      <Card className="p-8 border-2 border-muted bg-muted/5">
        <div className="flex items-center justify-center gap-3 text-muted-foreground">
          <AlertCircle className="w-6 h-6" />
          <span className="text-lg">Unable to load global air quality data</span>
        </div>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-3">
          <Wind className="w-6 h-6 text-chart-5" />
          <div>
            <h2 className="text-2xl font-bold">Global Air Quality Monitor</h2>
            <p className="text-sm text-muted-foreground">
              Showing {filteredData.length} of {data.length} locations worldwide
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="md:col-span-2 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search by city, country, or location..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value)
              setCurrentPage(1)
            }}
            className="pl-10"
          />
        </div>

        <select
          value={selectedCountry}
          onChange={(e) => {
            setSelectedCountry(e.target.value)
            setCurrentPage(1)
          }}
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <option value="all">All Countries</option>
          {countries.map((country) => (
            <option key={country} value={country}>
              {country}
            </option>
          ))}
        </select>

        <select
          value={aqiFilter}
          onChange={(e) => {
            setAqiFilter(e.target.value)
            setCurrentPage(1)
          }}
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <option value="all">All AQI Levels</option>
          <option value="good">Good (0-50)</option>
          <option value="moderate">Moderate (51-100)</option>
          <option value="unhealthy">Unhealthy (101-200)</option>
          <option value="hazardous">Hazardous (200+)</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {paginatedData.map((location, index) => {
          const aqiLevel = location.aqi ? getAQILevel(location.aqi) : null

          return (
            <Link
              key={index}
              href={`/dashboard/${location.city.toLowerCase().replace(/\s+/g, "-")}`}
              className="block group"
            >
              <Card
                className={`p-5 border-2 ${aqiLevel?.border || "border-border"} ${aqiLevel?.bg || "bg-card/50"} hover:scale-[1.02] transition-all duration-300`}
              >
                <div className="space-y-3">
                  {/* Location Header */}
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-2 flex-1">
                      <MapPin className="w-4 h-4 text-chart-5 mt-1 flex-shrink-0" />
                      <div className="min-w-0">
                        <h3 className="font-semibold text-lg leading-tight truncate">{location.city}</h3>
                        <p className="text-sm text-muted-foreground truncate">{location.country}</p>
                      </div>
                    </div>
                  </div>

                  {/* AQI Display */}
                  {location.aqi && aqiLevel && (
                    <div className="flex items-baseline gap-3 pt-2">
                      <span className="text-4xl font-bold">{location.aqi}</span>
                      <div className="flex flex-col">
                        <span className={`text-sm font-semibold ${aqiLevel.color}`}>{aqiLevel.label}</span>
                        <span className="text-xs text-muted-foreground">AQI</span>
                      </div>
                    </div>
                  )}

                  {/* Key Measurements */}
                  <div className="grid grid-cols-2 gap-2 pt-2 border-t border-border/50">
                    {location.measurements.slice(0, 4).map((measurement, idx) => (
                      <div key={idx} className="space-y-1">
                        <p className="text-xs text-muted-foreground uppercase">{measurement.parameter}</p>
                        <p className="text-sm font-semibold">
                          {measurement.value.toFixed(1)} {measurement.unit}
                        </p>
                      </div>
                    ))}
                  </div>

                  {/* View Details Link */}
                  <div className="pt-2 text-sm text-chart-5 group-hover:text-chart-4 transition-colors">
                    View Details →
                  </div>
                </div>
              </Card>
            </Link>
          )
        })}
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
          >
            Previous
          </Button>
          <div className="flex items-center gap-2">
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let pageNum
              if (totalPages <= 5) {
                pageNum = i + 1
              } else if (currentPage <= 3) {
                pageNum = i + 1
              } else if (currentPage >= totalPages - 2) {
                pageNum = totalPages - 4 + i
              } else {
                pageNum = currentPage - 2 + i
              }

              return (
                <Button
                  key={pageNum}
                  variant={currentPage === pageNum ? "default" : "outline"}
                  size="sm"
                  onClick={() => setCurrentPage(pageNum)}
                  className="w-10"
                >
                  {pageNum}
                </Button>
              )
            })}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  )
}
