import express from "express";
import { authRequired } from "../middleware/authMiddleware.js";
import {
  getUserItineraries,
  getItineraryById,
  createItinerary,
  updateItinerary,
  deleteItinerary,
  addItemToItinerary,
  updateItineraryItem,
  deleteItineraryItem
} from "../controllers/itineraryController.js";

const router = express.Router();

// All routes require authentication
router.use(authRequired);

router.get("/", getUserItineraries);
router.get("/:id", getItineraryById);
router.post("/", createItinerary);
router.put("/:id", updateItinerary);
router.delete("/:id", deleteItinerary);

// Item management routes
router.post("/:id/items", addItemToItinerary);
router.put("/:id/items/:itemId", updateItineraryItem);
router.delete("/:id/items/:itemId", deleteItineraryItem);

export default router;

