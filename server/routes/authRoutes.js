import express from "express";
import { registerUser, loginUser, adminLogin, getMe } from "../controllers/authController.js";
import { authRequired } from "../middleware/authMiddleware.js";
import { sendOTP, verifyOTP } from "../controllers/otpController.js";

const router = express.Router();

// Public routes
router.post("/send-otp", sendOTP);
router.post("/verify-otp", verifyOTP);
router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/admin-login", adminLogin);

// Protected route
router.get("/me", authRequired, getMe);

export default router;

