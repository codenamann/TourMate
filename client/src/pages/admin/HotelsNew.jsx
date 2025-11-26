import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { MapPin } from "lucide-react"
import { createHotel } from "@/api/hotels"
import { getStates, getCitiesByState, searchCities } from "@/api/states"
import { useToast } from "@/components/ui/toast"
import MapLocationPicker from "@/components/admin/MapLocationPicker"

const HotelsNew = () => {
  const navigate = useNavigate()
  const [states, setStates] = useState([])
  const [cities, setCities] = useState([])
  const [citySearch, setCitySearch] = useState("")
  const [formData, setFormData] = useState({
    name: "",
    stateId: "",
    cityId: "",
    description: "",
    roomTypes: [],
    coordinates: { lat: 20.5937, lng: 78.9629 },
    avgRating: 0
  })
  const [roomTypeInput, setRoomTypeInput] = useState("")
  const [selectedFiles, setSelectedFiles] = useState([])
  const [loading, setLoading] = useState(false)
  const [mapPickerOpen, setMapPickerOpen] = useState(false)
  const { addToast } = useToast()

  useEffect(() => {
    const fetchStates = async () => {
      try {
        const response = await getStates()
        setStates(response.data)
      } catch (error) {
        console.error("Error fetching states:", error)
      }
    }
    fetchStates()
  }, [])

  useEffect(() => {
    const fetchCities = async () => {
      if (!formData.stateId) {
        setCities([])
        return
      }
      try {
        const response = await getCitiesByState(formData.stateId)
        setCities(response.data)
      } catch (error) {
        console.error("Error fetching cities:", error)
      }
    }
    fetchCities()
  }, [formData.stateId])

  useEffect(() => {
    const searchCitiesDebounced = async () => {
      if (!citySearch || citySearch.length < 2) {
        if (formData.stateId) {
          const response = await getCitiesByState(formData.stateId)
          setCities(response.data)
        }
        return
      }
      try {
        const response = await searchCities(citySearch)
        setCities(response.data)
      } catch (error) {
        console.error("Error searching cities:", error)
      }
    }
    const timer = setTimeout(searchCitiesDebounced, 300)
    return () => clearTimeout(timer)
  }, [citySearch, formData.stateId])

  const handleRoomTypesChange = (e) => {
    const value = e.target.value
    setRoomTypeInput(value)
    const types = value.split(',').map(t => t.trim()).filter(t => t)
    setFormData({ ...formData, roomTypes: types })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!formData.name || !formData.cityId) {
      addToast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      })
      return
    }

    setLoading(true)
    try {
      await createHotel(formData, selectedFiles)
      addToast({
        title: "Success",
        description: "Hotel created successfully"
      })
      navigate("/admin/hotels")
    } catch (error) {
      console.error("Error creating hotel:", error)
      addToast({
        title: "Error",
        description: error.response?.data?.message || "Failed to create hotel",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-foreground mb-6">Add New Hotel</h1>

      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>Hotel Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="name">Hotel Name *</Label>
                <Input 
                  id="name" 
                  placeholder="Enter hotel name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="state">State *</Label>
                <Select
                  id="state"
                  value={formData.stateId}
                  onChange={(e) => {
                    setFormData({ ...formData, stateId: e.target.value, cityId: "" })
                    setCitySearch("")
                  }}
                  required
                >
                  <option value="">Select State</option>
                  {states.map(state => (
                    <option key={state._id} value={state._id}>
                      {state.name}
                    </option>
                  ))}
                </Select>
              </div>
              <div>
                <Label htmlFor="city">City *</Label>
                <div className="space-y-2">
                  <Input
                    id="city-search"
                    placeholder="Search city or select from dropdown"
                    value={citySearch}
                    onChange={(e) => {
                      setCitySearch(e.target.value)
                      if (!e.target.value) {
                        setFormData({ ...formData, cityId: "" })
                      }
                    }}
                  />
                  <Select
                    id="city"
                    value={formData.cityId}
                    onChange={(e) => {
                      setFormData({ ...formData, cityId: e.target.value })
                      const selectedCity = cities.find(c => c._id === e.target.value)
                      if (selectedCity) {
                        setCitySearch(selectedCity.name)
                      }
                    }}
                    required
                  >
                    <option value="">Select City</option>
                    {cities.map(city => (
                      <option key={city._id} value={city._id}>
                        {city.name} {city.stateId ? `(${city.stateId.name})` : ""}
                      </option>
                    ))}
                  </Select>
                </div>
              </div>
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea 
                id="description" 
                placeholder="Enter hotel description" 
                rows={4}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="rating">Average Rating</Label>
                <Input 
                  id="rating" 
                  type="number" 
                  min="0" 
                  max="5" 
                  step="0.1"
                  placeholder="0"
                  value={formData.avgRating}
                  onChange={(e) => setFormData({ ...formData, avgRating: parseFloat(e.target.value) || 0 })}
                />
              </div>
              <div>
                <Label>Location</Label>
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <Input 
                      type="text" 
                      placeholder="Latitude"
                      value={formData.coordinates?.lat?.toFixed(4) || ""}
                      readOnly
                      className="bg-muted"
                    />
                    <Input 
                      type="text" 
                      placeholder="Longitude"
                      value={formData.coordinates?.lng?.toFixed(4) || ""}
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
            </div>

            <Separator />

            <div>
              <Label>Images (up to 5)</Label>
              <Input 
                type="file"
                multiple
                accept="image/*"
                onChange={(e) => setSelectedFiles(Array.from(e.target.files).slice(0, 5))}
                className="mt-2"
              />
              {selectedFiles.length > 0 && (
                <p className="text-xs text-muted-foreground mt-1">
                  {selectedFiles.length} file(s) selected
                </p>
              )}
            </div>

            <Separator />

            <div>
              <Label>Room Types (comma-separated)</Label>
              <Input 
                placeholder="e.g., Deluxe, Suite, Standard"
                value={roomTypeInput}
                onChange={handleRoomTypesChange}
                className="mt-2"
              />
              {formData.roomTypes.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {formData.roomTypes.map((type, idx) => (
                    <span key={idx} className="px-2 py-1 bg-muted rounded text-sm">
                      {type}
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div className="flex gap-4">
              <Button type="submit" disabled={loading}>
                {loading ? "Saving..." : "Save Hotel"}
              </Button>
              <Button type="button" variant="outline" onClick={() => navigate("/admin/hotels")}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>

      {/* Map Location Picker Dialog */}
      <Dialog open={mapPickerOpen} onOpenChange={setMapPickerOpen}>
        <DialogContent className="relative z-[2000] max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Pick Hotel Location</DialogTitle>
          </DialogHeader>
          <div className="mt-4">
            <MapLocationPicker
              initialCenter={[20.5937, 78.9629]}
              value={formData.coordinates}
              onChange={(location) => {
                setFormData({ ...formData, coordinates: location })
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

export default HotelsNew
