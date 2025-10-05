import { type NextRequest, NextResponse } from "next/server"
import { fetchAirQuality } from "@/lib/actions/air-quality"

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const city = searchParams.get("city")

  if (!city) {
    return NextResponse.json({ error: "City parameter is required" }, { status: 400 })
  }

  const data = await fetchAirQuality(city)

  if (!data) {
    return NextResponse.json({ error: "No data found" }, { status: 404 })
  }

  return NextResponse.json(data)
}
