import mongoose from "mongoose";

const hotelSchema = new mongoose.Schema({
  cityId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "City",
    required: true
  },
  name: {
    type: String,
    required: true
  },
  images: [{
    type: String
  }],
  roomTypes: [{
    type: String
  }],
  coordinates: {
    lat: {
      type: Number,
      required: true
    },
    lng: {
      type: Number,
      required: true
    }
  },
  avgRating: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

export default mongoose.model("Hotel", hotelSchema);

