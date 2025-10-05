import { AnimatedGlobe } from "./animated-globe"
import { CitySelector } from "./city-selector"
import { LocationDetector } from "./location-detector"
import Link from "next/link"
import { Button } from "./ui/button"

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 grid-pattern opacity-50" />

      {/* Globe animation - Enhanced visibility */}
      <div className="absolute inset-0 flex items-center justify-center opacity-60">
        <div className="w-full h-full max-w-4xl max-h-4xl">
          <AnimatedGlobe />
        </div>
      </div>

      {/* Gradient overlays */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 py-20">
        <div className="max-w-5xl mx-auto text-center space-y-8">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-card/50 backdrop-blur-sm border border-border/50">
            <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
            <span className="text-sm text-muted-foreground">Powered by NASA Earth Observation Data</span>
          </div>

          {/* Main heading */}
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-balance">
            Plan Smarter Cities with{" "}
            <span className="font-extrabold bg-gradient-to-r from-blue-400 via-cyan-400 to-emerald-400 bg-clip-text text-transparent">
              NASA Data
            </span>
          </h1>

          {/* Description */}
          <p className="text-xl sm:text-2xl text-muted-foreground max-w-3xl mx-auto text-pretty leading-relaxed">
            An interactive urban planning tool that visualizes city health through heat islands, air quality, green
            cover, and water risk using real-time satellite data
          </p>

          {/* City selector and location detector */}
          <div className="pt-8 grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
            <CitySelector />
            <LocationDetector />
          </div>

          {/* Quick access buttons */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <Button variant="outline" asChild>
              <Link href="/global-monitor">Global Air Quality Monitor</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/dashboard/temperature">Temperature Analysis</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/alerts">View Disaster Alerts</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/recommendations">Get Recommendations</Link>
            </Button>
          </div>

          {/* Feature highlights */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-12 max-w-3xl mx-auto">
            {[
              { icon: "🔥", label: "Heat Islands" },
              { icon: "🌱", label: "Green Cover" },
              { icon: "💧", label: "Water Risk" },
              { icon: "🌬️", label: "Air Quality" },
            ].map((feature) => (
              <div
                key={feature.label}
                className="flex flex-col items-center gap-2 p-4 rounded-xl bg-card/30 backdrop-blur-sm border border-border/30 hover:border-primary/50 transition-colors"
              >
                <span className="text-3xl">{feature.icon}</span>
                <span className="text-sm font-medium text-muted-foreground">{feature.label}</span>
              </div>
            ))}
          </div>

          {/* Footer Credit */}
          <div className="pt-16 pb-8">
            <div className="flex items-center justify-center gap-2 animate-fade-in">
              <p className="text-lg font-medium text-muted-foreground/80">
                MADE BY{" "}
                <span className="text-xl font-bold bg-gradient-to-r from-blue-400 via-cyan-400 to-emerald-400 bg-clip-text text-transparent animate-pulse">
                  FUTUREFRAME
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
    </section>
  )
}
