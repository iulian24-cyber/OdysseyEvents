import { Router } from "express";
import { getEvents, createEvent } from "../controllers/event.controller.js";
import { protect } from "../middleware/auth.middleware.js";
import { moderatorOnly } from "../middleware/moderator.middleware.js";
import { updateEvent, deleteEvent } from "../controllers/event.controller.js";  

const router = Router();


router.get("/", protect, getEvents);
router.post("/", protect, moderatorOnly, createEvent);
router.put("/:id", protect, moderatorOnly, updateEvent);
router.delete("/:id", protect, moderatorOnly, deleteEvent);

export default router;
