"use server";

import { NextResponse } from "next/server";

import { prisma } from "@/libs/client";
import cors from "@/libs/cors";
import { puterror } from "@/libs/constants";
import { symbolSchema } from "@/libs/schemas";

export const PUT = async (req, { params }) => {
  let data;
  const { slug } = await params;
  try {
    const { min, max, name } = await req.json();

    const parsed = symbolSchema?.safeParse({
      min,
      max,
      name,
    });

    if (!parsed?.success) {
      const firstError = parsed?.error?.issues[0];
      return NextResponse.json(
        { message: firstError?.message },
        { status: 302, headers: cors }
      );
    }

    data = {
      min: parseInt(min),
      max: parseInt(max),
      name,
    };

    const symbol = await prisma.symbol.update({
      where: { id: slug },
      data,
    });

    return NextResponse.json(symbol, { status: 200, headers: cors });
  } catch (error) {
    console.error("CATCH: ", error);
    return NextResponse.json(
      { message: puterror },
      { status: 500, headers: cors }
    );
  }
};
