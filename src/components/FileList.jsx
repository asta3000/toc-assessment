/* eslint-disable react/prop-types */
"use client";

import Image from "next/image";
import React from "react";

import { FileDelete } from "@/functions/File";
import { useTranslation } from "@/hooks/useTranslation";

const FileList = ({ allDatas, handleChangeValue, getDatas }) => {
  const t = useTranslation();
  const handleDelete = async (file) => {
    await FileDelete("delete", file);
    getDatas();
  };

  return (
    <div className="w-full flex flex-wrap justify-start items-start gap-3">
      {allDatas?.map((file, index) => {
        let icon;

        if (file.name.includes(".png") || file.name.includes(".PNG"))
          icon = "/pngicon.png";
        else if (file.name.includes(".jpg") || file.name.includes(".JPG"))
          icon = "/jpgicon.png";
        else if (file.name.includes(".exe") || file.name.includes(".EXE"))
          icon = "/exeicon.png";
        else if (file.name.includes(".xlsx") || file.name.includes(".XLSX"))
          icon = "/xlsxicon.png";
        else if (file.name.includes(".docx") || file.name.includes(".DOCX"))
          icon = "/docxicon.png";
        else if (file.name.includes(".pdf") || file.name.includes(".PDF"))
          icon = "/pdficon.png";
        else if (file.name.includes(".zip") || file.name.includes(".ZIP"))
          icon = "/zipicon.png";
        else if (file.name.includes(".rar") || file.name.includes(".ZIP"))
          icon = "/raricon.png";
        else icon = "/fileicon.png";

        return (
          <div
            className="flex flex-col justify-start items-center text-[12px] gap-3 cursor-pointer hover:bg-yellow-100 p-2 rounded-2xl"
            key={index}
          >
            <Image
              src={icon}
              width={70}
              height={70}
              alt={file.name}
              onClick={(event) => handleChangeValue(event, file)}
            />
            <p
              className="text-center"
              onClick={(event) => handleChangeValue(event, file)}
            >
              {file.name}
            </p>
            <div className="flex gap-5 justify-center items-center">
              <a
                href={"/assets/" + file.name}
                className="hover:underline hover:text-blue-900 text-blue-700"
              >
                {t("files.Download")}
              </a>
              <span
                className="hover:underline hover:text-blue-900 text-blue-700"
                onClick={() => handleDelete(file)}
              >
                {t("files.Delete")}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default FileList;
