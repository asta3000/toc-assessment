"use server";

import { NextResponse } from "next/server";

import { prisma } from "@/libs/client";
import cors from "@/libs/cors";
import { geterror, posterror } from "@/libs/constants";

export const GET = async () => {
  try {
    const types = await prisma.answerType.findMany({
      orderBy: [{ name: "asc" }],
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
    const { name, classification, description, status } = await req.json();
    data = {
      name,
      classification,
      description,
      status,
    };

    const type = await prisma.answerType.create({
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
