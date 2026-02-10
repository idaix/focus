import { useQuery } from '@tanstack/react-query'
import {
  CloudRainIcon,
  SunIcon,
  CloudIcon,
  CloudSnowIcon,
  WindIcon,
  MapPinIcon,
  SearchIcon,
  DropletsIcon,
  TrashIcon,
  PlusIcon,
} from 'lucide-react'
import { useState, useEffect } from 'react'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { db } from '@/lib/db'
import { useLiveQuery } from 'dexie-react-hooks'

const fetchWeather = async (lat: number, lon: number) => {
  const response = await fetch(
    `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,weather_code,wind_speed_10m,relative_humidity_2m&daily=temperature_2m_max,temperature_2m_min,sunrise,sunset&hourly=temperature_2m,weather_code&timezone=auto`
  )
  if (!response.ok) throw new Error('Failed to fetch weather')
  return response.json()
}

const searchLocations = async (query: string) => {
  if (query.length < 3) return []
  const response = await fetch(
    `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query)}&count=5&language=en&format=json`
  )
  if (!response.ok) throw new Error('Failed to search locations')
  const data = await response.json()
  return data.results || []
}

const getWeatherIcon = (code: number, className = 'w-6 h-6') => {
  if (code === 0) return <SunIcon className={`${className} text-yellow-500`} />
  if (code >= 1 && code <= 3) return <CloudIcon className={`${className} text-gray-400`} />
  if ((code >= 51 && code <= 67) || (code >= 80 && code <= 82))
    return <CloudRainIcon className={`${className} text-blue-400`} />
  if (code >= 71 && code <= 77) return <CloudSnowIcon className={`${className} text-white`} />
  return <SunIcon className={`${className} text-yellow-500`} />
}

