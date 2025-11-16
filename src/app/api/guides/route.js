"use server";

import { NextResponse } from "next/server";

import { prisma } from "@/libs/client";
import cors from "@/libs/cors";
import { geterror, posterror } from "@/libs/constants";
import { guideSchema } from "@/libs/schemas";

export const GET = async () => {
  try {
    const guides = await prisma.guide.findMany({
      orderBy: [{ name: "asc" }],
    });

    return NextResponse.json(guides, { status: 200, headers: cors });
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
      guideType,
      value,
    } = await req.json();

    const parsed = guideSchema?.safeParse({
      name,
      description,
      guideType,
      value,
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
      guideType,
      value,
    };

    const guide = await prisma.guide.create({
      data,
    });

    return NextResponse.json(guide, { status: 201, headers: cors });
  } catch (error) {
    console.error("CATCH: ", error);
    return NextResponse.json(
      { message: posterror },
      { status: 500, headers: cors }
    );
  }
};
