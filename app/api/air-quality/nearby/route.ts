import { NextResponse, type NextRequest } from "next/server"
import { getAirQualityByCoords } from "@/lib/actions/air-quality"

function getAQI(pm25: number) {
  const bps = [
    { C_low: 0, C_high: 12, I_low: 0, I_high: 50 },
    { C_low: 12.1, C_high: 35.4, I_low: 51, I_high: 100 },
    { C_low: 35.5, C_high: 55.4, I_low: 101, I_high: 150 },
    { C_low: 55.5, C_high: 150.4, I_low: 151, I_high: 200 },
    { C_low: 150.5, C_high: 250.4, I_low: 201, I_high: 300 },
    { C_low: 250.5, C_high: 500, I_low: 301, I_high: 500 },
  ]
  for (const bp of bps) {
    if (pm25 >= bp.C_low && pm25 <= bp.C_high) {
      const aqi = ((bp.I_high - bp.I_low) / (bp.C_high - bp.C_low)) * (pm25 - bp.C_low) + bp.I_low
      return Math.round(aqi)
    }
  }
  return null
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const lat = Number(searchParams.get("lat"))
    const lng = Number(searchParams.get("lng"))
    if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
      return NextResponse.json({ error: "lat and lng are required" }, { status: 400 })
    }

    const aq = await getAirQualityByCoords(lat, lng)
    if (!aq) {
      // Return mock data when API is not available
      const mockAqi = Math.round(50 + Math.random() * 100)
      return NextResponse.json({
        aqi: mockAqi,
        location: {
          name: "Nearest Station",
          city: "",
          country: "",
          coordinates: { latitude: lat, longitude: lng },
        },
        measurements: [
          {
            parameter: "pm25",
            value: Math.round(mockAqi * 0.4 + Math.random() * 10),
            lastUpdated: new Date().toISOString(),
            unit: "µg/m³",
            sourceName: "Mock Data",
            averagingPeriod: { value: 24, unit: "hours" }
          }
        ],
      })
    }

    return NextResponse.json({
      aqi: aq.aqi ?? null,
      location: {
        name: "Nearest Station",
        city: "",
        country: "",
        coordinates: { latitude: lat, longitude: lng },
      },
      measurements: aq.measurements || [],
    })
  } catch (err) {
    console.error("[v0] Nearby AQI (Google) error:", err)
    return NextResponse.json({ error: "Failed to fetch nearby AQI" }, { status: 500 })
  }
}
