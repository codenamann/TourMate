import mongoose from "mongoose";

const destinationSchema = new mongoose.Schema({
  cityId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "City",
    required: true
  },
  name: {
    type: String,
    required: true
  },
  category: {
    type: String,
    enum: ["destination", "hidden_gem"],
    required: true
  },
  description: {
    type: String,
    default: ""
  },
  highlights: [{
    type: String
  }],
  images: [{
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
  }
}, {
  timestamps: true
});

export default mongoose.model("Destination", destinationSchema);

