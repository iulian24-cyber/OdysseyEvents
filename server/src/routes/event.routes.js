import { Router } from "express";
import { getEvents, createEvent } from "../controllers/event.controller.js";
import { protect } from "../middleware/auth.middleware.js";
import { moderatorOnly } from "../middleware/moderator.middleware.js";

const router = Router();

router.get("/", protect, getEvents);
router.post("/", protect, moderatorOnly, createEvent);

export default router;
