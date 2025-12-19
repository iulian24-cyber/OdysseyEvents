import nodemailer from "nodemailer";

// Use environment variables
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.MAIL_USER,   // Your Gmail
    pass: process.env.MAIL_PASS,   // App password
  },
});

export const sendEmail = async ({ to, subject, text, html }) => {
  try {
    await transporter.sendMail({
      from: `"OdysseyEvents" <${process.env.MAIL_USER}>`,
      to,
      subject,
      text,
      html,
    });
  } catch (err) {
    console.error("Email Send Error:", err);
  }
};
