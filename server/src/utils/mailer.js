import { Resend } from "resend";

if (!process.env.RESEND_API_KEY) {
  console.error("❌ Missing RESEND_API_KEY in environment!");
}

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendEmail = async ({ to, subject, html }) => {
  try {
    console.log("📧 Sending email to:", to);

    const { data, error } = await resend.emails.send({
      from: "Odyssey Events <onboarding@resend.dev>", 
      // Later you can replace with a verified domain:
      // from: "Odyssey Events <no-reply@yourdomain.com>",
      to,
      subject,
      html,
    });

    if (error) {
      console.error("❌ Email error:", error);
      return;
    }

    console.log("✅ Email sent!", data);
  } catch (err) {
    console.error("❌ Email Send Failed:", err);
  }
};
