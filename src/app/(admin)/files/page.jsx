"use client";

import React, { useState, useEffect, Fragment } from "react";
import lodash from "lodash";
import { Toaster } from "react-hot-toast";

import FileManager from "@/components/FileManager";
import { FileUpload, FileList } from "@/functions/File";
import { FullSpinner } from "@/components/Spinner";
import { useTranslation } from "@/hooks/useTranslation";

const Files = () => {
  const [allDatas, setAllDatas] = useState();
  const [file, setFile] = useState();
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadingStatus, setUploadingStatus] = useState(false);
  const [action, setAction] = useState("read");
  const [loading, setLoading] = useState(false);
  const t = useTranslation();

  const getDatas = async () => {
    setLoading(true);
    action === "read" && (await FileList(action, setAllDatas));
    setLoading(false);
  };

  useEffect(() => {
    if (action === "read") {
      setAllDatas();
      setFile();
      getDatas();
    }
  }, [action]);

  if (loading || lodash.isEmpty(allDatas)) {
    return <FullSpinner />;
  }

  const handleChangeValue = (event, file) => {
    event.preventDefault();

    if (event.target.files) {
      setFile(event.target.files?.[0]);
    } else {
      setFile(file);
    }
  };

  const handleSave = async (event) => {
    event.preventDefault();

    if (!file) {
      return;
    }

    setUploadingStatus(true);
    setUploadProgress(0);

    if (action === "upload") {
      await FileUpload(file, setUploadProgress);
    }

    setUploadProgress(0);
    setFile();
    setAllDatas();
    setAction("read");
    setUploadingStatus(false);
  };

  return (
    <div className="mx-20 flex flex-col justify-center items-start">
      <p className="mt-10 mb-5 font-bold text-blue-900 text-xl">
        {t("files.title")}
      </p>
      <Toaster />
      <FileManager
        setAction={setAction}
        getDatas={getDatas}
        file={file}
        setFile={setFile}
        allDatas={allDatas}
        action={action}
        handleChangeValue={handleChangeValue}
        handleSave={handleSave}
        uploadProgress={uploadProgress}
        uploadingStatus={uploadingStatus}
      />
    </div>
  );
};

export default Files;
