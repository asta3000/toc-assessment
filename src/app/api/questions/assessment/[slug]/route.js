"use server";

import { NextResponse } from "next/server";

import { prisma } from "@/libs/client";
import cors from "@/libs/cors";
import { geterror } from "@/libs/constants";

export const GET = async (req, { params }) => {
  const { slug } = await params;
  try {
    if (!slug) {
      throw new Error(geterror);
    }

    const questions = await prisma.question.findMany({
      where: { assessmentId: slug, status: "1" },
      orderBy: [
        { Assessment: { name: "asc" } },
        { Module: { name: "asc" } },
        { order: "asc" },
      ],
      include: {
        Assessment: { select: { id: true, name: true } },
        Module: { select: { id: true, name: true, goal: true } },
        AnswerType: { select: { id: true, classification: true } },
        QuestionType: {
          select: { id: true, classification: true, description: true },
        },
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
