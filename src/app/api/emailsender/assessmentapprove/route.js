import Mail from "@/emails/assessmentapprove";
import { prisma } from "@/libs/client";

import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { render } from "@react-email/components";

export const POST = async (req) => {
  const { yearId, assessmentId, organizationId } = await req.json();
  const { MAIL_USER_SENDER, MAIL_HOST, MAIL_PASS, TOC_EMAIL } = process.env;

  const transporter = nodemailer.createTransport({
    host: MAIL_HOST,
    port: 465,
    secure: true,
    auth: {
      user: MAIL_USER_SENDER,
      pass: MAIL_PASS,
    },
  });

  const year = await prisma.year.findFirst({
    where: { id: yearId },
  });

  const assessment = await prisma.assessment.findFirst({
    where: { id: assessmentId },
  });

  const organization = await prisma.organization.findUnique({
    where: { id: organizationId },
  });

  const emailHtml = await render(
    <Mail
      year={year.name}
      assessment={assessment.name}
      organization={organization.name}
    />
  );

  const options = {
    from: MAIL_USER_SENDER,
    to: TOC_EMAIL,
    subject: "Үнэлгээний баталгаажуулалт зөвшөөрөв",
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
