"use server";

import { NextResponse } from "next/server";

import { prisma } from "@/libs/client";
import cors from "@/libs/cors";
import { geterror } from "@/libs/constants";

export const GET = async (req, { params }) => {
  const { slug } = await params;
  try {
    const performances = await prisma.performance.findMany({
      where: { organizationId: slug, Assessment: { status: "1" } },
      include: {
        Organization: true,
        Status: true,
        Assessment: true,
        Year: true,
      },
    });

    return NextResponse.json(performances, { status: 200, headers: cors });
  } catch (error) {
    console.error("CATCH: ", error);
    return NextResponse.json(
      { message: geterror },
      { status: 500, headers: cors }
    );
  }
};
