"use server";

import { NextResponse } from "next/server";

import { prisma } from "@/libs/client";
import cors from "@/libs/cors";
import { posterror } from "@/libs/constants";

// Баталгаажуулаагүй бүх хариултыг бүхэлд нь баталгаажуулахад ашиглана.
export const POST = async (req) => {
  try {
    const { organizationId, yearId, assessmentId } = await req.json();

    await prisma.$transaction(async (tx) => {
      await tx.answer.updateMany({
        where: { organizationId, yearId, assessmentId, isVerified: false },
        data: {
          isVerified: true,
        },
      });
    });

    return NextResponse.json(true, { status: 200, headers: cors });
  } catch (error) {
    console.error("CATCH: ", error);
    return NextResponse.json(
      { message: posterror },
      { status: 500, headers: cors }
    );
  }
};
