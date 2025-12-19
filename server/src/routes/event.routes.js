import { Router } from "express";
import {
  getEvents,
  createEvent,
  updateEvent,
  deleteEvent
} from "../controllers/event.controller.js";
import { protect } from "../middleware/auth.middleware.js";
import { moderatorOnly } from "../middleware/moderator.middleware.js";
import { upload } from "../middleware/upload.js"; // ✅ NAMED import
import Event from "../models/Event.js";

const router = Router();

/* =======================
   READ
======================= */
router.get("/", protect, getEvents);

// 🔑 REQUIRED for Edit Event page
router.get("/:id", protect, async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    res.json(event);
  } catch {
    res.status(400).json({ message: "Invalid event ID" });
  }
});

/* =======================
   CREATE
======================= */
router.post(
  "/",
  protect,
  moderatorOnly,
  upload.single("image"),
  createEvent
);

/* =======================
   UPDATE
======================= */
router.put(
  "/:id",
  protect,
  moderatorOnly,
  upload.single("image"),
  updateEvent
);

/* =======================
   DELETE
======================= */
router.delete(
  "/:id",
  protect,
  moderatorOnly,
  deleteEvent
);

export default router;
