import express from "express";
import {
  getSafetyReviews,
  createSafetyReview
} from "../controllers/safetyReviewController.js";

const router = express.Router();

router.get("/", getSafetyReviews);
router.post("/", createSafetyReview);

export default router;

