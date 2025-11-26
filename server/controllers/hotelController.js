import Hotel from "../models/Hotel.js";
import { uploadMultipleToCloudinary } from "../config/multer.js";

export const getHotels = async (req, res) => {
  try {
    const { cityId } = req.query;
    const filter = cityId ? { cityId } : {};
    const hotels = await Hotel.find(filter)
      .populate({ path: "cityId", populate: { path: "stateId" } })
      .sort({ createdAt: -1 });
    res.json(hotels);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getHotelById = async (req, res) => {
  try {
    const hotel = await Hotel.findById(req.params.id)
      .populate({ path: "cityId", populate: { path: "stateId" } });
    if (!hotel) {
      return res.status(404).json({ message: "Hotel not found" });
    }
    res.json(hotel);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createHotel = async (req, res) => {
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
    
    const hotelData = {
      ...req.body,
      coordinates: coordinates || req.body.coordinates,
      images: imageUrls
    };
    
    const hotel = new Hotel(hotelData);
    await hotel.save();
    const populated = await Hotel.findById(hotel._id)
      .populate({ path: "cityId", populate: { path: "stateId" } });
    res.status(201).json(populated);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const updateHotel = async (req, res) => {
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
    
    const hotel = await Hotel.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    ).populate({ path: "cityId", populate: { path: "stateId" } });
    
    if (!hotel) {
      return res.status(404).json({ message: "Hotel not found" });
    }
    res.json(hotel);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteHotel = async (req, res) => {
  try {
    const hotel = await Hotel.findByIdAndDelete(req.params.id);
    if (!hotel) {
      return res.status(404).json({ message: "Hotel not found" });
    }
    res.json({ message: "Hotel deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

