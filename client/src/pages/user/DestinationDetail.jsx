import { useParams, Link, useNavigate } from 'react-router-dom'
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select } from "@/components/ui/select"
import { Star, Shield, MapPin, Calendar } from "lucide-react"
import { useState, useEffect } from "react"
import { getDestinationById } from "@/api/destinations"
import { getReviews, getSafetyReviews, createReview, createSafetyReview } from "@/api/reviews"
import { fetchItineraries, createItinerary, addItemToItinerary } from "@/api/itineraries"
import { useAuth } from "@/context/AuthContext"
import { useToast } from "@/components/ui/toast"

const DestinationDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user, isAuthenticated } = useAuth()
  const { addToast } = useToast()
  const [reviewDialogOpen, setReviewDialogOpen] = useState(false)
  const [destination, setDestination] = useState(null)
  const [reviews, setReviews] = useState([])
  const [safetyReviews, setSafetyReviews] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  
  // Review submission states
  const [reviewFormOpen, setReviewFormOpen] = useState(false)
  const [safetyReviewFormOpen, setSafetyReviewFormOpen] = useState(false)
  const [reviewRating, setReviewRating] = useState(5)
  const [reviewComment, setReviewComment] = useState("")
  const [safetyRating, setSafetyRating] = useState(5)
  const [safetyComment, setSafetyComment] = useState("")
  const [submittingReview, setSubmittingReview] = useState(false)
  
  // Add to itinerary states
  const [itineraryDialogOpen, setItineraryDialogOpen] = useState(false)
  const [itineraries, setItineraries] = useState([])
  const [selectedItineraryId, setSelectedItineraryId] = useState("")
  const [newItineraryName, setNewItineraryName] = useState("")
  const [selectedDay, setSelectedDay] = useState(1)
  const [addingToItinerary, setAddingToItinerary] = useState(false)

  const loadReviews = async () => {
    try {
      const [reviewsRes, safetyRes] = await Promise.all([
        getReviews({ targetType: "destination", targetId: id }),
        getSafetyReviews({ destinationId: id })
      ])
      setReviews(reviewsRes.data)
      setSafetyReviews(safetyRes.data)
    } catch (err) {
      console.error("Error fetching reviews:", err)
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const destRes = await getDestinationById(id)
        setDestination(destRes.data)
        await loadReviews()
      } catch (err) {
        console.error("Error fetching destination:", err)
        setError(err.response?.data?.message || "Failed to load destination")
      } finally {
        setLoading(false)
      }
    }
    if (id) {
      fetchData()
    }
  }, [id])

  const loadItineraries = async () => {
    if (!isAuthenticated) return
    try {
      const response = await fetchItineraries()
      setItineraries(response.data)
    } catch (error) {
      console.error("Error fetching itineraries:", error)
    }
  }

  useEffect(() => {
    if (itineraryDialogOpen && isAuthenticated) {
      loadItineraries()
    }
  }, [itineraryDialogOpen, isAuthenticated])

  const handleSubmitReview = async () => {
    if (!reviewRating) {
      addToast({
        title: "Error",
        description: "Please select a rating",
        variant: "destructive"
      })
      return
    }

    setSubmittingReview(true)
    try {
      await createReview({
        targetType: "destination",
        targetId: id,
        rating: reviewRating,
        comment: reviewComment
      })
      addToast({
        title: "Success",
        description: "Review submitted successfully"
      })
      setReviewFormOpen(false)
      setReviewComment("")
      setReviewRating(5)
      loadReviews()
    } catch (error) {
      console.error("Error submitting review:", error)
      addToast({
        title: "Error",
        description: error.response?.data?.message || "Failed to submit review",
        variant: "destructive"
      })
    } finally {
      setSubmittingReview(false)
    }
  }

  const handleSubmitSafetyReview = async () => {
    if (!safetyRating) {
      addToast({
        title: "Error",
        description: "Please select a rating",
        variant: "destructive"
      })
      return
    }

    setSubmittingReview(true)
    try {
      await createSafetyReview({
        destinationId: id,
        safetyRating: safetyRating,
        comment: safetyComment
      })
      addToast({
        title: "Success",
        description: "Safety review submitted successfully"
      })
      setSafetyReviewFormOpen(false)
      setSafetyComment("")
      setSafetyRating(5)
      loadReviews()
    } catch (error) {
      console.error("Error submitting safety review:", error)
      addToast({
        title: "Error",
        description: error.response?.data?.message || "Failed to submit safety review",
        variant: "destructive"
      })
    } finally {
      setSubmittingReview(false)
    }
  }

  const handleAddToItinerary = async () => {
    if (!selectedItineraryId && !newItineraryName.trim()) {
      addToast({
        title: "Error",
        description: "Please select an itinerary or create a new one",
        variant: "destructive"
      })
      return
    }

    setAddingToItinerary(true)
    try {
      let itineraryId = selectedItineraryId

      // Create new itinerary if needed
      if (!itineraryId && newItineraryName.trim()) {
        const createRes = await createItinerary({
          name: newItineraryName,
          startDate: null,
          endDate: null,
          items: []
        })
        itineraryId = createRes.data._id
        // Refresh itineraries list
        await loadItineraries()
      }

      if (!itineraryId) {
        throw new Error("Itinerary ID is required")
      }

      // Determine day number
      let dayToUse = selectedDay
      if (selectedItineraryId) {
        const selectedItinerary = itineraries.find(it => it._id === selectedItineraryId)
        if (selectedItinerary && selectedItinerary.items && selectedItinerary.items.length > 0) {
          const maxDay = Math.max(...selectedItinerary.items.map(i => i.day || 1))
          if (selectedDay <= maxDay) {
            dayToUse = selectedDay
          } else {
            dayToUse = maxDay + 1
          }
        } else {
          dayToUse = 1
        }
      }

      // Get destination coordinates if available
      const coordinates = destination?.coordinates || null

      // Add item to itinerary using the new endpoint
      await addItemToItinerary(itineraryId, {
        type: "destination",
        refId: id,
        day: dayToUse,
        startTime: null,
        endTime: null,
        note: "",
        coordinates: coordinates
      })

      const itineraryName = itineraries.find(it => it._id === itineraryId)?.name || newItineraryName || "itinerary"
      addToast({
        title: "Success",
        description: `Added to ${itineraryName} (Day ${dayToUse})`
      })
      setItineraryDialogOpen(false)
      setSelectedItineraryId("")
      setNewItineraryName("")
      setSelectedDay(1)
    } catch (error) {
      console.error("Error adding to itinerary:", error)
      const errorMessage = error.response?.data?.message || error.message || "Failed to add to itinerary"
      if (errorMessage.includes("not found")) {
        addToast({
          title: "Error",
          description: "Itinerary not found. Please try again.",
          variant: "destructive"
        })
      } else {
        addToast({
          title: "Error",
          description: errorMessage,
          variant: "destructive"
        })
      }
    } finally {
      setAddingToItinerary(false)
    }
  }

  // Calculate average ratings
  const avgRating = reviews.length > 0 
    ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length 
    : 0
  const avgSafetyRating = safetyReviews.length > 0
    ? safetyReviews.reduce((sum, r) => sum + r.safetyRating, 0) / safetyReviews.length
    : 0

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12 text-muted-foreground">Loading destination...</div>
      </div>
    )
  }

  if (error || !destination) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <p className="text-destructive mb-4">{error || "Destination not found"}</p>
          <Button asChild>
            <Link to="/explore">Back to Explore</Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Image Banner */}
      <div className="h-64 md:h-96 bg-muted rounded-lg mb-6 overflow-hidden">
        {destination.images && destination.images.length > 0 ? (
          <img 
            src={destination.images[0]} 
            alt={destination.name} 
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <MapPin className="w-16 h-16 text-muted-foreground" />
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="flex items-center gap-4 mb-4">
            <h1 className="text-3xl font-bold text-foreground">
              {destination.name}
            </h1>
            <Badge variant="secondary">
              {destination.category === "hidden_gem" ? "Hidden Gem" : "Popular"}
            </Badge>
          </div>
          <p className="text-muted-foreground mb-2">
            {destination.cityId?.name ? `${destination.cityId.name}${destination.cityId.stateId?.name ? `, ${destination.cityId.stateId.name}` : ""}` : "India"}
          </p>
          <p className="text-muted-foreground mb-6">
            {destination.description || "No description available."}
          </p>

          {/* Highlights Section */}
          {destination.highlights && destination.highlights.length > 0 && (
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Highlights</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                  {destination.highlights.map((highlight, idx) => (
                    <li key={idx}>{highlight}</li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}

          {/* Safety Rating */}
          {(avgSafetyRating > 0 || avgRating > 0) && (
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  Safety & Experience
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4">
                  {avgSafetyRating > 0 && (
                    <>
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Safety Rating</p>
                        <div className="flex items-center gap-1">
                          {[1, 2, 3, 4, 5].map((i) => (
                            <Star 
                              key={i} 
                              className={`w-5 h-5 ${i <= Math.round(avgSafetyRating) ? 'fill-accent text-accent' : 'text-muted-foreground'}`} 
                            />
                          ))}
                          <span className="ml-2 text-sm font-medium">{avgSafetyRating.toFixed(1)}</span>
                        </div>
                      </div>
                      {avgRating > 0 && <Separator orientation="vertical" className="h-12" />}
                    </>
                  )}
                  {avgRating > 0 && (
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Experience Rating</p>
                      <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map((i) => (
                          <Star 
                            key={i} 
                            className={`w-5 h-5 ${i <= Math.round(avgRating) ? 'fill-accent text-accent' : 'text-muted-foreground'}`} 
                          />
                        ))}
                        <span className="ml-2 text-sm font-medium">{avgRating.toFixed(1)}</span>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Reviews Section */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Reviews ({reviews.length})</CardTitle>
                {reviews.length > 0 && (
                  <Button variant="outline" onClick={() => setReviewDialogOpen(true)}>
                    View All Reviews
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {reviews.length > 0 ? (
                <div className="space-y-4">
                  {reviews.slice(0, 2).map((review) => (
                    <div key={review._id} className="border-b border-border pb-4 last:border-0">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="flex">
                          {[1, 2, 3, 4, 5].map((i) => (
                            <Star 
                              key={i} 
                              className={`w-4 h-4 ${i <= review.rating ? 'fill-accent text-accent' : 'text-muted-foreground'}`} 
                            />
                          ))}
                        </div>
                        <span className="text-sm font-medium">User Review</span>
                        <span className="text-xs text-muted-foreground ml-auto">
                          {new Date(review.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {review.comment || "No comment provided."}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">No reviews yet. Be the first to review!</p>
              )}
            </CardContent>
          </Card>
        </div>

        <div>
          <Card className="sticky top-4">
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button 
                className="w-full" 
                size="lg"
                onClick={() => {
                  if (!isAuthenticated) {
                    navigate("/login")
                  } else {
                    setItineraryDialogOpen(true)
                  }
                }}
              >
                <Calendar className="w-4 h-4 mr-2" />
                Add to Itinerary
              </Button>
              {isAuthenticated ? (
                <>
                  <Button 
                    variant="outline" 
                    className="w-full" 
                    onClick={() => setReviewFormOpen(true)}
                  >
                    Write a Review
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full" 
                    onClick={() => setSafetyReviewFormOpen(true)}
                  >
                    Write Safety Review
                  </Button>
                </>
              ) : (
                <Button variant="outline" className="w-full" asChild>
                  <Link to="/login">
                    Login to Write Reviews
                  </Link>
                </Button>
              )}
              <Button variant="outline" className="w-full" asChild>
                <Link to={`/map?destination=${id}`}>
                  View on Map
                </Link>
              </Button>
              <Button variant="outline" className="w-full" asChild>
                <Link to={`/hotels?cityId=${destination.cityId?._id}`}>
                  Find Hotels Nearby
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Review Dialog */}
      <Dialog open={reviewDialogOpen} onOpenChange={setReviewDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>All Reviews ({reviews.length})</DialogTitle>
            <DialogDescription>Read what other travelers have to say</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            {reviews.length > 0 ? (
              reviews.map((review) => (
                <div key={review._id} className="border-b border-border pb-4">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((i) => (
                        <Star 
                          key={i} 
                          className={`w-4 h-4 ${i <= review.rating ? 'fill-accent text-accent' : 'text-muted-foreground'}`} 
                        />
                      ))}
                    </div>
                    <span className="text-sm font-medium">User Review</span>
                    <span className="text-xs text-muted-foreground ml-auto">
                      {new Date(review.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {review.comment || "No comment provided."}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-center text-muted-foreground py-8">No reviews yet.</p>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Add to Itinerary Dialog */}
      <Dialog open={itineraryDialogOpen} onOpenChange={setItineraryDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add to Itinerary</DialogTitle>
            <DialogDescription>Select an existing itinerary or create a new one</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <div>
              <Label>Select Itinerary</Label>
              <Select
                value={selectedItineraryId}
                onChange={(e) => {
                  setSelectedItineraryId(e.target.value)
                  setNewItineraryName("")
                }}
              >
                <option value="">Choose an itinerary...</option>
                {itineraries.map((it) => (
                  <option key={it._id} value={it._id}>
                    {it.name} ({it.items?.length || 0} items)
                  </option>
                ))}
              </Select>
            </div>
            <div className="text-center text-sm text-muted-foreground">OR</div>
            <div>
              <Label>Create New Itinerary</Label>
              <Input
                placeholder="Enter itinerary name"
                value={newItineraryName}
                onChange={(e) => {
                  setNewItineraryName(e.target.value)
                  setSelectedItineraryId("")
                }}
              />
            </div>
            {selectedItineraryId && (() => {
              const selectedItinerary = itineraries.find(it => it._id === selectedItineraryId)
              const maxDay = selectedItinerary?.items?.length > 0 
                ? Math.max(...selectedItinerary.items.map(i => i.day || 1))
                : 0
              return (
                <div>
                  <Label>Day (optional)</Label>
                  <Input
                    type="number"
                    min="1"
                    value={selectedDay}
                    placeholder={`Default: ${maxDay + 1}`}
                    onChange={(e) => {
                      const day = parseInt(e.target.value) || maxDay + 1
                      setSelectedDay(day)
                    }}
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Default: Day {maxDay + 1}
                  </p>
                </div>
              )
            })()}
            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={() => {
                setItineraryDialogOpen(false)
                setSelectedItineraryId("")
                setNewItineraryName("")
              }}>
                Cancel
              </Button>
              <Button onClick={handleAddToItinerary} disabled={addingToItinerary}>
                {addingToItinerary ? "Adding..." : "Add"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Review Form Dialog */}
      <Dialog open={reviewFormOpen} onOpenChange={setReviewFormOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Write a Review</DialogTitle>
            <DialogDescription>Share your experience at this destination</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <div>
              <Label>Rating *</Label>
              <Select
                value={reviewRating}
                onChange={(e) => setReviewRating(parseInt(e.target.value))}
              >
                <option value={5}>5 - Excellent</option>
                <option value={4}>4 - Very Good</option>
                <option value={3}>3 - Good</option>
                <option value={2}>2 - Fair</option>
                <option value={1}>1 - Poor</option>
              </Select>
            </div>
            <div>
              <Label>Comment</Label>
              <Textarea
                placeholder="Share your experience..."
                rows={4}
                value={reviewComment}
                onChange={(e) => setReviewComment(e.target.value)}
              />
            </div>
            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={() => setReviewFormOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSubmitReview} disabled={submittingReview}>
                {submittingReview ? "Submitting..." : "Submit Review"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Safety Review Form Dialog */}
      <Dialog open={safetyReviewFormOpen} onOpenChange={setSafetyReviewFormOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Write a Safety Review</DialogTitle>
            <DialogDescription>Rate the safety level of this destination</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <div>
              <Label>Safety Rating *</Label>
              <Select
                value={safetyRating}
                onChange={(e) => setSafetyRating(parseInt(e.target.value))}
              >
                <option value={5}>5 - Very Safe</option>
                <option value={4}>4 - Safe</option>
                <option value={3}>3 - Moderate</option>
                <option value={2}>2 - Some Concerns</option>
                <option value={1}>1 - Unsafe</option>
              </Select>
            </div>
            <div>
              <Label>Comment</Label>
              <Textarea
                placeholder="Share safety-related information..."
                rows={4}
                value={safetyComment}
                onChange={(e) => setSafetyComment(e.target.value)}
              />
            </div>
            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={() => setSafetyReviewFormOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSubmitSafetyReview} disabled={submittingReview}>
                {submittingReview ? "Submitting..." : "Submit Safety Review"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default DestinationDetail
