import { useState, useEffect } from "react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Calendar } from "lucide-react"
import { Link } from "react-router-dom"
import { useAuth } from "@/context/AuthContext"
import { getMe } from "@/api/auth"
import { fetchItineraries } from "@/api/itineraries"

const Profile = () => {
  const { user } = useAuth()
  const [userData, setUserData] = useState(null)
  const [itineraries, setItineraries] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [userResponse, itinerariesResponse] = await Promise.all([
          getMe(),
          fetchItineraries().catch(() => ({ data: [] })) // Handle error gracefully
        ])
        setUserData(userResponse.data)
        setItineraries(itinerariesResponse.data || [])
      } catch (error) {
        console.error("Error fetching user data:", error)
      } finally {
        setLoading(false)
      }
    }
    
    if (user) {
      fetchData()
    } else {
      setLoading(false)
    }
  }, [user])

  const displayUser = userData || user
  const initials = displayUser?.name?.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2) || "U"

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="text-center py-12 text-muted-foreground">Loading profile...</div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold text-foreground mb-6">Profile</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* User Info Card */}
        <Card>
          <CardHeader>
            <div className="flex flex-col items-center text-center">
              <Avatar className="w-24 h-24 mb-4">
                <AvatarFallback className="text-2xl">{initials}</AvatarFallback>
              </Avatar>
              <CardTitle>{displayUser?.name || "User"}</CardTitle>
              <p className="text-sm text-muted-foreground">
                {displayUser?.role === "admin" ? "Administrator" : "Traveler"}
              </p>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium">Email</label>
              <p className="text-sm text-muted-foreground">{displayUser?.email || "N/A"}</p>
            </div>
            <div>
              <label className="text-sm font-medium">Role</label>
              <div className="mt-1">
                <Badge variant={displayUser?.role === "admin" ? "default" : "secondary"}>
                  {displayUser?.role || "user"}
                </Badge>
              </div>
            </div>
            <Separator />
            <Button variant="outline" className="w-full" disabled>
              Edit Profile (Coming Soon)
            </Button>
          </CardContent>
        </Card>

        {/* Saved Itineraries */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Saved Itineraries</CardTitle>
                <Badge variant="secondary">{itineraries.length} total</Badge>
              </div>
            </CardHeader>
            <CardContent>
              {itineraries.length > 0 ? (
                <div className="space-y-4">
                  <div className="text-sm text-muted-foreground mb-4">
                    Recent itineraries
                  </div>
                  {itineraries.slice(0, 3).map((itinerary) => (
                    <div key={itinerary._id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold">{itinerary.name}</h3>
                        <Badge variant="outline">{itinerary.items?.length || 0} items</Badge>
                      </div>
                      {itinerary.startDate && itinerary.endDate && (
                        <div className="text-sm text-muted-foreground mb-2">
                          {new Date(itinerary.startDate).toLocaleDateString()} - {new Date(itinerary.endDate).toLocaleDateString()}
                        </div>
                      )}
                      <Button variant="outline" size="sm" asChild className="w-full mt-2">
                        <Link to={`/itinerary/${itinerary._id}`}>View Details</Link>
                      </Button>
                    </div>
                  ))}
                  {itineraries.length > 3 && (
                    <Button asChild variant="outline" className="w-full">
                      <Link to="/itinerary">View All Itineraries</Link>
                    </Button>
                  )}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Calendar className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No Itineraries Yet</h3>
                  <div className="text-sm text-muted-foreground mb-6">
                    Create your first itinerary to get started
                  </div>
                  <Button asChild variant="outline" className="w-full">
                    <Link to="/itinerary">Go to Itinerary</Link>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default Profile
