"use server";

import { NextResponse } from "next/server";

import { prisma } from "@/libs/client";
import cors from "@/libs/cors";
import { puterror } from "@/libs/constants";

export const PUT = async (req) => {
  try {
    const body = await req.json();

    const result = await prisma.$transaction(async (tx) => {
      // Шинээр эрэмбэлэх захиалгыг үүсгэж байна.
      const orderRequest = body.map((data) =>
        tx.question.update({
          where: { id: data.id },
          data: { order: data.order },
        })
      );

      // Захиалгуудыг хэрэгжүүлж байна.
      const orderedNews = await Promise.all(orderRequest);

      return orderedNews;
    });

    return NextResponse.json(result, { status: 200, headers: cors });
  } catch (error) {
    console.error("CATCH: ", puterror);
    return NextResponse.json({}, { status: 400, headers: cors });
  }
};
