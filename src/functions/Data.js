"use client";

import toast from "react-hot-toast";
import lodash from "lodash";

import { instance } from "@/libs/client";

export const DataRegister = async (url, data) => {
  // console.log(url);
  // console.log(data);
  await instance
    .post(url, data)
    .then((result) => {
      if (result.status === 201) {
        toast.success("Амжилттай бүртгэгдлээ", {
          duration: 2000,
          position: "top-right",
          className: "bg-green-400 text-white",
          style: {
            border: "2px solid rgb(192, 38, 19)",
          },
        });
        return true;
      } else {
        toast.error("Бүртгэхэд алдаа гарлаа", {
          duration: 2000,
          position: "top-right",
          className: "bg-red-400 text-white",
          style: {
            border: "2px solid rgb(192, 38, 19)",
          },
        });
        return false;
      }
    })
    .catch((error) => {
      console.log(error);
      toast.error(error.response.data.message, {
        duration: 2000,
        position: "top-right",
        className: "bg-red-400 text-white",
        style: {
          border: "2px solid rgb(192, 38, 19)",
        },
      });
      return false;
    });
};

export const DataEditorBySlug = async (url, data) => {
  // console.log(url);
  // console.log(data);

  const id = lodash.isEmpty(data?.id)
    ? lodash.isEmpty(data?.data?.id)
      ? data?.answer?.questionId // Асуулгын хариулт
      : data?.data?.id
    : data?.id;

  await instance
    .put(url + "/" + id, data)
    .then((result) => {
      if (result.status === 200) {
        toast.success("Амжилттай өөрчлөгдлөө", {
          duration: 2000,
          position: "top-right",
          className: "bg-green-400 text-white",
          style: {
            border: "2px solid rgb(192, 38, 19)",
          },
        });
        return true;
      } else {
        toast.error("Өөрчлөхөд алдаа гарлаа", {
          duration: 2000,
          position: "top-right",
          className: "bg-red-400 text-white",
          style: {
            border: "2px solid rgb(192, 38, 19)",
          },
        });
        return false;
      }
    })
    .catch((error) => {
      console.log(error);
      toast.error(error.response.data.message, {
        duration: 2000,
        position: "top-right",
        className: "bg-red-400 text-white",
        style: {
          border: "2px solid rgb(192, 38, 19)",
        },
      });
      return false;
    });
};
