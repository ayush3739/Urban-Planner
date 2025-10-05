import type { Metadata } from "next"
import { OpenAQLocationsList } from "@/components/openaq/locations-list"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

export const metadata: Metadata = {
  title: "OpenAQ Locations | Smart Urban Growth Simulator",
  description: "Browse the first 10 OpenAQ locations from a secure proxy.",
}

export default function OpenAQPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/">
            <Button variant="ghost" size="sm" className="gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back to Home
            </Button>
          </Link>
          <h1 className="text-xl font-bold">OpenAQ Locations</h1>
          <div className="w-24" />
        </div>
      </header>

      {/* Main Content */}
      <main className="min-h-screen container mx-auto px-4 py-8">
        <header className="mb-6">
          <h1 className="text-2xl md:text-3xl font-semibold text-pretty">OpenAQ Locations</h1>
          <p className="text-muted-foreground mt-1">
            Data fetched securely via a server-side proxy to protect the API key.
          </p>
        </header>
        <section>
          <OpenAQLocationsList limit={1000} />
        </section>
      </main>
    </div>
  )
}
