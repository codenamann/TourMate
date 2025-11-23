import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Hotel, MapPin, Gem, MessageSquare } from "lucide-react"

const Dashboard = () => {
  const stats = [
    { title: "Total Hotels", value: "125", icon: Hotel, color: "text-accent" },
    { title: "Total Destinations", value: "48", icon: MapPin, color: "text-accent" },
    { title: "Hidden Gems", value: "32", icon: Gem, color: "text-accent" },
    { title: "Pending Reviews", value: "12", icon: MessageSquare, color: "text-destructive" },
  ]

  return (
    <div>
      <h1 className="text-3xl font-bold text-foreground mb-6">Admin Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => {
          const Icon = stat.icon
          return (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                <Icon className={`h-4 w-4 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  {stat.title === "Pending Reviews" ? "Requires attention" : "Active listings"}
                </p>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[1, 2, 3, 4].map((item) => (
                <div key={item} className="flex items-center justify-between border-b border-border pb-3 last:border-0">
                  <div>
                    <p className="text-sm font-medium">Activity {item}</p>
                    <p className="text-xs text-muted-foreground">2 hours ago</p>
                  </div>
                  <Badge variant="secondary">New</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <button className="w-full text-left p-3 rounded-md hover:bg-accent transition-colors">
                Add New Hotel
              </button>
              <button className="w-full text-left p-3 rounded-md hover:bg-accent transition-colors">
                Add New Destination
              </button>
              <button className="w-full text-left p-3 rounded-md hover:bg-accent transition-colors">
                Moderate Reviews
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default Dashboard
