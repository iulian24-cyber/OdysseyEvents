import Event from "../models/Event.js";

export const getEvents = async (req, res) => {
  const events = await Event.find().sort({ date: 1 });
  res.json(events);
};

export const createEvent = async (req, res) => {
  const { title, description, date } = req.body;

  const event = await Event.create({
    title,
    description,
    date,
    createdBy: req.user.id
  });

  res.status(201).json(event);
};
