import Otp from "../models/Otp.js";
import bcrypt from "bcryptjs";
import axios from "axios";

// Rate limiting: Store last OTP send time per email (in-memory for simplicity)
const lastOtpSendTime = new Map();

// Generate 6-digit OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Send OTP via Brevo
const sendOTPEmail = async (email, otpCode) => {
  try {
    const response = await axios.post(
      "https://api.brevo.com/v3/smtp/email",
      {
        sender: {
          name: process.env.BREVO_SENDER_NAME || "TourMate",
          email: process.env.BREVO_SENDER_EMAIL
        },
        to: [
          {
            email: email
          }
        ],
        subject: "Your TourMate Verification Code",
        htmlContent: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #333;">Email Verification</h2>
            <p>Your verification code is:</p>
            <div style="background: #f4f4f4; padding: 20px; text-align: center; font-size: 32px; font-weight: bold; letter-spacing: 5px; margin: 20px 0;">
              ${otpCode}
            </div>
            <p style="color: #666;">This code will expire in 5 minutes.</p>
            <p style="color: #666; font-size: 12px;">If you didn't request this code, please ignore this email.</p>
          </div>
        `
      },
      {
        headers: {
          "api-key": process.env.BREVO_API_KEY,
          "Content-Type": "application/json"
        }
      }
    );
    return { success: true };
  } catch (error) {
    console.error("Brevo email error:", error.response?.data || error.message);
    throw new Error("Failed to send verification email");
  }
};

// Send OTP
export const sendOTP = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    const normalizedEmail = email.toLowerCase();

    // Rate limiting: Check if OTP was sent in last 45 seconds
    const lastSendTime = lastOtpSendTime.get(normalizedEmail);
    const now = Date.now();
    if (lastSendTime && (now - lastSendTime) < 45000) {
      const remainingSeconds = Math.ceil((45000 - (now - lastSendTime)) / 1000);
      return res.status(429).json({ 
        message: `Please wait ${remainingSeconds} seconds before requesting a new OTP` 
      });
    }

    // Generate OTP
    const otpCode = generateOTP();

    // Hash OTP before saving
    const salt = await bcrypt.genSalt(10);
    const hashedOTP = await bcrypt.hash(otpCode, salt);

    // Set expiration (5 minutes from now)
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + 5);

    // Delete any existing unverified OTPs for this email
    await Otp.deleteMany({ email: normalizedEmail, verified: false });

    // Save OTP
    const otp = new Otp({
      email: normalizedEmail,
      otpCode: hashedOTP,
      expiresAt
    });
    await otp.save();

    // Update rate limit
    lastOtpSendTime.set(normalizedEmail, now);

    // Send email via Brevo
    try {
      await sendOTPEmail(normalizedEmail, otpCode);
    } catch (emailError) {
      // If email fails, still return success but log error
      // In production, you might want to handle this differently
      console.error("Email sending failed:", emailError);
      // For development, you might want to return the OTP in response
      // In production, remove this and handle error properly
      if (process.env.NODE_ENV === "development") {
        console.log(`[DEV] OTP for ${normalizedEmail}: ${otpCode}`);
      }
    }

    res.json({ 
      message: "OTP sent successfully",
      // In development, include OTP for testing
      ...(process.env.NODE_ENV === "development" && { otpCode })
    });
  } catch (error) {
    console.error("Send OTP error:", error);
    res.status(500).json({ message: error.message || "Failed to send OTP" });
  }
};

// Verify OTP
export const verifyOTP = async (req, res) => {
  try {
    const { email, otpCode } = req.body;

    if (!email || !otpCode) {
      return res.status(400).json({ message: "Email and OTP code are required" });
    }

    const normalizedEmail = email.toLowerCase();

    // Find the most recent unverified OTP for this email
    const otp = await Otp.findOne({ 
      email: normalizedEmail, 
      verified: false 
    }).sort({ createdAt: -1 });

    if (!otp) {
      return res.status(400).json({ message: "No OTP found or already verified" });
    }

    // Check if expired
    if (new Date() > otp.expiresAt) {
      await Otp.deleteOne({ _id: otp._id });
      return res.status(400).json({ message: "OTP has expired" });
    }

    // Compare OTP
    const isMatch = await bcrypt.compare(otpCode, otp.otpCode);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid OTP code" });
    }

    // Mark as verified
    otp.verified = true;
    await otp.save();

    res.json({ 
      success: true,
      message: "OTP verified successfully" 
    });
  } catch (error) {
    console.error("Verify OTP error:", error);
    res.status(500).json({ message: error.message || "Failed to verify OTP" });
  }
};

// Check if email is verified (helper function for registration)
export const isEmailVerified = async (email) => {
  const normalizedEmail = email.toLowerCase();
  const otp = await Otp.findOne({ 
    email: normalizedEmail, 
    verified: true 
  }).sort({ createdAt: -1 });
  
  // Check if verified within last 10 minutes (reasonable window for registration)
  if (otp && otp.createdAt) {
    const tenMinutesAgo = new Date();
    tenMinutesAgo.setMinutes(tenMinutesAgo.getMinutes() - 10);
    return otp.createdAt > tenMinutesAgo;
  }
  
  return false;
};

