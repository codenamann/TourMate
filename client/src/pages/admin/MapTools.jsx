import { useState, useEffect } from "react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select } from "@/components/ui/select"
import MapWrapper from "@/components/map/MapWrapper"
import { Marker, Popup, useMapEvents } from "react-leaflet"
import { createMapPin } from "@/api/admin"
import { getStates, getCitiesByState, searchCities } from "@/api/states"
import { useToast } from "@/components/ui/toast"
import MapLocationPicker from "@/components/admin/MapLocationPicker"
import '@/lib/leaflet'

// Component to handle map clicks
function MapClickHandler({ onMapClick }) {
  useMapEvents({
    click: (e) => {
      onMapClick(e)
    }
  })
  return null
}

const MapTools = () => {
  const [dialogOpen, setDialogOpen] = useState(false)
  const [formType, setFormType] = useState("hotel")
  const [states, setStates] = useState([])
  const [cities, setCities] = useState([])
  const [citySearch, setCitySearch] = useState("")
  const [formData, setFormData] = useState({
    name: "",
    stateId: "",
    cityId: "",
    description: "",
    highlights: [],
    roomTypes: [],
    coordinates: { lat: 20.5937, lng: 78.9629 }
  })
  const [highlightsInput, setHighlightsInput] = useState("")
  const [roomTypesInput, setRoomTypesInput] = useState("")
  const [selectedFiles, setSelectedFiles] = useState([])
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

  const openForm = (type) => {
    setFormType(type)
    setFormData({
      name: "",
      stateId: "",
      cityId: "",
      description: "",
      highlights: [],
      roomTypes: [],
      coordinates: { lat: 20.5937, lng: 78.9629 }
    })
    setHighlightsInput("")
    setRoomTypesInput("")
    setCitySearch("")
    setSelectedFiles([])
    setDialogOpen(true)
  }


  const handleSubmit = async () => {
    if (!formData.name || !formData.cityId || !formData.coordinates) {
      addToast({
        title: "Error",
        description: "Please fill in all required fields and pick a location on the map",
        variant: "destructive"
      })
      return
    }

    // Normalize highlights and roomTypes to arrays
    let highlights = []
    if (typeof highlightsInput === "string" && highlightsInput.trim() !== "") {
      highlights = highlightsInput.split(",").map(h => h.trim()).filter(Boolean)
    } else if (Array.isArray(formData.highlights)) {
      highlights = formData.highlights
    }

    let roomTypes = []
    if (typeof roomTypesInput === "string" && roomTypesInput.trim() !== "") {
      roomTypes = roomTypesInput.split(",").map(r => r.trim()).filter(Boolean)
    } else if (Array.isArray(formData.roomTypes)) {
      roomTypes = formData.roomTypes
    }

    // Prepare payload - remove stateId, ensure category is correct
    const payload = {
      name: formData.name,
      cityId: formData.cityId,
      description: formData.description || "",
      coordinates: formData.coordinates
    }

    // Add type-specific fields
    if (formType === "destination") {
      payload.category = "destination"
      payload.highlights = highlights
    } else if (formType === "hidden_gem") {
      payload.category = "hidden_gem"
      payload.highlights = highlights
    } else if (formType === "hotel") {
      payload.roomTypes = roomTypes
    }

    try {
      await createMapPin({
        type: formType === "hidden_gem" ? "hidden_gem" : formType,
        ...payload
      }, selectedFiles)
      
      addToast({
        title: "Success",
        description: `${formType === "hidden_gem" ? "Hidden Gem" : formType} created successfully`
      })
      
      setDialogOpen(false)
      setFormData({
        name: "",
        stateId: "",
        cityId: "",
        description: "",
        highlights: [],
        roomTypes: [],
        coordinates: { lat: 20.5937, lng: 78.9629 }
      })
      setHighlightsInput("")
      setRoomTypesInput("")
      setCitySearch("")
      setSelectedFiles([])
    } catch (error) {
      console.error("Error creating item:", error)
      addToast({
        title: "Error",
        description: error.response?.data?.message || "Failed to create item",
        variant: "destructive"
      })
    }
  }

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-3xl font-bold text-foreground">Map Creation Tool</h1>
        <div className="flex gap-2">
          <Button onClick={() => openForm("hotel")}>Add Hotel</Button>
          <Button onClick={() => openForm("destination")}>Add Destination</Button>
          <Button onClick={() => openForm("hidden_gem")}>Add Hidden Gem</Button>
        </div>
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-4 gap-4">
        {/* Sidebar */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button
              variant="outline"
              className="w-full justify-start"
              onClick={() => openForm("hotel")}
            >
              Add Hotel
            </Button>
            <Button
              variant="outline"
              className="w-full justify-start"
              onClick={() => openForm("destination")}
            >
              Add Destination
            </Button>
            <Button
              variant="outline"
              className="w-full justify-start"
              onClick={() => openForm("hidden_gem")}
            >
              Add Hidden Gem
            </Button>
          </CardContent>
        </Card>

        {/* Map */}
        <div className="lg:col-span-3">
          <Card className="h-full">
            <CardContent className="p-0 h-full">
              <div className="h-full">
                <MapWrapper 
                  height="100%" 
                  center={[formData.coordinates.lat, formData.coordinates.lng]}
                  zoom={5}
                >
                  <MapClickHandler onMapClick={(e) => {
                    const { lat, lng } = e.latlng
                    setFormData(prev => ({
                      ...prev,
                      coordinates: { lat, lng }
                    }))
                  }} />
                  <Marker 
                    position={[formData.coordinates.lat, formData.coordinates.lng]}
                  >
                    <Popup>
                      <div className="p-2">
                        <p className="text-sm font-semibold">Selected Location</p>
                        <p className="text-xs text-muted-foreground">
                          {formData.coordinates.lat.toFixed(4)}, {formData.coordinates.lng.toFixed(4)}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Click on map to change location
                        </p>
                      </div>
                    </Popup>
                  </Marker>
                </MapWrapper>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Form Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              Add {formType === "hotel" ? "Hotel" : formType === "destination" ? "Destination" : formType === "hidden_gem" ? "Hidden Gem" : "Item"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <div>
              <Label>Name *</Label>
              <Input 
                placeholder={`Enter ${formType} name`}
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div>
              <Label>State *</Label>
              <Select
                value={formData.stateId}
                onChange={(e) => {
                  setFormData({ ...formData, stateId: e.target.value, cityId: "" })
                  setCitySearch("")
                }}
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
              <Label>City *</Label>
              <div className="space-y-2">
                <Input
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
                  value={formData.cityId}
                  onChange={(e) => {
                    setFormData({ ...formData, cityId: e.target.value })
                    const selectedCity = cities.find(c => c._id === e.target.value)
                    if (selectedCity) {
                      setCitySearch(selectedCity.name)
                    }
                  }}
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
            <div>
              <Label>Description</Label>
              <Textarea 
                placeholder="Enter description" 
                rows={3}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>
            {(formType === "destination" || formType === "hidden_gem") ? (
              <div>
                <Label>Highlights (comma-separated)</Label>
                <Input 
                  placeholder="e.g., Beautiful views, Cultural heritage, Adventure activities"
                  onChange={(e) => {
                    const highlights = e.target.value.split(',').map(h => h.trim()).filter(h => h)
                    setFormData({ ...formData, highlights })
                  }}
                />
              </div>
            ) : null}
            {formType === "hotel" && (
              <div>
                <Label>Room Types (comma-separated)</Label>
                <Input 
                  placeholder="e.g., Deluxe, Suite, Standard"
                  onChange={(e) => {
                    const roomTypes = e.target.value.split(',').map(r => r.trim()).filter(r => r)
                    setFormData({ ...formData, roomTypes })
                  }}
                />
              </div>
            )}
            <div>
              <Label>Images (up to 5)</Label>
              <Input 
                type="file"
                multiple
                accept="image/*"
                onChange={(e) => setSelectedFiles(Array.from(e.target.files).slice(0, 5))}
              />
              {selectedFiles.length > 0 && (
                <p className="text-xs text-muted-foreground mt-1">
                  {selectedFiles.length} file(s) selected
                </p>
              )}
            </div>
            <div className="bg-muted p-3 rounded-md">
              <Label className="text-xs text-muted-foreground">Coordinates</Label>
              <p className="text-sm">
                Lat: {formData.coordinates.lat.toFixed(4)}, Lng: {formData.coordinates.lng.toFixed(4)}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Click on the map to set coordinates
              </p>
            </div>
            <div className="flex gap-2">
              <Button className="flex-1" onClick={handleSubmit}>Save</Button>
              <Button variant="outline" onClick={() => setDialogOpen(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default MapTools
