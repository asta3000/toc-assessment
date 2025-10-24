"use server";

import { NextResponse } from "next/server";

import { prisma } from "@/libs/client";
import cors from "@/libs/cors";
import { geterror } from "@/libs/constants";

export const GET = async () => {
  try {
    const subQuestions = await prisma.subQuestion.findMany({
      orderBy: [{ name: "asc" }],
      include: {
        Question: {
          select: {
            id: true,
            name: true,
            name_en: true,
          },
        },
      },
    });

    return NextResponse.json(subQuestions, { status: 200, headers: cors });
  } catch (error) {
    console.error("CATCH: ", error);
    return NextResponse.json(
      { message: geterror },
      { status: 500, headers: cors }
    );
  }
};
