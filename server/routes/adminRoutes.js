import express from "express";
import { adminAuth } from "../middleware/adminAuth.js";
import upload from "../config/multer.js";
import {
  createDestination,
  updateDestination,
  deleteDestination
} from "../controllers/destinationController.js";
import {
  createHotel,
  updateHotel,
  deleteHotel
} from "../controllers/hotelController.js";
import {
  updateReview,
  deleteReview
} from "../controllers/reviewController.js";
import {
  createMapPin,
  getHiddenGems,
  getPendingReviews
} from "../controllers/adminController.js";

const router = express.Router();

// Apply admin auth to all routes
router.use(adminAuth);

// Destinations
router.get("/destinations", async (req, res) => {
  const { getDestinations } = await import("../controllers/destinationController.js");
  return getDestinations(req, res);
});
router.post("/destinations", upload.array("images", 5), createDestination);
router.put("/destinations/:id", upload.array("images", 5), updateDestination);
router.delete("/destinations/:id", deleteDestination);

// Hotels
router.get("/hotels", async (req, res) => {
  const { getHotels } = await import("../controllers/hotelController.js");
  return getHotels(req, res);
});
router.post("/hotels", upload.array("images", 5), createHotel);
router.put("/hotels/:id", upload.array("images", 5), updateHotel);
router.delete("/hotels/:id", deleteHotel);

// Hidden Gems
router.get("/hidden-gems", getHiddenGems);
router.post("/hidden-gems", upload.array("images", 5), createDestination);
router.put("/hidden-gems/:id", upload.array("images", 5), updateDestination);
router.delete("/hidden-gems/:id", deleteDestination);

// Reviews
router.get("/reviews", getPendingReviews);
router.put("/reviews/:id", updateReview);
router.delete("/reviews/:id", deleteReview);

// Map creation
router.post("/map/create", upload.array("images", 5), createMapPin);

export default router;

