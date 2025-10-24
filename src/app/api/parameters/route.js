"use server";

import { NextResponse } from "next/server";

import { prisma } from "@/libs/client";
import cors from "@/libs/cors";
import { geterror, posterror } from "@/libs/constants";

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

    if (!name || !value || !description) {
      throw new Error(posterror);
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
