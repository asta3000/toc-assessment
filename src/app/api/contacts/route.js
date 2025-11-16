"use server";

import { NextResponse } from "next/server";

import { prisma } from "@/libs/client";
import cors from "@/libs/cors";
import { geterror, posterror } from "@/libs/constants";
import { contactSchema } from "@/libs/schemas";

export const GET = async () => {
  try {
    const contacts = await prisma.contact.findMany({
      orderBy: [{ name: "asc" }],
    });

    return NextResponse.json(contacts, { status: 200, headers: cors });
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
    const { name, value, status = "1" } = await req.json();

    const parsed = contactSchema?.safeParse({
      name,
      value,
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
      status,
    };

    const contact = await prisma.contact.create({
      data,
    });

    return NextResponse.json(contact, { status: 201, headers: cors });
  } catch (error) {
    console.error("CATCH: ", error);
    return NextResponse.json(
      { message: posterror },
      { status: 500, headers: cors }
    );
  }
};
