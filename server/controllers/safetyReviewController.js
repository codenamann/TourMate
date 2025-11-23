import SafetyReview from "../models/SafetyReview.js";

export const getSafetyReviews = async (req, res) => {
  try {
    const { destinationId } = req.query;
    const filter = destinationId ? { destinationId } : {};
    const reviews = await SafetyReview.find(filter).populate("destinationId");
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createSafetyReview = async (req, res) => {
  try {
    const review = new SafetyReview(req.body);
    await review.save();
    res.status(201).json(review);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

