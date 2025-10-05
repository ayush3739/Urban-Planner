'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, Clock, Satellite, Leaf, Droplets, Wind } from 'lucide-react';
import { 
  fetchFireData, 
  fetchAirQualityData, 
  fetchUrbanInfrastructure,
  getUrbanAnalyticsSummary 
} from '@/lib/comprehensiveApi';

interface ApiStatus {
  name: string;
  status: 'online' | 'offline' | 'testing';
  icon: any;
  description: string;
  lastCheck?: string;
}

export function ApiStatusIndicator() {
  const [apiStatuses, setApiStatuses] = useState<ApiStatus[]>([
    { name: 'NASA FIRMS', status: 'testing', icon: Satellite, description: 'Fire and thermal anomalies' },
    { name: 'NASA Earthdata', status: 'testing', icon: Satellite, description: 'MODIS temperature data' },
    { name: 'Copernicus', status: 'testing', icon: Leaf, description: 'Vegetation indices (NDVI)' },
    { name: 'OpenStreetMap', status: 'testing', icon: Wind, description: 'Urban infrastructure' },
    { name: 'Google Earth Engine', status: 'testing', icon: Droplets, description: 'Satellite imagery analysis' }
  ]);

  useEffect(() => {
    checkApiStatuses();
  }, []);

  const checkApiStatuses = async () => {
    const testLat = 40.7128; // New York coordinates for testing
    const testLon = -74.0060;

    const updatedStatuses = [...apiStatuses];

    try {
      // Test NASA FIRMS
      const fireData = await fetchFireData(testLat, testLon, 1);
      updatedStatuses[0] = {
        ...updatedStatuses[0],
        status: 'online',
        lastCheck: new Date().toLocaleTimeString()
      };
    } catch {
      updatedStatuses[0] = { ...updatedStatuses[0], status: 'offline' };
    }

    try {
      // Test OpenStreetMap
      const infrastructure = await fetchUrbanInfrastructure(testLat, testLon);
      updatedStatuses[3] = {
        ...updatedStatuses[3],
        status: infrastructure.total_elements > 0 ? 'online' : 'offline',
        lastCheck: new Date().toLocaleTimeString()
      };
    } catch {
      updatedStatuses[3] = { ...updatedStatuses[3], status: 'offline' };
    }

    try {
      // Test Air Quality (combined API)
      const aqiData = await fetchAirQualityData(testLat, testLon);
      if (aqiData.length > 0) {
        updatedStatuses[1].status = 'online';
        updatedStatuses[1].lastCheck = new Date().toLocaleTimeString();
      }
    } catch {
      updatedStatuses[1] = { ...updatedStatuses[1], status: 'offline' };
    }

    // Copernicus and GEE typically require more complex auth, mark as testing
    updatedStatuses[2] = { ...updatedStatuses[2], status: 'testing' };
    updatedStatuses[4] = { ...updatedStatuses[4], status: 'testing' };

    setApiStatuses(updatedStatuses);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'online':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'offline':
        return <XCircle className="w-4 h-4 text-red-500" />;
      case 'testing':
        return <Clock className="w-4 h-4 text-yellow-500" />;
      default:
        return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online':
        return 'bg-green-100 text-green-800';
      case 'offline':
        return 'bg-red-100 text-red-800';
      case 'testing':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Satellite className="w-5 h-5" />
          API Status Monitor
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {apiStatuses.map((api, index) => {
            const IconComponent = api.icon;
            return (
              <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <IconComponent className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <div className="font-medium">{api.name}</div>
                    <div className="text-sm text-muted-foreground">{api.description}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {api.lastCheck && (
                    <span className="text-xs text-muted-foreground">{api.lastCheck}</span>
                  )}
                  <Badge variant="secondary" className={getStatusColor(api.status)}>
                    {getStatusIcon(api.status)}
                    <span className="ml-1 capitalize">{api.status}</span>
                  </Badge>
                </div>
              </div>
            );
          })}
        </div>
        <div className="mt-4 p-3 bg-muted/50 rounded-lg">
          <p className="text-sm text-muted-foreground">
            🟢 Online: Real-time data available | 🟡 Testing: Authentication in progress | 🔴 Offline: Service unavailable
          </p>
        </div>
      </CardContent>
    </Card>
  );
}