"use client";

import { useState, useEffect } from "react";
import { GoogleMap, Marker as GoogleMarker, useJsApiLoader, InfoWindow } from "@react-google-maps/api";
import { Button } from "@/components/ui/button";
import { MapPin, Navigation, Loader2 } from "lucide-react";
import { fetchUrbanHeatData, fetchWaterStressData } from "@/lib/nasaApi";

const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "";

export default function MapVisualization() {
  const [heatData, setHeatData] = useState<any[]>([]);
  const [waterData, setWaterData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [locationLoading, setLocationLoading] = useState(false);
  const [mapCenter, setMapCenter] = useState<[number, number]>([28.6139, 77.209]);
  const [selectedMarker, setSelectedMarker] = useState<any>(null);
  
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: GOOGLE_MAPS_API_KEY,
  });

  const handleFetch = async () => {
    setLoading(true);
    try {
      // Use user location if available, otherwise default to Delhi
      const [lat, lon] = userLocation || [28.6139, 77.209];
      const start = "2025-09-01";
      const end = "2025-09-30";

      const heat = await fetchUrbanHeatData(lat, lon, start, end);
      const water = await fetchWaterStressData(lat, lon, start, end);

      setHeatData(heat);
      setWaterData(water);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  const getCurrentLocation = () => {
    setLocationLoading(true);

    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
      setLocationLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const newLocation: [number, number] = [latitude, longitude];
        setUserLocation(newLocation);
        setMapCenter(newLocation);
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

  return (
    <div className="relative space-y-4">
      <div className="flex gap-2 flex-wrap">
        <Button
          onClick={handleFetch}
          disabled={loading}
          className="gap-2"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Fetching NASA Data...
            </>
          ) : (
            <>
              <MapPin className="w-4 h-4" />
              Load NASA Layers
            </>
          )}
        </Button>

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
      </div>

      {userLocation && (
        <div className="p-3 bg-primary/10 border border-primary/20 rounded-lg">
          <p className="text-sm font-medium text-primary">
            📍 Your Location: {userLocation[0].toFixed(4)}, {userLocation[1].toFixed(4)}
          </p>
        </div>
      )}

      <div className="rounded-lg overflow-hidden border border-border">
        {isLoaded ? (
          <GoogleMap
            center={{ lat: mapCenter[0], lng: mapCenter[1] }}
            zoom={userLocation ? 12 : 8}
            mapContainerStyle={{ height: "70vh", width: "100%" }}
          >
            {/* Selected Location Marker */}
            <GoogleMarker 
              position={{ lat: mapCenter[0], lng: mapCenter[1] }}
              onClick={() => setSelectedMarker({ type: 'location', data: { coords: mapCenter } })}
            />
            
            {/* User Location Marker */}
            {userLocation && (
              <GoogleMarker 
                position={{ lat: userLocation[0], lng: userLocation[1] }}
                onClick={() => setSelectedMarker({ type: 'user', data: { coords: userLocation } })}
                icon={{
                  url: 'https://maps.google.com/mapfiles/ms/icons/blue-dot.png'
                }}
              />
            )}

            {/* 🔥 Urban Heat Data Markers */}
            {heatData.map((h, index) => (
              <GoogleMarker
                key={`heat-${index}`}
                position={{ 
                  lat: mapCenter[0] + (Math.random() - 0.5) * 0.02, 
                  lng: mapCenter[1] + (Math.random() - 0.5) * 0.02 
                }}
                onClick={() => setSelectedMarker({ type: 'heat', data: h })}
                icon={{
                  url: 'https://maps.google.com/mapfiles/ms/icons/red-dot.png'
                }}
              />
            ))}

            {/* 💧 Water Stress Data Markers */}
            {waterData.map((w, index) => (
              <GoogleMarker
                key={`water-${index}`}
                position={{ 
                  lat: mapCenter[0] + (Math.random() - 0.5) * 0.02, 
                  lng: mapCenter[1] + (Math.random() - 0.5) * 0.02 
                }}
                onClick={() => setSelectedMarker({ type: 'water', data: w })}
                icon={{
                  url: 'https://maps.google.com/mapfiles/ms/icons/blue-dot.png'
                }}
              />
            ))}

            {/* Info Window */}
            {selectedMarker && (
              <InfoWindow
                position={
                  selectedMarker.type === 'location' ? { lat: mapCenter[0], lng: mapCenter[1] } :
                  selectedMarker.type === 'user' ? { lat: userLocation![0], lng: userLocation![1] } :
                  { lat: mapCenter[0] + (Math.random() - 0.5) * 0.02, lng: mapCenter[1] + (Math.random() - 0.5) * 0.02 }
                }
                onCloseClick={() => setSelectedMarker(null)}
              >
                <div className="p-2">
                  {selectedMarker.type === 'location' && (
                    <>
                      <b>📍 Selected Location</b>
                      <br />
                      Coordinates: {mapCenter[0].toFixed(4)}, {mapCenter[1].toFixed(4)}
                    </>
                  )}
                  {selectedMarker.type === 'user' && (
                    <>
                      <b>📱 Your Current Location</b>
                      <br />
                      Coordinates: {userLocation![0].toFixed(4)}, {userLocation![1].toFixed(4)}
                    </>
                  )}
                  {selectedMarker.type === 'heat' && (
                    <>
                      <b>🔥 MODIS LST</b>
                      <br />
                      {selectedMarker.data.title}
                      <br />
                      <a href={selectedMarker.data.link} target="_blank" rel="noreferrer">
                        View Data
                      </a>
                    </>
                  )}
                  {selectedMarker.type === 'water' && (
                    <>
                      <b>💧 GRACE Water</b>
                      <br />
                      {selectedMarker.data.title}
                      <br />
                      <a href={selectedMarker.data.link} target="_blank" rel="noreferrer">
                        View Data
                      </a>
                    </>
                  )}
                </div>
              </InfoWindow>
            )}
          </GoogleMap>
        ) : (
          <div className="flex items-center justify-center h-[70vh] bg-muted">
            <div className="text-center">
              <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2" />
              <p>Loading Google Maps...</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
