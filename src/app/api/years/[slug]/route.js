"use server";

import { NextResponse } from "next/server";

import { prisma } from "@/libs/client";
import cors from "@/libs/cors";
import { puterror } from "@/libs/constants";

export const PUT = async (req, { params }) => {
  let data;
  const { slug } = await params;
  try {
    const { name, status } = await req.json();
    data = {
      name,
      status,
    };

    if (status === "1") {
      await prisma.year.updateMany({
        where: { status: "1" },
        data: {
          status: "0",
        },
      });
    }

    const year = await prisma.year.update({
      where: { id: slug },
      data,
    });

    return NextResponse.json(year, { status: 200, headers: cors });
  } catch (error) {
    console.error("CATCH: ", error);
    return NextResponse.json(
      { message: puterror },
      { status: 500, headers: cors }
    );
  }
};
