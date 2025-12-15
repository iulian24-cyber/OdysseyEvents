import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

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
