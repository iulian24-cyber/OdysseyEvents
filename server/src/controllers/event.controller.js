import Event from "../models/Event.js";
import User from "../models/User.js";
import cloudinary from "../utils/cloudinary.js";
import { sendEmail } from "../utils/mailer.js";

/* =======================
   GET EVENTS (with filters)
======================= */
export const getEvents = async (req, res) => {
  try {
    const { page = 1, limit = 5, categories } = req.query;

    const filter = {};

    if (categories) {
      filter.category = { $in: categories.split(",") };
    }

    const events = await Event.find(filter)
      .sort({ date: 1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    res.json(events);
  } catch (err) {
    console.error("GetEvents error:", err);
    res.status(500).json({ message: "Failed to load events" });
  }
};

/* =======================
   CREATE EVENT + RESEND EMAILS
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
      eventLink
    } = req.body;

    const imageUrl = req.file?.path || "";

    // Save event
    const event = await Event.create({
      title,
      date,
      time,
      description,
      location,
      category,
      eventLink: eventLink || "",
      imageUrl
    });

    /* ===============================
       📧 SEND EMAILS (NON-BLOCKING)
    =============================== */

    const interestedUsers = await User.find({
      preferredCategories: category
    });

    console.log(`📨 Will notify ${interestedUsers.length} users (Resend)`);

    // Run email sending AFTER response returns
    setTimeout(() => {
      interestedUsers.forEach(async (u) => {
        try {
          await sendEmail({
            to: u.email,
            subject: `New ${category} Event: ${title}`,
            html: `
              <h2>${title}</h2>
              <p><b>Date:</b> ${date}</p>
              <p><b>Time:</b> ${time}</p>
              <p><b>Location:</b> ${location}</p>
              <p>${description}</p>

              ${
                eventLink
                  ? `<p><a href="${eventLink}" target="_blank">Check out event</a></p>`
                  : ""
              }

              <br/>
              <small>You receive this because you follow <b>${category}</b> events.</small>
            `,
          });
        } catch (err) {
          console.error(`❌ Error emailing ${u.email}:`, err);
        }
      });
    }, 300);

    return res.status(201).json(event);

  } catch (err) {
    console.error("CreateEvent error:", err);
    res.status(500).json({ message: "Failed to create event" });
  }
};


/* =======================
   UPDATE EVENT (replace image)
======================= */
export const updateEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    const {
      title,
      date,
      time,
      description,
      location,
      category,
      eventLink
    } = req.body;

    event.title = title;
    event.date = date;
    event.time = time;
    event.description = description;
    event.location = location;
    event.category = category;
    event.eventLink = eventLink;

    // 🔥 NEW IMAGE UPLOADED → replace old one
    if (req.file) {
      if (event.imageUrl) {
        const publicId = event.imageUrl.split("/").slice(-1)[0].split(".")[0];
        await cloudinary.uploader.destroy(`odyssey-events/${publicId}`);
      }

      event.imageUrl = req.file.path;
    }

    await event.save();

    res.json(event);
  } catch (err) {
    console.error("UpdateEvent error:", err);
    res.status(500).json({ message: "Failed to update event" });
  }
};

/* =======================
   DELETE EVENT (remove image)
======================= */
export const deleteEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    // 🔥 delete image from Cloudinary
    if (event.imageUrl) {
      const publicId = event.imageUrl.split("/").slice(-1)[0].split(".")[0];
      await cloudinary.uploader.destroy(`odyssey-events/${publicId}`);
    }

    await event.deleteOne();

    res.json({ message: "Event deleted" });
  } catch (err) {
    console.error("DeleteEvent error:", err);
    res.status(500).json({ message: "Failed to delete event" });
  }
};
