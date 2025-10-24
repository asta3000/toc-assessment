"use server";

import { NextResponse } from "next/server";

import { prisma } from "@/libs/client";
import cors from "@/libs/cors";
import { geterror } from "@/libs/constants";

export const POST = async (req) => {
  try {
    const { organizationId, yearId, assessmentId } = await req.json();

    if (!organizationId || !yearId || !assessmentId) {
      throw new Error(geterror);
    }

    const [answers, optionAnswers] = await Promise.all([
      prisma.answer.findMany({
        where: {
          organizationId,
          yearId,
          assessmentId,
        },
      }),
      prisma.optionAnswer.findMany({
        where: {
          organizationId,
          yearId,
          assessmentId,
        },
      }),
    ]);

    return NextResponse.json(
      { answers, optionAnswers },
      { status: 200, headers: cors }
    );
  } catch (error) {
    console.error("CATCH: ", error);
    return NextResponse.json(
      { message: geterror },
      { status: 500, headers: cors }
    );
  }
};
