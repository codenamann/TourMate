import { useState } from "react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select } from "@/components/ui/select"
import MapWrapper from "@/components/map/MapWrapper"
import { createMapPin } from "@/api/admin"

const MapTools = () => {
  const [dialogOpen, setDialogOpen] = useState(false)
  const [formType, setFormType] = useState("hotel")
  const [formData, setFormData] = useState({
    name: "",
    cityId: "",
    description: "",
    coordinates: { lat: 20.5937, lng: 78.9629 }
  })

  const openForm = (type) => {
    setFormType(type)
    setFormData({
      name: "",
      cityId: "",
      description: "",
      coordinates: { lat: 20.5937, lng: 78.9629 }
    })
    setDialogOpen(true)
  }

  const handleSubmit = async () => {
    try {
      await createMapPin({
        type: formType,
        ...formData
      })
      alert(`${formType} created successfully`)
      setDialogOpen(false)
      setFormData({
        name: "",
        cityId: "",
        description: "",
        coordinates: { lat: 20.5937, lng: 78.9629 }
      })
    } catch (error) {
      console.error("Error creating item:", error)
      alert("Failed to create item")
    }
  }

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-3xl font-bold text-foreground">Map Creation Tool</h1>
        <div className="flex gap-2">
          <Button onClick={() => openForm("hotel")}>Add Hotel</Button>
          <Button onClick={() => openForm("destination")}>Add Destination</Button>
          <Button onClick={() => openForm("hidden-gem")}>Add Hidden Gem</Button>
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
              onClick={() => openForm("hidden-gem")}
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
                <MapWrapper height="100%" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Form Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              Add {formType === "hotel" ? "Hotel" : formType === "destination" ? "Destination" : "Hidden Gem"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <div>
              <Label>Name</Label>
              <Input 
                placeholder={`Enter ${formType} name`}
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            {formType === "hotel" && (
              <>
                <div>
                  <Label>City</Label>
                  <Input placeholder="Enter city" />
                </div>
                <div>
                  <Label>Rating</Label>
                  <Select>
                    <option>Select rating</option>
                    <option>5 Stars</option>
                    <option>4 Stars</option>
                    <option>3 Stars</option>
                  </Select>
                </div>
              </>
            )}
            <div>
              <Label>Description</Label>
              <Textarea 
                placeholder="Enter description" 
                rows={3}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
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
