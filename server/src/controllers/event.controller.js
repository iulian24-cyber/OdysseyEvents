import Event from "../models/Event.js";
import User from "../models/User.js";
import cloudinary from "../utils/cloudinary.js";
import { sendEmail } from "../utils/mailer.js";

/* =======================
   GET EVENTS (with filters)
   - by default only approved events are returned
   - moderators can query admin=true to see all
======================= */
export const getEvents = async (req, res) => {
  try {
    const { page = 1, limit = 5, categories, admin } = req.query;

    const filter = {};

    if (categories) {
      filter.category = { $in: categories.split(",") };
    }

    // default: only approved (also include legacy documents with no `status` field)
    if (!(admin === "true" && req.user?.role === "moderator")) {
      filter.$or = [
        { status: "approved" },
        { status: { $exists: false } }
      ];
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
   CREATE EVENT (moderator-only) + RESEND EMAILS
   - existing route for moderators
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

    // Save event as approved (moderator-created)
    const event = await Event.create({
      title,
      date,
      time,
      description,
      location,
      category,
      eventLink: eventLink || "",
      imageUrl,
      status: "approved",
      approvedBy: req.user?.id || null,
      approvedAt: new Date()
    });

    // notify interested users
    const interestedUsers = await User.find({
      preferredCategories: category
    });

    console.log(`📨 Will notify ${interestedUsers.length} users (Resend)`);

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
   SUBMIT EVENT (user submissions)
   - creates a pending event for moderators to review
   - moderators submitting here will auto-approve
======================= */
export const submitEvent = async (req, res) => {
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

    const isModerator = req.user?.role === "moderator";

    const event = await Event.create({
      title,
      date,
      time,
      description,
      location,
      category,
      eventLink: eventLink || "",
      imageUrl,
      status: isModerator ? "approved" : "pending",
      submittedBy: req.user?.id || null,
      submittedAt: new Date(),
      approvedBy: isModerator ? req.user?.id : null,
      approvedAt: isModerator ? new Date() : null
    });

    // If auto-approved (moderator submit), notify users
    if (isModerator) {
      const interestedUsers = await User.find({
        preferredCategories: category
      });

      console.log(`📨 Will notify ${interestedUsers.length} users (Resend)`);

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
    }

    res.status(201).json(event);
  } catch (err) {
    console.error("SubmitEvent error:", err);
    res.status(500).json({ message: "Failed to submit event" });
  }
};

/* =======================
   GET PENDING EVENTS (moderator)
======================= */
export const getPendingEvents = async (req, res) => {
  try {
    // populate submitter username + email for moderator UI
    const events = await Event.find({ status: "pending" })
      .sort({ submittedAt: -1 })
      .populate("submittedBy", "username email");

    res.json(events);
  } catch (err) {
    console.error("GetPendingEvents error:", err);
    res.status(500).json({ message: "Failed to load pending events" });
  }
};

/* =======================
   APPROVE EVENT (moderator)
======================= */
export const approveEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    event.status = "approved";
    event.approvedBy = req.user.id;
    event.approvedAt = new Date();
    await event.save();

    // notify interested users
    const interestedUsers = await User.find({
      preferredCategories: event.category
    });

    console.log(`📨 Will notify ${interestedUsers.length} users (Resend)`);

    setTimeout(() => {
      interestedUsers.forEach(async (u) => {
        try {
          await sendEmail({
            to: u.email,
            subject: `New ${event.category} Event: ${event.title}`,
            html: `
              <h2>${event.title}</h2>
              <p><b>Date:</b> ${event.date}</p>
              <p><b>Time:</b> ${event.time}</p>
              <p><b>Location:</b> ${event.location}</p>
              <p>${event.description}</p>

              ${
                event.eventLink
                  ? `<p><a href="${event.eventLink}" target="_blank">Check out event</a></p>`
                  : ""
              }

              <br/>
              <small>You receive this because you follow <b>${event.category}</b> events.</small>
            `,
          });
        } catch (err) {
          console.error(`❌ Error emailing ${u.email}:`, err);
        }
      });
    }, 300);

    res.json(event);
  } catch (err) {
    console.error("ApproveEvent error:", err);
    res.status(500).json({ message: "Failed to approve event" });
  }
};

/* =======================
   DECLINE EVENT (moderator)
======================= */
export const declineEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id).populate("submittedBy", "username email");

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    event.status = "rejected";
    event.approvedBy = req.user.id;
    event.approvedAt = new Date();
    await event.save();

    // notify submitter if present
    if (event.submittedBy?.email) {
      try {
        await sendEmail({
          to: event.submittedBy.email,
          subject: `Your submission was declined: ${event.title}`,
          html: `
            <h3>Your event submission has been declined</h3>
            <p>Title: <b>${event.title}</b></p>
            <p>If you have questions, reply to this email.</p>
          `
        });
      } catch (err) {
        console.error(`❌ Error emailing submitter ${event.submittedBy.email}:`, err);
      }
    }

    res.json({ message: "Event declined" });
  } catch (err) {
    console.error("DeclineEvent error:", err);
    res.status(500).json({ message: "Failed to decline event" });
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