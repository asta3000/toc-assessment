import Mail from "@/emails/otp";
import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { render } from "@react-email/components";

export const POST = async (req) => {
  const { email, otp } = await req.json();
  const { MAIL_USER_SENDER, MAIL_HOST, MAIL_PASS } = process.env;

  const transporter = nodemailer.createTransport({
    host: MAIL_HOST,
    port: 465,
    secure: true,
    auth: {
      user: MAIL_USER_SENDER,
      pass: MAIL_PASS,
    },
  });

  const emailHtml = await render(<Mail email={email} otp={otp} />);

  const options = {
    from: MAIL_USER_SENDER,
    to: email,
    subject: "Төхөөрөмж баталгаажуулалт",
    html: emailHtml,
  };

  await transporter.sendMail(options);

  return NextResponse.json(
    {
      success: true,
    },
    { status: 200 }
  );
};
