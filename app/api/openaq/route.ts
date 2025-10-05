import { NextResponse, type NextRequest } from "next/server"

// OpenAQ API endpoint
const OPENAQ_API_KEY = process.env.OPENAQ_API_KEY || "706306e2b140aee16932e5b073e2de6a6e9b30ce1f796441ad953676cd82bded"
const OPENAQ_V3_LOCATIONS_URL = "https://api.openaq.org/v3/locations"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get("limit") || "1000", 10)

    // Try to fetch from OpenAQ API with caching
    try {
      const openaqUrl = `${OPENAQ_V3_LOCATIONS_URL}?limit=${limit}`
      
      const response = await fetch(openaqUrl, {
        headers: {
          "X-API-Key": OPENAQ_API_KEY,
        },
        // Cache for 1 hour (3600 seconds) - makes subsequent loads instant!
        next: { revalidate: 3600 }
      })

      if (!response.ok) {
        throw new Error(`OpenAQ API error: ${response.status}`)
      }

      const data = await response.json()
      
      // Transform the data to match our expected format
      const transformedResults = data.results?.map((location: any) => ({
        id: location.id,
        name: location.name || "Unknown Location",
        city: location.locality || location.city || "Unknown",
        country: location.country?.name || location.country || "Unknown",
        coordinates: location.coordinates ? {
          latitude: location.coordinates.latitude,
          longitude: location.coordinates.longitude
        } : null,
        measurements: location.sensors?.map((sensor: any) => ({
          parameter: sensor.parameter?.name || sensor.parameter,
          value: sensor.coverage?.expectedCount,
          unit: sensor.unit,
          lastUpdated: sensor.coverage?.datetimeLast?.utc
        })) || []
      })) || []

      return NextResponse.json({
        results: transformedResults,
        meta: data.meta
      })
    } catch (apiError) {
      // Fall through to mock data
    }

    // If API fails or API key not available, return mock data
    const mockLocations = [
      {
        id: 1,
        name: "New York Central Park",
        city: "New York",
        country: "United States",
        coordinates: { latitude: 40.7829, longitude: -73.9654 }
      },
      {
        id: 2,
        name: "London Westminster",
        city: "London",
        country: "United Kingdom",
        coordinates: { latitude: 51.4994, longitude: -0.1244 }
      },
      {
        id: 3,
        name: "Tokyo Shibuya",
        city: "Tokyo",
        country: "Japan",
        coordinates: { latitude: 35.6762, longitude: 139.6503 }
      },
      {
        id: 4,
        name: "Paris Centre",
        city: "Paris",
        country: "France",
        coordinates: { latitude: 48.8566, longitude: 2.3522 }
      },
      {
        id: 5,
        name: "Beijing Central",
        city: "Beijing",
        country: "China",
        coordinates: { latitude: 39.9042, longitude: 116.4074 }
      },
      {
        id: 6,
        name: "Mumbai Downtown",
        city: "Mumbai",
        country: "India",
        coordinates: { latitude: 19.0760, longitude: 72.8777 }
      },
      {
        id: 7,
        name: "São Paulo Centro",
        city: "São Paulo",
        country: "Brazil",
        coordinates: { latitude: -23.5505, longitude: -46.6333 }
      },
      {
        id: 8,
        name: "Mexico City Centro",
        city: "Mexico City",
        country: "Mexico",
        coordinates: { latitude: 19.4326, longitude: -99.1332 }
      },
      {
        id: 9,
        name: "Sydney Harbour",
        city: "Sydney",
        country: "Australia",
        coordinates: { latitude: -33.8688, longitude: 151.2093 }
      },
      {
        id: 10,
        name: "Cairo Downtown",
        city: "Cairo",
        country: "Egypt",
        coordinates: { latitude: 30.0444, longitude: 31.2357 }
      }
    ]

    return NextResponse.json({
      results: mockLocations.slice(0, limit),
      meta: {
        total: mockLocations.length,
        limit: limit,
        source: "mock_data"
      }
    })
  } catch (error) {
    console.error("[OpenAQ API] Error:", error)
    
    // Return mock data as fallback
    const mockLocations = [
      {
        id: 1,
        name: "New York Central Park",
        city: "New York",
        country: "United States",
        coordinates: { latitude: 40.7829, longitude: -73.9654 }
      },
      {
        id: 2,
        name: "London Westminster",
        city: "London",
        country: "United Kingdom",
        coordinates: { latitude: 51.4994, longitude: -0.1244 }
      }
    ]

    return NextResponse.json({
      results: mockLocations,
      meta: {
        total: mockLocations.length,
        limit: 10,
        source: "fallback_mock_data",
        error: "API unavailable"
      }
    })
  }
}