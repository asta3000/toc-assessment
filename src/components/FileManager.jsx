"use client";

import React, { Fragment } from "react";
import lodash from "lodash";
import { GrClose } from "react-icons/gr";

import { FileButton, FileMenuButton } from "@/components/MyButton";
import { FileInput } from "@/components/MyInput";
import FileList from "@/components/FileList";
import { useTranslation } from "@/hooks/useTranslation";
import { useSystemStore } from "@/stores/storeSystem";

const FileManager = ({
  setAction,
  uploadProgress,
  allDatas,
  action,
  handleChangeValue,
  handleSave,
  uploadingStatus,
  file,
  setFile,
  getDatas,
}) => {
  const t = useTranslation();
  const { system } = useSystemStore();
  const menus = [
    // {
    //   name: "Цэс үүсгэх",
    //   action: "create",
    //   title: "New folder",
    // },
    {
      name: "Файл хуулах",
      name_en: "File Upload",
      action: "upload",
    },
    // {
    //   name: "Файл татах",
    //   action: "download",
    //   title: "Download",
    // },
    // {
    //   name: "Нэр солих",
    //   action: "rename",
    //   title: "Rename",
    // },
    // {
    //   name: "Устгах",
    //   action: "delete",
    //   title: "Delete",
    // },
    {
      name: "Шинэчлэх",
      name_en: "Refresh",
      action: "read",
    },
  ];

  const handleMenu = (action) => {
    setAction(action);
    if (action !== "download" && action !== "delete") {
      setFile();
    }
  };

  return (
    <div className="relative w-full border-[1px] border-blue-700">
      {/* Start of Menu */}
      <div className="bg-blue-100 h-12 pl-3 pr-5 flex items-center justify-between">
        <div id="menu" className="flex gap-5">
          {menus.map((menu, index) => {
            return (
              <FileMenuButton
                key={index}
                action="file"
                menu={menu}
                onClick={handleMenu}
              />
            );
          })}
        </div>
        <div className="text-sm">
          {file ? (
            <Fragment>
              <span className="font-semibold">{t("files.SelectedFile")}</span>
              <span>{file?.name}</span>
            </Fragment>
          ) : null}
        </div>
      </div>
      {/* End of Menu */}

      {/* Start of POPUP window */}
      {action === "upload" && (
        <div
          id="action"
          //   className="h-12 flex items-center justify-start px-6 text-sm gap-5"
          className="absolute top-[20%] left-[2%] w-[450px] bg-blue-100 border-[1px] border-blue-700 p-5 text-sm z-10"
        >
          <div className="mb-5 flex justify-between items-center">
            <p className=" text-blue-900 font-semibold">
              {system.language === "mn"
                ? menus.filter((m) => m.action === action)[0]?.name
                : menus.filter((m) => m.action === action)[0]?.name_en}
              :
            </p>
            <GrClose
              onClick={() => handleMenu("read")}
              className="cursor-pointer rotate-0 hover:rotate-180 transition-all ease-in-out duration-700 text-blue-800"
            />
          </div>
          <form
            method="POST"
            className="flex justify-start items-center gap-5"
            onSubmit={(event) => handleSave(event)}
          >
            <div className="w-[500px] flex justify-between items-center gap-5">
              <div className="flex-3/4">
                <FileInput
                  type="file"
                  name="file"
                  handleChangeValue={handleChangeValue}
                />
              </div>
              <div className="flex-1/4">
                <FileButton label={t("files.Upload")} />
              </div>
            </div>
          </form>

          {/* Start of Uploading Progress */}
          {uploadingStatus && (
            <div className="space-y-2 mt-5">
              <div className="h-3 w-full rounded-full bg-white border-[1px] border-blue-900">
                <div
                  className="h-2.5 rounded-full bg-blue-900 transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
              <p className="text-sm text-blue-900">{uploadProgress}%</p>
            </div>
          )}
          {/* End of Uploading Progress */}
        </div>
      )}
      {/* End of POPUP window */}

      {/* Start of Workspace */}
      <div
        className={`p-3 min-h-72 flex ${
          lodash.isEmpty(allDatas)
            ? "items-center justify-center"
            : "items-start justify-between overflow-y-auto h-full"
        }`}
      >
        {lodash.isEmpty(allDatas) ? (
          <p className="text-red-400 italic text-md">
            {t("files.FileNotFound")}
          </p>
        ) : (
          <FileList
            allDatas={allDatas}
            handleChangeValue={handleChangeValue}
            getDatas={getDatas}
          />
        )}
      </div>
      {/* End of Workspace */}
    </div>
  );
};

export default FileManager;
