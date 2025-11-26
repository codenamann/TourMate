import mongoose from "mongoose";

const itineraryItemSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["Destination", "Hotel"],
      required: true,
    },
    refId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      refPath: "type",
    },
    day: {
      type: Number,
      required: true,
    },
    startTime: {
      type: String, // "09:00", optional
      default: null,
    },
    endTime: {
      type: String, // "17:00", optional
      default: null,
    },
    note: {
      type: String,
      default: "",
    },
    coordinates: {
      lat: {
        type: Number,
        default: null,
      },
      lng: {
        type: Number,
        default: null,
      },
    },
  },
  { _id: true }
);

const itinerarySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    startDate: {
      type: Date,
      default: null,
    },
    endDate: {
      type: Date,
      default: null,
    },
    items: [itineraryItemSchema],
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Itinerary", itinerarySchema);
