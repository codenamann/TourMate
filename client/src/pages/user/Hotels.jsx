import { useState } from "react"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Select } from "@/components/ui/select"
import { Star, MapPin, Filter } from "lucide-react"

const Hotels = () => {
  const [filterOpen, setFilterOpen] = useState(false)

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-foreground mb-4">Hotels</h1>
        
        {/* Search Bar */}
        <div className="flex gap-4 mb-6">
          <Input
            placeholder="Search hotels..."
            className="flex-1"
          />
          <Button onClick={() => setFilterOpen(true)} variant="outline">
            <Filter className="w-4 h-4 mr-2" />
            Filters
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-4 mb-6 flex-wrap">
        <Select>
          <option>All Cities</option>
          <option>Mumbai</option>
          <option>Delhi</option>
          <option>Bangalore</option>
        </Select>
        <Select>
          <option>All Ratings</option>
          <option>5 Stars</option>
          <option>4 Stars</option>
          <option>3 Stars</option>
        </Select>
        <Select>
          <option>Price Range</option>
          <option>Budget</option>
          <option>Mid-range</option>
          <option>Luxury</option>
        </Select>
      </div>

      {/* Hotel Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((item) => (
          <Card key={item} className="overflow-hidden">
            <div className="h-48 bg-muted flex items-center justify-center">
              <MapPin className="w-12 h-12 text-muted-foreground" />
            </div>
            <CardHeader>
              <CardTitle>Hotel {item}</CardTitle>
              <CardDescription className="flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                City, State
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2 mb-4">
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Star key={i} className="w-4 h-4 fill-accent text-accent" />
                  ))}
                </div>
                <span className="text-sm">4.{item}</span>
                <Badge variant="secondary" className="ml-2">Luxury</Badge>
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                Hotel description will appear here...
              </p>
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-lg font-bold">₹{2000 + item * 500}</span>
                  <span className="text-sm text-muted-foreground">/night</span>
                </div>
                <Button>View Details</Button>
              </div>
            </CardContent>
          </Card>
        ))}
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
