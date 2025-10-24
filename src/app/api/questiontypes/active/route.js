"use server";

import { NextResponse } from "next/server";

import { prisma } from "@/libs/client";
import cors from "@/libs/cors";
import { geterror } from "@/libs/constants";

export const GET = async () => {
  try {
    const types = await prisma.questionType.findMany({
      where: { status: "1" },
      orderBy: [{ assessmentId: "asc" }, { moduleId: "asc" }, { name: "asc" }],
      include: {
        Assessment: true,
        Module: true,
      },
    });

    return NextResponse.json(types, { status: 200, headers: cors });
  } catch (error) {
    console.error("CATCH: ", error);
    return NextResponse.json(
      { message: geterror },
      { status: 500, headers: cors }
    );
  }
};
