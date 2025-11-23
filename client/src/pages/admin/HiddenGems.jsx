import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Select } from "@/components/ui/select"
import { Plus, Edit, Trash2 } from "lucide-react"

const HiddenGems = () => {
  const hiddenGems = [
    { id: 1, name: "Secret Beach", city: "Goa", category: "Hidden Gem", status: "Active" },
    { id: 2, name: "Mountain Cave", city: "Himachal", category: "Hidden Gem", status: "Active" },
    { id: 3, name: "Ancient Temple", city: "Kerala", category: "Hidden Gem", status: "Active" },
  ]

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-foreground">Manage Hidden Gems</h1>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Add Hidden Gem
        </Button>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="flex gap-4">
            <Input placeholder="Search hidden gems..." className="flex-1" />
            <Select>
              <option>All Cities</option>
              <option>Goa</option>
              <option>Himachal</option>
              <option>Kerala</option>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>City</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {hiddenGems.map((gem) => (
                <TableRow key={gem.id}>
                  <TableCell className="font-medium">{gem.name}</TableCell>
                  <TableCell>{gem.city}</TableCell>
                  <TableCell>
                    <Badge variant="secondary">{gem.category}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{gem.status}</Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="icon">
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="icon">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}

export default HiddenGems
