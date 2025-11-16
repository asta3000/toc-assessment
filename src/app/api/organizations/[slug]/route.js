"use server";

import { NextResponse } from "next/server";

import { prisma } from "@/libs/client";
import cors from "@/libs/cors";
import { geterror, puterror } from "@/libs/constants";
import { organizationSchema } from "@/libs/schemas";

export const GET = async (req, { params }) => {
  const { slug } = await params;
  try {
    const organization = await prisma.organization.findMany({
      where: { id: slug },
      include: {
        Member: { select: { id: true, name: true } },
        Operation: { select: { id: true, name: true } },
        Sector: { select: { id: true, name: true } },
      },
    });

    return NextResponse.json(organization, { status: 200, headers: cors });
  } catch (error) {
    console.error("E: ", error);
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
    const { name, memberId, operationId, sectorId, status } = await req.json();

    const parsed = organizationSchema?.safeParse({
      name,
      memberId,
      operationId,
      sectorId,
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
      memberId,
      operationId,
      sectorId,
      status,
    };

    const organization = await prisma.organization.update({
      where: { id: slug },
      data,
    });

    return NextResponse.json(organization, { status: 200, headers: cors });
  } catch (error) {
    console.error("E: ", error);
    return NextResponse.json(
      { message: puterror },
      { status: 500, headers: cors }
    );
  }
};
