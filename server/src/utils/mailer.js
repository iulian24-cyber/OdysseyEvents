import nodemailer from "nodemailer";

// ===============================
//  CREATE TRANSPORTER (GMAIL)
// ===============================
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.MAIL_USER,   // Gmail address
    pass: process.env.MAIL_PASS,   // 16-digit App Password
  },
});

// ===============================
//  VERIFY CONNECTION ON START
// ===============================
transporter.verify((error, success) => {
  if (error) {
    console.error("❌ MAILER CONNECTION FAILED:");
    console.error(error);
  } else {
    console.log("✅ MAILER READY TO SEND EMAILS");
  }
});

// ===============================
//  SEND EMAIL FUNCTION
// ===============================
export const sendEmail = async ({ to, subject, text, html }) => {
  try {
    console.log("📧 Attempting to send email to:", to);

    await transporter.sendMail({
      from: `"OdysseyEvents" <${process.env.MAIL_USER}>`,
      to,
      subject,
      text,
      html,
    });

    console.log("✅ Email sent successfully to:", to);
  } catch (err) {
    console.error("❌ Email Send Error:", err);
  }
};
