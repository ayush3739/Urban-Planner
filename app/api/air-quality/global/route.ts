import { NextResponse } from "next/server"
import { fetchGlobalAirQuality } from "@/lib/actions/air-quality"

export async function GET() {
  try {
    const data = await fetchGlobalAirQuality(60)
    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch global air quality" }, { status: 500 })
  }
}
