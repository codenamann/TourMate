import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Calendar, Plus, Trash2, Edit2, Clock, MapPin } from "lucide-react";
import {
  getItineraryById,
  updateItinerary,
  deleteItineraryItem,
  addItemToItinerary,
  updateItineraryItem,
} from "@/api/itineraries";
import { getDestinations } from "@/api/destinations";
import { getHotels } from "@/api/hotels";
import { useToast } from "@/components/ui/toast";

const ItineraryDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToast } = useToast();
  const [itinerary, setItinerary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedDay, setSelectedDay] = useState(1);
  const [addItemDialogOpen, setAddItemDialogOpen] = useState(false);
  const [editItemDialogOpen, setEditItemDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [destinations, setDestinations] = useState([]);
  const [hotels, setHotels] = useState([]);
  const [itemForm, setItemForm] = useState({
    type: "Destination",
    refId: "",
    day: 1,
    startTime: "",
    endTime: "",
    note: "",
  });

  useEffect(() => {
    loadItinerary();
    loadOptions();
  }, [id]);

  const loadItinerary = async () => {
    try {
      setLoading(true);
      const response = await getItineraryById(id);
      setItinerary(response.data);
      // Set selected day to first day with items, or day 1
      if (response.data.items && response.data.items.length > 0) {
        const days = response.data.items.map((i) => i.day).filter(Boolean);
        if (days.length > 0) {
          setSelectedDay(Math.min(...days));
        }
      }
    } catch (error) {
      console.error("Error loading itinerary:", error);
      addToast({
        title: "Error",
        description:
          error.response?.data?.message || "Failed to load itinerary",
        variant: "destructive",
      });
      navigate("/itinerary");
    } finally {
      setLoading(false);
    }
  };

  const loadOptions = async () => {
    try {
      const [destsRes, hotelsRes] = await Promise.all([
        getDestinations(),
        getHotels(),
      ]);
      setDestinations(destsRes.data || []);
      setHotels(hotelsRes.data || []);
    } catch (error) {
      console.error("Error loading options:", error);
    }
  };

  const getDays = () => {
    if (!itinerary || !itinerary.items || itinerary.items.length === 0) {
      return [1];
    }
    const days = new Set();
    itinerary.items.forEach((item) => {
      if (item.day) days.add(item.day);
    });
    const sortedDays = Array.from(days).sort((a, b) => a - b);
    return sortedDays.length > 0 ? sortedDays : [1];
  };

  const getItemsForDay = (day) => {
    if (!itinerary || !itinerary.items) return [];
    return itinerary.items.filter((item) => item.day === day);
  };

  const handleAddItem = async () => {
    if (!itemForm.refId) {
      addToast({
        title: "Error",
        description: "Please select a destination or hotel",
        variant: "destructive",
      });
      return;
    }

    try {
      await addItemToItinerary(id, {
        type: itemForm.type,
        refId: itemForm.refId,
        day: itemForm.day || selectedDay,
        startTime: itemForm.startTime || null,
        endTime: itemForm.endTime || null,
        note: itemForm.note || "",
        coordinates: null,
      });
      addToast({
        title: "Success",
        description: "Item added to itinerary",
      });
      setAddItemDialogOpen(false);
      setItemForm({
        type: "Destination",
        refId: "",
        day: selectedDay,
        startTime: "",
        endTime: "",
        note: "",
      });
      loadItinerary();
    } catch (error) {
      console.error("Error adding item:", error);
      addToast({
        title: "Error",
        description: error.response?.data?.message || "Failed to add item",
        variant: "destructive",
      });
    }
  };

  const handleEditItem = async () => {
    if (!editingItem) return;

    try {
      await updateItineraryItem(id, editingItem._id, {
        day: itemForm.day,
        startTime: itemForm.startTime || null,
        endTime: itemForm.endTime || null,
        note: itemForm.note || "",
      });
      addToast({
        title: "Success",
        description: "Item updated",
      });
      setEditItemDialogOpen(false);
      setEditingItem(null);
      loadItinerary();
    } catch (error) {
      console.error("Error updating item:", error);
      addToast({
        title: "Error",
        description: error.response?.data?.message || "Failed to update item",
        variant: "destructive",
      });
    }
  };

  const handleDeleteItem = async (itemId) => {
    if (!window.confirm("Are you sure you want to remove this item?")) {
      return;
    }

    try {
      await deleteItineraryItem(id, itemId);
      addToast({
        title: "Success",
        description: "Item removed from itinerary",
      });
      loadItinerary();
    } catch (error) {
      console.error("Error deleting item:", error);
      addToast({
        title: "Error",
        description: error.response?.data?.message || "Failed to remove item",
        variant: "destructive",
      });
    }
  };

  const openEditDialog = (item) => {
    setEditingItem(item);
    setItemForm({
      type: item.type,
      refId: item.refId?._id || item.refId,
      day: item.day || selectedDay,
      startTime: item.startTime || "",
      endTime: item.endTime || "",
      note: item.note || "",
    });
    setEditItemDialogOpen(true);
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12 text-muted-foreground">
          Loading itinerary...
        </div>
      </div>
    );
  }

  if (!itinerary) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <p className="text-destructive mb-4">Itinerary not found</p>
          <Button asChild>
            <Link to="/itinerary">Back to Itineraries</Link>
          </Button>
        </div>
      </div>
    );
  }

  const days = getDays();
  const currentDayItems = getItemsForDay(selectedDay);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Button
          variant="outline"
          onClick={() => navigate("/itinerary")}
          className="mb-4"
        >
          ← Back to Itineraries
        </Button>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">
              {itinerary.name}
            </h1>
            {itinerary.startDate && itinerary.endDate && (
              <p className="text-muted-foreground">
                {new Date(itinerary.startDate).toLocaleDateString()} -{" "}
                {new Date(itinerary.endDate).toLocaleDateString()}
              </p>
            )}
            <div className="flex items-center gap-2 mt-2">
              <Badge variant="secondary">
                {itinerary.items?.length || 0} items
              </Badge>
              {days.length > 0 && (
                <Badge variant="outline">
                  {days.length} day{days.length > 1 ? "s" : ""}
                </Badge>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Day Selector */}
        <Card>
          <CardHeader>
            <CardTitle>Days</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {days.map((day) => (
              <Button
                key={day}
                variant={selectedDay === day ? "default" : "outline"}
                className="w-full justify-start"
                onClick={() => setSelectedDay(day)}
              >
                Day {day}
                <Badge variant="secondary" className="ml-auto">
                  {getItemsForDay(day).length}
                </Badge>
              </Button>
            ))}
            <Button
              variant="outline"
              className="w-full justify-start mt-4"
              onClick={() => {
                const newDay = days.length > 0 ? Math.max(...days) + 1 : 1;
                setSelectedDay(newDay);
                setItemForm((prev) => ({ ...prev, day: newDay }));
                setAddItemDialogOpen(true);
              }}
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Day
            </Button>
          </CardContent>
        </Card>

        {/* Main Content */}
        <div className="lg:col-span-3">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Day {selectedDay}</CardTitle>
                <Button
                  onClick={() => {
                    setItemForm((prev) => ({ ...prev, day: selectedDay }));
                    setAddItemDialogOpen(true);
                  }}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Item
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {currentDayItems.length > 0 ? (
                <div className="space-y-4">
                  {currentDayItems.map((item) => {
                    const refData = item.refId;
                    return (
                      <div key={item._id} className="border rounded-lg p-4">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <Badge
                                variant={
                                  item.type === "destination"
                                    ? "default"
                                    : "secondary"
                                }
                              >
                                {item.type === "destination"
                                  ? "Destination"
                                  : "Hotel"}
                              </Badge>
                              <h3 className="font-semibold">
                                {refData?.name || "Unknown"}
                              </h3>
                            </div>
                            {(item.startTime || item.endTime) && (
                              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                                <Clock className="w-4 h-4" />
                                {item.startTime && item.endTime
                                  ? `${item.startTime} - ${item.endTime}`
                                  : item.startTime || item.endTime}
                              </div>
                            )}
                            {item.note && (
                              <p className="text-sm text-muted-foreground mb-2">
                                {item.note}
                              </p>
                            )}
                            {refData?.description && (
                              <p className="text-sm text-muted-foreground line-clamp-2">
                                {refData.description}
                              </p>
                            )}
                          </div>
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => openEditDialog(item)}
                            >
                              <Edit2 className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => handleDeleteItem(item._id)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-12 text-muted-foreground">
                  <Calendar className="w-16 h-16 mx-auto mb-4 opacity-50" />
                  <p>No items for Day {selectedDay}</p>
                  <Button
                    variant="outline"
                    className="mt-4"
                    onClick={() => {
                      setItemForm((prev) => ({ ...prev, day: selectedDay }));
                      setAddItemDialogOpen(true);
                    }}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add First Item
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Add Item Dialog */}
      <Dialog open={addItemDialogOpen} onOpenChange={setAddItemDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              Add Item to Day {itemForm.day || selectedDay}
            </DialogTitle>
            <DialogDescription>
              Select a destination or hotel to add
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <div>
              <Label>Type</Label>
              <Select
                value={itemForm.type}
                onChange={(e) => {
                  setItemForm({ ...itemForm, type: e.target.value, refId: "" });
                }}
              >
                <option value="Destination">Destination</option>
                <option value="Hotel">Hotel</option>
              </Select>
            </div>
            <div>
              <Label>
                {itemForm.type === "Destination" ? "Destination" : "Hotel"} *
              </Label>
              <Select
                value={itemForm.refId}
                onChange={(e) =>
                  setItemForm({ ...itemForm, refId: e.target.value })
                }
                required
              >
                <option value="">
                  Select{" "}
                  {itemForm.type === "Destination" ? "Destination" : "Hotel"}...
                </option>
                {(itemForm.type === "Destination" ? destinations : hotels).map(
                  (item) => (
                    <option key={item._id} value={item._id}>
                      {item.name}
                    </option>
                  )
                )}
              </Select>
            </div>
            <div>
              <Label>Day</Label>
              <Input
                type="number"
                min="1"
                value={itemForm.day || selectedDay}
                onChange={(e) =>
                  setItemForm({
                    ...itemForm,
                    day: parseInt(e.target.value) || selectedDay,
                  })
                }
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Start Time (optional)</Label>
                <Input
                  type="time"
                  value={itemForm.startTime}
                  onChange={(e) =>
                    setItemForm({ ...itemForm, startTime: e.target.value })
                  }
                />
              </div>
              <div>
                <Label>End Time (optional)</Label>
                <Input
                  type="time"
                  value={itemForm.endTime}
                  onChange={(e) =>
                    setItemForm({ ...itemForm, endTime: e.target.value })
                  }
                />
              </div>
            </div>
            <div>
              <Label>Note (optional)</Label>
              <Textarea
                placeholder="Add a note..."
                rows={3}
                value={itemForm.note}
                onChange={(e) =>
                  setItemForm({ ...itemForm, note: e.target.value })
                }
              />
            </div>
            <div className="flex gap-2 justify-end">
              <Button
                variant="outline"
                onClick={() => setAddItemDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button onClick={handleAddItem}>Add Item</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Item Dialog */}
      <Dialog open={editItemDialogOpen} onOpenChange={setEditItemDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Item</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <div>
              <Label>Day</Label>
              <Input
                type="number"
                min="1"
                value={itemForm.day}
                onChange={(e) =>
                  setItemForm({
                    ...itemForm,
                    day: parseInt(e.target.value) || 1,
                  })
                }
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Start Time (optional)</Label>
                <Input
                  type="time"
                  value={itemForm.startTime}
                  onChange={(e) =>
                    setItemForm({ ...itemForm, startTime: e.target.value })
                  }
                />
              </div>
              <div>
                <Label>End Time (optional)</Label>
                <Input
                  type="time"
                  value={itemForm.endTime}
                  onChange={(e) =>
                    setItemForm({ ...itemForm, endTime: e.target.value })
                  }
                />
              </div>
            </div>
            <div>
              <Label>Note (optional)</Label>
              <Textarea
                placeholder="Add a note..."
                rows={3}
                value={itemForm.note}
                onChange={(e) =>
                  setItemForm({ ...itemForm, note: e.target.value })
                }
              />
            </div>
            <div className="flex gap-2 justify-end">
              <Button
                variant="outline"
                onClick={() => {
                  setEditItemDialogOpen(false);
                  setEditingItem(null);
                }}
              >
                Cancel
              </Button>
              <Button onClick={handleEditItem}>Save Changes</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ItineraryDetail;
