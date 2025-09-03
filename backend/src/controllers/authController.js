import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import sendEmail from "../utils/sendEmail.js";

// Generate JWT
const generateToken = (user) => {
  return jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
};

// Generate 6-digit OTP
const generateOtp = () =>
  Math.floor(100000 + Math.random() * 900000).toString();

// ===================== REGISTER =====================
// ===================== REGISTER =====================
export const register = async (req, res) => {
  try {
    const { name, email, phone, password, role } = req.body;

    const existing = await User.findOne({ email });
    if (existing)
      return res.status(400).json({ message: "Email already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const emailOtp = generateOtp();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000);

    // Create user with phone auto-verified
    const user = await User.create({
      name,
      email,
      phone,
      password: hashedPassword,
      role,
      emailOtp,
      emailOtpExpires: otpExpires,
      isEmailVerified: false,
      isPhoneVerified: true, // Phone auto-verified
    });

    // Send Email OTP
    await sendEmail(
      email,
      "MedRush Email Verification",
      `Your Email OTP is ${emailOtp}. It is valid for 10 minutes.`
    );

    // Respond immediately after sending email OTP
    res.status(201).json({
      message: "OTP sent successfully to your email",
      userId: user._id,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// ===================== VERIFY EMAIL OTP =====================
export const verifyEmailOtp = async (req, res) => {
  try {
    const { userId, otp } = req.body;

    const user = await User.findById(userId);
    if (!user) return res.status(400).json({ message: "User not found" });

    if (user.isEmailVerified) {
      return res.status(400).json({ message: "Email already verified" });
    }

    if (user.emailOtp !== otp || user.emailOtpExpires < Date.now()) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    user.isEmailVerified = true;
    user.emailOtp = null;
    user.emailOtpExpires = null;
    await user.save();

    res.json({ message: "Email verified successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ===================== LOGIN =====================
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    if (!user.isEmailVerified) {
      return res.status(400).json({
        message: "Please verify your email before logging in",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials" });

    res.json({
      message: "Login successful",
      token: generateToken(user),
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ===================== GET LOGGED-IN USER =====================
export const me = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
