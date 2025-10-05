"use client"

import useSWR from "swr"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { LocationsGridSkeleton } from "@/components/ui/location-skeleton"

type OpenAQLocation = {
  id: number
  name: string
  city?: string
  country?: string
  coordinates?: { latitude: number; longitude: number }
}

type OpenAQResponse = {
  results: OpenAQLocation[]
  meta?: any
}

const fetcher = (url: string) => fetch(url).then((r) => r.json())

export function OpenAQLocationsList({ limit = 1000 }: { limit?: number }) {
  const { data, error, isLoading } = useSWR<OpenAQResponse>(`/api/openaq?limit=${limit}`, fetcher)

  if (error) {
    return (
      <Card className="border-border">
        <CardHeader>
          <CardTitle className="text-destructive">Failed to load</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-sm">We couldn't fetch OpenAQ data. Please try again later.</p>
        </CardContent>
      </Card>
    )
  }

  if (isLoading || !data) {
    return (
      <div className="space-y-4">
        <Card className="border-border">
          <CardHeader>
            <CardTitle>Loading {limit.toLocaleString()} air quality locations...</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground text-sm">Fetching real-time data from OpenAQ API</p>
          </CardContent>
        </Card>
        <LocationsGridSkeleton count={12} />
      </div>
    )
  }

  const items = data.results ?? []

  return (
    <Card className="border-border">
      <CardHeader>
        <CardTitle className="text-pretty">OpenAQ Locations (first {limit})</CardTitle>
      </CardHeader>
      <CardContent>
        {items.length === 0 ? (
          <p className="text-muted-foreground text-sm">No locations found.</p>
        ) : (
          <ul className="flex flex-col gap-3">
            {items.map((loc) => (
              <li key={loc.id} className="rounded-lg border border-border p-3 hover:bg-secondary/40 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="min-w-0">
                    <p className="font-medium text-pretty">{loc.name}</p>
                    <p className="text-muted-foreground text-sm">
                      {loc.city || "Unknown city"}, {loc.country || "Unknown country"}
                    </p>
                  </div>
                  {loc.coordinates ? (
                    <span className="text-xs text-muted-foreground">
                      {loc.coordinates.latitude.toFixed(3)}, {loc.coordinates.longitude.toFixed(3)}
                    </span>
                  ) : (
                    <span className="text-xs text-muted-foreground">No coords</span>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  )
}
