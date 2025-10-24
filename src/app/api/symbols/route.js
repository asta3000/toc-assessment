"use server";

import { NextResponse } from "next/server";

import { prisma } from "@/libs/client";
import cors from "@/libs/cors";
import { geterror, posterror } from "@/libs/constants";

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
