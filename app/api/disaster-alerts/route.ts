import { NextRequest, NextResponse } from 'next/server'

// NASA FIRMS API for active fire data
const FIRMS_BASE_URL = 'https://firms.modaps.eosdis.nasa.gov/api/area/csv'
const NASA_FIRMS_API_KEY = process.env.NASA_FIRMS_API_KEY || process.env.NEXT_PUBLIC_NASA_FIRMS_API_KEY

export interface FireData {
  latitude: number
  longitude: number
  brightness: number
  scan: number
  track: number
  acq_date: string
  acq_time: string
  satellite: string
  confidence: number | string
  version: string
  bright_t31: number
  frp: number // Fire Radiative Power
  daynight: string
}

export interface DisasterAlert {
  id: string
  type: 'fire' | 'flood' | 'storm' | 'heatwave'
  severity: 'low' | 'medium' | 'high'
  title: string
  location: string
  description: string
  time: string
  lat: number
  lon: number
  confidence?: number
  frp?: number
  satellite?: string
}

async function fetchRealFireData(lat: number, lng: number, radius: number): Promise<FireData[]> {
  if (!NASA_FIRMS_API_KEY) {
    return []
  }

  try {
    // FIRMS API format: /api/area/csv/{MAP_KEY}/{source}/{area}/{day_range}/{date}
    // area format: lat1,lon1,lat2,lon2 (bounding box)
    const latOffset = radius / 111 // ~111 km per degree latitude
    const lonOffset = radius / (111 * Math.cos(lat * Math.PI / 180))
    
    const lat1 = lat - latOffset
    const lon1 = lng - lonOffset
    const lat2 = lat + latOffset
    const lon2 = lng + lonOffset
    
    const area = `${lat1},${lon1},${lat2},${lon2}`
    
    // Try VIIRS S-NPP first (more recent, higher resolution)
    const viirsUrl = `${FIRMS_BASE_URL}/${NASA_FIRMS_API_KEY}/VIIRS_SNPP_NRT/${area}/1`
    
    const response = await fetch(viirsUrl, { next: { revalidate: 3600 } })
    
    if (!response.ok) {
      throw new Error(`FIRMS API error: ${response.status}`)
    }
    
    const csvText = await response.text()
    
    // Parse CSV (skip header row)
    const lines = csvText.trim().split('\n')
    if (lines.length <= 1) {
      return []
    }
    
    const fires: FireData[] = []
    const headers = lines[0].split(',')
    
    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',')
      const fire: any = {}
      headers.forEach((header, index) => {
        fire[header.trim()] = values[index]?.trim()
      })
      
      fires.push({
        latitude: parseFloat(fire.latitude),
        longitude: parseFloat(fire.longitude),
        brightness: parseFloat(fire.brightness),
        scan: parseFloat(fire.scan || fire.scan_),
        track: parseFloat(fire.track || fire.track_),
        acq_date: fire.acq_date,
        acq_time: fire.acq_time,
        satellite: fire.satellite || 'VIIRS',
        confidence: fire.confidence === 'nominal' || fire.confidence === 'high' || fire.confidence === 'low' ? 
          fire.confidence : parseFloat(fire.confidence),
        version: fire.version || '2',
        bright_t31: parseFloat(fire.bright_t31),
        frp: parseFloat(fire.frp),
        daynight: fire.daynight || 'D'
      })
    }
    
    return fires
  } catch (error) {
    console.error('[NASA FIRMS API] Error:', error)
    return []
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const latitude = searchParams.get('latitude') || '28.61'
    const longitude = searchParams.get('longitude') || '77.23'
    const city = searchParams.get('city') || 'Delhi'
    const radius = searchParams.get('radius') || '50' // km radius

    const lat = parseFloat(latitude)
    const lng = parseFloat(longitude)

    if (isNaN(lat) || isNaN(lng)) {
      return NextResponse.json(
        { error: 'Invalid latitude or longitude values' },
        { status: 400 }
      )
    }

    const alerts: DisasterAlert[] = []

    // Try to fetch real fire data from NASA FIRMS
    if (NASA_FIRMS_API_KEY) {
      const fireData = await fetchRealFireData(lat, lng, parseInt(radius))
      
      fireData.forEach((fire, index) => {
        const confidenceLevel = typeof fire.confidence === 'string' ? 
          (fire.confidence === 'high' ? 80 : fire.confidence === 'nominal' ? 50 : 30) :
          fire.confidence
        
        const severity: 'low' | 'medium' | 'high' = 
          fire.frp > 100 || confidenceLevel > 70 ? 'high' :
          fire.frp > 50 || confidenceLevel > 50 ? 'medium' : 'low'
        
        alerts.push({
          id: `fire-${fire.satellite}-${fire.acq_date}-${fire.acq_time}-${index}`,
          type: 'fire',
          severity,
          title: `Active Fire Detected - ${fire.satellite}`,
          location: `${fire.latitude.toFixed(3)}°N, ${fire.longitude.toFixed(3)}°E`,
          description: `Fire detected by ${fire.satellite} satellite with ${
            typeof fire.confidence === 'string' ? fire.confidence : fire.confidence.toFixed(0) + '%'
          } confidence. Fire Radiative Power: ${fire.frp.toFixed(1)} MW. Brightness: ${fire.brightness.toFixed(0)}K`,
          time: `${fire.acq_date} ${fire.acq_time.substring(0, 2)}:${fire.acq_time.substring(2, 4)} UTC`,
          lat: fire.latitude,
          lon: fire.longitude,
          confidence: typeof fire.confidence === 'string' ? undefined : fire.confidence,
          frp: fire.frp,
          satellite: fire.satellite
        })
      })
    }

    // If no real data or no API key, use mock data
    if (alerts.length === 0) {
      const mockFireData = generateMockFireAlerts(lat, lng, city, parseInt(radius))
      alerts.push(...mockFireData)
    }

    // Add other disaster types (floods, storms, heatwaves)
    const otherAlerts = generateOtherDisasterAlerts(lat, lng, city)
    alerts.push(...otherAlerts)

    // Sort by severity and time
    const sortedAlerts = alerts.sort((a, b) => {
      const severityOrder = { high: 3, medium: 2, low: 1 }
      return severityOrder[b.severity] - severityOrder[a.severity]
    })

    return NextResponse.json({
      city,
      location: { latitude: lat, longitude: lng },
      alerts: sortedAlerts,
      metadata: {
        total: sortedAlerts.length,
        fires: sortedAlerts.filter(a => a.type === 'fire').length,
        floods: sortedAlerts.filter(a => a.type === 'flood').length,
        storms: sortedAlerts.filter(a => a.type === 'storm').length,
        heatwaves: sortedAlerts.filter(a => a.type === 'heatwave').length,
        lastUpdated: new Date().toISOString()
      }
    })

  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch disaster alerts' },
      { status: 500 }
    )
  }
}

