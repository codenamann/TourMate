import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { MapPin } from "lucide-react"

const HotelsNew = () => {
  return (
    <div>
      <h1 className="text-3xl font-bold text-foreground mb-6">Add New Hotel</h1>

      <Card>
        <CardHeader>
          <CardTitle>Hotel Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="name">Hotel Name</Label>
              <Input id="name" placeholder="Enter hotel name" />
            </div>
            <div>
              <Label htmlFor="city">City</Label>
              <Input id="city" placeholder="Enter city" />
            </div>
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" placeholder="Enter hotel description" rows={4} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="rating">Rating</Label>
              <Select id="rating">
                <option>Select rating</option>
                <option>5 Stars</option>
                <option>4 Stars</option>
                <option>3 Stars</option>
                <option>2 Stars</option>
                <option>1 Star</option>
              </Select>
            </div>
            <div>
              <Label htmlFor="price">Price per Night (₹)</Label>
              <Input id="price" type="number" placeholder="5000" />
            </div>
          </div>

          <Separator />

          <div>
            <Label>Images</Label>
            <div className="mt-2 border-2 border-dashed border-border rounded-lg p-8 text-center">
              <p className="text-sm text-muted-foreground">Click to upload images</p>
              <p className="text-xs text-muted-foreground mt-1">PNG, JPG up to 10MB</p>
            </div>
          </div>

          <Separator />

          <div>
            <Label>Room Types</Label>
            <div className="mt-4 space-y-4">
              {[1, 2, 3].map((item) => (
                <Card key={item}>
                  <CardContent className="p-4">
                    <div className="grid grid-cols-2 gap-4">
                      <Input placeholder="Room type name" />
                      <Input type="number" placeholder="Price" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          <Separator />

          <div>
            <Label className="flex items-center gap-2 mb-2">
              <MapPin className="w-4 h-4" />
              Location (Map Picker)
            </Label>
            <div className="h-64 bg-muted rounded-lg flex items-center justify-center">
              <p className="text-muted-foreground">Map picker will appear here</p>
            </div>
          </div>

          <div className="flex gap-4">
            <Button>Save Hotel</Button>
            <Button variant="outline">Cancel</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default HotelsNew
