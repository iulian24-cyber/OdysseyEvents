import { Router } from "express";
import { signup, login, updateMe } from "../controllers/auth.controller.js";
import { protect } from "../middleware/auth.middleware.js";
import User from "../models/User.js";

const router = Router();

router.post("/signup", signup);
router.post("/login", login);
router.put("/me", protect, updateMe);

router.get("/me", protect, async (req, res) => {
  const user = await User.findById(req.user.id).select("-password");
  res.json(user);
});

export default router;
