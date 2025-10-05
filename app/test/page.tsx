"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Loader2, CheckCircle, XCircle } from "lucide-react"

interface TestResult {
  name: string
  status: "pending" | "success" | "error"
  response?: any
  error?: string
}

export default function TestPage() {
  const [results, setResults] = useState<TestResult[]>([])
  const [testing, setTesting] = useState(false)

  const tests = [
    {
      name: "Global Air Quality API",
      url: "/api/air-quality/global",
    },
    {
      name: "Air Quality API (New York)",
      url: "/api/air-quality?city=New York",
    },
    {
      name: "Nearby Air Quality API",
      url: "/api/air-quality/nearby?lat=40.7128&lng=-74.006",
    },
    {
      name: "OpenAQ API",
      url: "/api/openaq?limit=5",
    },
  ]

  const runTests = async () => {
    setTesting(true)
    setResults([])

    for (const test of tests) {
      setResults((prev) => [...prev, { name: test.name, status: "pending" }])

      try {
        const response = await fetch(test.url)
        const data = await response.json()

        if (response.ok) {
          setResults((prev) =>
            prev.map((r) =>
              r.name === test.name
                ? { ...r, status: "success", response: data }
                : r
            )
          )
        } else {
          setResults((prev) =>
            prev.map((r) =>
              r.name === test.name
                ? { ...r, status: "error", error: data.error || "Unknown error" }
                : r
            )
          )
        }
      } catch (error) {
        setResults((prev) =>
          prev.map((r) =>
            r.name === test.name
              ? { ...r, status: "error", error: (error as Error).message }
              : r
          )
        )
      }

      // Small delay between tests
      await new Promise((resolve) => setTimeout(resolve, 500))
    }

    setTesting(false)
  }

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="text-center space-y-4">
          <h1 className="text-3xl font-bold">NASA Urban Simulator - API Test Suite</h1>
          <p className="text-muted-foreground">
            Test all API endpoints to ensure the application is working correctly
          </p>
          <Button
            onClick={runTests}
            disabled={testing}
            className="gap-2"
          >
            {testing && <Loader2 className="w-4 h-4 animate-spin" />}
            {testing ? "Running Tests..." : "Run All Tests"}
          </Button>
        </div>

        {results.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Test Results</h2>
            {results.map((result, index) => (
              <Card key={index}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{result.name}</CardTitle>
                    <Badge
                      variant={
                        result.status === "success"
                          ? "default"
                          : result.status === "error"
                          ? "destructive"
                          : "secondary"
                      }
                      className="gap-1"
                    >
                      {result.status === "pending" && <Loader2 className="w-3 h-3 animate-spin" />}
                      {result.status === "success" && <CheckCircle className="w-3 h-3" />}
                      {result.status === "error" && <XCircle className="w-3 h-3" />}
                      {result.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  {result.status === "success" && result.response && (
                    <div>
                      <p className="text-sm text-green-600 mb-2">✅ API working correctly</p>
                      <details className="text-xs">
                        <summary className="cursor-pointer text-muted-foreground">View Response Data</summary>
                        <pre className="mt-2 p-2 bg-muted rounded overflow-auto max-h-40">
                          {JSON.stringify(result.response, null, 2)}
                        </pre>
                      </details>
                    </div>
                  )}
                  {result.status === "error" && (
                    <p className="text-sm text-destructive">❌ Error: {result.error}</p>
                  )}
                  {result.status === "pending" && (
                    <p className="text-sm text-muted-foreground">⏳ Testing...</p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {!testing && results.length > 0 && (
          <div className="mt-8 p-4 bg-secondary/20 rounded-lg">
            <h3 className="font-semibold mb-2">Summary</h3>
            <div className="flex gap-4 text-sm">
              <span className="text-green-600">
                ✅ Passed: {results.filter((r) => r.status === "success").length}
              </span>
              <span className="text-destructive">
                ❌ Failed: {results.filter((r) => r.status === "error").length}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}