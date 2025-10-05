// lib/apiTester.ts
// Comprehensive API testing utility to verify all data sources

import { 
  fetchFireData, 
  fetchAirQualityData, 
  fetchUrbanInfrastructure,
  fetchMODISTemperature,
  fetchPrecipitationData,
  fetchNDVIData,
  fetchComprehensiveEnvironmentalData,
  getUrbanAnalyticsSummary
} from './comprehensiveApi';

export interface TestResult {
  apiName: string;
  status: 'pass' | 'fail' | 'warning';
  message: string;
  dataPoints?: number;
  responseTime?: number;
  error?: string;
  sampleData?: any;
}

export async function testAllAPIs(lat: number = 40.7128, lon: number = -74.0060): Promise<TestResult[]> {
  const results: TestResult[] = [];
  const testCity = "New York";
  const startDate = "2025-09-01";
  const endDate = "2025-09-30";

  console.log('🧪 Starting comprehensive API tests...');
  console.log(`📍 Test location: ${testCity} (${lat}, ${lon})`);

  // Test 1: NASA FIRMS Fire Data
  try {
    const startTime = Date.now();
    const fireData = await fetchFireData(lat, lon, 3);
    const responseTime = Date.now() - startTime;
    
    results.push({
      apiName: 'NASA FIRMS',
      status: fireData.length > 0 ? 'pass' : 'warning',
      message: fireData.length > 0 
        ? `✅ Retrieved ${fireData.length} fire/thermal data points`
        : '⚠️ No fire data (may be normal for this location)',
      dataPoints: fireData.length,
      responseTime,
      sampleData: fireData[0]
    });
  } catch (error: any) {
    results.push({
      apiName: 'NASA FIRMS',
      status: 'fail',
      message: `❌ API call failed: ${error.message}`,
      error: error.toString()
    });
  }

  // Test 2: NASA MODIS Temperature
  try {
    const startTime = Date.now();
    const tempData = await fetchMODISTemperature(lat, lon, startDate, endDate);
    const responseTime = Date.now() - startTime;
    
    results.push({
      apiName: 'NASA MODIS Temperature',
      status: tempData.length > 0 ? 'pass' : 'warning',
      message: tempData.length > 0
        ? `✅ Retrieved ${tempData.length} temperature data points`
        : '⚠️ Using fallback data',
      dataPoints: tempData.length,
      responseTime,
      sampleData: tempData[0]
    });
  } catch (error: any) {
    results.push({
      apiName: 'NASA MODIS Temperature',
      status: 'fail',
      message: `❌ API call failed: ${error.message}`,
      error: error.toString()
    });
  }

  // Test 3: NASA GPM Precipitation
  try {
    const startTime = Date.now();
    const precipData = await fetchPrecipitationData(lat, lon, startDate, endDate);
    const responseTime = Date.now() - startTime;
    
    results.push({
      apiName: 'NASA GPM Precipitation',
      status: precipData.length > 0 ? 'pass' : 'warning',
      message: precipData.length > 0
        ? `✅ Retrieved ${precipData.length} precipitation data points`
        : '⚠️ Using fallback data',
      dataPoints: precipData.length,
      responseTime,
      sampleData: precipData[0]
    });
  } catch (error: any) {
    results.push({
      apiName: 'NASA GPM Precipitation',
      status: 'fail',
      message: `❌ API call failed: ${error.message}`,
      error: error.toString()
    });
  }

  // Test 4: Copernicus NDVI
  try {
    const startTime = Date.now();
    const ndviData = await fetchNDVIData(lat, lon, startDate, endDate);
    const responseTime = Date.now() - startTime;
    
    results.push({
      apiName: 'Copernicus Sentinel-2 NDVI',
      status: ndviData.length > 0 ? 'pass' : 'warning',
      message: ndviData.length > 0
        ? `✅ Retrieved ${ndviData.length} vegetation data points`
        : '⚠️ Using mock NDVI data',
      dataPoints: ndviData.length,
      responseTime,
      sampleData: ndviData[0]
    });
  } catch (error: any) {
    results.push({
      apiName: 'Copernicus Sentinel-2 NDVI',
      status: 'fail',
      message: `❌ API call failed: ${error.message}`,
      error: error.toString()
    });
  }

  // Test 5: OpenStreetMap Infrastructure
  try {
    const startTime = Date.now();
    const infrastructure = await fetchUrbanInfrastructure(lat, lon);
    const responseTime = Date.now() - startTime;
    
    results.push({
      apiName: 'OpenStreetMap Overpass',
      status: infrastructure.total_elements > 0 ? 'pass' : 'fail',
      message: infrastructure.total_elements > 0
        ? `✅ Retrieved ${infrastructure.total_elements} urban features (${infrastructure.roads.length} roads, ${infrastructure.buildings.length} buildings)`
        : '❌ No infrastructure data retrieved',
      dataPoints: infrastructure.total_elements,
      responseTime,
      sampleData: { 
        roads: infrastructure.roads.length, 
        buildings: infrastructure.buildings.length,
        industrial: infrastructure.industrial.length
      }
    });
  } catch (error: any) {
    results.push({
      apiName: 'OpenStreetMap Overpass',
      status: 'fail',
      message: `❌ API call failed: ${error.message}`,
      error: error.toString()
    });
  }

  // Test 6: Air Quality Data
  try {
    const startTime = Date.now();
    const aqiData = await fetchAirQualityData(lat, lon);
    const responseTime = Date.now() - startTime;
    
    results.push({
      apiName: 'Air Quality (OSM-based)',
      status: aqiData.length > 0 ? 'pass' : 'fail',
      message: aqiData.length > 0
        ? `✅ Generated ${aqiData.length} AQI data points`
        : '❌ No AQI data generated',
      dataPoints: aqiData.length,
      responseTime,
      sampleData: aqiData[0]
    });
  } catch (error: any) {
    results.push({
      apiName: 'Air Quality (OSM-based)',
      status: 'fail',
      message: `❌ API call failed: ${error.message}`,
      error: error.toString()
    });
  }

  // Test 7: Comprehensive Environmental Data (Heat)
  try {
    const startTime = Date.now();
    const heatData = await fetchComprehensiveEnvironmentalData(lat, lon, 'heat');
    const responseTime = Date.now() - startTime;
    
    results.push({
      apiName: 'Comprehensive Heat Data',
      status: heatData.length > 0 ? 'pass' : 'fail',
      message: heatData.length > 0
        ? `✅ Combined ${heatData.length} heat data points from multiple sources`
        : '❌ No comprehensive heat data',
      dataPoints: heatData.length,
      responseTime,
      sampleData: heatData[0]
    });
  } catch (error: any) {
    results.push({
      apiName: 'Comprehensive Heat Data',
      status: 'fail',
      message: `❌ API call failed: ${error.message}`,
      error: error.toString()
    });
  }

  // Test 8: Urban Analytics Summary
  try {
    const startTime = Date.now();
    const summary = await getUrbanAnalyticsSummary(lat, lon);
    const responseTime = Date.now() - startTime;
    
    results.push({
      apiName: 'Urban Analytics Summary',
      status: summary ? 'pass' : 'fail',
      message: summary
        ? `✅ Generated comprehensive urban analytics`
        : '❌ Failed to generate summary',
      responseTime,
      sampleData: summary
    });
  } catch (error: any) {
    results.push({
      apiName: 'Urban Analytics Summary',
      status: 'fail',
      message: `❌ API call failed: ${error.message}`,
      error: error.toString()
    });
  }

  // Summary statistics
  const passCount = results.filter(r => r.status === 'pass').length;
  const failCount = results.filter(r => r.status === 'fail').length;
  const warnCount = results.filter(r => r.status === 'warning').length;

  console.log('\n📊 Test Summary:');
  console.log(`✅ Passed: ${passCount}`);
  console.log(`⚠️ Warnings: ${warnCount}`);
  console.log(`❌ Failed: ${failCount}`);
  console.log(`Total Tests: ${results.length}`);

  return results;
}