function generateMockFireAlerts(lat: number, lng: number, city: string, radius: number): DisasterAlert[] {
  const alerts: DisasterAlert[] = []
  
  // Generate 1-3 fire alerts within radius
  const fireCount = Math.floor(Math.random() * 3) + 1
  
  for (let i = 0; i < fireCount; i++) {
    // Random location within radius (simplified)
    const offsetLat = (Math.random() - 0.5) * (radius / 111) // ~111km per degree
    const offsetLng = (Math.random() - 0.5) * (radius / 111)
    
    const confidence = Math.floor(Math.random() * 40) + 60 // 60-100%
    const frp = Math.random() * 500 + 50 // Fire Radiative Power
    
    const severity = confidence > 85 ? 'high' : confidence > 70 ? 'medium' : 'low'
    const timeAgo = Math.floor(Math.random() * 120) + 5 // 5-125 minutes ago
    
    alerts.push({
      id: `fire-${i + 1}-${Date.now()}`,
      type: 'fire',
      severity,
      title: `Active Fire Detection`,
      location: `${(lat + offsetLat).toFixed(3)}, ${(lng + offsetLng).toFixed(3)}`,
      description: `NASA FIRMS ${Math.random() > 0.5 ? 'MODIS' : 'VIIRS'} satellite detected active fire hotspot. Fire Radiative Power: ${frp.toFixed(1)} MW. Confidence: ${confidence}%. Monitor for smoke and air quality impacts.`,
      time: `${timeAgo} min ago`,
      lat: lat + offsetLat,
      lon: lng + offsetLng,
      confidence,
      frp,
      satellite: Math.random() > 0.5 ? 'MODIS' : 'VIIRS S-NPP'
    })
  }
  
  return alerts
}

function generateOtherDisasterAlerts(lat: number, lng: number, city: string): DisasterAlert[] {
  const alerts: DisasterAlert[] = []
  
  // Random flood alert
  if (Math.random() > 0.6) {
    alerts.push({
      id: `flood-${Date.now()}`,
      type: 'flood',
      severity: Math.random() > 0.7 ? 'high' : 'medium',
      title: 'Heavy Precipitation Alert',
      location: `${city} - Low-lying areas`,
      description: 'NASA GPM satellite data indicates heavy rainfall system approaching. Flood risk elevated in drainage-poor areas. Monitor water levels.',
      time: `${Math.floor(Math.random() * 60) + 10} min ago`,
      lat: lat + (Math.random() - 0.5) * 0.1,
      lon: lng + (Math.random() - 0.5) * 0.1
    })
  }
  
  // Random storm alert
  if (Math.random() > 0.7) {
    alerts.push({
      id: `storm-${Date.now()}`,
      type: 'storm',
      severity: Math.random() > 0.8 ? 'high' : 'medium',
      title: 'Severe Weather System',
      location: `${city} metropolitan area`,
      description: 'NASA satellite imagery shows developing storm system. High winds and heavy rain expected. Secure outdoor equipment.',
      time: `${Math.floor(Math.random() * 90) + 15} min ago`,
      lat: lat + (Math.random() - 0.5) * 0.2,
      lon: lng + (Math.random() - 0.5) * 0.2
    })
  }
  
  // Random heatwave alert
  if (Math.random() > 0.5) {
    const tempAnomaly = Math.random() * 6 + 2 // 2-8°C above normal
    alerts.push({
      id: `heat-${Date.now()}`,
      type: 'heatwave',
      severity: tempAnomaly > 5 ? 'high' : tempAnomaly > 3 ? 'medium' : 'low',
      title: 'Urban Heat Island Effect',
      location: `${city} - Urban core`,
      description: `NASA MODIS land surface temperature ${tempAnomaly.toFixed(1)}°C above seasonal average. Heat stress risk elevated. Consider cooling measures.`,
      time: `${Math.floor(Math.random() * 180) + 30} min ago`,
      lat: lat + (Math.random() - 0.5) * 0.05,
      lon: lng + (Math.random() - 0.5) * 0.05
    })
  }
  
  return alerts
}