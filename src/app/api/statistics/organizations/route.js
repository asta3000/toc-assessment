"use server";

import { NextResponse } from "next/server";

import { prisma } from "@/libs/client";
import cors from "@/libs/cors";
import { geterror } from "@/libs/constants";
import { getRandomHexColor } from "@/libs/generate";

// Баталгаажуулагч хуудасны dashboard
// Бүртгэлтэй байгууллагыг гишүүнчлэлийн төрлөөр харахад ашиглаж байна.
export const GET = async () => {
  try {
    const results = await prisma.$transaction(async (tx) => {
      const organizations = await tx.organization.findMany({
        where: {
          NOT: { memberId: null },
          status: "1",
        },
        include: {
          Member: true,
        },
      });

      const members = await tx.member.findMany({
        where: { status: "1" },
      });

      const dashboard1 = [];
      const colors = [];
      for (const member of members) {
        dashboard1.push({
          name: member.name,
          value:
            organizations.filter((o) => o.memberId === member.id).length ?? 0,
        });

        const hexColor = getRandomHexColor();
        colors.push(hexColor);
      }

      return { colors, dashboard1 };
    });

    return NextResponse.json(results, { status: 200, headers: cors });
  } catch (error) {
    console.log("E: ", error);
    return NextResponse.json(
      { message: geterror },
      { status: 500, headers: cors }
    );
  }
};
