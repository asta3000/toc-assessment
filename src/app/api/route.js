"use server";

import { NextResponse } from "next/server";
import cors from "@/libs/cors";

export const GET = async (req) => {
  try {
    const result = {
      message: "API is running. You need the auth token",
      status: 200,
    };
    return NextResponse.json(result, { status: 401, headers: cors });
  } catch (error) {
    console.log("E: ", error);
  }
};
