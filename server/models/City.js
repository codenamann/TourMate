import mongoose from "mongoose";

const citySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  stateId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "State",
    required: true
  },
  latitude: {
    type: Number,
    default: null
  },
  longitude: {
    type: Number,
    default: null
  }
}, {
  timestamps: true
});

// Index for search performance
citySchema.index({ name: "text" });
citySchema.index({ stateId: 1 });

export default mongoose.model("City", citySchema);

