import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const latitude = searchParams.get('latitude') || '28.61'
    const longitude = searchParams.get('longitude') || '77.23'
    const startDate = searchParams.get('start') || '20251001'
    const endDate = searchParams.get('end') || '20251004'

    // Validate parameters
    const lat = parseFloat(latitude)
    const lng = parseFloat(longitude)
    
    if (isNaN(lat) || isNaN(lng) || lat < -90 || lat > 90 || lng < -180 || lng > 180) {
      return NextResponse.json(
        { error: 'Invalid latitude or longitude values' },
        { status: 400 }
      )
    }

    // Build NASA POWER API URL
    const nasaUrl = new URL('https://power.larc.nasa.gov/api/temporal/daily/point')
    nasaUrl.searchParams.set('parameters', 'T2M')
    nasaUrl.searchParams.set('start', startDate)
    nasaUrl.searchParams.set('end', endDate)
    nasaUrl.searchParams.set('latitude', latitude)
    nasaUrl.searchParams.set('longitude', longitude)
    nasaUrl.searchParams.set('format', 'JSON')
    nasaUrl.searchParams.set('community', 'RE')

    console.log('[NASA POWER API] Fetching:', nasaUrl.toString())

    const response = await fetch(nasaUrl.toString(), {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'NASA-Urban-Simulator/1.0'
      }
    })

    if (!response.ok) {
      console.error('[NASA POWER API] Error:', response.status, response.statusText)
      return NextResponse.json(
        { error: `NASA POWER API error: ${response.status} ${response.statusText}` },
        { status: response.status }
      )
    }

    const data = await response.json()
    
    // Log the response structure for debugging
    console.log('[NASA POWER API] Response keys:', Object.keys(data))
    if (data.properties) {
      console.log('[NASA POWER API] Properties keys:', Object.keys(data.properties))
      if (data.properties.parameter) {
        console.log('[NASA POWER API] Parameter keys:', Object.keys(data.properties.parameter))
      }
    }

    return NextResponse.json(data)

  } catch (error) {
    console.error('[NASA POWER API] Error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch temperature data from NASA POWER API' },
      { status: 500 }
    )
  }
}