import Destination from "../models/Destination.js";
import { uploadMultipleToCloudinary } from "../config/multer.js";

export const getDestinations = async (req, res) => {
  try {
    const { category, cityId } = req.query;
    const filter = {};
    if (category) filter.category = category;
    if (cityId) filter.cityId = cityId;
    
    const destinations = await Destination.find(filter)
      .populate({ path: "cityId", populate: { path: "stateId" } })
      .sort({ createdAt: -1 });
    res.json(destinations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getDestinationById = async (req, res) => {
  try {
    const destination = await Destination.findById(req.params.id)
      .populate({ path: "cityId", populate: { path: "stateId" } });
    if (!destination) {
      return res.status(404).json({ message: "Destination not found" });
    }
    res.json(destination);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createDestination = async (req, res) => {
    try {
      let imageUrls = [];
      // Upload images to Cloudinary if files are present
    if (req.files && req.files.length > 0) {
      imageUrls = await uploadMultipleToCloudinary(req.files);
    } else if (req.body.images && Array.isArray(req.body.images)) {
      // If images are passed as URLs (from frontend)
      imageUrls = req.body.images;
    }
    
    // Parse coordinates if it's a string (from FormData)
    let coordinates = req.body.coordinates;
    if (typeof coordinates === 'string') {
      try {
        coordinates = JSON.parse(coordinates);
      } catch (e) {
        // If parsing fails, use as is
      }
    }
    
    const destinationData = {
      ...req.body,
      coordinates: coordinates || req.body.coordinates,
      images: imageUrls
    };
    
    const destination = new Destination(destinationData);
    await destination.save();
    const populated = await Destination.findById(destination._id)
      .populate({ path: "cityId", populate: { path: "stateId" } });
    res.status(201).json(populated);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const updateDestination = async (req, res) => {
  try {
    let imageUrls = req.body.images || [];
    
    // Upload new images to Cloudinary if files are present
    if (req.files && req.files.length > 0) {
      const newImageUrls = await uploadMultipleToCloudinary(req.files);
      // Merge with existing images if provided
      const existingImages = Array.isArray(req.body.images) ? req.body.images : [];
      imageUrls = [...existingImages, ...newImageUrls];
    }
    
    // Parse coordinates if it's a string (from FormData)
    let coordinates = req.body.coordinates;
    if (typeof coordinates === 'string') {
      try {
        coordinates = JSON.parse(coordinates);
      } catch (e) {
        // If parsing fails, use as is
      }
    }
    
    const updateData = {
      ...req.body,
      coordinates: coordinates || req.body.coordinates,
      images: imageUrls
    };
    
    const destination = await Destination.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    ).populate({ path: "cityId", populate: { path: "stateId" } });
    
    if (!destination) {
      return res.status(404).json({ message: "Destination not found" });
    }
    res.json(destination);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteDestination = async (req, res) => {
  try {
    const destination = await Destination.findByIdAndDelete(req.params.id);
    if (!destination) {
      return res.status(404).json({ message: "Destination not found" });
    }
    res.json({ message: "Destination deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

