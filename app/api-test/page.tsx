'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { RefreshCw, CheckCircle, XCircle, AlertTriangle, PlayCircle } from 'lucide-react';
import { testAllAPIs, testCityData, type TestResult } from '@/lib/apiTester';
import Link from 'next/link';

export default function APITestPage() {
  const [testing, setTesting] = useState(false);
  const [results, setResults] = useState<TestResult[]>([]);
  const [cityTests, setCityTests] = useState<any>(null);

  const runTests = async () => {
    setTesting(true);
    setResults([]);
    setCityTests(null);

    try {
      // Run comprehensive API tests
      const apiResults = await testAllAPIs(40.7128, -74.0060);
      setResults(apiResults);

      // Test specific city data
      const cityData = await testCityData('New York', 40.7128, -74.0060);
      setCityTests(cityData);
    } catch (error) {
      console.error('Testing error:', error);
    } finally {
      setTesting(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pass':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'fail':
        return <XCircle className="w-5 h-5 text-red-500" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pass':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'fail':
        return 'bg-red-100 text-red-800 border-red-300';
      case 'warning':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const passCount = results.filter(r => r.status === 'pass').length;
  const failCount = results.filter(r => r.status === 'fail').length;
  const warnCount = results.filter(r => r.status === 'warning').length;
  const totalTests = results.length;

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">API Testing Dashboard</h1>
            <p className="text-muted-foreground mt-2">
              Comprehensive testing of all NASA and satellite data APIs
            </p>
          </div>
          <Link href="/">
            <Button variant="outline">Back to Home</Button>
          </Link>
        </div>

        {/* Test Control */}
        <Card>
          <CardHeader>
            <CardTitle>Run API Tests</CardTitle>
            <CardDescription>
              Test all integrated APIs including NASA FIRMS, Earthdata, Copernicus, and OpenStreetMap
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              onClick={runTests} 
              disabled={testing}
              className="gap-2"
              size="lg"
            >
              {testing ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Testing APIs...
                </>
              ) : (
                <>
                  <PlayCircle className="w-4 h-4" />
                  Run All Tests
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Test Summary */}
        {results.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600">{totalTests}</div>
                  <div className="text-sm text-muted-foreground mt-1">Total Tests</div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600">{passCount}</div>
                  <div className="text-sm text-muted-foreground mt-1">Passed</div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-yellow-600">{warnCount}</div>
                  <div className="text-sm text-muted-foreground mt-1">Warnings</div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-red-600">{failCount}</div>
                  <div className="text-sm text-muted-foreground mt-1">Failed</div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Test Results */}
        {results.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>API Test Results</CardTitle>
              <CardDescription>Detailed results for each API endpoint</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {results.map((result, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        {getStatusIcon(result.status)}
                        <div>
                          <h3 className="font-semibold text-lg">{result.apiName}</h3>
                          <p className="text-sm text-muted-foreground mt-1">{result.message}</p>
                        </div>
                      </div>
                      <Badge variant="secondary" className={getStatusColor(result.status)}>
                        {result.status.toUpperCase()}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4 text-sm">
                      {result.dataPoints !== undefined && (
                        <div>
                          <div className="text-muted-foreground">Data Points</div>
                          <div className="font-semibold">{result.dataPoints}</div>
                        </div>
                      )}
                      {result.responseTime !== undefined && (
                        <div>
                          <div className="text-muted-foreground">Response Time</div>
                          <div className="font-semibold">{result.responseTime}ms</div>
                        </div>
                      )}
                      {result.sampleData && (
                        <div className="col-span-2">
                          <div className="text-muted-foreground">Sample Data</div>
                          <pre className="text-xs bg-muted p-2 rounded mt-1 overflow-x-auto">
                            {JSON.stringify(result.sampleData, null, 2)}
                          </pre>
                        </div>
                      )}
                    </div>

                    {result.error && (
                      <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded">
                        <div className="text-sm font-semibold text-red-800">Error Details:</div>
                        <pre className="text-xs text-red-700 mt-1">{result.error}</pre>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* City Data Tests */}
        {cityTests && (
          <Card>
            <CardHeader>
              <CardTitle>City Environmental Data</CardTitle>
              <CardDescription>Testing all environmental layers for New York</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {Object.entries(cityTests).map(([layer, data]: [string, any]) => (
                  <div key={layer} className="border rounded-lg p-4">
                    <h4 className="font-semibold capitalize mb-2">{layer} Layer</h4>
                    {data.status === 'success' ? (
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Data Points:</span>
                          <span className="font-semibold">{data.dataPoints}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Source:</span>
                          <span className="font-semibold text-xs">{data.source}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Avg Intensity:</span>
                          <span className="font-semibold">{data.avgIntensity?.toFixed(2)}</span>
                        </div>
                        <Badge className="bg-green-100 text-green-800 w-full justify-center">
                          ✓ Working
                        </Badge>
                      </div>
                    ) : (
                      <div>
                        <Badge className="bg-red-100 text-red-800 w-full justify-center">
                          ✗ Error
                        </Badge>
                        <p className="text-xs text-red-600 mt-2">{data.error}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Instructions */}
        <Card>
          <CardHeader>
            <CardTitle>Testing Instructions</CardTitle>
          </CardHeader>
          <CardContent className="prose prose-sm max-w-none">
            <ul>
              <li>Click "Run All Tests" to test all integrated APIs</li>
              <li>Green badges indicate successful API connections with real data</li>
              <li>Yellow badges indicate APIs working but using fallback/mock data</li>
              <li>Red badges indicate API connection failures</li>
              <li>Check response times to monitor API performance</li>
              <li>Review sample data to verify correct data structure</li>
            </ul>
            <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded">
              <strong>Note:</strong> Some APIs may use mock data if authentication fails or rate limits are exceeded. 
              This is normal behavior and the application will gracefully fall back to simulated data to ensure 
              continuous operation.
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
