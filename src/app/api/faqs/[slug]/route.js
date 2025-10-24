"use server";

import { NextResponse } from "next/server";

import { prisma } from "@/libs/client";
import cors from "@/libs/cors";
import { puterror } from "@/libs/constants";

export const PUT = async (req, { params }) => {
  let data;
  const { slug } = await params;
  try {
    const { question, answer, status } = await req.json();
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