// Function to test specific city environmental data
export async function testCityData(cityName: string, lat: number, lon: number) {
  console.log(`\n🌆 Testing ${cityName} environmental data...`);
  
  const layers: Array<'heat' | 'green' | 'water' | 'aqi'> = ['heat', 'green', 'water', 'aqi'];
  const layerResults: Record<string, any> = {};

  for (const layer of layers) {
    try {
      const data = await fetchComprehensiveEnvironmentalData(lat, lon, layer);
      layerResults[layer] = {
        status: 'success',
        dataPoints: data.length,
        source: data[0]?.source || 'Unknown',
        avgIntensity: data.reduce((sum, d) => sum + d.intensity, 0) / data.length
      };
      console.log(`  ${layer}: ${data.length} points from ${data[0]?.source || 'Unknown'}`);
    } catch (error: any) {
      layerResults[layer] = {
        status: 'error',
        error: error.message
      };
      console.error(`  ${layer}: Error - ${error.message}`);
    }
  }

  return layerResults;
}

// Export function to run tests from browser console
export function runAPITests() {
  testAllAPIs().then(results => {
    console.table(results.map(r => ({
      API: r.apiName,
      Status: r.status,
      'Data Points': r.dataPoints || 0,
      'Time (ms)': r.responseTime || 0,
      Message: r.message
    })));
  });
}
