"use server";

import { NextResponse } from "next/server";

import { prisma } from "@/libs/client";
import cors from "@/libs/cors";
import { CYCLE, puterror, STATUS_FILLING } from "@/libs/constants";

export const PUT = async (req, { params }) => {
  let data;
  let urlEmail;
  const { slug } = await params;
  try {
    const { statusId, cycle } = await req.json();

    await prisma.$transaction(async (tx) => {
      // Байгууллагын хариунаас хамаарч үнэлгээний төлөв өөрчлөлт

      const cycle = await tx.parameter.findFirst({
        where: {
          id: CYCLE,
        },
      });

      // Дууссан төлөвтэй бол шууд төлөв солино.
      if (statusId === STATUS_FILLING && cycle < Number(cycle[0]?.value)) {
        data = {
          statusId,
          cycle: Number(cycle) + 1,
        };
      } else {
        data = {
          statusId,
        };
      }

      await tx.performance.update({
        where: { id: slug },
        data,
      });
    });

    return NextResponse.json(true, { status: 200, headers: cors });
  } catch (error) {
    console.error("CATCH: ", error);
    return NextResponse.json(
      { message: puterror },
      { status: 500, headers: cors }
    );
  }
};
