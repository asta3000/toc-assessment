"use server";

import { NextResponse } from "next/server";

import { prisma } from "@/libs/client";
import cors from "@/libs/cors";
import { puterror } from "@/libs/constants";
import { questionTypeSchema } from "@/libs/schemas";

export const PUT = async (req, { params }) => {
  let data;
  const { slug } = await params;
  try {
    const {
      name,
      classification,
      description,
      status,
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

    const types = await prisma.questionType.update({
      where: { id: slug },
      data,
    });

    return NextResponse.json(types, { status: 200, headers: cors });
  } catch (error) {
    console.error("CATCH: ", error);
    return NextResponse.json(
      { message: puterror },
      { status: 500, headers: cors }
    );
  }
};
