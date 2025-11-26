import Itinerary from "../models/Itinerary.js";

// Get all itineraries for the authenticated user
export const getUserItineraries = async (req, res) => {
  try {
    const itineraries = await Itinerary.find({ userId: req.user.id }).sort({
      createdAt: -1,
    });
    res.json(itineraries);
  } catch (error) {
    console.error("Get itineraries error:", error);
    res.status(500).json({ message: error.message });
  }
};

// Get a single itinerary by ID
export const getItineraryById = async (req, res) => {
  try {
    const { id } = req.params;
    const itinerary = await Itinerary.findById(id).populate({
      path: "items.refId",
      select: "name description images coordinates",
    });

    if (!itinerary) {
      return res.status(404).json({ message: "Itinerary not found" });
    }

    // Verify ownership
    if (itinerary.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: "Access denied" });
    }

    res.json(itinerary);
  } catch (error) {
    console.error("Get itinerary error:", error);
    res.status(500).json({ message: error.message });
  }
};

// Create a new itinerary
export const createItinerary = async (req, res) => {
  try {
    const { name, startDate, endDate, items } = req.body;

    if (!name) {
      return res.status(400).json({ message: "Itinerary name is required" });
    }

    // Validate items structure
    if (items && Array.isArray(items)) {
      for (const item of items) {
        if (!item.type || !["Destination", "Hotel"].includes(item.type)) {
          return res.status(400).json({
            message:
              "Each item must have a valid type: 'destination' or 'hotel'",
          });
        }
        if (!item.refId) {
          return res
            .status(400)
            .json({ message: "Each item must have a refId" });
        }
      }

      // Check for duplicate items (same type and refId)
      const itemKeys = items.map((item) => `${item.type}:${item.refId}`);
      const uniqueKeys = new Set(itemKeys);
      if (itemKeys.length !== uniqueKeys.size) {
        return res.status(400).json({
          message: "Duplicate items are not allowed in the same itinerary",
        });
      }
    }

    const itinerary = new Itinerary({
      userId: req.user.id,
      name,
      startDate: startDate || null,
      endDate: endDate || null,
      items: items || [],
    });

    await itinerary.save();
    res.status(201).json(itinerary);
  } catch (error) {
    console.error("Create itinerary error:", error);
    res.status(400).json({ message: error.message });
  }
};

// Update an itinerary
export const updateItinerary = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, startDate, endDate, items } = req.body;

    // Find itinerary and verify ownership
    const itinerary = await Itinerary.findById(id);
    if (!itinerary) {
      return res.status(404).json({ message: "Itinerary not found" });
    }

    if (itinerary.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: "Access denied" });
    }

    // Validate items structure if provided
    if (items !== undefined && Array.isArray(items)) {
      for (const item of items) {
        if (!item.type || !["Destination", "Hotel"].includes(item.type)) {
          return res.status(400).json({
            message:
              "Each item must have a valid type: 'destination' or 'hotel'",
          });
        }
        if (!item.refId) {
          return res
            .status(400)
            .json({ message: "Each item must have a refId" });
        }
      }

      // Check for duplicate items (same type and refId)
      const itemKeys = items.map((item) => `${item.type}:${item.refId}`);
      const uniqueKeys = new Set(itemKeys);
      if (itemKeys.length !== uniqueKeys.size) {
        return res.status(400).json({
          message: "Duplicate items are not allowed in the same itinerary",
        });
      }
    }

    // Update fields
    if (name !== undefined) itinerary.name = name;
    if (startDate !== undefined) itinerary.startDate = startDate || null;
    if (endDate !== undefined) itinerary.endDate = endDate || null;
    if (items !== undefined) itinerary.items = items;

    await itinerary.save();
    res.json(itinerary);
  } catch (error) {
    console.error("Update itinerary error:", error);
    res.status(400).json({ message: error.message });
  }
};

