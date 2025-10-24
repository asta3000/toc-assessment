"use server";

import { NextResponse } from "next/server";

import { prisma } from "@/libs/client";
import cors from "@/libs/cors";
import { geterror, puterror } from "@/libs/constants";

export const GET = async (req, { params }) => {
  const { slug } = await params;

  try {
    const parameters = await prisma.parameter.findMany({
      where: { id: slug },
    });

    if (!slug) {
      throw new Error(geterror);
    }

    return NextResponse.json(parameters, { status: 200, headers: cors });
  } catch (error) {
    console.error("CATCH: ", error);
    return NextResponse.json(
      { message: geterror },
      { status: 500, headers: cors }
    );
  }
};

export const PUT = async (req, { params }) => {
  let data;
  const { slug } = await params;
  try {
    const { name, value, description } = await req.json();

    if (!name || !value || !description) {
      throw new Error(puterror);
    }

    data = {
      name,
      value,
      description,
    };

    const parameter = await prisma.parameter.update({
      where: { id: slug },
      data,
    });

    return NextResponse.json(parameter, { status: 200, headers: cors });
  } catch (error) {
    console.error("CATCH: ", error);
    return NextResponse.json(
      { message: puterror },
      { status: 500, headers: cors }
    );
  }
};
