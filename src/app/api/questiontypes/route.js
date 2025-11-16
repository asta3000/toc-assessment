"use server";

import { NextResponse } from "next/server";

import { prisma } from "@/libs/client";
import cors from "@/libs/cors";
import { geterror, posterror } from "@/libs/constants";
import { questionTypeSchema } from "@/libs/schemas";

export const GET = async () => {
  try {
    const types = await prisma.questionType.findMany({
      orderBy: [
        { Assessment: { name: "asc" } },
        { Module: { name: "asc" } },
        { name: "asc" },
      ],
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

export const POST = async (req) => {
  let data;
  try {
    const {
      name,
      classification,
      description,
      status = "1",
      assessmentId,
      moduleId,
    } = await req.json();

    const parsed = questionTypeSchema?.safeParse({
      name,
      classification,
      description,
      assessmentId,
      moduleId,
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
      classification,
      description,
      status,
      assessmentId,
      moduleId,
    };

    const type = await prisma.questionType.create({
      data,
    });

    return NextResponse.json(type, { status: 201, headers: cors });
  } catch (error) {
    console.error("CATCH: ", error);
    return NextResponse.json(
      { message: posterror },
      { status: 500, headers: cors }
    );
  }
};
