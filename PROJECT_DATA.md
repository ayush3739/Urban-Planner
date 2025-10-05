# 📊 Project Data & Statistics

Comprehensive overview of the NASA Urban Air Quality Simulator's data sources, coverage, and capabilities.

## 🌍 Global Coverage

### Cities Monitored (29 Total)

#### North America (5)
- **New York, USA** (40.71°N, 74.01°W)
- **Los Angeles, USA** (34.05°N, 118.24°W)
- **Mexico City, Mexico** (19.43°N, 99.13°W)
- **Toronto, Canada** (43.65°N, 79.38°W)
- **Chicago, USA** (41.88°N, 87.63°W)

#### South America (2)
- **São Paulo, Brazil** (-23.55°S, 46.63°W)
- **Buenos Aires, Argentina** (-34.60°S, 58.38°W)

#### Europe (8)
- **London, UK** (51.51°N, 0.13°W)
- **Paris, France** (48.86°N, 2.35°E)
- **Berlin, Germany** (52.52°N, 13.40°E)
- **Madrid, Spain** (40.42°N, 3.70°W)
- **Rome, Italy** (41.90°N, 12.50°E)
- **Moscow, Russia** (55.76°N, 37.62°E)
- **Istanbul, Turkey** (41.01°N, 28.98°E)
- **Athens, Greece** (37.98°N, 23.73°E)

#### Asia (11)
- **Delhi, India** (28.61°N, 77.23°E)
- **Mumbai, India** (19.08°N, 72.88°E)
- **Beijing, China** (39.90°N, 116.40°E)
- **Shanghai, China** (31.23°N, 121.47°E)
- **Tokyo, Japan** (35.68°N, 139.69°E)
- **Seoul, South Korea** (37.57°N, 126.98°E)
- **Bangkok, Thailand** (13.76°N, 100.50°E)
- **Singapore** (1.35°N, 103.82°E)
- **Dubai, UAE** (25.20°N, 55.27°E)
- **Jakarta, Indonesia** (-6.21°S, 106.85°E)
- **Manila, Philippines** (14.60°N, 120.98°E)

#### Africa (2)
- **Cairo, Egypt** (30.04°N, 31.24°E)
- **Lagos, Nigeria** (6.52°N, 3.38°E)

#### Oceania (1)
- **Sydney, Australia** (-33.87°S, 151.21°E)

---

## 📡 Data Sources & APIs

### NASA APIs

#### 1. NASA FIRMS (Fire Information for Resource Management System)
- **Purpose**: Active fire and thermal anomaly detection
- **Satellite**: VIIRS S-NPP (Visible Infrared Imaging Radiometer Suite)
- **Resolution**: 375m (high resolution)
- **Update Frequency**: Near real-time (every few hours)
- **Coverage**: Global
- **Data Points**:
  - Fire location (latitude/longitude)
  - Fire Radiative Power (FRP) in MW
  - Brightness temperature in Kelvin
  - Confidence level (%)
  - Acquisition date and time
  - Day/Night detection

**API Endpoint**: `https://firms.modaps.eosdis.nasa.gov/api/area/csv`

**Data Sample**:
```
latitude,longitude,brightness,frp,confidence,acq_date,acq_time
28.625,77.245,345.2,156.3,85,2025-10-05,1430
```

#### 2. NASA POWER (Prediction Of Worldwide Energy Resources)
- **Purpose**: Daily meteorological data
- **Parameter**: T2M (Temperature at 2 meters)
- **Time Range**: 1981 - Present
- **Resolution**: 0.5° x 0.5° (approximately 50km)
- **Update Frequency**: Daily
- **Coverage**: Global
- **Data Format**: JSON

**API Endpoint**: `https://power.larc.nasa.gov/api/temporal/daily/point`

**Sample Response**:
```json
{
  "parameter": {
    "T2M": {
      "20251001": 32.5,
      "20251002": 33.2,
      "20251003": 31.8
    }
  }
}
```

#### 3. NASA Earthdata
- **Purpose**: Authentication for NASA services
- **Token Type**: JWT (JSON Web Token)
- **Expiration**: Long-lived (5 years)
- **Usage**: Satellite imagery access

---

### Air Quality APIs

