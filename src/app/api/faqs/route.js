"use server";

import { NextResponse } from "next/server";

import { prisma } from "@/libs/client";
import cors from "@/libs/cors";
import { geterror, posterror } from "@/libs/constants";
import { faqSchema } from "@/libs/schemas";

export const GET = async () => {
  try {
    const faqs = await prisma.faq.findMany({
      orderBy: [{ question: "asc" }],
    });

    return NextResponse.json(faqs, { status: 200, headers: cors });
  } catch (error) {
    console.error("CATCH: ", error);
    return NextResponse.json(
      { message: geterror },
      { status: 500, headers: cors }
    );
  }
};

export const POST = async (req) => {
  let data;
  try {
    const { question, answer, status = "1" } = await req.json();

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

    const faq = await prisma.faq.create({
      data,
    });

    return NextResponse.json(faq, { status: 201, headers: cors });
  } catch (error) {
    console.error("CATCH: ", error);
    return NextResponse.json(
      { message: posterror },
      { status: 500, headers: cors }
    );
  }
};
