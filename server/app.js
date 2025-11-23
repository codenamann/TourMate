import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { connectDB } from "./config/db.js";
import { errorHandler } from "./middleware/errorHandler.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load .env file from server directory
dotenv.config({ path: join(__dirname, ".env") });

connectDB();

const app = express();
app.use(express.json());

app.use(cors({
  origin: process.env.CORS_ORIGIN || "http://localhost:5173",
  credentials: true
}));

// ROUTES
import cityRoutes from "./routes/cityRoutes.js";
import destinationRoutes from "./routes/destinationRoutes.js";
import hotelRoutes from "./routes/hotelRoutes.js";
import reviewRoutes from "./routes/reviewRoutes.js";
import safetyReviewRoutes from "./routes/safetyReviewRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import budgetRoutes from "./routes/budgetRoutes.js";

app.use("/api/cities", cityRoutes);
app.use("/api/destinations", destinationRoutes);
app.use("/api/hotels", hotelRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/safety-reviews", safetyReviewRoutes);
app.use("/admin/api", adminRoutes);
app.use("/api/budget", budgetRoutes);

app.get("/api/ping", (req, res) => res.json({ message: "Backend running" }));

app.use(errorHandler);

export default app;

