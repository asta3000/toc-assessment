"use server";

import { NextResponse } from "next/server";

import { prisma } from "@/libs/client";
import cors from "@/libs/cors";
import { posterror } from "@/libs/constants";

export const GET = async () => {
  try {
    const operations = await prisma.operation.findMany({
      orderBy: [{ name: "asc" }],
    });

    return NextResponse.json(operations, { status: 200, headers: cors });
  } catch (error) {
    console.error("CATCH: ", error);
    return NextResponse.json({}, { status: 500, headers: cors });
  }
};

export const POST = async (req) => {
  let data;
  try {
    const { name, status, description } = await req.json();
    data = {
      name,
      status,
      description,
    };

    const operation = await prisma.operation.create({
      data,
    });

    return NextResponse.json(operation, { status: 201, headers: cors });
  } catch (error) {
    console.error("CATCH: ", error);
    return NextResponse.json(
      { message: posterror },
      { status: 500, headers: cors }
    );
  }
};
