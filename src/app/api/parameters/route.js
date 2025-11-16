"use server";

import { NextResponse } from "next/server";

import { prisma } from "@/libs/client";
import cors from "@/libs/cors";
import { geterror, posterror } from "@/libs/constants";
import { parameterSchema } from "@/libs/schemas";

export const GET = async () => {
  try {
    const parameters = await prisma.parameter.findMany({
      orderBy: [{ name: "asc" }],
    });

    return NextResponse.json(parameters, { status: 200, headers: cors });
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
    const { name, value, description } = await req.json();

    const parsed = parameterSchema?.safeParse({
      name,
      value,
      description,
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
      value,
      description,
    };

    const parameter = await prisma.parameter.create({
      data,
    });

    return NextResponse.json(parameter, { status: 201, headers: cors });
  } catch (error) {
    console.error("CATCH: ", error);
    return NextResponse.json(
      { message: posterror },
      { status: 500, headers: cors }
    );
  }
};
