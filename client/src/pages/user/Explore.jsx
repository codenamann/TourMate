import { useState, useEffect } from "react"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Separator } from "@/components/ui/separator"
import { MapPin, Star, Filter } from "lucide-react"
import { Link } from "react-router-dom"
import { getDestinations } from "@/api/destinations"

const Explore = () => {
  const [filterOpen, setFilterOpen] = useState(false)
  const [destinations, setDestinations] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getDestinations()
        setDestinations(response.data)
      } catch (error) {
        console.error("Error fetching destinations:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

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
                <div className="h-48 bg-muted flex items-center justify-center">
                  <MapPin className="w-12 h-12 text-muted-foreground" />
                </div>
                <CardHeader>
                  <CardTitle>{dest.name}</CardTitle>
                  <CardDescription>{dest.cityId?.name || "India"}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2 mb-4">
                    <Star className="w-4 h-4 fill-accent text-accent" />
                    <span className="text-sm">4.5</span>
                    <Badge variant="secondary" className="ml-2">
                      {dest.category === "hidden_gem" ? "Hidden Gem" : "Popular"}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">
                    {dest.description || "Description of the destination will appear here..."}
                  </p>
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
                  <input type="checkbox" />
                  <span>Popular</span>
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" />
                  <span>Hidden Gems</span>
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" />
                  <span>Adventure</span>
                </label>
              </div>
            </div>
            <Separator />
            <div>
              <label className="text-sm font-medium mb-2 block">Rating</label>
              <div className="space-y-2">
                <label className="flex items-center gap-2">
                  <input type="checkbox" />
                  <span>4+ Stars</span>
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" />
                  <span>3+ Stars</span>
                </label>
              </div>
            </div>
            <Button className="w-full mt-6">Apply Filters</Button>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  )
}

export default Explore
