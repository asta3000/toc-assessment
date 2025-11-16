"use server";

import { NextResponse } from "next/server";

import { prisma } from "@/libs/client";
import cors from "@/libs/cors";
import { geterror, posterror } from "@/libs/constants";
import { moduleSchema } from "@/libs/schemas";

export const GET = async () => {
  try {
    const modules = await prisma.module.findMany({
      orderBy: [{ Assessment: { name: "asc" } }, { name: "asc" }],
      include: {
        Assessment: {
          select: {
            id: true,
            name: true,
            abstract: true,
            content: true,
            goal: true,
          },
        },
      },
    });

    return NextResponse.json(modules, { status: 200, headers: cors });
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
    const {
      name,
      status = "1",
      description,
      assessmentId,
      goal,
    } = await req.json();

    const parsed = moduleSchema?.safeParse({
      name,
      description,
      assessmentId,
      goal,
    });

    if (!parsed?.success) {
      const firstError = parsed?.error?.issues[0];
      return NextResponse.json(
        { message: firstError?.message },
        { status: 302, headers: cors }
      );
    }

    data = {
      name,
      status,
      description,
      assessmentId,
      goal,
    };

    const modules = await prisma.module.create({
      data,
    });

    return NextResponse.json(modules, { status: 201, headers: cors });
  } catch (error) {
    console.error("CATCH: ", error);
    return NextResponse.json(
      { message: posterror },
      { status: 500, headers: cors }
    );
  }
};
