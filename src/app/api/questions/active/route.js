"use server";

import { NextResponse } from "next/server";

import { prisma } from "@/libs/client";
import cors from "@/libs/cors";
import { geterror } from "@/libs/constants";

export const GET = async () => {
  try {
    const questions = await prisma.question.findMany({
      where: { status: "1" },
      orderBy: { name: "asc" },
      include: {
        Assessment: { select: { id: true, name: true } },
        Module: { select: { id: true, name: true, goal: true } },
        AnswerType: { select: { id: true, name: true, classification: true } },
        QuestionType: { select: { id: true, name: true } },
      },
    });

    return NextResponse.json(questions, { status: 200, headers: cors });
  } catch (error) {
    console.error("CATCH: ", error);
    return NextResponse.json(
      { message: geterror },
      { status: 500, headers: cors }
    );
  }
};
