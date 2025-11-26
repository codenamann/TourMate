import express from "express";
import { getCities, getCityById } from "../controllers/cityController.js";
import { adminRequired } from "../middleware/authMiddleware.js";
import { seedIndiaCities } from "../utils/seedIndiaCities.js";

const router = express.Router();

router.get("/", getCities);
router.get("/:id", getCityById);

// Admin-only endpoint to refresh cities from dataset
router.post("/refresh", adminRequired, async (req, res) => {
  try {
    await seedIndiaCities();
    res.json({ 
      message: "Cities refreshed successfully"
    });
  } catch (error) {
    console.error("Error refreshing cities:", error);
    res.status(500).json({ message: error.message });
  }
});

export default router;

