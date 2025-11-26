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
    // Use userId from authenticated user, not from request body
    const { destinationId, safetyRating, comment } = req.body;
    
    if (!destinationId || !safetyRating) {
      return res.status(400).json({ message: "destinationId and safetyRating are required" });
    }

    // Check for duplicate safety review (same user, same destination)
    const existingReview = await SafetyReview.findOne({
      userId: req.user.id,
      destinationId
    });

    if (existingReview) {
      return res.status(400).json({ 
        message: "You have already submitted a safety review for this destination" 
      });
    }

    // Validate safety rating
    if (safetyRating < 1 || safetyRating > 5) {
      return res.status(400).json({ message: "Safety rating must be between 1 and 5" });
    }

    const review = new SafetyReview({
      userId: req.user.id,
      destinationId,
      safetyRating,
      comment: comment || ""
    });
    
    await review.save();
    res.status(201).json(review);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

