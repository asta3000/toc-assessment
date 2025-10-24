import Mail from "@/emails/verificationsend";
import { prisma } from "@/libs/client";

import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { render } from "@react-email/components";

export const POST = async (req) => {
  const { yearId, assessmentId, organizationId } = await req.json();
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

  const organization = await prisma.organization.findUnique({
    where: { id: organizationId },
  });

  const year = await prisma.year.findUnique({
    where: { id: yearId },
  });

  const assessment = await prisma.assessment.findUnique({
    where: { id: assessmentId },
  });

  const emailHtml = await render(
    <Mail
      year={year.name}
      assessment={assessment.name}
      organization={organization.name}
    />
  );

  const users = await prisma.user.findMany({
    where: { organizationId },
  });

  for (const to of users) {
    const options = {
      from: MAIL_USER_SENDER,
      to: "asta3000@gmail.com",
      subject: "Баталгаажуулалт илгээлт",
      html: emailHtml,
    };

    await transporter.sendMail(options);
  }

  return NextResponse.json(
    {
      success: true,
    },
    { status: 200 }
  );
};
