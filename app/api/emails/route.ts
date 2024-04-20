import { Resend } from "resend";
import Welcome from "@/emails/Welcome";

const resend = new Resend(process.env.RESEND_API_KEY);
export async function POST(request) {
  const { email, firstName, lastName, subject, body } = await request.json();
  console.log("Hello here");
  await resend.emails.send({
    from: "onboarding@resend.dev",
    to: email || "leereal08@ymail.com",
    subject: subject || "Welcome to Resend!",
    react: Welcome({ email, firstName, lastName, subject, body }),
  });
}
