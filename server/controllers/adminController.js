import Destination from "../models/Destination.js";
import Hotel from "../models/Hotel.js";
import Review from "../models/Review.js";

// Map-based creation
export const createMapPin = async (req, res) => {
  try {
    const { type, coordinates, name, cityId, ...otherFields } = req.body;
    
    let item;
    if (type === "hotel") {
      item = new Hotel({ name, cityId, coordinates, ...otherFields });
    } else if (type === "destination" || type === "hidden_gem") {
      item = new Destination({
        name,
        cityId,
        coordinates,
        category: type === "hidden_gem" ? "hidden_gem" : "destination",
        ...otherFields
      });
    } else {
      return res.status(400).json({ message: "Invalid type" });
    }
    
    await item.save();
    res.status(201).json(item);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get hidden gems
export const getHiddenGems = async (req, res) => {
  try {
    const gems = await Destination.find({ category: "hidden_gem" }).populate("cityId");
    res.json(gems);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Admin review moderation
export const getPendingReviews = async (req, res) => {
  try {
    // For now, return all reviews. Later add status field
    const reviews = await Review.find();
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

