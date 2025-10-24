"use client";

import { instance } from "@/libs/client";
import toast from "react-hot-toast";

export const FileList = async (action, setAllDatas) => {
  try {
    await instance
      .post("/filemanager/", { action })
      .then((result) => {
        if (result.status === 200) {
          setAllDatas(result.data);
        }
      })
      .catch((error) => {
        console.error(error);
        toast.error("Файлын жагсаалт авахад алдаа гарлаа.", {
          duration: 2000,
          position: "top-right",
          className: "bg-red-400 text-white",
          style: {
            border: "2px solid rgb(192, 38, 19)",
          },
        });
      });
  } catch (error) {
    console.error("ERROR: ", error);
  }
};

export const FileUpload = async (file, setUploadProgress) => {
  const formData = new FormData();
  formData.set("file", file);

  try {
    await instance
      .post("/filemanager/fileupload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        onUploadProgress: (progressEvent) => {
          const progress = progressEvent.total
            ? Math.round((progressEvent.loaded * 100) / progressEvent.total)
            : 0;
          setUploadProgress(progress);
        },
      })
      .then((result) => {
        if (result.status === 200) {
          toast.success("Файл амжилттай хуулагдлаа", {
            duration: 2000,
            position: "top-right",
            className: "bg-green-400 text-white",
            style: {
              border: "2px solid rgb(192, 38, 19)",
            },
          });
        }
      })
      .catch((error) => {
        console.error(error);
        toast.error("Файл хуулахад алдаа гарлаа.", {
          duration: 2000,
          position: "top-right",
          className: "bg-red-400 text-white",
          style: {
            border: "2px solid rgb(192, 38, 19)",
          },
        });
        setUploadProgress(0);
      });
  } catch (error) {
    console.log("ERROR_UPLOAD: ", error);
    setUploadProgress(0);
  }
};

export const FileDelete = async (action, file) => {
  try {
    await instance
      .post("/filemanager/", {
        action,
        name: file?.name,
      })
      .then((result) => {
        if (result.status === 200) {
          toast.success("Файл амжилттай устгагдлаа.", {
            duration: 2000,
            position: "top-right",
            className: "bg-green-400 text-white",
            style: {
              border: "2px solid rgb(192, 38, 19)",
            },
          });
        }
      })
      .catch((error) => {
        console.error(error);
        toast.error("Файлын жагсаалт авахад алдаа гарлаа.", {
          duration: 2000,
          position: "top-right",
          className: "bg-red-400 text-white",
          style: {
            border: "2px solid rgb(192, 38, 19)",
          },
        });
      });
  } catch (error) {
    console.error("ERROR: ", error);
  }
};
