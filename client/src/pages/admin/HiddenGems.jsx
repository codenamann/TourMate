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
import { getHiddenGems, deleteHiddenGem, updateHiddenGem } from "@/api/admin"
import { getDestinationById } from "@/api/destinations"
import { getCities } from "@/api/cities"
import { useToast } from "@/components/ui/toast"
import MapLocationPicker from "@/components/admin/MapLocationPicker"

const HiddenGems = () => {
  const [hiddenGems, setHiddenGems] = useState([])
  const [cities, setCities] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCity, setSelectedCity] = useState("")
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [editingGem, setEditingGem] = useState(null)
  const [editFormData, setEditFormData] = useState({
    name: "",
    cityId: "",
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
        const [gemsRes, citiesRes] = await Promise.all([
          getHiddenGems(),
          getCities()
        ])
        setHiddenGems(gemsRes.data)
        setCities(citiesRes.data)
      } catch (error) {
        console.error("Error fetching hidden gems:", error)
        addToast({
          title: "Error",
          description: "Failed to load hidden gems",
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
      const response = await getDestinationById(id)
      const gem = response.data
      setEditingGem(gem)
      setEditFormData({
        name: gem.name || "",
        cityId: gem.cityId?._id || gem.cityId || "",
        description: gem.description || "",
        highlights: gem.highlights || [],
        coordinates: gem.coordinates || null,
        images: gem.images || []
      })
      setHighlightsInput((gem.highlights || []).join(", "))
      setNewImageFiles([])
      setEditDialogOpen(true)
    } catch (error) {
      console.error("Error fetching hidden gem:", error)
      addToast({
        title: "Error",
        description: "Failed to load hidden gem data",
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
      await updateHiddenGem(editingGem._id, editFormData, newImageFiles)
      addToast({
        title: "Success",
        description: "Hidden gem updated successfully"
      })
      setEditDialogOpen(false)
      setEditingGem(null)
      // Reload hidden gems
      const response = await getHiddenGems()
      setHiddenGems(response.data)
    } catch (error) {
      console.error("Error updating hidden gem:", error)
      addToast({
        title: "Error",
        description: error.response?.data?.message || "Failed to update hidden gem",
        variant: "destructive"
      })
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this hidden gem?")) {
      try {
        await deleteHiddenGem(id)
        setHiddenGems(hiddenGems.filter(g => g._id !== id))
        addToast({
          title: "Success",
          description: "Hidden gem deleted successfully"
        })
      } catch (error) {
        console.error("Error deleting hidden gem:", error)
        addToast({
          title: "Error",
          description: error.response?.data?.message || "Failed to delete hidden gem",
          variant: "destructive"
        })
      }
    }
  }

  const filteredGems = hiddenGems.filter(gem => {
    const matchesSearch = !searchTerm || 
      gem.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      gem.cityId?.name?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCity = !selectedCity || gem.cityId?._id === selectedCity
    return matchesSearch && matchesCity
  })

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-foreground">Manage Hidden Gems</h1>
        <Button asChild>
          <Link to="/admin/hidden-gems/new">
            <Plus className="w-4 h-4 mr-2" />
            Add Hidden Gem
          </Link>
        </Button>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="flex gap-4">
            <Input 
              placeholder="Search hidden gems..." 
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
            <div className="p-8 text-center text-muted-foreground">Loading hidden gems...</div>
          ) : filteredGems.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>City</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredGems.map((gem) => (
                  <TableRow key={gem._id}>
                    <TableCell className="font-medium">{gem.name}</TableCell>
                    <TableCell>{gem.cityId?.name || "N/A"}</TableCell>
                    <TableCell className="max-w-xs truncate">
                      {gem.description || "No description"}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          title="Edit"
                          onClick={() => handleEdit(gem._id)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => handleDelete(gem._id)}
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
            <div className="p-8 text-center text-muted-foreground">No hidden gems found</div>
          )}
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="relative z-[2000] max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Hidden Gem</DialogTitle>
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
            <DialogTitle>Pick Hidden Gem Location</DialogTitle>
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

export default HiddenGems
