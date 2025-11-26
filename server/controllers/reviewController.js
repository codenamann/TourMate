import Review from "../models/Review.js";

export const getReviews = async (req, res) => {
  try {
    const { targetType, targetId } = req.query;
    const filter = {};
    if (targetType) filter.targetType = targetType;
    if (targetId) filter.targetId = targetId;
    
    const reviews = await Review.find(filter);
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createReview = async (req, res) => {
  try {
    // Use userId from authenticated user, not from request body
    const { targetType, targetId, rating, comment } = req.body;
    
    if (!targetType || !targetId || !rating) {
      return res.status(400).json({ message: "targetType, targetId, and rating are required" });
    }

    // Check for duplicate review (same user, same target)
    const existingReview = await Review.findOne({
      userId: req.user.id,
      targetType,
      targetId
    });

    if (existingReview) {
      return res.status(400).json({ 
        message: "You have already submitted a review for this item" 
      });
    }

    // Validate rating
    if (rating < 1 || rating > 5) {
      return res.status(400).json({ message: "Rating must be between 1 and 5" });
    }

    const review = new Review({
      userId: req.user.id,
      targetType,
      targetId,
      rating,
      comment: comment || ""
    });
    
    await review.save();
    res.status(201).json(review);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const updateReview = async (req, res) => {
  try {
    const review = await Review.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }
    res.json(review);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteReview = async (req, res) => {
  try {
    const review = await Review.findByIdAndDelete(req.params.id);
    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }
    res.json({ message: "Review deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

