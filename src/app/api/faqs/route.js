"use server";

import { NextResponse } from "next/server";

import { prisma } from "@/libs/client";
import cors from "@/libs/cors";
import { geterror, posterror } from "@/libs/constants";

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
    const { question, answer, status } = await req.json();
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
