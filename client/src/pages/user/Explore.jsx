import { useState, useEffect } from "react"
import { useSearchParams } from "react-router-dom"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Separator } from "@/components/ui/separator"
import { MapPin, Filter } from "lucide-react"
import { Link } from "react-router-dom"
import { getDestinations } from "@/api/destinations"
import { getCities } from "@/api/cities"

const Explore = () => {
  const [searchParams] = useSearchParams()
  const [filterOpen, setFilterOpen] = useState(false)
  const [destinations, setDestinations] = useState([])
  const [cities, setCities] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get("category") || "")
  const [selectedCity, setSelectedCity] = useState("")

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const params = {}
        if (selectedCategory) params.category = selectedCategory
        if (selectedCity) params.cityId = selectedCity
        
        const [destRes, citiesRes] = await Promise.all([
          getDestinations(params),
          getCities()
        ])
        setDestinations(destRes.data)
        setCities(citiesRes.data)
      } catch (error) {
        console.error("Error fetching destinations:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [selectedCategory, selectedCity])

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-foreground mb-4">Explore Destinations</h1>
        
        {/* Search Bar */}
        <div className="flex gap-4 mb-6">
          <Input
            placeholder="Search destinations..."
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

      {/* Destination Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-3 text-center py-8 text-muted-foreground">Loading...</div>
        ) : destinations.length > 0 ? (
          destinations
            .filter(dest => 
              !searchTerm || 
              dest.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
              dest.cityId?.name?.toLowerCase().includes(searchTerm.toLowerCase())
            )
            .map((dest) => (
              <Card key={dest._id} className="overflow-hidden">
                <div className="h-48 bg-muted flex items-center justify-center overflow-hidden">
                  {dest.images && dest.images.length > 0 ? (
                    <img src={dest.images[0]} alt={dest.name} className="w-full h-full object-cover" />
                  ) : (
                    <MapPin className="w-12 h-12 text-muted-foreground" />
                  )}
                </div>
                <CardHeader>
                  <CardTitle>{dest.name}</CardTitle>
                  <CardDescription>{dest.cityId?.name || "India"}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2 mb-4">
                    <Badge variant="secondary" className="ml-2">
                      {dest.category === "hidden_gem" ? "Hidden Gem" : "Popular"}
                    </Badge>
                    {dest.cityId?.stateId?.name && (
                      <Badge variant="outline" className="text-xs">
                        {dest.cityId.stateId.name}
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                    {dest.description || "No description available."}
                  </p>
                  {dest.highlights && dest.highlights.length > 0 && (
                    <div className="mb-4">
                      <p className="text-xs text-muted-foreground mb-1">Highlights:</p>
                      <div className="flex flex-wrap gap-1">
                        {dest.highlights.slice(0, 3).map((highlight, idx) => (
                          <Badge key={idx} variant="outline" className="text-xs">
                            {highlight}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                  <Button asChild variant="outline" className="w-full">
                    <Link to={`/destination/${dest._id}`}>View Details</Link>
                  </Button>
                </CardContent>
              </Card>
            ))
        ) : (
          <div className="col-span-3 text-center py-8 text-muted-foreground">No destinations found</div>
        )}
      </div>

      {/* Filter Sheet */}
      <Sheet open={filterOpen} onOpenChange={setFilterOpen}>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Filter Destinations</SheetTitle>
          </SheetHeader>
          <div className="mt-6 space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Category</label>
              <div className="space-y-2">
                <label className="flex items-center gap-2">
                  <input 
                    type="radio" 
                    name="category"
                    value=""
                    checked={selectedCategory === ""}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                  />
                  <span>All</span>
                </label>
                <label className="flex items-center gap-2">
                  <input 
                    type="radio" 
                    name="category"
                    value="destination"
                    checked={selectedCategory === "destination"}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                  />
                  <span>Popular</span>
                </label>
                <label className="flex items-center gap-2">
                  <input 
                    type="radio" 
                    name="category"
                    value="hidden_gem"
                    checked={selectedCategory === "hidden_gem"}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                  />
                  <span>Hidden Gems</span>
                </label>
              </div>
            </div>
            <Separator />
            <div>
              <label className="text-sm font-medium mb-2 block">City</label>
              <select 
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
              >
                <option value="">All Cities</option>
                {cities.map(city => (
                  <option key={city._id} value={city._id}>
                    {city.name}, {city.state}
                  </option>
                ))}
              </select>
            </div>
            <Button 
              className="w-full mt-6" 
              onClick={() => setFilterOpen(false)}
            >
              Apply Filters
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  )
}

export default Explore