#### 1. OpenAQ API v3
- **Purpose**: Real-time air quality measurements
- **Locations**: 1,000+ monitoring stations worldwide
- **Update Frequency**: Real-time (varies by station)
- **Caching**: 1 hour
- **Parameters Measured**:
  - PM2.5 (Particulate Matter 2.5 μm)
  - PM10 (Particulate Matter 10 μm)
  - NO₂ (Nitrogen Dioxide)
  - O₃ (Ozone)
  - CO (Carbon Monoxide)
  - SO₂ (Sulfur Dioxide)

**API Endpoint**: `https://api.openaq.org/v3/locations`

**Request Limit**: 1,000 locations per request

**Data Coverage by Region**:
- **Asia**: ~350 stations
- **Europe**: ~280 stations
- **North America**: ~200 stations
- **South America**: ~80 stations
- **Africa**: ~50 stations
- **Oceania**: ~40 stations

#### 2. Google Air Quality API
- **Status**: Quota limited (using mock data)
- **Purpose**: Backup air quality data
- **Coverage**: Major global cities
- **Update Frequency**: Hourly

---

### Geolocation APIs

#### Google Geocoding API
- **Purpose**: Address to coordinates conversion
- **Reverse Geocoding**: Coordinates to city names
- **Accuracy**: City-level precision
- **Monthly Quota**: 40,000 requests

#### Google Maps JavaScript API
- **Purpose**: Interactive map visualization
- **Features**: Markers, overlays, custom styling
- **Monthly Quota**: 28,500 map loads

---

## 📊 Data Statistics

### Air Quality Index (AQI) Categories

| AQI Range | Category | Color | Health Impact |
|-----------|----------|-------|---------------|
| 0-50 | Good | 🟢 Green | Air quality is satisfactory |
| 51-100 | Moderate | 🟡 Yellow | Acceptable for most people |
| 101-150 | Unhealthy for Sensitive | 🟠 Orange | Sensitive groups may experience effects |
| 151-200 | Unhealthy | 🔴 Red | Everyone may begin to experience effects |
| 201-300 | Very Unhealthy | 🟣 Purple | Health alert: everyone may experience serious effects |
| 301+ | Hazardous | 🟤 Maroon | Health warnings of emergency conditions |

### Pollutant Standards (WHO Guidelines)

| Pollutant | WHO 24-hr Average | Unit |
|-----------|-------------------|------|
| PM2.5 | 15 μg/m³ | Micrograms per cubic meter |
| PM10 | 45 μg/m³ | Micrograms per cubic meter |
| NO₂ | 25 μg/m³ | Micrograms per cubic meter |
| O₃ | 100 μg/m³ | Micrograms per cubic meter |
| SO₂ | 40 μg/m³ | Micrograms per cubic meter |
| CO | 4 mg/m³ | Milligrams per cubic meter |

---

## 🔥 Fire Detection Data

### NASA FIRMS Satellites

#### VIIRS S-NPP (Primary)
- **Launch**: 2011
- **Resolution**: 375m
- **Accuracy**: ±250m at nadir
- **Scan Width**: 3000 km
- **Overpass**: Twice daily (day and night)

#### MODIS (Backup)
- **Satellites**: Aqua and Terra
- **Resolution**: 1km
- **Accuracy**: ±500m
- **Scan Width**: 2330 km
- **Overpass**: 4 times daily

### Fire Detection Metrics

**Fire Radiative Power (FRP) Scale**:
- **Low**: 0-50 MW (Small fires, agricultural burning)
- **Medium**: 50-100 MW (Active wildfires)
- **High**: 100-500 MW (Large wildfires)
- **Extreme**: 500+ MW (Massive fire events)

**Confidence Levels**:
- **Low**: 0-50% (Possible fire)
- **Nominal**: 50-80% (Likely fire)
- **High**: 80-100% (Confirmed fire)

---

## 🌡️ Temperature Data

### NASA POWER Temperature Statistics

**Average Global Temperature Range**: 10°C - 35°C

**Extremes Recorded**:
- **Hottest Cities**: Dubai, Bangkok, Delhi (35-45°C in summer)
- **Coldest Cities**: Moscow, Toronto (-10 to 5°C in winter)
- **Most Stable**: Singapore, Jakarta (28-32°C year-round)

---

## 📈 System Performance Metrics

### API Response Times

| Endpoint | First Load | Cached Load | Data Size |
|----------|-----------|-------------|-----------|
| `/api/air-quality/global` | 50-100ms | 14-29ms | ~15KB |
| `/api/openaq` | 3-5s | <100ms | ~500KB |
| `/api/disaster-alerts` | 1-3s | 11-50ms | ~10KB |
| `/api/temperature` | 1.5-3s | 500ms | ~5KB |

