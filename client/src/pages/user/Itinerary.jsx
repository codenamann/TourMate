import { useState, useEffect } from "react"
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Calendar, Plus, Trash2, Eye } from "lucide-react"
import { Link } from "react-router-dom"
import { fetchItineraries, createItinerary, deleteItinerary } from "@/api/itineraries"
import { useToast } from "@/components/ui/toast"

const Itinerary = () => {
  const [itineraries, setItineraries] = useState([])
  const [loading, setLoading] = useState(true)
  const [createDialogOpen, setCreateDialogOpen] = useState(false)
  const [formData, setFormData] = useState({ name: "", startDate: "", endDate: "" })
  const [creating, setCreating] = useState(false)
  const { addToast } = useToast()

  useEffect(() => {
    loadItineraries()
  }, [])

  const loadItineraries = async () => {
    try {
      setLoading(true)
      const response = await fetchItineraries()
      setItineraries(response.data)
    } catch (error) {
      console.error("Error fetching itineraries:", error)
      addToast({
        title: "Error",
        description: "Failed to load itineraries",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const handleCreate = async (e) => {
    e.preventDefault()
    if (!formData.name.trim()) {
      addToast({
        title: "Error",
        description: "Please enter an itinerary name",
        variant: "destructive"
      })
      return
    }

    setCreating(true)
    try {
      await createItinerary({
        name: formData.name,
        startDate: formData.startDate || null,
        endDate: formData.endDate || null,
        items: []
      })
      addToast({
        title: "Success",
        description: "Itinerary created successfully"
      })
      setCreateDialogOpen(false)
      setFormData({ name: "", startDate: "", endDate: "" })
      loadItineraries()
    } catch (error) {
      console.error("Error creating itinerary:", error)
      addToast({
        title: "Error",
        description: error.response?.data?.message || "Failed to create itinerary",
        variant: "destructive"
      })
    } finally {
      setCreating(false)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this itinerary?")) {
      return
    }

    try {
      await deleteItinerary(id)
      addToast({
        title: "Success",
        description: "Itinerary deleted successfully"
      })
      loadItineraries()
    } catch (error) {
      console.error("Error deleting itinerary:", error)
      addToast({
        title: "Error",
        description: error.response?.data?.message || "Failed to delete itinerary",
        variant: "destructive"
      })
    }
  }

  const formatDate = (dateString) => {
    if (!dateString) return "Not set"
    return new Date(dateString).toLocaleDateString()
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">My Itineraries</h1>
          <p className="text-muted-foreground">Manage your travel plans</p>
        </div>
        <Button onClick={() => setCreateDialogOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Create New Itinerary
        </Button>
      </div>

      {loading ? (
        <div className="text-center py-12 text-muted-foreground">Loading itineraries...</div>
      ) : itineraries.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {itineraries.map((itinerary) => (
            <Card key={itinerary._id}>
              <CardHeader>
                <CardTitle>{itinerary.name}</CardTitle>
                <CardDescription>
                  {formatDate(itinerary.startDate)} - {formatDate(itinerary.endDate)}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      {itinerary.items?.length || 0} item(s) added
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      asChild
                      className="flex-1"
                    >
                      <Link to={`/itinerary/${itinerary._id}`}>
                        <Eye className="w-4 h-4 mr-2" />
                        View Details
                      </Link>
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(itinerary._id)}
                      className="flex-1"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="py-12">
            <div className="text-center">
              <Calendar className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Itineraries Yet</h3>
              <p className="text-sm text-muted-foreground mb-6">
                Start planning your trip by creating a new itinerary
              </p>
              <Button onClick={() => setCreateDialogOpen(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Create Your First Itinerary
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Create Dialog */}
      <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Itinerary</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleCreate} className="space-y-4 mt-4">
            <div>
              <Label htmlFor="name">Itinerary Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., Summer Trip 2024"
                required
              />
            </div>
            <div>
              <Label htmlFor="startDate">Start Date</Label>
              <Input
                id="startDate"
                type="date"
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="endDate">End Date</Label>
              <Input
                id="endDate"
                type="date"
                value={formData.endDate}
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
              />
            </div>
            <div className="flex gap-2 justify-end">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setCreateDialogOpen(false)
                  setFormData({ name: "", startDate: "", endDate: "" })
                }}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={creating}>
                {creating ? "Creating..." : "Create"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default Itinerary
