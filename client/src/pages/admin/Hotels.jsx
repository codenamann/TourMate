import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Select } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Plus, Edit, Trash2, MapPin } from "lucide-react"
import { getHotels, deleteHotel, getHotelById, updateHotel } from "@/api/hotels"
import { getCities } from "@/api/cities"
import { useToast } from "@/components/ui/toast"
import MapLocationPicker from "@/components/admin/MapLocationPicker"

const Hotels = () => {
  const [hotels, setHotels] = useState([])
  const [cities, setCities] = useState([])
  const [loading, setLoading] = useState(true)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [editingHotel, setEditingHotel] = useState(null)
  const [editFormData, setEditFormData] = useState({
    name: "",
    cityId: "",
    description: "",
    roomTypes: [],
    coordinates: null,
    avgRating: 0,
    images: []
  })
  const [roomTypeInput, setRoomTypeInput] = useState("")
  const [newImageFiles, setNewImageFiles] = useState([])
  const [mapPickerOpen, setMapPickerOpen] = useState(false)
  const [saving, setSaving] = useState(false)
  const { addToast } = useToast()

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [hotelsRes, citiesRes] = await Promise.all([
          getHotels(),
          getCities()
        ])
        setHotels(hotelsRes.data)
        setCities(citiesRes.data)
      } catch (error) {
        console.error("Error fetching data:", error)
        addToast({
          title: "Error",
          description: "Failed to load hotels",
          variant: "destructive"
        })
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [addToast])

  const handleEdit = async (id) => {
    try {
      const response = await getHotelById(id)
      const hotel = response.data
      setEditingHotel(hotel)
      setEditFormData({
        name: hotel.name || "",
        cityId: hotel.cityId?._id || hotel.cityId || "",
        description: hotel.description || "",
        roomTypes: hotel.roomTypes || [],
        coordinates: hotel.coordinates || null,
        avgRating: hotel.avgRating || 0,
        images: hotel.images || []
      })
      setRoomTypeInput((hotel.roomTypes || []).join(", "))
      setNewImageFiles([])
      setEditDialogOpen(true)
    } catch (error) {
      console.error("Error fetching hotel:", error)
      addToast({
        title: "Error",
        description: "Failed to load hotel data",
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
      await updateHotel(editingHotel._id, editFormData, newImageFiles)
      addToast({
        title: "Success",
        description: "Hotel updated successfully"
      })
      setEditDialogOpen(false)
      setEditingHotel(null)
      // Reload hotels
      const response = await getHotels()
      setHotels(response.data)
    } catch (error) {
      console.error("Error updating hotel:", error)
      addToast({
        title: "Error",
        description: error.response?.data?.message || "Failed to update hotel",
        variant: "destructive"
      })
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this hotel?")) {
      try {
        await deleteHotel(id)
        setHotels(hotels.filter(h => h._id !== id))
        addToast({
          title: "Success",
          description: "Hotel deleted successfully"
        })
      } catch (error) {
        console.error("Error deleting hotel:", error)
        addToast({
          title: "Error",
          description: error.response?.data?.message || "Failed to delete hotel",
          variant: "destructive"
        })
      }
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-foreground">Manage Hotels</h1>
        <Button asChild>
          <Link to="/admin/hotels/new">
            <Plus className="w-4 h-4 mr-2" />
            Add New Hotel
          </Link>
        </Button>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="flex gap-4">
            <Input placeholder="Search hotels..." className="flex-1" />
            <Select>
              <option>All Cities</option>
              <option>Mumbai</option>
              <option>Goa</option>
              <option>Shimla</option>
            </Select>
            <Select>
              <option>All Ratings</option>
              <option>5 Stars</option>
              <option>4 Stars</option>
              <option>3 Stars</option>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Hotel Name</TableHead>
                <TableHead>City</TableHead>
                <TableHead>Rating</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                    Loading...
                  </TableCell>
                </TableRow>
              ) : hotels.length > 0 ? (
                hotels.map((hotel) => (
                  <TableRow key={hotel._id}>
                    <TableCell className="font-medium">{hotel.name}</TableCell>
                    <TableCell>{hotel.cityId?.name || "N/A"}</TableCell>
                    <TableCell>{hotel.avgRating || "N/A"}</TableCell>
                    <TableCell>
                      <Badge variant="outline">Active</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => handleEdit(hotel._id)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDelete(hotel._id)}>
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                    No hotels found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="relative z-[2000] max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Hotel</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <div className="grid grid-cols-2 gap-4">
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
              <Label>Room Types (comma-separated)</Label>
              <Input 
                value={roomTypeInput}
                onChange={(e) => {
                  setRoomTypeInput(e.target.value)
                  const types = e.target.value.split(',').map(t => t.trim()).filter(t => t)
                  setEditFormData({ ...editFormData, roomTypes: types })
                }}
              />
            </div>
            <div>
              <Label>Average Rating</Label>
              <Input 
                type="number"
                min="0"
                max="5"
                step="0.1"
                value={editFormData.avgRating}
                onChange={(e) => setEditFormData({ ...editFormData, avgRating: parseFloat(e.target.value) || 0 })}
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
                  {newImageFiles.length} new file(s) selected
                </p>
              )}
              {editFormData.images && editFormData.images.length > 0 && (
                <div className="mt-2">
                  <p className="text-xs text-muted-foreground mb-1">Existing images ({editFormData.images.length})</p>
                  <div className="flex flex-wrap gap-2">
                    {editFormData.images.map((url, idx) => (
                      <img key={idx} src={url} alt={`Existing ${idx + 1}`} className="w-16 h-16 object-cover rounded" />
                    ))}
                  </div>
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
            <DialogTitle>Pick Hotel Location</DialogTitle>
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

export default Hotels