// Delete an itinerary
export const deleteItinerary = async (req, res) => {
  try {
    const { id } = req.params;

    // Find itinerary and verify ownership
    const itinerary = await Itinerary.findById(id);
    if (!itinerary) {
      return res.status(404).json({ message: "Itinerary not found" });
    }

    if (itinerary.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: "Access denied" });
    }

    await Itinerary.findByIdAndDelete(id);
    res.json({ message: "Itinerary deleted successfully" });
  } catch (error) {
    console.error("Delete itinerary error:", error);
    res.status(500).json({ message: error.message });
  }
};

// Add item to itinerary
export const addItemToItinerary = async (req, res) => {
  try {
    const { id } = req.params;
    const { type, refId, day, startTime, endTime, note, coordinates } =
      req.body;

    const normalized =
      type.toLowerCase() === "destination"
        ? "Destination"
        : type.toLowerCase() === "hotel"
        ? "Hotel"
        : type;

    console.log({ type, refId, day, startTime, endTime, note, coordinates });

    // Validate required fields
    if (!["Destination", "Hotel"].includes(normalized)) {
      return res
        .status(400)
        .json({ message: "Valid type (Destination or Hotel) is required" });
    }

    if (!refId) {
      return res.status(400).json({ message: "refId is required" });
    }
    if (day === undefined || day === null) {
      return res.status(400).json({ message: "day is required" });
    }

    // Find itinerary and verify ownership
    const itinerary = await Itinerary.findById(id);
    if (!itinerary) {
      return res.status(404).json({ message: "Itinerary not found" });
    }

    if (itinerary.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: "Access denied" });
    }

    // Check for duplicate (same type and refId)
    const duplicate = itinerary.items.find(
      (item) =>
        item.type.toLowerCase() === normalized.toLowerCase() &&
        item.refId.toString() === refId
    );

    if (duplicate) {
      return res
        .status(400)
        .json({ message: "This item is already in the itinerary" });
    }

    // Add new item
    const newItem = {
      type: normalized,
      refId,
      day: parseInt(day),
      startTime: startTime || null,
      endTime: endTime || null,
      note: note || "",
      coordinates: coordinates || null,
    };

    itinerary.items.push(newItem);
    await itinerary.save();

    // Populate the new item
    const populated = await Itinerary.findById(id).populate({
      path: "items.refId",
      select: "name description images coordinates",
    });

    res.status(201).json(populated);
  } catch (error) {
    console.error("Add item error:", error);
    res.status(400).json({ message: error.message });
  }
};

// Update item in itinerary
export const updateItineraryItem = async (req, res) => {
  try {
    const { id, itemId } = req.params;
    const { day, startTime, endTime, note, coordinates } = req.body;

    // Find itinerary and verify ownership
    const itinerary = await Itinerary.findById(id);
    if (!itinerary) {
      return res.status(404).json({ message: "Itinerary not found" });
    }

    if (itinerary.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: "Access denied" });
    }

    // Find item
    const item = itinerary.items.id(itemId);
    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }

    // Update item fields
    if (day !== undefined) item.day = parseInt(day);
    if (startTime !== undefined) item.startTime = startTime || null;
    if (endTime !== undefined) item.endTime = endTime || null;
    if (note !== undefined) item.note = note || "";
    if (coordinates !== undefined) item.coordinates = coordinates || null;

    await itinerary.save();

    // Populate and return
    const populated = await Itinerary.findById(id).populate({
      path: "items.refId",
      select: "name description images coordinates",
    });

    res.json(populated);
  } catch (error) {
    console.error("Update item error:", error);
    res.status(400).json({ message: error.message });
  }
};

// Delete item from itinerary
export const deleteItineraryItem = async (req, res) => {
  try {
    const { id, itemId } = req.params;

    // Find itinerary and verify ownership
    const itinerary = await Itinerary.findById(id);
    if (!itinerary) {
      return res.status(404).json({ message: "Itinerary not found" });
    }

    if (itinerary.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: "Access denied" });
    }

    // Remove item
    console.log(itinerary);
    itinerary.items.id(itemId).deleteOne();
    await itinerary.save();

    res.json({ message: "Item deleted successfully" });
  } catch (error) {
    console.error("Delete item error:", error);
    res.status(400).json({ message: error.message });
  }
};
