import Event from "../models/Event.js";

/* =======================
   GET EVENTS (with filters)
======================= */
export const getEvents = async (req, res) => {
  try {
    const { page = 1, limit = 5, categories } = req.query;

    const filter = {};

    // 🔑 CATEGORY FILTER (For You)
    if (categories) {
      filter.category = {
        $in: categories.split(",")
      };
    }

    const events = await Event.find(filter)
      .sort({ date: 1 }) // upcoming first
      .skip((page - 1) * limit)
      .limit(Number(limit));

    res.json(events);
  } catch (err) {
    console.error("GetEvents error:", err);
    res.status(500).json({ message: "Failed to load events" });
  }
};

/* =======================
   CREATE EVENT
======================= */
export const createEvent = async (req, res) => {
  try {
    const {
      title,
      date,
      time,
      description,
      location,
      category,
      eventLink,
      imageUrl
    } = req.body;

    const event = await Event.create({
      title,
      date,
      time,
      description,
      location,
      category,
      eventLink: eventLink || "",
      imageUrl: imageUrl || ""
    });

    res.status(201).json(event);
  } catch (err) {
    console.error("CreateEvent error:", err);
    res.status(500).json({ message: "Failed to create event" });
  }
};

/* =======================
   UPDATE EVENT
======================= */
export const updateEvent = async (req, res) => {
  try {
    const event = await Event.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    res.json(event);
  } catch (err) {
    console.error("UpdateEvent error:", err);
    res.status(500).json({ message: "Failed to update event" });
  }
};

/* =======================
   DELETE EVENT
======================= */
export const deleteEvent = async (req, res) => {
  try {
    const event = await Event.findByIdAndDelete(req.params.id);

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    res.json({ message: "Event deleted" });
  } catch (err) {
    console.error("DeleteEvent error:", err);
    res.status(500).json({ message: "Failed to delete event" });
  }
};