### Caching Strategy

- **OpenAQ**: 1 hour cache (3,600 seconds)
- **NASA FIRMS**: 1 hour cache
- **Temperature Data**: 24 hour cache
- **Static Content**: 1 year cache

### Data Freshness

- **Air Quality**: Updated every 1 hour
- **Fire Alerts**: Updated every 1 hour (NASA updates every 3-4 hours)
- **Temperature**: Updated daily at 00:00 UTC
- **OpenAQ Stations**: Real-time (with 1-hour cache)

---

## 💾 Data Storage & Processing

### Database
- **Type**: None (API-driven, no persistent storage)
- **Caching**: Next.js built-in caching
- **State Management**: React hooks + SWR

### Data Processing
- **CSV Parsing**: NASA FIRMS fire data
- **JSON Processing**: All other APIs
- **Client-Side**: SWR for data fetching and caching
- **Server-Side**: Next.js API routes with revalidation

---

## 🔄 Update Frequencies

| Data Type | Update Frequency | Source |
|-----------|-----------------|---------|
| Fire Alerts | 3-4 hours | NASA FIRMS |
| Air Quality (Global) | 1 hour | Mock + NASA |
| Air Quality (OpenAQ) | Real-time | OpenAQ API |
| Temperature | Daily | NASA POWER |
| Disaster Alerts | 1 hour | NASA FIRMS |

---

## 📍 Geospatial Coverage

### Coordinates Range
- **Latitude**: -90° to 90° (full global coverage)
- **Longitude**: -180° to 180° (full global coverage)

### Supported Regions
- ✅ All continents
- ✅ Urban areas
- ✅ Rural areas
- ✅ Remote regions (limited data)

---

## 🎯 Data Accuracy

### Air Quality Measurements
- **Accuracy**: ±10% for PM2.5, ±15% for other pollutants
- **Calibration**: Station-dependent
- **Quality Control**: OpenAQ validation

### Fire Detection
- **False Positive Rate**: <5% (high confidence detections)
- **Omission Rate**: ~10% (some small fires missed)
- **Location Accuracy**: ±250m (VIIRS), ±500m (MODIS)

### Temperature Data
- **Accuracy**: ±1°C for daily averages
- **Resolution**: 0.5° x 0.5° grid
- **Validation**: Ground station comparison

---

## 📊 Historical Data Availability

- **NASA FIRMS**: Last 7-10 days
- **NASA POWER Temperature**: 1981 - Present
- **OpenAQ**: Last 90 days (varies by station)
- **Google Air Quality**: Real-time only

---

## 🌐 API Rate Limits

| API | Rate Limit | Daily Quota | Caching |
|-----|-----------|-------------|---------|
| NASA FIRMS | No strict limit | 10,000 requests | 1 hour |
| NASA POWER | No strict limit | Unlimited | 24 hours |
| OpenAQ | No limit with key | Unlimited | 1 hour |
| Google Maps | 50 req/sec | 28,500 loads | Browser |
| Google Geocoding | 50 req/sec | 40,000 requests | 24 hours |

---

## 📱 Data Delivery

### Response Formats
- **JSON**: All API responses
- **CSV**: NASA FIRMS raw data (converted to JSON)
- **GeoJSON**: Future implementation for maps

### Compression
- **Gzip**: Enabled for all API responses
- **Size Reduction**: ~70% smaller responses

---

## 🔐 Data Privacy

- **No User Data Stored**: All data is public environmental data
- **No Tracking**: No personal information collected
- **API Keys**: Securely stored in environment variables
- **HTTPS Only**: All API communications encrypted

---

## 📝 Data Attribution

All data must be attributed to:
- **NASA FIRMS**: "Fire data courtesy of NASA FIRMS"
- **OpenAQ**: "Air quality data from OpenAQ"
- **NASA POWER**: "Temperature data from NASA POWER"
- **Google**: "Maps and geocoding by Google"

---

## 🎓 Educational Use

This project is designed for:
- ✅ Academic research
- ✅ Environmental awareness
- ✅ Data visualization education
- ✅ API integration learning
- ✅ Public health information

---

**Data Last Updated**: October 5, 2025  
**Project Version**: 1.0.0  
**Total Data Points**: 1,000+ stations, 29 cities, global fire coverage
