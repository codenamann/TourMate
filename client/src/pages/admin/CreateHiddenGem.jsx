import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { MapPin } from "lucide-react"
import { createHiddenGem } from "@/api/admin"
import { getStates, getCitiesByState, searchCities } from "@/api/states"
import { useToast } from "@/components/ui/toast"
import MapLocationPicker from "@/components/admin/MapLocationPicker"

const CreateHiddenGem = () => {
  const navigate = useNavigate()
  const [states, setStates] = useState([])
  const [cities, setCities] = useState([])
  const [citySearch, setCitySearch] = useState("")
  const [formData, setFormData] = useState({
    name: "",
    stateId: "",
    cityId: "",
    category: "hidden_gem",
    description: "",
    highlights: [],
    coordinates: null
  })
  const [highlightsInput, setHighlightsInput] = useState("")
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

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!formData.name || !formData.cityId || !formData.coordinates) {
      addToast({
        title: "Error",
        description: "Please fill in all required fields and pick a location on the map",
        variant: "destructive"
      })
      return
    }

    setLoading(true)
    try {
      await createHiddenGem(formData, selectedFiles)
      addToast({
        title: "Success",
        description: "Hidden gem created successfully"
      })
      navigate("/admin/hidden-gems")
    } catch (error) {
      console.error("Error creating hidden gem:", error)
      addToast({
        title: "Error",
        description: error.response?.data?.message || "Failed to create hidden gem",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-foreground mb-6">Create New Hidden Gem</h1>

      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>Hidden Gem Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="name">Name *</Label>
                <Input 
                  id="name" 
                  placeholder="Enter hidden gem name"
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
                placeholder="Enter description" 
                rows={4}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>

            <div>
              <Label htmlFor="highlights">Highlights (comma-separated)</Label>
              <Input 
                id="highlights"
                placeholder="e.g., Beautiful views, Cultural heritage, Adventure activities"
                value={highlightsInput}
                onChange={(e) => {
                  setHighlightsInput(e.target.value)
                  const highlights = e.target.value.split(',').map(h => h.trim()).filter(h => h)
                  setFormData({ ...formData, highlights })
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

            <div className="flex gap-4">
              <Button type="submit" disabled={loading}>
                {loading ? "Creating..." : "Create Hidden Gem"}
              </Button>
              <Button type="button" variant="outline" onClick={() => navigate("/admin/hidden-gems")}>
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
            <DialogTitle>Pick Hidden Gem Location</DialogTitle>
          </DialogHeader>
          <div className="mt-4">
            <MapLocationPicker
              initialCenter={formData.cityId ? 
                cities.find(c => c._id === formData.cityId)?.coordinates ? 
                  [cities.find(c => c._id === formData.cityId).coordinates.lat, cities.find(c => c._id === formData.cityId).coordinates.lng] 
                  : [20.5937, 78.9629]
                : [20.5937, 78.9629]
              }
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

export default CreateHiddenGem

