import { Router } from "express";
import { sendEmail } from "../utils/mailer.js";

const router = Router();

// POST /api/contact/
router.post("/", async (req, res) => {
  try {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ message: "Name, email and message are required" });
    }

    // send to site admin inbox
    await sendEmail({
      to: process.env.CONTACT_EMAIL || "notifications@odysseyevents.online",
      subject: `Contact form: ${name}`,
      html: `
        <h3>New contact form submission</h3>
        <p><b>Name:</b> ${name}</p>
        <p><b>Email:</b> ${email}</p>
        <p><b>Message:</b></p>
        <p>${message}</p>
      `
    });

    res.json({ message: "Message sent" });
  } catch (err) {
    console.error("Contact error:", err);
    res.status(500).json({ message: "Failed to send message" });
  }
});

export default router;
