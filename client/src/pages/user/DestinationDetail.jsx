import { useParams } from 'react-router-dom'
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Star, Shield, MapPin, Calendar } from "lucide-react"
import { useState } from "react"

const DestinationDetail = () => {
  const { id } = useParams()
  const [reviewDialogOpen, setReviewDialogOpen] = useState(false)

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Image Banner */}
      <div className="h-64 md:h-96 bg-muted rounded-lg mb-6 flex items-center justify-center">
        <MapPin className="w-16 h-16 text-muted-foreground" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <h1 className="text-3xl font-bold text-foreground mb-4">
            Destination {id}
          </h1>
          <p className="text-muted-foreground mb-6">
            Detailed description of the destination will appear here. This includes information about the location, 
            attractions, best time to visit, and more.
          </p>

          {/* Highlights Section */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Highlights</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                <li>Beautiful landscapes</li>
                <li>Rich cultural heritage</li>
                <li>Delicious local cuisine</li>
                <li>Adventure activities</li>
              </ul>
            </CardContent>
          </Card>

          {/* Safety Rating */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Safety & Experience
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Safety Rating</p>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <Star key={i} className="w-5 h-5 fill-accent text-accent" />
                    ))}
                  </div>
                </div>
                <Separator orientation="vertical" className="h-12" />
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Experience Rating</p>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <Star key={i} className="w-5 h-5 fill-accent text-accent" />
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Reviews Section */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Reviews</CardTitle>
                <Button variant="outline" onClick={() => setReviewDialogOpen(true)}>
                  View All Reviews
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[1, 2].map((review) => (
                  <div key={review} className="border-b border-border pb-4 last:border-0">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="flex">
                        {[1, 2, 3, 4, 5].map((i) => (
                          <Star key={i} className="w-4 h-4 fill-accent text-accent" />
                        ))}
                      </div>
                      <span className="text-sm font-medium">User {review}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Review content will appear here...
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card className="sticky top-4">
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button className="w-full" size="lg">
                <Calendar className="w-4 h-4 mr-2" />
                Add to Itinerary
              </Button>
              <Button variant="outline" className="w-full">
                View on Map
              </Button>
              <Button variant="outline" className="w-full">
                Find Hotels Nearby
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Review Dialog */}
      <Dialog open={reviewDialogOpen} onOpenChange={setReviewDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>All Reviews</DialogTitle>
            <DialogDescription>Read what other travelers have to say</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            {[1, 2, 3, 4, 5].map((review) => (
              <div key={review} className="border-b border-border pb-4">
                <div className="flex items-center gap-2 mb-2">
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <Star key={i} className="w-4 h-4 fill-accent text-accent" />
                    ))}
                  </div>
                  <span className="text-sm font-medium">User {review}</span>
                  <Badge variant="secondary" className="ml-auto">Verified</Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  Detailed review content will appear here...
                </p>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default DestinationDetail
