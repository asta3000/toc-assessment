"use server";

import { NextResponse } from "next/server";

import { prisma } from "@/libs/client";
import cors from "@/libs/cors";
import { geterror } from "@/libs/constants";

export const GET = async () => {
  try {
    const statuses = await prisma.status.findMany({
      orderBy: [{ name: "asc" }],
    });

    return NextResponse.json(statuses, { status: 200, headers: cors });
  } catch (error) {
    console.error("CATCH: ", error);
    return NextResponse.json(
      { message: geterror },
      { status: 500, headers: cors }
    );
  }
};

// export const POST = async (req) => {
//   let data;
//   try {
//     const { name, status, description } = await req.json();
//     data = {
//       name,
//       status,
//       description,
//     };

//     const statuses = await prisma.status.create({
//       data,
//     });

//     return NextResponse.json(statuses, { status: 201, headers: cors });
//   } catch (error) {
//     console.error("CATCH: ", error);
//     return NextResponse.json(
//       { message: posterror },
//       { status: 500, headers: cors }
//     );
//   }
// };
