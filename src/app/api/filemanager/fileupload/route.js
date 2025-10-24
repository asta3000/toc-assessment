import path, { join } from "path";
import { writeFile } from "fs/promises";
import { NextResponse } from "next/server";

import cors from "@/libs/cors";

export const POST = async (req) => {
  const formData = await req.formData();
  const file = formData.get("file");
  const basePath = path.join(process.cwd(), "public", "assets");

  if (!file) {
    return NextResponse.json({}, { status: 400, headers: cors });
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  const fileName = Date.now() + "-" + file.name;
  const uploadPath = join(basePath, fileName);
  await writeFile(uploadPath, buffer);
  return NextResponse.json({ success: true }, { status: 200, headers: cors });
};
