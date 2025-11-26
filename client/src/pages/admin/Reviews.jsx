import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Select } from "@/components/ui/select"
import { CheckCircle, XCircle, Star, Trash2 } from "lucide-react"
import { getPendingReviews, deleteReview } from "@/api/reviews"
import { useToast } from "@/components/ui/toast"

const Reviews = () => {
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const { addToast } = useToast()

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const response = await getPendingReviews()
        setReviews(response.data)
      } catch (error) {
        console.error("Error fetching reviews:", error)
        addToast({
          title: "Error",
          description: "Failed to load reviews",
          variant: "destructive"
        })
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [addToast])

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this review?")) {
      try {
        await deleteReview(id)
        setReviews(reviews.filter(r => r._id !== id))
        addToast({
          title: "Success",
          description: "Review deleted successfully"
        })
      } catch (error) {
        console.error("Error deleting review:", error)
        addToast({
          title: "Error",
          description: error.response?.data?.message || "Failed to delete review",
          variant: "destructive"
        })
      }
    }
  }

  const filteredReviews = reviews.filter(review => {
    const matchesSearch = !searchTerm || 
      review.comment?.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesSearch
  })

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-foreground">Moderate Reviews</h1>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="flex gap-4">
            <Input 
              placeholder="Search reviews..." 
              className="flex-1"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          {loading ? (
            <div className="p-8 text-center text-muted-foreground">Loading reviews...</div>
          ) : filteredReviews.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Type</TableHead>
                  <TableHead>Rating</TableHead>
                  <TableHead>Review</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredReviews.map((review) => (
                  <TableRow key={review._id}>
                    <TableCell>
                      <Badge variant="outline">
                        {review.targetType === "destination" ? "Destination" : "Hotel"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map((i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${
                              i <= review.rating ? "fill-accent text-accent" : "text-muted-foreground"
                            }`}
                          />
                        ))}
                        <span className="ml-1 text-sm">{review.rating}</span>
                      </div>
                    </TableCell>
                    <TableCell className="max-w-xs truncate">
                      {review.comment || "No comment"}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {new Date(review.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => handleDelete(review._id)}
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
            <div className="p-8 text-center text-muted-foreground">No reviews found</div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default Reviews
