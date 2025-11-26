import { useState, useEffect } from "react"
import { useSearchParams } from "react-router-dom"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Select } from "@/components/ui/select"
import { Star, MapPin, Filter } from "lucide-react"
import { getHotels } from "@/api/hotels"
import { getCities } from "@/api/cities"

const Hotels = () => {
  const [searchParams] = useSearchParams()
  const [filterOpen, setFilterOpen] = useState(false)
  const [hotels, setHotels] = useState([])
  const [cities, setCities] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCity, setSelectedCity] = useState(searchParams.get("cityId") || "")
  const [minRating, setMinRating] = useState("")

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const params = {}
        if (selectedCity) params.cityId = selectedCity
        
        const [hotelsRes, citiesRes] = await Promise.all([
          getHotels(params),
          getCities()
        ])
        setHotels(hotelsRes.data)
        setCities(citiesRes.data)
      } catch (error) {
        console.error("Error fetching hotels:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [selectedCity])

  const filteredHotels = hotels.filter(hotel => {
    const matchesSearch = !searchTerm || 
      hotel.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      hotel.cityId?.name?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesRating = !minRating || (hotel.avgRating || 0) >= parseFloat(minRating)
    return matchesSearch && matchesRating
  })

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-foreground mb-4">Hotels</h1>
        
        {/* Search Bar */}
        <div className="flex gap-4 mb-6">
          <Input
            placeholder="Search hotels..."
            className="flex-1"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Button onClick={() => setFilterOpen(true)} variant="outline">
            <Filter className="w-4 h-4 mr-2" />
            Filters
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-4 mb-6 flex-wrap">
        <Select 
          value={selectedCity} 
          onChange={(e) => setSelectedCity(e.target.value)}
          className="w-[200px]"
        >
          <option value="">All Cities</option>
          {cities.map(city => (
            <option key={city._id} value={city._id}>
              {city.name}, {city.state}
            </option>
          ))}
        </Select>
        <Select 
          value={minRating} 
          onChange={(e) => setMinRating(e.target.value)}
          className="w-[200px]"
        >
          <option value="">All Ratings</option>
          <option value="4">4+ Stars</option>
          <option value="3">3+ Stars</option>
          <option value="2">2+ Stars</option>
        </Select>
      </div>

      {/* Hotel Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-3 text-center py-8 text-muted-foreground">Loading hotels...</div>
        ) : filteredHotels.length > 0 ? (
          filteredHotels.map((hotel) => (
            <Card key={hotel._id} className="overflow-hidden">
              <div className="h-48 bg-muted flex items-center justify-center overflow-hidden">
                {hotel.images && hotel.images.length > 0 ? (
                  <img src={hotel.images[0]} alt={hotel.name} className="w-full h-full object-cover" />
                ) : (
                  <MapPin className="w-12 h-12 text-muted-foreground" />
                )}
              </div>
              <CardHeader>
                <CardTitle>{hotel.name}</CardTitle>
                <CardDescription className="flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  {hotel.cityId?.name ? `${hotel.cityId.name}${hotel.cityId.stateId?.name ? `, ${hotel.cityId.stateId.name}` : ""}` : "Location not specified"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2 mb-4">
                  {hotel.avgRating > 0 ? (
                    <>
                      <div className="flex">
                        {[1, 2, 3, 4, 5].map((i) => (
                          <Star 
                            key={i} 
                            className={`w-4 h-4 ${i <= Math.round(hotel.avgRating) ? 'fill-accent text-accent' : 'text-muted-foreground'}`} 
                          />
                        ))}
                      </div>
                      <span className="text-sm">{hotel.avgRating.toFixed(1)}</span>
                    </>
                  ) : (
                    <span className="text-sm text-muted-foreground">No ratings yet</span>
                  )}
                  {hotel.roomTypes && hotel.roomTypes.length > 0 && (
                    <Badge variant="secondary" className="ml-2">
                      {hotel.roomTypes[0]}
                    </Badge>
                  )}
                </div>
                {hotel.roomTypes && hotel.roomTypes.length > 0 && (
                  <p className="text-sm text-muted-foreground mb-4">
                    Room types: {hotel.roomTypes.join(", ")}
                  </p>
                )}
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="col-span-3 text-center py-8 text-muted-foreground">No hotels found</div>
        )}
      </div>

      {/* Filter Sheet */}
      <Sheet open={filterOpen} onOpenChange={setFilterOpen}>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Filter Hotels</SheetTitle>
          </SheetHeader>
          <div className="mt-6 space-y-6">
            <div>
              <label className="text-sm font-medium mb-2 block">Amenities</label>
              <div className="space-y-2">
                <label className="flex items-center gap-2">
                  <input type="checkbox" />
                  <span>WiFi</span>
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" />
                  <span>Pool</span>
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" />
                  <span>Spa</span>
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" />
                  <span>Restaurant</span>
                </label>
              </div>
            </div>
            <Button className="w-full">Apply Filters</Button>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  )
}

export default Hotels
