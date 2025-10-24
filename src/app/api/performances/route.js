"use server";

import { NextResponse } from "next/server";

import { prisma } from "@/libs/client";
import cors from "@/libs/cors";
import { geterror, posterror, STATUS_NEW } from "@/libs/constants";

export const GET = async () => {
  try {
    const performances = await prisma.performance.findMany({
      where: { Assessment: { status: "1" } },
      orderBy: { Organization: { name: "asc" } },
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

export const POST = async (req) => {
  try {
    const {
      organizationId,
      yearId,
      assessmentId,
      statusId = STATUS_NEW,
    } = await req.json();
    // console.log("ROUTE: ", answer, optionAnswer);

    await prisma.$transaction(async (tx) => {
      const performance = await tx.performance.findMany({
        where: {
          organizationId,
          yearId,
          assessmentId,
        },
        select: { id: true, statusId: true },
      });

      if (performance.length === 1) {
        await tx.performance.update({
          where: { id: performance[0].id },
          data: {
            statusId,
          },
        });
      }
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
