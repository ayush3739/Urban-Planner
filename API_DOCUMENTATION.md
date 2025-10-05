# 🔌 API Documentation

This document describes all the API endpoints available in the NASA Urban Air Quality Simulator.

## Table of Contents
- [Air Quality APIs](#air-quality-apis)
- [Disaster Alert APIs](#disaster-alert-apis)
- [OpenAQ Integration](#openaq-integration)
- [Temperature Data](#temperature-data)

---

## Air Quality APIs

### Global Air Quality
Get air quality data for all 29 monitored cities worldwide.

**Endpoint**: `GET /api/air-quality/global`

**Response**:
```json
[
  {
    "city": "New York",
    "country": "USA",
    "aqi": 45,
    "pm25": 12.5,
    "temperature": 18.2,
    "status": "Good",
    "latitude": 40.7128,
    "longitude": -74.0060
  },
  ...
]
```

**Caching**: 1 hour

**Data Sources**:
- Mock AQ data (Google API quota reached)
- NASA POWER API for temperature

---

### City-Specific Air Quality
Get detailed air quality data for a specific location.

**Endpoint**: `GET /api/air-quality/nearby`

**Query Parameters**:
- `latitude` (required): Latitude coordinate
- `longitude` (required): Longitude coordinate

**Example**:
```
GET /api/air-quality/nearby?latitude=28.61&longitude=77.23
```

**Response**:
```json
{
  "location": {
    "latitude": 28.61,
    "longitude": 77.23
  },
  "aqi": 156,
  "category": "Unhealthy",
  "pollutants": {
    "pm25": 65.4,
    "pm10": 120.8,
    "no2": 45.2,
    "o3": 78.3,
    "co": 1.2,
    "so2": 12.5
  },
  "timestamp": "2025-10-05T12:00:00Z"
}
```

---

## Disaster Alert APIs

### NASA FIRMS Fire Detection
Get real-time active fire and disaster alerts from NASA satellites.

**Endpoint**: `GET /api/disaster-alerts`

**Query Parameters**:
- `latitude` (optional, default: 28.61): Latitude coordinate
- `longitude` (optional, default: 77.23): Longitude coordinate
- `city` (optional, default: "Delhi"): City name
- `radius` (optional, default: 50): Search radius in kilometers

**Example**:
```
GET /api/disaster-alerts?latitude=28.61&longitude=77.23&city=Delhi&radius=100
```

**Response**:
```json
{
  "city": "Delhi",
  "location": {
    "latitude": 28.61,
    "longitude": 77.23
  },
  "alerts": [
    {
      "id": "fire-VIIRS-20251005-1430-0",
      "type": "fire",
      "severity": "high",
      "title": "Active Fire Detected - VIIRS S-NPP",
      "location": "28.625°N, 77.245°E",
      "description": "Fire detected by VIIRS S-NPP satellite with high confidence. Fire Radiative Power: 156.3 MW. Brightness: 345K",
      "time": "2025-10-05 14:30 UTC",
      "lat": 28.625,
      "lon": 77.245,
      "confidence": 85,
      "frp": 156.3,
      "satellite": "VIIRS S-NPP"
    },
    {
      "id": "heat-1728135600000",
      "type": "heatwave",
      "severity": "medium",
      "title": "Urban Heat Island Effect",
      "location": "Delhi - Urban core",
      "description": "NASA MODIS land surface temperature 4.2°C above seasonal average.",
      "time": "45 min ago",
      "lat": 28.612,
      "lon": 77.228
    }
  ],
  "metadata": {
    "total": 5,
    "fires": 2,
    "floods": 1,
    "storms": 1,
    "heatwaves": 1,
    "lastUpdated": "2025-10-05T12:00:00Z"
  }
}
```

**Alert Types**:
- `fire`: Active fires from NASA FIRMS
- `flood`: Heavy precipitation alerts
- `storm`: Severe weather systems
- `heatwave`: Urban heat island effects

**Severity Levels**:
- `low`: Monitor situation
- `medium`: Take precautions
- `high`: Immediate action required

**Data Source**: NASA FIRMS VIIRS S-NPP satellite

**Caching**: 1 hour (real-time data refreshed hourly)

**Fallback**: If NASA FIRMS API is unavailable, returns mock data based on location

---

## OpenAQ Integration

### Global Air Quality Locations
Get 1,000+ real-time air quality monitoring stations worldwide.

**Endpoint**: `GET /api/openaq`

**Query Parameters**:
- `limit` (optional, default: 1000): Maximum number of locations
- `page` (optional, default: 1): Page number for pagination

**Example**:
```
GET /api/openaq?limit=1000&page=1
```

**Response**:
```json
{
  "results": [
    {
      "id": 12345,
      "name": "Delhi - Punjabi Bagh",
      "locality": "Punjabi Bagh",
      "country": {
        "code": "IN",
        "name": "India"
      },
      "coordinates": {
        "latitude": 28.6692,
        "longitude": 77.1356
      },
      "sensors": [
        {
          "parameter": {
            "id": 2,
            "name": "pm25"
          },
          "latest": {
            "value": 156.8,
            "datetime": "2025-10-05T12:00:00Z"
          }
        }
      ],
      "isMobile": false,
      "isMonitor": true
    }
  ],
  "meta": {
    "found": 1000,
    "limit": 1000,
    "page": 1
  }
}
```

**Parameters Tracked**:
- `pm25`: Particulate Matter 2.5
- `pm10`: Particulate Matter 10
- `no2`: Nitrogen Dioxide
- `o3`: Ozone
- `co`: Carbon Monoxide
- `so2`: Sulfur Dioxide

**Data Source**: OpenAQ API v3 (https://api.openaq.org/v3)

**Caching**: 1 hour (3,600 seconds)

**Performance**:
- First load: 3-5 seconds
- Cached loads: <100ms (instant)

---

## Temperature Data

### NASA POWER Temperature API
Get daily temperature data from NASA's POWER (Prediction Of Worldwide Energy Resources) project.

**Endpoint**: `GET /api/temperature`

**Query Parameters**:
- `latitude` (required): Latitude coordinate
- `longitude` (required): Longitude coordinate
- `start` (required): Start date in YYYYMMDD format
- `end` (required): End date in YYYYMMDD format

**Example**:
```
GET /api/temperature?latitude=28.61&longitude=77.23&start=20251001&end=20251005
```

**Response**:
```json
{
  "location": {
    "latitude": 28.61,
    "longitude": 77.23
  },
  "parameter": "T2M",
  "dates": [
    "2025-10-01",
    "2025-10-02",
    "2025-10-03",
    "2025-10-04",
    "2025-10-05"
  ],
  "temperatures": [
    32.5,
    33.2,
    31.8,
    30.9,
    32.1
  ],
  "unit": "Celsius"
}
```

**Parameter**:
- `T2M`: Temperature at 2 meters above ground level

**Data Source**: NASA POWER API

**Update Frequency**: Daily

---

## Rate Limits & Quotas

### OpenAQ API
- **Limit**: 1,000 locations per request
- **Rate Limit**: No strict limit with API key
- **Caching**: 1 hour to reduce API calls

### NASA FIRMS
- **Limit**: 10,000 requests per day
- **Area**: Maximum 500km x 500km bounding box
- **Historical Data**: Last 7-10 days available

### NASA POWER
- **Limit**: No strict limit for academic/research use
- **Data Range**: 1981 to near real-time
- **Resolution**: Daily averages

### Google APIs
- **Maps API**: 28,500 requests per month (free tier)
- **Geocoding API**: 40,000 requests per month (free tier)
- **Air Quality API**: Limited quota (currently using mock data)

---

## Error Handling

All APIs return standard HTTP status codes:

- `200 OK`: Successful request
- `400 Bad Request`: Invalid parameters
- `401 Unauthorized`: Missing or invalid API key
- `404 Not Found`: Resource not found
- `429 Too Many Requests`: Rate limit exceeded
- `500 Internal Server Error`: Server error
- `503 Service Unavailable`: External API unavailable

**Error Response Format**:
```json
{
  "error": "Error message description",
  "code": "ERROR_CODE",
  "status": 400
}
```

---

## Caching Strategy

To optimize performance and reduce API costs:

1. **Browser Caching**: Static assets cached for 1 year
2. **API Caching**: Data cached using Next.js `revalidate` option
3. **SWR Caching**: Client-side caching with automatic revalidation

**Cache Durations**:
- OpenAQ data: 1 hour
- NASA FIRMS alerts: 1 hour
- Temperature data: 24 hours
- City list: Static (no expiration)

---

## Best Practices

1. **Always check for cached data** before making API calls
2. **Handle errors gracefully** with fallback to mock data
3. **Implement retry logic** for failed requests
4. **Monitor API quotas** to avoid service disruptions
5. **Use appropriate cache durations** based on data update frequency

---

## Support

For API issues or questions:
- Check the error response message
- Verify API keys are correctly configured
- Review rate limits and quotas
- Open an issue on GitHub

---

**Last Updated**: October 5, 2025
