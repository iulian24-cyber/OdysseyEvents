import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendEmail = async ({ to, subject, html }) => {
  try {
    const result = await resend.emails.send({
      from: "Odyssey Events <notifications@odysseyevents.online>",
      to,
      subject,
      html
    });

    console.log("📨 Email sent!", result);
  } catch (err) {
    console.error("❌ Email error:", err);
  }
};
