import { useState, useEffect } from "react"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Compass, MapPin, Star } from "lucide-react"
import { Link } from "react-router-dom"
import { getDestinations } from "@/api/destinations"

const Home = () => {
  const [destinations, setDestinations] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getDestinations({ category: "destination" })
        setDestinations(response.data.slice(0, 3))
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
      {/* Hero Section */}
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
          Welcome to TourMate
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-6">
          Your ultimate travel planning companion for exploring India. Discover hidden gems, plan your journey, and create unforgettable memories.
        </p>
        <div className="flex gap-4 justify-center">
          <Button asChild size="lg">
            <Link to="/explore">Explore Destinations</Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link to="/budget">Plan Budget</Link>
          </Button>
        </div>
      </div>

      {/* Explore Destinations Section */}
      <section className="mb-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-foreground">Explore Destinations</h2>
          <Button asChild variant="ghost">
            <Link to="/explore">View All</Link>
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {loading ? (
            <div className="col-span-3 text-center py-8 text-muted-foreground">Loading...</div>
          ) : destinations.length > 0 ? (
            destinations.map((dest) => (
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
      </section>

      {/* Popular Spots */}
      <section>
        <h2 className="text-2xl font-bold text-foreground mb-6">Popular Spots</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((item) => (
            <Card key={item}>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Compass className="w-5 h-5 text-accent" />
                  <CardTitle className="text-lg">Spot {item}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">Popular travel destination</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  )
}

export default Home
