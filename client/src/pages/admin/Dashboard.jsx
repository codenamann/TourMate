import { useState, useEffect } from "react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Hotel, MapPin, Gem, MessageSquare } from "lucide-react"
import { Link } from "react-router-dom"
import { getHotels } from "@/api/hotels"
import { getDestinations } from "@/api/destinations"
import { getHiddenGems } from "@/api/admin"
import { getPendingReviews } from "@/api/reviews"

const Dashboard = () => {
  const [stats, setStats] = useState({
    hotels: 0,
    destinations: 0,
    hiddenGems: 0,
    pendingReviews: 0
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [hotelsRes, destRes, gemsRes, reviewsRes] = await Promise.all([
          getHotels(),
          getDestinations({ category: "destination" }),
          getHiddenGems(),
          getPendingReviews()
        ])
        setStats({
          hotels: hotelsRes.data.length,
          destinations: destRes.data.length,
          hiddenGems: gemsRes.data.length,
          pendingReviews: reviewsRes.data.length
        })
      } catch (error) {
        console.error("Error fetching stats:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchStats()
  }, [])

  const statsData = [
    { title: "Total Hotels", value: stats.hotels, icon: Hotel, color: "text-accent", link: "/admin/hotels" },
    { title: "Total Destinations", value: stats.destinations, icon: MapPin, color: "text-accent", link: "/admin/destinations" },
    { title: "Hidden Gems", value: stats.hiddenGems, icon: Gem, color: "text-accent", link: "/admin/hidden-gems" },
    { title: "Pending Reviews", value: stats.pendingReviews, icon: MessageSquare, color: "text-destructive", link: "/admin/reviews" },
  ]

  return (
    <div>
      <h1 className="text-3xl font-bold text-foreground mb-6">Admin Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {loading ? (
          <div className="col-span-4 text-center py-8 text-muted-foreground">Loading stats...</div>
        ) : (
          statsData.map((stat, index) => {
            const Icon = stat.icon
            return (
              <Card key={index} className={stat.link ? "cursor-pointer hover:bg-accent/5 transition-colors" : ""}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                  <Icon className={`h-4 w-4 ${stat.color}`} />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {stat.title === "Pending Reviews" ? "Requires attention" : "Active listings"}
                  </p>
                </CardContent>
              </Card>
            )
          })
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Button asChild variant="outline" className="w-full justify-start">
                <Link to="/admin/hotels/new">
                  Add New Hotel
                </Link>
              </Button>
              <Button asChild variant="outline" className="w-full justify-start">
                <Link to="/admin/destinations">
                  Manage Destinations
                </Link>
              </Button>
              <Button asChild variant="outline" className="w-full justify-start">
                <Link to="/admin/reviews">
                  Moderate Reviews
                </Link>
              </Button>
              <Button asChild variant="outline" className="w-full justify-start">
                <Link to="/admin/map-tools">
                  Map Tools
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>System Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">Backend API</span>
                <Badge variant="default">Connected</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Database</span>
                <Badge variant="default">Connected</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Cloudinary</span>
                <Badge variant="default">Backend Service</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default Dashboard
