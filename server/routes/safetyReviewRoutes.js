import express from "express";
import { authRequired } from "../middleware/authMiddleware.js";
import {
  getSafetyReviews,
  createSafetyReview
} from "../controllers/safetyReviewController.js";

const router = express.Router();

router.get("/", getSafetyReviews);
router.post("/", authRequired, createSafetyReview);

export default router;

