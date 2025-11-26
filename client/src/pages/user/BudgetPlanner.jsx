import { useState } from "react"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Wallet, MapPin } from "lucide-react"
import { planBudget } from "@/api/budget"

const BudgetPlanner = () => {
  const [budget, setBudget] = useState("")
  const [days, setDays] = useState("")
  const [travelType, setTravelType] = useState("")
  const [comfortLevel, setComfortLevel] = useState("")
  const [recommendations, setRecommendations] = useState([])
  const [loading, setLoading] = useState(false)

  const handleGenerate = async () => {
    if (!budget || !days || !travelType || !comfortLevel) {
      alert("Please fill all fields")
      return
    }
    setLoading(true)
    try {
      const response = await planBudget({
        budget: Number(budget),
        days: Number(days),
        travelType,
        comfortLevel,
        startingCityId: null
      })
      setRecommendations(response.data.eligibleCities || [])
    } catch (error) {
      console.error("Error generating budget plan:", error)
      alert("Error generating recommendations")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Budget Planner</h1>
        <p className="text-muted-foreground">
          Get AI-assisted recommendations based on your budget and preferences
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Form Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Wallet className="w-5 h-5" />
              Plan Your Budget
            </CardTitle>
            <CardDescription>Enter your travel details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="budget">Total Budget (₹)</Label>
              <Input
                id="budget"
                type="number"
                placeholder="50000"
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="days">Number of Days</Label>
              <Input
                id="days"
                type="number"
                placeholder="7"
                value={days}
                onChange={(e) => setDays(e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="travel-type">Travel Type</Label>
              <Select
                id="travel-type"
                value={travelType}
                onChange={(e) => setTravelType(e.target.value)}
              >
                <option value="">Select type</option>
                <option value="solo">Solo</option>
                <option value="couple">Couple</option>
                <option value="family">Family</option>
                <option value="friends">Friends</option>
              </Select>
            </div>

            <div>
              <Label htmlFor="comfort">Comfort Level</Label>
              <Select
                id="comfort"
                value={comfortLevel}
                onChange={(e) => setComfortLevel(e.target.value)}
              >
                <option value="">Select level</option>
                <option value="budget">Budget</option>
                <option value="mid-range">Mid-range</option>
                <option value="luxury">Luxury</option>
              </Select>
            </div>

            <Separator />

            <Button className="w-full" size="lg" onClick={handleGenerate} disabled={loading}>
              {loading ? "Generating..." : "Generate Recommendations"}
            </Button>
          </CardContent>
        </Card>

        {/* Results Section */}
        <Card>
          <CardHeader>
            <CardTitle>Recommended Cities</CardTitle>
            <CardDescription>Based on your budget and preferences</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 max-h-[600px] overflow-y-auto">
              {recommendations.length > 0 ? (
                recommendations.map((rec, index) => (
                  <div key={rec.city?._id || index} className="border border-border rounded-lg p-4 hover:bg-muted/50 transition-colors">
                    <div className="flex items-center gap-2 mb-3">
                      <MapPin className="w-5 h-5 text-accent" />
                      <h3 className="font-semibold">{rec.city?.name || `City ${index + 1}`}</h3>
                      {rec.city?.state && (
                        <span className="text-xs text-muted-foreground">, {rec.city.state}</span>
                      )}
                    </div>
                    <div className="space-y-2 mb-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Estimated Cost:</span>
                        <span className="font-semibold">₹{rec.estimatedCost?.toLocaleString() || "N/A"}</span>
                      </div>
                      {rec.dailyBudget && (
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Daily Budget:</span>
                          <span>₹{rec.dailyBudget?.toLocaleString()}</span>
                        </div>
                      )}
                      {rec.estimatedTransport && (
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Transport:</span>
                          <span>₹{rec.estimatedTransport?.toLocaleString()}</span>
                        </div>
                      )}
                    </div>
                    {rec.breakdown && (
                      <div className="text-xs text-muted-foreground mb-3 space-y-1">
                        <div>Stay: ₹{rec.breakdown.stay?.toLocaleString()}</div>
                        <div>Food: ₹{rec.breakdown.food?.toLocaleString()}</div>
                        <div>Travel: ₹{rec.breakdown.travel?.toLocaleString()}</div>
                        <div>Misc: ₹{rec.breakdown.misc?.toLocaleString()}</div>
                      </div>
                    )}
                    <div className="flex gap-2">
                      <Badge 
                        variant={rec.affordability === "affordable" ? "default" : "destructive"}
                        className="text-xs"
                      >
                        {rec.affordability === "affordable" ? "Within Budget" : "Over Budget"}
                      </Badge>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-4 bg-muted rounded-lg">
                  <p className="text-sm text-muted-foreground text-center">
                    Enter your details and click "Generate Recommendations" to see AI-suggested destinations
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default BudgetPlanner
