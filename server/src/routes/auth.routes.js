import { Router } from "express";
import { signup, login } from "../controllers/auth.controller.js";
import { protect } from "../middleware/auth.middleware.js";
import User from "../models/User.js";

const router = Router();

router.post("/signup", signup);
router.post("/login", login);

router.get("/me", protect, async (req, res) => {
  const user = await User.findById(req.user.id).select("-password");
  res.json(user);
});

export default router;
