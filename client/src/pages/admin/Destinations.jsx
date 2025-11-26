import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Select } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Plus, Edit, Trash2, MapPin } from "lucide-react"
import { getDestinations, deleteDestination, getDestinationById, updateDestination } from "@/api/destinations"
import { getCities } from "@/api/cities"
import { useToast } from "@/components/ui/toast"
import MapLocationPicker from "@/components/admin/MapLocationPicker"

const Destinations = () => {
  const [destinations, setDestinations] = useState([])
  const [cities, setCities] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("")
  const [selectedCity, setSelectedCity] = useState("")
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [editingDestination, setEditingDestination] = useState(null)
  const [editFormData, setEditFormData] = useState({
    name: "",
    cityId: "",
    category: "destination",
    description: "",
    highlights: [],
    coordinates: null,
    images: []
  })
  const [highlightsInput, setHighlightsInput] = useState("")
  const [newImageFiles, setNewImageFiles] = useState([])
  const [mapPickerOpen, setMapPickerOpen] = useState(false)
  const [saving, setSaving] = useState(false)
  const { addToast } = useToast()

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const params = { category: "destination" }
        if (selectedCity) params.cityId = selectedCity
        
        const [destRes, citiesRes] = await Promise.all([
          getDestinations(params),
          getCities()
        ])
        setDestinations(destRes.data)
        setCities(citiesRes.data)
      } catch (error) {
        console.error("Error fetching destinations:", error)
        addToast({
          title: "Error",
          description: "Failed to load destinations",
          variant: "destructive"
        })
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [selectedCategory, selectedCity, addToast])

  const handleEdit = async (id) => {
    try {
      const response = await getDestinationById(id)
      const dest = response.data
      setEditingDestination(dest)
      setEditFormData({
        name: dest.name || "",
        cityId: dest.cityId?._id || dest.cityId || "",
        category: dest.category || "destination",
        description: dest.description || "",
        highlights: dest.highlights || [],
        coordinates: dest.coordinates || null,
        images: dest.images || []
      })
      setHighlightsInput((dest.highlights || []).join(", "))
      setNewImageFiles([])
      setEditDialogOpen(true)
    } catch (error) {
      console.error("Error fetching destination:", error)
      addToast({
        title: "Error",
        description: "Failed to load destination data",
        variant: "destructive"
      })
    }
  }

  const handleUpdate = async () => {
    if (!editFormData.name || !editFormData.cityId || !editFormData.coordinates) {
      addToast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      })
      return
    }

    setSaving(true)
    try {
      await updateDestination(editingDestination._id, editFormData, newImageFiles)
      addToast({
        title: "Success",
        description: "Destination updated successfully"
      })
      setEditDialogOpen(false)
      setEditingDestination(null)
      // Reload destinations
      const params = { category: "destination" }
      if (selectedCity) params.cityId = selectedCity
      const destRes = await getDestinations(params)
      setDestinations(destRes.data)
    } catch (error) {
      console.error("Error updating destination:", error)
      addToast({
        title: "Error",
        description: error.response?.data?.message || "Failed to update destination",
        variant: "destructive"
      })
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this destination?")) {
      try {
        await deleteDestination(id)
        setDestinations(destinations.filter(d => d._id !== id))
        addToast({
          title: "Success",
          description: "Destination deleted successfully"
        })
      } catch (error) {
        console.error("Error deleting destination:", error)
        addToast({
          title: "Error",
          description: error.response?.data?.message || "Failed to delete destination",
          variant: "destructive"
        })
      }
    }
  }

  const filteredDestinations = destinations.filter(dest => {
    const matchesSearch = !searchTerm || 
      dest.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dest.cityId?.name?.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesSearch
  })

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-foreground">Manage Destinations</h1>
        <Button asChild>
          <Link to="/admin/destinations/new">
            <Plus className="w-4 h-4 mr-2" />
            Add Destination
          </Link>
        </Button>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="flex gap-4">
            <Input 
              placeholder="Search destinations..." 
              className="flex-1"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
            >
              <option value="">All Cities</option>
              {cities.map(city => (
                <option key={city._id} value={city._id}>
                  {city.name}
                </option>
              ))}
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          {loading ? (
            <div className="p-8 text-center text-muted-foreground">Loading destinations...</div>
          ) : filteredDestinations.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>City</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredDestinations.map((dest) => (
                  <TableRow key={dest._id}>
                    <TableCell className="font-medium">{dest.name}</TableCell>
                    <TableCell>{dest.cityId?.name || "N/A"}</TableCell>
                    <TableCell>
                      <Badge variant={dest.category === "destination" ? "default" : "secondary"}>
                        {dest.category === "hidden_gem" ? "Hidden Gem" : "Popular"}
                      </Badge>
                    </TableCell>
                    <TableCell className="max-w-xs truncate">
                      {dest.description || "No description"}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          title="Edit"
                          onClick={() => handleEdit(dest._id)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => handleDelete(dest._id)}
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="p-8 text-center text-muted-foreground">No destinations found</div>
          )}
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="relative z-[2000] max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Destination</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <div>
              <Label>Name *</Label>
              <Input 
                value={editFormData.name}
                onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
              />
            </div>
            <div>
              <Label>City *</Label>
              <Select
                value={editFormData.cityId}
                onChange={(e) => setEditFormData({ ...editFormData, cityId: e.target.value })}
              >
                <option value="">Select City</option>
                {cities.map(city => (
                  <option key={city._id} value={city._id}>
                    {city.name}, {city.state}
                  </option>
                ))}
              </Select>
            </div>
            <div>
              <Label>Category</Label>
              <Select
                value={editFormData.category}
                onChange={(e) => setEditFormData({ ...editFormData, category: e.target.value })}
              >
                <option value="destination">Destination</option>
                <option value="monument">Monument</option>
                <option value="fort">Fort</option>
                <option value="beach">Beach</option>
                <option value="temple">Temple</option>
              </Select>
            </div>
            <div>
              <Label>Description</Label>
              <Textarea 
                value={editFormData.description}
                onChange={(e) => setEditFormData({ ...editFormData, description: e.target.value })}
                rows={3}
              />
            </div>
            <div>
              <Label>Highlights (comma-separated)</Label>
              <Input 
                value={highlightsInput}
                onChange={(e) => {
                  setHighlightsInput(e.target.value)
                  const highlights = e.target.value.split(',').map(h => h.trim()).filter(h => h)
                  setEditFormData({ ...editFormData, highlights })
                }}
              />
            </div>
            <div>
              <Label>Location *</Label>
              <div className="space-y-2">
                <div className="flex gap-2">
                  <Input 
                    type="text" 
                    placeholder="Latitude"
                    value={editFormData.coordinates?.lat?.toFixed(4) || ""}
                    readOnly
                    className="bg-muted"
                  />
                  <Input 
                    type="text" 
                    placeholder="Longitude"
                    value={editFormData.coordinates?.lng?.toFixed(4) || ""}
                    readOnly
                    className="bg-muted"
                  />
                </div>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setMapPickerOpen(true)}
                  className="w-full"
                >
                  <MapPin className="w-4 h-4 mr-2" />
                  Pick Location on Map
                </Button>
              </div>
            </div>
            <div>
              <Label>Add New Images (up to 5)</Label>
              <Input 
                type="file"
                multiple
                accept="image/*"
                onChange={(e) => setNewImageFiles(Array.from(e.target.files).slice(0, 5))}
              />
              {newImageFiles.length > 0 && (
                <p className="text-xs text-muted-foreground mt-1">
                  {newImageFiles.length} new file(s) selected (will be added to existing images)
                </p>
              )}
              {editFormData.images && editFormData.images.length > 0 && (
                <div className="mt-2">
                  <p className="text-xs text-muted-foreground mb-1">Existing images ({editFormData.images.length})</p>
                  <div className="flex flex-wrap gap-2">
                    {editFormData.images.map((url, idx) => (
                      <div key={idx} className="relative">
                        <img src={url} alt={`Existing ${idx + 1}`} className="w-16 h-16 object-cover rounded" />
                      </div>
                    ))}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Current images will be kept. New images will be added.
                  </p>
                </div>
              )}
            </div>
            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={() => setEditDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleUpdate} disabled={saving}>
                {saving ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Map Location Picker Dialog */}
      <Dialog open={mapPickerOpen} onOpenChange={setMapPickerOpen}>
        <DialogContent className="relative z-[2000] max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Pick Destination Location</DialogTitle>
          </DialogHeader>
          <div className="mt-4">
            <MapLocationPicker
              initialCenter={editFormData.coordinates ? 
                [editFormData.coordinates.lat, editFormData.coordinates.lng] 
                : editFormData.cityId ? 
                  cities.find(c => c._id === editFormData.cityId)?.coordinates ? 
                    [cities.find(c => c._id === editFormData.cityId).coordinates.lat, cities.find(c => c._id === editFormData.cityId).coordinates.lng] 
                    : [20.5937, 78.9629]
                  : [20.5937, 78.9629]
              }
              value={editFormData.coordinates}
              onChange={(location) => {
                setEditFormData({ ...editFormData, coordinates: location })
              }}
            />
            <div className="mt-4 flex justify-end">
              <Button onClick={() => setMapPickerOpen(false)}>
                Confirm Location
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default Destinations
