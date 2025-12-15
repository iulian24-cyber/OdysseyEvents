import Event from "../models/Event.js";

export const getEvents = async (req, res) => {
  const events = await Event.find().sort({ date: 1 });
  res.json(events);
};

export const createEvent = async (req, res) => {
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

    // ✅ MUST BE INCLUDED
    eventLink: eventLink || "",
    imageUrl: imageUrl || ""
  });

  res.status(201).json(event); // IMPORTANT: return the event
};

export const updateEvent = async (req, res) => {
  const event = await Event.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );

  if (!event) {
    return res.status(404).json({ message: "Event not found" });
  }

  res.json(event);
};

export const deleteEvent = async (req, res) => {
  const event = await Event.findByIdAndDelete(req.params.id);

  if (!event) {
    return res.status(404).json({ message: "Event not found" });
  }

  res.json({ message: "Event deleted" });
};