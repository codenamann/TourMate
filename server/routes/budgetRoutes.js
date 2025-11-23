import express from "express";
import { planBudget, getAIExplanation } from "../controllers/budgetController.js";

const router = express.Router();

router.post("/plan", planBudget);
router.post("/ai-explain", getAIExplanation);

export default router;

