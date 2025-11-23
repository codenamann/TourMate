import { useState } from "react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Select } from "@/components/ui/select"
import { Plus, Edit, Trash2 } from "lucide-react"

const Destinations = () => {
  const destinations = [
    { id: 1, name: "Taj Mahal", city: "Agra", category: "Popular", status: "Active" },
    { id: 2, name: "Golden Temple", city: "Amritsar", category: "Popular", status: "Active" },
    { id: 3, name: "Hidden Beach", city: "Goa", category: "Hidden Gem", status: "Active" },
  ]

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-foreground">Manage Destinations</h1>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Add Destination
        </Button>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="flex gap-4">
            <Input placeholder="Search destinations..." className="flex-1" />
            <Select>
              <option>All Categories</option>
              <option>Popular</option>
              <option>Hidden Gem</option>
            </Select>
            <Select>
              <option>All Cities</option>
              <option>Agra</option>
              <option>Amritsar</option>
              <option>Goa</option>
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
              {destinations.map((dest) => (
                <TableRow key={dest.id}>
                  <TableCell className="font-medium">{dest.name}</TableCell>
                  <TableCell>{dest.city}</TableCell>
                  <TableCell>
                    <Badge variant={dest.category === "Popular" ? "default" : "secondary"}>
                      {dest.category}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{dest.status}</Badge>
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

export default Destinations
