import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { sendEmail } from "../utils/mailer.js";

/* =======================
   SIGN UP
======================= */
export const signup = async (req, res) => {
  const { username, email, password, categories } = req.body;

  const exists = await User.findOne({
    $or: [{ email }, { username }]
  });

  if (exists) {
    return res.status(400).json({
      message: "Email or username already exists"
    });
  }

  const hashed = await bcrypt.hash(password, 10);

  await User.create({
    username,
    email,
    password: hashed,
    preferredCategories: categories || []
  });

  res.status(201).json({
    message: "Account created"
  });
};

/* =======================
   LOGIN
======================= */
export const login = async (req, res) => {
  const { identifier, password } = req.body;

  const isEmail = /\S+@\S+\.\S+/.test(identifier);

  const user = await User.findOne(
    isEmail
      ? { email: identifier }
      : { username: identifier }
  );

  if (!user) {
    return res.status(401).json({
      message: "Invalid credentials"
    });
  }

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) {
    return res.status(401).json({
      message: "Invalid credentials"
    });
  }

  const token = jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );

  res.json({
    token,
    user: {
      id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
      preferredCategories: user.preferredCategories
    }
  });
};

/* =======================
   UPDATE CURRENT USER
======================= */
export const updateMe = async (req, res) => {
  try {
    const { username, email, password, preferredCategories } = req.body;

    // req.user.id comes from JWT payload (protect middleware)
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    // update allowed fields only
    if (username !== undefined) user.username = username;
    if (email !== undefined) user.email = email;

    if (Array.isArray(preferredCategories)) {
      user.preferredCategories = preferredCategories;
    }

    // update password ONLY if provided
    if (password) {
      const hashed = await bcrypt.hash(password, 10);
      user.password = hashed;
    }

    await user.save();

    // respond WITHOUT password
    res.json({
      id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
      preferredCategories: user.preferredCategories
    });
  } catch (err) {
    console.error("UpdateMe error:", err);
    res.status(500).json({
      message: "Failed to update account"
    });
  }
};

/* =======================
   FORGOT PASSWORD
======================= */
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        message: "Email is required"
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      // Don't reveal if email exists (security best practice)
      return res.json({
        message: "If that email exists, a reset code has been sent"
      });
    }

    // Generate 6-digit reset code
    const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
    const resetCodeExpiry = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

    user.resetCode = resetCode;
    user.resetCodeExpiry = resetCodeExpiry;
    await user.save();

    // Send email
    await sendEmail({
      to: email,
      subject: "Your OdysseyEvents Password Reset Code",
      html: `
        <h2>Password Reset Request</h2>
        <p>Your reset code is: <strong>${resetCode}</strong></p>
        <p>This code will expire in 15 minutes.</p>
        <p>If you didn't request this, please ignore this email.</p>
      `
    });

    res.json({
      message: "If that email exists, a reset code has been sent"
    });
  } catch (err) {
    console.error("ForgotPassword error:", err);
    res.status(500).json({
      message: "Failed to process password reset"
    });
  }
};

/* =======================
   RESET PASSWORD
======================= */
export const resetPassword = async (req, res) => {
  try {
    const { email, resetCode, newPassword } = req.body;

    if (!email || !resetCode || !newPassword) {
      return res.status(400).json({
        message: "Email, reset code, and new password are required"
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({
        message: "Invalid email or reset code"
      });
    }

    // Check if reset code is correct and not expired
    if (user.resetCode !== resetCode) {
      return res.status(401).json({
        message: "Invalid reset code"
      });
    }

    if (new Date() > user.resetCodeExpiry) {
      return res.status(401).json({
        message: "Reset code has expired. Please request a new one."
      });
    }

    // Update password
    const hashed = await bcrypt.hash(newPassword, 10);
    user.password = hashed;
    user.resetCode = null;
    user.resetCodeExpiry = null;
    await user.save();

    res.json({
      message: "Password has been reset successfully"
    });
  } catch (err) {
    console.error("ResetPassword error:", err);
    res.status(500).json({
      message: "Failed to reset password"
    });
  }
};
