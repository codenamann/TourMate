import Destination from "../models/Destination.js";
import Hotel from "../models/Hotel.js";
import Review from "../models/Review.js";
import { uploadMultipleToCloudinary } from "../config/multer.js";

// Map-based creation
export const createMapPin = async (req, res) => {
  try {
    let { type, coordinates, name, cityId, ...otherFields } = req.body;
    
    // Parse coordinates if it's a string (from FormData)
    if (typeof coordinates === 'string') {
      try {
        coordinates = JSON.parse(coordinates);
      } catch (e) {
        // If parsing fails, use as is
      }
    }
    
    let imageUrls = [];
    // Upload images to Cloudinary if files are present
    if (req.files && req.files.length > 0) {
      imageUrls = await uploadMultipleToCloudinary(req.files);
    } else if (otherFields.images && Array.isArray(otherFields.images)) {
      imageUrls = otherFields.images;
    }
    
    let item;
    if (type === "hotel") {
      item = new Hotel({ 
        name, 
        cityId, 
        coordinates, 
        images: imageUrls,
        ...otherFields 
      });
    } else if (type === "destination" || type === "hidden_gem") {
      item = new Destination({
        name,
        cityId,
        coordinates,
        images: imageUrls,
        category: type === "hidden_gem" ? "hidden_gem" : "destination",
        ...otherFields
      });
    } else {
      return res.status(400).json({ message: "Invalid type" });
    }
    
    await item.save();
    const populated = await (type === "hotel" ? Hotel : Destination)
      .findById(item._id)
      .populate("cityId");
    res.status(201).json(populated);
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

