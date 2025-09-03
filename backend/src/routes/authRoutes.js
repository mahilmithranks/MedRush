import express from "express";
import { 
  register, 
  login, 
  me, 
  verifyEmailOtp, 
  // verifyPhoneOtp <-- remove this
} from "../controllers/authController.js";

import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Register user
router.post("/register", register);

// Verify Email OTP
router.post("/verify-email-otp", verifyEmailOtp);

// Verify Phone OTP
// router.post("/verify-phone-otp", verifyPhoneOtp); <-- remove this

// Login
router.post("/login", login);

// Get current user
router.get("/me", protect, me);

export default router;
