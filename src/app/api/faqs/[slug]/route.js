"use server";

import { NextResponse } from "next/server";

import { prisma } from "@/libs/client";
import cors from "@/libs/cors";
import { puterror } from "@/libs/constants";
import { faqSchema } from "@/libs/schemas";

export const PUT = async (req, { params }) => {
  let data;
  const { slug } = await params;
  try {
    const { question, answer, status } = await req.json();

    const parsed = faqSchema?.safeParse({
      question,
      answer,
    });

    if (!parsed?.success) {
      const firstError = parsed?.error?.issues[0];
      return NextResponse.json(
        { message: firstError?.message },
        { status: 302, headers: cors }
      );
    }

    data = {
      question,
      answer,
      status,
    };

    const faq = await prisma.faq.update({
      where: { id: slug },
      data,
    });

    return NextResponse.json(faq, { status: 200, headers: cors });
  } catch (error) {
    console.error("CATCH: ", error);
    return NextResponse.json(
      { message: puterror },
      { status: 500, headers: cors }
    );
  }
};
