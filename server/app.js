import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import mongoose from "mongoose";
import { connectDB } from "./config/db.js";
import { errorHandler } from "./middleware/errorHandler.js";
import { createSuperAdmin } from "./utils/createSuperAdmin.js";
import { seedIndiaCities } from "./utils/seedIndiaCities.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load .env file from server directory
dotenv.config({ path: join(__dirname, ".env") });

connectDB();

// Create superadmin and seed cities after DB connection
mongoose.connection.once("open", async () => {
  createSuperAdmin();
  await seedIndiaCities();
});

const app = express();
app.use(express.json());

app.use(cors({
  origin: process.env.CORS_ORIGIN || "http://localhost:5173",
  credentials: true
}));

// ROUTES
import authRoutes from "./routes/authRoutes.js";
import stateRoutes from "./routes/stateRoutes.js";
import cityRoutes from "./routes/cityRoutes.js";
import destinationRoutes from "./routes/destinationRoutes.js";
import hotelRoutes from "./routes/hotelRoutes.js";
import reviewRoutes from "./routes/reviewRoutes.js";
import safetyReviewRoutes from "./routes/safetyReviewRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import budgetRoutes from "./routes/budgetRoutes.js";
import itineraryRoutes from "./routes/itineraryRoutes.js";

app.use("/api/auth", authRoutes);
app.use("/api/states", stateRoutes);
app.use("/api/cities", cityRoutes);
app.use("/api/destinations", destinationRoutes);
app.use("/api/hotels", hotelRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/safety-reviews", safetyReviewRoutes);
app.use("/admin/api", adminRoutes);
app.use("/api/budget", budgetRoutes);
app.use("/api/itineraries", itineraryRoutes);

app.get("/api/ping", (req, res) => res.json({ message: "Backend running" }));

app.use(errorHandler);

export default app;

