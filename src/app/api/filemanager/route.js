import fs from "fs";
import path from "path";
import { NextResponse } from "next/server";

import cors from "@/libs/cors";

export const POST = async (req) => {
  const basePath = path.join(process.cwd(), "public", "assets");
  const { action, name, path: relPath = "" } = await req.json();
  const targetPath = path.join(basePath, relPath);

  switch (action) {
    // Цэс, файлын жагсаалт авах
    case "read":
      const files = fs
        .readdirSync(targetPath)
        .sort()
        .map((file) => {
          const stat = fs.statSync(path.join(targetPath, file));
          return {
            name: file,
            isFile: stat.isFile(),
            size: stat.size,
            dateModified: stat.mtime,
            dateCreated: stat.ctime,
          };
        });
      return NextResponse.json(files, { status: 200, headers: cors });

    //   Цэс үүсгэх
    // case "create":
    //   fs.mkdirSync(path.join(targetPath, name));
    //   return NextResponse.json({ success: true }, { status: 200 });

    //   Цэс, файл устгах
    case "delete":
      fs.rmSync(path.join(targetPath, name), { recursive: true, force: true });
      return NextResponse.json(
        { success: true },
        { status: 200, headers: cors }
      );

    //   Цэс, файл нэр солих
    // case "rename":
    //   fs.renameSync(
    //     path.join(targetPath, name),
    //     path.join(targetPath, newName)
    //   );
    //   return NextResponse.json({ success: true }, { status: 200 });

    //   Үйлдэл тодорхойгүй үед өгөх алдаа
    default:
      return NextResponse.json({}, { status: 400, headers: cors });
  }
};
