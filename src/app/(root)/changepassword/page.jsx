"use client";

import React, { useEffect, useState } from "react";
import lodash from "lodash";
import toast, { Toaster } from "react-hot-toast";
import { useRouter } from "next/navigation";

import { useUserStore } from "@/stores/storeUser";
import { useSystemStore } from "@/stores/storeSystem";
import { useTranslation } from "@/hooks/useTranslation";
import { WhiteInput } from "@/components/MyInput";
import { MyView } from "@/components/MyText";
import { SolidButton } from "@/components/MyButton";
import { DataEditorBySlug } from "@/functions/Data";
import { Spinner } from "@/components/Spinner";

const ChangePassword = () => {
  const router = useRouter();
  const [data, setData] = useState({
    password: "",
    currentPassword: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const user = useUserStore.getState().user;
  const { system } = useSystemStore();
  const t = useTranslation();
  const metadatas = [
    {
      name: "Имэйл хаяг",
      name_en: "Email",
      align: "center",
      field: "email",
      type: "email",
      width: "10%",
    },
    {
      name: "Одоогийн нууц үг",
      name_en: "Current password",
      align: "center",
      field: "currentPassword",
      type: "password",
      width: "10%",
    },
    {
      name: "Нууц үг",
      name_en: "Password",
      align: "center",
      field: "password",
      type: "password",
      width: "10%",
    },
    {
      name: "Батлах нууц үг",
      name_en: "Confirm password",
      align: "center",
      field: "confirmPassword",
      type: "password",
      width: "10%",
    },
  ];

  useEffect(() => {
    if (lodash.isEmpty(user.email) || lodash.isEmpty(user.role)) {
      router.push("/");
    }
  }, []);

  const handleClickSave = async (event) => {
    event.preventDefault();

    if (lodash.isEmpty(data.currentPassword)) {
      toast.error("Одоогийн нууц үгийг оруулна уу.", {
        duration: 2000,
        position: "top-right",
        className: "bg-red-400 text-white",
        style: {
          border: "2px solid rgb(192, 38, 19)",
        },
      });
    } else if (lodash.isEmpty(data.password)) {
      toast.error("Шинэ нууц үгийг оруулна уу.", {
        duration: 2000,
        position: "top-right",
        className: "bg-red-400 text-white",
        style: {
          border: "2px solid rgb(192, 38, 19)",
        },
      });
    } else if (
      !lodash.isEmpty(data.password) &&
      data.currentPassword === data.password
    ) {
      toast.error("Шинэ нууц үг нь одоогийн нууц үгтэй ижил байна.", {
        duration: 2000,
        position: "top-right",
        className: "bg-red-400 text-white",
        style: {
          border: "2px solid rgb(192, 38, 19)",
        },
      });
    } else if (
      !lodash.isEmpty(data.password) &&
      data.password === data.confirmPassword
    ) {
      setLoading(true);
      await DataEditorBySlug("/users/changepassword", {
        ...data,
        id: user?.id,
      });
      setData({
        password: "",
        currentPassword: "",
        confirmPassword: "",
      });
      setLoading(false);
    } else {
      toast.error("Шинэ нууц үг хоорондоо тохирохгүй байна.", {
        duration: 2000,
        position: "top-right",
        className: "bg-red-400 text-white",
        style: {
          border: "2px solid rgb(192, 38, 19)",
        },
      });
    }
  };

  return (
    <div>
      <div className="mx-20 flex flex-col justify-center items-start">
        <Toaster />
        {/* Байгууллагын мэдээллийг харах */}
        <p className="mt-10 mb-5 font-bold text-blue-900 text-xl">
          {t("organizations.profile.changepassword.title")}
        </p>
        <form
          method="POST"
          onSubmit={(event) => {
            handleClickSave(event);
          }}
          className="w-full flex justify-center items-start flex-col gap-5"
        >
          {metadatas.map((metadata, index) => {
            return metadata.type === "password" ? (
              <WhiteInput
                name={metadata.field}
                type={metadata.type}
                label={
                  system.language === "mn" ? metadata.name : metadata.name_en
                }
                value={data[metadata.field]}
                key={index}
                disabled={metadata.field === "email" ? true : false}
                data={data}
                setData={setData}
              />
            ) : metadata.field === "email" ? (
              <MyView
                value={user?.email}
                key={index}
                label={
                  system.language === "mn" ? metadata.name : metadata.name_en
                }
              />
            ) : null;
          })}
          {loading ? (
            <Spinner />
          ) : (
            <div className="flex justify-start items-center gap-3">
              <SolidButton
                color="green"
                size="small"
                action="save"
                label={t("action.ChangePassword")}
              />
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default ChangePassword;
