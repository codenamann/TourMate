import express from "express";
import { getStates, getStateById } from "../controllers/stateController.js";

const router = express.Router();

router.get("/", getStates);
router.get("/:id", getStateById);

export default router;

