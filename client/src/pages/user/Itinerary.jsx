import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { MapPin, Clock, Calendar } from "lucide-react"

const Itinerary = () => {
  const days = [1, 2, 3, 4, 5]

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-foreground mb-2">My Itinerary</h1>
        <p className="text-muted-foreground">Manage your travel plans</p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>7-Day India Tour</CardTitle>
            <Button variant="outline">Edit Itinerary</Button>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="day1" className="w-full">
            <TabsList className="grid w-full grid-cols-5">
              {days.map((day) => (
                <TabsTrigger key={day} value={`day${day}`}>
                  Day {day}
                </TabsTrigger>
              ))}
            </TabsList>

            {days.map((day) => (
              <TabsContent key={day} value={`day${day}`} className="mt-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-2 mb-4">
                    <Calendar className="w-5 h-5 text-accent" />
                    <h3 className="text-lg font-semibold">Day {day} Schedule</h3>
                  </div>

                  {[1, 2, 3].map((activity) => (
                    <Card key={activity}>
                      <CardContent className="p-4">
                        <div className="flex items-start gap-4">
                          <div className="flex-shrink-0">
                            <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center">
                              <MapPin className="w-6 h-6 text-accent" />
                            </div>
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="font-semibold">Activity {activity}</h4>
                              <Badge variant="secondary">Morning</Badge>
                            </div>
                            <p className="text-sm text-muted-foreground mb-2">
                              Description of the activity will appear here...
                            </p>
                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                              <div className="flex items-center gap-1">
                                <Clock className="w-4 h-4" />
                                <span>2 hours</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <MapPin className="w-4 h-4" />
                                <span>Location</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}

                  <Separator />

                  <div className="p-4 bg-muted rounded-lg">
                    <p className="text-sm text-muted-foreground">
                      Estimated daily budget: ₹{3000 + day * 500}
                    </p>
                  </div>
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>

      <div className="mt-6 flex gap-4">
        <Button>Save Itinerary</Button>
        <Button variant="outline">Export PDF</Button>
        <Button variant="outline">Share</Button>
      </div>
    </div>
  )
}

export default Itinerary
