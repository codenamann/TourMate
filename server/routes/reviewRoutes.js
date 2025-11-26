import express from "express";
import { authRequired } from "../middleware/authMiddleware.js";
import {
  getReviews,
  createReview
} from "../controllers/reviewController.js";

const router = express.Router();

router.get("/", getReviews);
router.post("/", authRequired, createReview);

export default router;