export default function WeatherWidget() {
  const locations = useLiveQuery(() => db.weatherLocations.toArray())
  const [currentLocation, setCurrentLocation] = useState({
    lat: 40.7128,
    lon: -74.006,
    name: 'New York',
    id: 'default',
  })
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<any[]>([])
  const [isSearchOpen, setIsSearchOpen] = useState(false)

  // Initialize default location
  useEffect(() => {
    const init = async () => {
      const count = await db.weatherLocations.count()
      if (count === 0) {
        await db.weatherLocations.add({
          id: 'default',
          lat: 40.7128,
          lon: -74.006,
          name: 'New York',
          isDefault: true,
        })
      }
    }
    init()
  }, [])

  // Set current location from DB
  useEffect(() => {
    if (locations && locations.length > 0) {
      const active = locations.find((l) => l.isDefault) || locations[0]
      setCurrentLocation(active)
    }
  }, [locations])

  const { data, isLoading, error } = useQuery({
    queryKey: ['weather', currentLocation.lat, currentLocation.lon],
    queryFn: () => fetchWeather(currentLocation.lat, currentLocation.lon),
  })

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    const results = await searchLocations(searchQuery)
    setSearchResults(results)
  }

  const addLocation = async (loc: any) => {
    await db.weatherLocations.add({
      id: crypto.randomUUID(),
      lat: loc.latitude,
      lon: loc.longitude,
      name: `${loc.name}, ${loc.country_code}`,
      isDefault: false, // Keep current check for default logic if needed, simplify for now
    })
    setSearchQuery('')
    setSearchResults([])
    setIsSearchOpen(false)
  }

  const switchToLocation = async (loc: any) => {
    // Unset other defaults (optional if strictly 1 default, but UI driven switch is easier locally)
    setCurrentLocation(loc)
  }

  const removeLocation = async (e: React.MouseEvent, id: string) => {
      e.stopPropagation()
      await db.weatherLocations.delete(id)
  }

  if (isLoading || !currentLocation)
    return <div className="h-full flex items-center justify-center">Loading...</div>
  if (error)
    return <div className="h-full flex items-center justify-center text-red-400">Error</div>

  const current = data?.current
  const daily = data?.daily
  const hourly = data?.hourly

  return (
    <div className="h-full flex flex-col p-4 space-y-4 relative group">
      {/* Header / Location */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
            <Dialog open={isSearchOpen} onOpenChange={setIsSearchOpen}>
                <DialogTrigger asChild>
                    <Button variant="ghost" size="sm" className="p-0 h-auto font-semibold text-lg hover:bg-transparent hover:underline flex gap-1">
                        <MapPinIcon className="w-4 h-4" />
                        {currentLocation.name}
                    </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Manage Locations</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                        <form onSubmit={handleSearch} className="flex gap-2">
                            <Input
                                placeholder="Search city..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                            <Button type="submit" size="icon">
                                <SearchIcon className="w-4 h-4" />
                            </Button>
                        </form>
                        
                         {searchResults.length > 0 && (
                            <ScrollArea className="h-[100px] border rounded-md">
                                <div className="p-2 space-y-1">
                                    {searchResults.map((res) => (
                                        <Button key={res.id} variant="ghost" className="w-full justify-start h-8 text-xs" onClick={() => addLocation(res)}>
                                            <PlusIcon className="w-3 h-3 mr-2" />
                                            {res.name}, {res.country_code}
                                        </Button>
                                    ))}
                                </div>
                            </ScrollArea>
                        )}

                        <div className="space-y-2">
                            <h4 className="text-sm font-medium">Saved Locations</h4>
                            {locations?.map((loc) => (
                                <div key={loc.id} className="flex items-center justify-between p-2 rounded-md bg-secondary/20 cursor-pointer hover:bg-secondary/40" onClick={() => switchToLocation(loc)}>
                                    <span className="text-sm">{loc.name}</span>
                                    {locations.length > 1 && (
                                         <Button variant="ghost" size="icon" className="h-6 w-6 text-destructive hover:bg-destructive/20" onClick={(e) => removeLocation(e, loc.id)}>
                                            <TrashIcon className="w-3 h-3" />
                                        </Button>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
        <span className="text-xs text-muted-foreground">{new Date().toLocaleDateString(undefined, { weekday: 'short', day: 'numeric'})}</span>
      </div>

      {/* Main Info */}
      <div className="flex items-center justify-between">
         <div className="flex flex-col">
            <span className="text-5xl font-bold tracking-tighter">
                {Math.round(current?.temperature_2m)}°
            </span>
             <div className="flex gap-3 text-xs text-muted-foreground mt-1">
                <span className="flex items-center gap-1"><DropletsIcon className="w-3 h-3"/> {current?.relative_humidity_2m}%</span>
                <span className="flex items-center gap-1"><WindIcon className="w-3 h-3"/> {current?.wind_speed_10m} km/h</span>
            </div>
         </div>
         <div className="flex flex-col items-center">
            {getWeatherIcon(current?.weather_code, "w-12 h-12")}
            <div className="flex gap-2 text-xs font-medium mt-2">
                 <span>H: {Math.round(daily?.temperature_2m_max[0])}°</span>
                 <span>L: {Math.round(daily?.temperature_2m_min[0])}°</span>
            </div>
         </div>
      </div>

      {/* Hourly Forecast */}
      <ScrollArea className="w-full whitespace-nowrap rounded-md border border-white/10 bg-black/20">
         <div className="flex w-max p-2 space-x-4">
            {hourly?.time.slice(0, 24).map((time: string, i: number) => (
               <div key={time} className="flex flex-col items-center gap-1 text-xs">
                   <span className="text-muted-foreground">
                       {new Date(time).toLocaleTimeString(undefined, { hour: 'numeric' })}
                   </span>
                   {getWeatherIcon(hourly.weather_code[i], "w-4 h-4")}
                   <span className="font-medium">{Math.round(hourly.temperature_2m[i])}°</span>
               </div>
            ))}
         </div>
         <ScrollBar orientation="horizontal" className="hidden" />
      </ScrollArea>
    </div>
  )
}
