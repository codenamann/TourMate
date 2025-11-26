// Admin authentication middleware
// Uses the adminRequired middleware from authMiddleware
import { adminRequired } from "./authMiddleware.js";

export const adminAuth = adminRequired;

