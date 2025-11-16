"use server";

import { NextResponse } from "next/server";

import { prisma } from "@/libs/client";
import cors from "@/libs/cors";
import { geterror, posterror } from "@/libs/constants";
import { symbolSchema } from "@/libs/schemas";

export const GET = async () => {
  try {
    const symbols = await prisma.symbol.findMany({
      orderBy: [{ name: "asc" }],
    });

    return NextResponse.json(symbols, { status: 200, headers: cors });
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

    const symbol = await prisma.symbol.create({
      data,
    });

    return NextResponse.json(symbol, { status: 201, headers: cors });
  } catch (error) {
    console.error("CATCH: ", error);
    return NextResponse.json(
      { message: posterror },
      { status: 500, headers: cors }
    );
  }
};
