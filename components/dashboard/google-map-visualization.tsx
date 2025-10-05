"use client";

import { useState, useEffect, useCallback } from "react";
import { GoogleMap, Marker as GoogleMarker, useJsApiLoader, InfoWindow, HeatmapLayer } from "@react-google-maps/api";
import { Button } from "@/components/ui/button";
import { MapPin, Navigation, Loader2 } from "lucide-react";
import { fetchUrbanHeatData, fetchWaterStressData } from "@/lib/nasaApi";
import { fetchComprehensiveEnvironmentalData, fetchFireData, fetchAirQualityData, getUrbanAnalyticsSummary } from "@/lib/comprehensiveApi";

const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "";

type DataLayer = "heat" | "green" | "water" | "aqi"

interface MapVisualizationProps {
  layer: DataLayer
  latitude: number
  longitude: number
  locationName: string
}

const mapContainerStyle = {
  width: '100%',
  height: '500px'
}

const mapOptions = {
  disableDefaultUI: false,
  zoomControl: true,
  scrollwheel: true,
  disableDoubleClickZoom: false,
  mapTypeId: 'roadmap' as google.maps.MapTypeId
}

const libraries: ("visualization" | "geometry" | "drawing" | "places")[] = ["visualization"];

export function MapVisualization({ layer, latitude, longitude, locationName }: MapVisualizationProps) {
  const [userLocation, setUserLocation] = useState<{ lat: number, lng: number } | null>(null);
  const [locationLoading, setLocationLoading] = useState(false);
  const [mapCenter, setMapCenter] = useState({ lat: latitude, lng: longitude });
  const [heatmapData, setHeatmapData] = useState<google.maps.LatLng[]>([]);
  const [loading, setLoading] = useState(false);
  const [realData, setRealData] = useState<any[]>([]);
  const [dataSource, setDataSource] = useState<string>('Loading...');
  
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: GOOGLE_MAPS_API_KEY,
    libraries
  });

  // Update map center when props change
  useEffect(() => {
    setMapCenter({ lat: latitude, lng: longitude });
  }, [latitude, longitude]);

  // Fetch real data from comprehensive APIs
  const fetchRealData = async () => {
    setLoading(true);
    try {
      console.log(`Fetching ${layer} data for ${locationName}...`);
      
      // Use comprehensive environmental data fetcher
      const environmentalData = await fetchComprehensiveEnvironmentalData(
        latitude, 
        longitude, 
        layer
      );
      
      if (environmentalData.length > 0) {
        console.log(`✅ Received ${environmentalData.length} real data points from APIs`);
        
        // Determine primary data source
        const sources = environmentalData.map(d => d.source).filter(Boolean);
        const primarySource = sources[0] || 'Multiple APIs';
        setDataSource(primarySource);
        
        setRealData(environmentalData);
      } else {
        console.log('📊 No API data available, using city-specific mock data');
        setDataSource('City-specific simulation');
        setRealData(generateCitySpecificData());
      }
      
    } catch (error) {
      console.error(`Error fetching ${layer} data:`, error);
      // Fallback to city-specific mock data
      console.log('🔄 Falling back to city-specific mock data');
      setDataSource('Fallback simulation');
      setRealData(generateCitySpecificData());
    } finally {
      setLoading(false);
    }
  };

  // Generate city-specific environmental data
  const generateCitySpecificData = () => {
    const cityName = locationName.toLowerCase();
    let baseIntensity = 0.5;
    let dataPoints = 15;
    
    // City-specific environmental profiles
    if (cityName.includes('new york')) {
      baseIntensity = layer === 'heat' ? 0.8 : layer === 'aqi' ? 0.7 : layer === 'green' ? 0.4 : 0.6;
      dataPoints = 25;
    } else if (cityName.includes('delhi')) {
      baseIntensity = layer === 'heat' ? 0.9 : layer === 'aqi' ? 0.9 : layer === 'green' ? 0.2 : 0.8;
      dataPoints = 30;
    } else if (cityName.includes('london')) {
      baseIntensity = layer === 'heat' ? 0.4 : layer === 'aqi' ? 0.5 : layer === 'green' ? 0.7 : 0.4;
      dataPoints = 20;
    } else if (cityName.includes('tokyo')) {
      baseIntensity = layer === 'heat' ? 0.7 : layer === 'aqi' ? 0.6 : layer === 'green' ? 0.5 : 0.7;
      dataPoints = 28;
    } else if (cityName.includes('sydney')) {
      baseIntensity = layer === 'heat' ? 0.6 : layer === 'aqi' ? 0.3 : layer === 'green' ? 0.8 : 0.5;
      dataPoints = 22;
    }
    
    return Array.from({ length: dataPoints }, (_, i) => ({
      intensity: Math.max(0.1, Math.min(1, baseIntensity + (Math.random() - 0.5) * 0.4)),
      lat: latitude + (Math.random() - 0.5) * 0.08,
      lng: longitude + (Math.random() - 0.5) * 0.08
    }));
  };

  const getCityDescription = (layerType: DataLayer): string => {
    const cityName = locationName.toLowerCase();
    
    const descriptions = {
      heat: {
        'new york': 'High density urban areas show elevated temperatures.',
        'delhi': 'Intense heat patterns from rapid urbanization.',
        'london': 'Moderate heat islands in central districts.',
        'tokyo': 'Dense urban heat concentration.',
        'sydney': 'Coastal moderation with inland heat buildup.'
      },
      green: {
        'new york': 'Central Park and riverside green corridors.',
        'delhi': 'Limited green cover, concentrated in parks.',
        'london': 'Abundant parks and green belt areas.',
        'tokyo': 'Integrated urban forestry and gardens.',
        'sydney': 'Coastal vegetation and national parks.'
      },
      water: {
        'new york': 'Adequate supply with infrastructure stress.',
        'delhi': 'Critical water stress and depletion.',
        'london': 'Stable supply with seasonal variations.',
        'tokyo': 'Managed resources with conservation efforts.',
        'sydney': 'Drought resilience with coastal advantages.'
      },
      aqi: {
        'new york': 'Moderate pollution from traffic and industry.',
        'delhi': 'Severe air quality challenges year-round.',
        'london': 'Improving air quality with ULEZ policies.',
        'tokyo': 'Good air quality with occasional spikes.',
        'sydney': 'Generally clean air with bushfire impacts.'
      }
    };
    
    // Find matching city description
    for (const [city, desc] of Object.entries(descriptions[layerType])) {
      if (cityName.includes(city)) {
        return desc;
      }
    }
    
    return 'Environmental monitoring data';
  };

  // Generate heatmap data based on real or mock data
  useEffect(() => {
    if (isLoaded && window.google) {
      fetchRealData();
    }
  }, [isLoaded, latitude, longitude, layer]);

  // Convert data to heatmap format
  useEffect(() => {
    if (isLoaded && window.google && realData.length > 0) {
      const points: google.maps.LatLng[] = [];
      
      realData.forEach((item) => {
        if (item.lat && item.lng && item.intensity) {
          points.push(new window.google.maps.LatLng(item.lat, item.lng));
        } else {
          // Fallback format
          points.push(new window.google.maps.LatLng(
            item.latitude || item.lat || latitude + (Math.random() - 0.5) * 0.05,
            item.longitude || item.lng || longitude + (Math.random() - 0.5) * 0.05
          ));
        }
      });
      
      setHeatmapData(points);
    }
  }, [realData, isLoaded]);

  // Fetch data when component mounts or location/layer changes
  useEffect(() => {
    fetchRealData();
  }, [latitude, longitude, layer]);

  const getCurrentLocation = () => {
    setLocationLoading(true);

    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
      setLocationLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude: lat, longitude: lng } = position.coords;
        setUserLocation({ lat, lng });
        setMapCenter({ lat, lng });
        setLocationLoading(false);
      },
      (error) => {
        console.error("Error getting location:", error);
        alert("Unable to retrieve your location. Please enable location services.");
        setLocationLoading(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  };

  const getHeatmapOptions = () => {
    const cityName = locationName.toLowerCase();
    
    // City and layer specific color schemes
    const colorSchemes = {
      heat: {
        'new york': ['rgba(255, 255, 0, 0)', 'rgba(255, 165, 0, 0.7)', 'rgba(255, 69, 0, 0.8)', 'rgba(255, 0, 0, 0.9)', 'rgba(139, 0, 0, 1)'],
        'delhi': ['rgba(255, 69, 0, 0)', 'rgba(255, 0, 0, 0.6)', 'rgba(220, 20, 60, 0.8)', 'rgba(139, 0, 0, 0.9)', 'rgba(128, 0, 0, 1)'],
        'london': ['rgba(255, 192, 203, 0)', 'rgba(255, 160, 122, 0.5)', 'rgba(255, 99, 71, 0.7)', 'rgba(255, 69, 0, 0.8)', 'rgba(255, 0, 0, 0.9)'],
        'tokyo': ['rgba(255, 215, 0, 0)', 'rgba(255, 140, 0, 0.6)', 'rgba(255, 69, 0, 0.8)', 'rgba(255, 0, 0, 0.9)', 'rgba(178, 34, 34, 1)'],
        'sydney': ['rgba(255, 228, 181, 0)', 'rgba(255, 165, 0, 0.5)', 'rgba(255, 99, 71, 0.7)', 'rgba(255, 69, 0, 0.8)', 'rgba(220, 20, 60, 0.9)'],
        default: ['rgba(255, 255, 0, 0)', 'rgba(255, 165, 0, 0.6)', 'rgba(255, 69, 0, 0.8)', 'rgba(255, 0, 0, 0.9)', 'rgba(139, 0, 0, 1)']
      },
      green: {
        'new york': ['rgba(173, 255, 47, 0)', 'rgba(154, 205, 50, 0.5)', 'rgba(124, 252, 0, 0.7)', 'rgba(50, 205, 50, 0.8)', 'rgba(34, 139, 34, 1)'],
        'delhi': ['rgba(240, 230, 140, 0)', 'rgba(189, 183, 107, 0.4)', 'rgba(154, 205, 50, 0.6)', 'rgba(107, 142, 35, 0.7)', 'rgba(85, 107, 47, 0.8)'],
        'london': ['rgba(144, 238, 144, 0)', 'rgba(152, 251, 152, 0.6)', 'rgba(124, 252, 0, 0.7)', 'rgba(50, 205, 50, 0.8)', 'rgba(34, 139, 34, 1)'],
        'tokyo': ['rgba(173, 255, 47, 0)', 'rgba(154, 205, 50, 0.5)', 'rgba(124, 252, 0, 0.7)', 'rgba(50, 205, 50, 0.8)', 'rgba(34, 139, 34, 1)'],
        'sydney': ['rgba(127, 255, 212, 0)', 'rgba(152, 251, 152, 0.6)', 'rgba(124, 252, 0, 0.7)', 'rgba(50, 205, 50, 0.8)', 'rgba(34, 139, 34, 1)'],
        default: ['rgba(173, 255, 47, 0)', 'rgba(154, 205, 50, 0.5)', 'rgba(124, 252, 0, 0.7)', 'rgba(50, 205, 50, 0.8)', 'rgba(34, 139, 34, 1)']
      },
      water: {
        'new york': ['rgba(175, 238, 238, 0)', 'rgba(135, 206, 250, 0.5)', 'rgba(70, 130, 180, 0.7)', 'rgba(30, 144, 255, 0.8)', 'rgba(0, 0, 255, 1)'],
        'delhi': ['rgba(255, 228, 196, 0)', 'rgba(255, 165, 0, 0.4)', 'rgba(255, 140, 0, 0.6)', 'rgba(255, 69, 0, 0.8)', 'rgba(255, 0, 0, 0.9)'],
        'london': ['rgba(176, 196, 222, 0)', 'rgba(135, 206, 250, 0.5)', 'rgba(70, 130, 180, 0.7)', 'rgba(30, 144, 255, 0.8)', 'rgba(0, 0, 255, 1)'],
        'tokyo': ['rgba(175, 238, 238, 0)', 'rgba(135, 206, 250, 0.5)', 'rgba(70, 130, 180, 0.7)', 'rgba(30, 144, 255, 0.8)', 'rgba(25, 25, 112, 1)'],
        'sydney': ['rgba(175, 238, 238, 0)', 'rgba(135, 206, 250, 0.5)', 'rgba(70, 130, 180, 0.7)', 'rgba(30, 144, 255, 0.8)', 'rgba(0, 0, 255, 1)'],
        default: ['rgba(175, 238, 238, 0)', 'rgba(135, 206, 250, 0.5)', 'rgba(70, 130, 180, 0.7)', 'rgba(30, 144, 255, 0.8)', 'rgba(0, 0, 255, 1)']
      },
      aqi: {
        'new york': ['rgba(255, 255, 0, 0)', 'rgba(255, 165, 0, 0.5)', 'rgba(255, 69, 0, 0.7)', 'rgba(255, 0, 0, 0.8)', 'rgba(128, 0, 128, 1)'],
        'delhi': ['rgba(255, 0, 0, 0)', 'rgba(220, 20, 60, 0.6)', 'rgba(139, 0, 0, 0.8)', 'rgba(128, 0, 128, 0.9)', 'rgba(75, 0, 130, 1)'],
        'london': ['rgba(255, 255, 224, 0)', 'rgba(255, 255, 0, 0.4)', 'rgba(255, 165, 0, 0.6)', 'rgba(255, 69, 0, 0.7)', 'rgba(255, 0, 0, 0.8)'],
        'tokyo': ['rgba(255, 255, 0, 0)', 'rgba(255, 165, 0, 0.5)', 'rgba(255, 69, 0, 0.7)', 'rgba(255, 0, 0, 0.8)', 'rgba(128, 0, 128, 1)'],
        'sydney': ['rgba(173, 255, 47, 0)', 'rgba(255, 255, 0, 0.4)', 'rgba(255, 165, 0, 0.6)', 'rgba(255, 69, 0, 0.7)', 'rgba(255, 0, 0, 0.8)'],
        default: ['rgba(255, 255, 0, 0)', 'rgba(255, 165, 0, 0.5)', 'rgba(255, 69, 0, 0.7)', 'rgba(255, 0, 0, 0.8)', 'rgba(128, 0, 128, 1)']
      }
    };

    // Get city-specific colors or fallback to default
    const getCityColors = (layerColors: any) => {
      for (const city in layerColors) {
        if (cityName.includes(city)) {
          return layerColors[city];
        }
      }
      return layerColors.default;
    };

    const selectedColors = getCityColors(colorSchemes[layer]);

    return {
      gradient: selectedColors,
      radius: cityName.includes('new york') || cityName.includes('delhi') ? 25 : 20,
      opacity: 0.8
    };
  };

  if (!isLoaded) {
    return (
      <div className="w-full h-[500px] bg-muted rounded-lg flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-blue-500 mx-auto mb-2" />
          <p className="text-sm text-muted-foreground">Loading Google Maps...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Controls */}
      <div className="flex gap-2 flex-wrap items-center">
        <Button
          onClick={getCurrentLocation}
          disabled={locationLoading}
          variant="outline"
          className="gap-2"
        >
          {locationLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Getting Location...
            </>
          ) : (
            <>
              <Navigation className="w-4 h-4" />
              Use My Location
            </>
          )}
        </Button>

        <Button
          onClick={fetchRealData}
          disabled={loading}
          variant="outline"
          className="gap-2"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Loading Data...
            </>
          ) : (
            <>
              <MapPin className="w-4 h-4" />
              Refresh Data
            </>
          )}
        </Button>
        
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span>{locationName}</span>
          <span className="text-xs">({latitude.toFixed(4)}, {longitude.toFixed(4)})</span>
          <span className="text-xs">• {realData.length} data points</span>
        </div>
      </div>

      {/* Google Map */}
      <div className="rounded-lg overflow-hidden border">
        <GoogleMap
          mapContainerStyle={mapContainerStyle}
          center={mapCenter}
          zoom={11}
          options={mapOptions}
        >
          {/* Location Marker */}
          <GoogleMarker
            position={mapCenter}
            icon={{
              path: google.maps.SymbolPath.CIRCLE,
              scale: 8,
              fillColor: '#3b82f6',
              fillOpacity: 1,
              strokeColor: '#ffffff',
              strokeWeight: 2,
            }}
            title={locationName}
          />

          {/* User Location Marker */}
          {userLocation && (
            <GoogleMarker
              position={userLocation}
              icon={{
                path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
                scale: 6,
                fillColor: '#10b981',
                fillOpacity: 1,
                strokeColor: '#ffffff',
                strokeWeight: 2,
              }}
              title="Your Location"
            />
          )}

          {/* Heatmap Layer */}
          {heatmapData.length > 0 && (
            <HeatmapLayer
              data={heatmapData}
              options={getHeatmapOptions()}
            />
          )}
        </GoogleMap>
      </div>

      {/* Layer Information */}
      <div className="p-4 bg-muted/50 rounded-lg">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${
              layer === 'heat' ? 'bg-red-500' :
              layer === 'green' ? 'bg-green-500' :
              layer === 'water' ? 'bg-blue-500' :
              'bg-purple-500'
            }`} />
            <span className="font-medium capitalize">{layer} Layer - {locationName}</span>
          </div>
          {loading && <Loader2 className="w-4 h-4 animate-spin text-blue-500" />}
        </div>
        <p className="text-sm text-muted-foreground">
          {layer === 'heat' && `Urban heat distribution in ${locationName}. ${getCityDescription('heat')}`}
          {layer === 'green' && `Vegetation coverage and green spaces in ${locationName}. ${getCityDescription('green')}`}
          {layer === 'water' && `Water stress and availability patterns in ${locationName}. ${getCityDescription('water')}`}
          {layer === 'aqi' && `Air quality index and pollution levels in ${locationName}. ${getCityDescription('aqi')}`}
        </p>
        <div className="mt-2 text-xs text-muted-foreground">
          Data points: {realData.length} | Source: {dataSource}
        </div>
      </div>
    </div>
  );
}