"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { MapPin, Navigation, Search } from "lucide-react"
import { cities, searchCities } from "@/lib/cities-data"

export function CitySelector() {
  const [searchQuery, setSearchQuery] = useState("")
  const [filteredCities, setFilteredCities] = useState(cities)
  const [selectedCity, setSelectedCity] = useState("")
  const [isGettingLocation, setIsGettingLocation] = useState(false)
  const router = useRouter()

  useEffect(() => {
    if (searchQuery) {
      setFilteredCities(searchCities(searchQuery))
    } else {
      setFilteredCities(cities)
    }
  }, [searchQuery])

  const handleExplore = () => {
    if (selectedCity) {
      router.push(`/dashboard/${selectedCity}`)
    }
  }

  const handleUseMyLocation = () => {
    setIsGettingLocation(true)
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords
          // Find nearest city based on coordinates
          let nearestCity = cities[0]
          let minDistance = Number.POSITIVE_INFINITY

          cities.forEach((city) => {
            const distance = Math.sqrt(
              Math.pow(city.coordinates.lat - latitude, 2) + Math.pow(city.coordinates.lng - longitude, 2),
            )
            if (distance < minDistance) {
              minDistance = distance
              nearestCity = city
            }
          })

          setSelectedCity(nearestCity.id)
          setSearchQuery(nearestCity.name)
          setIsGettingLocation(false)
        },
        (error) => {
          console.error("Error getting location:", error)
          setIsGettingLocation(false)
          alert("Unable to get your location. Please select a city manually.")
        },
      )
    } else {
      setIsGettingLocation(false)
      alert("Geolocation is not supported by your browser.")
    }
  }

  return (
    <div className="flex flex-col gap-4 w-full max-w-2xl">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search cities worldwide..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-14 pl-10 text-lg bg-card/50 backdrop-blur-sm border-border/50"
          />
        </div>
        <Button
          size="lg"
          variant="outline"
          className="h-14 px-4 bg-transparent"
          onClick={handleUseMyLocation}
          disabled={isGettingLocation}
        >
          <Navigation className={`w-5 h-5 ${isGettingLocation ? "animate-spin" : ""}`} />
        </Button>
      </div>

      <div className="max-h-[300px] overflow-y-auto rounded-xl bg-card/50 backdrop-blur-sm border border-border/50">
        {filteredCities.length > 0 ? (
          <div className="p-2">
            {Array.from(new Set(filteredCities.map((c) => c.continent))).map((continent) => (
              <div key={continent} className="mb-4">
                <div className="px-3 py-2 text-sm font-semibold text-muted-foreground">{continent}</div>
                {filteredCities
                  .filter((c) => c.continent === continent)
                  .map((city) => (
                    <button
                      key={city.id}
                      onClick={() => {
                        setSelectedCity(city.id)
                        setSearchQuery(city.name)
                      }}
                      className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-accent/50 transition-colors ${
                        selectedCity === city.id ? "bg-accent" : ""
                      }`}
                    >
                      <MapPin className="w-4 h-4 text-primary flex-shrink-0" />
                      <div className="flex-1 text-left">
                        <div className="font-medium">{city.name}</div>
                        <div className="text-sm text-muted-foreground">{city.country}</div>
                      </div>
                      <div className="text-xs text-muted-foreground">{(city.population / 1000000).toFixed(1)}M</div>
                    </button>
                  ))}
              </div>
            ))}
          </div>
        ) : (
          <div className="p-8 text-center text-muted-foreground">No cities found</div>
        )}
      </div>

      <Button
        size="lg"
        className="h-14 px-8 text-lg bg-primary hover:bg-primary/90 text-primary-foreground"
        disabled={!selectedCity}
        onClick={handleExplore}
      >
        Explore Dashboard
      </Button>
    </div>
  )
}
