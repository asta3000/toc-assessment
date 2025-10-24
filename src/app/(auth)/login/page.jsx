"use client";

import React, { useMemo, useState } from "react";
import lodash from "lodash";
import toast, { Toaster } from "react-hot-toast";
import { redirect } from "next/navigation";
import useSWR from "swr";

import { LoginViaCredentials } from "@/functions/Login";
import { WhiteInput } from "@/components/MyInput";
import { borderblue, textblue, selfRegistration } from "@/libs/constants";
import { FullSolidButton } from "@/components/MyButton";
import { useTranslation } from "@/hooks/useTranslation";
import { FullSpinner, Spinner } from "@/components/Spinner";
import { fetcher } from "@/libs/client";

const Login = () => {
  const uris = useMemo(() => {
    return ["/parameters/" + selfRegistration];
  }, []);
  const {
    data: allDatas,
    error,
    isLoading,
    isValidating,
  } = useSWR(uris, fetcher, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    refreshInterval: 0,
  });
  const [loading, setLoading] = useState(false);
  const t = useTranslation();
  const [data, setData] = useState({
    email: "",
    password: "",
  });

  if (isLoading) {
    return <FullSpinner />;
  }

  if (error) {
    console.error(error);
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (lodash.isEmpty(data.email) || lodash.isEmpty(data.password)) {
      toast.error("Нэвтрэх нэр эсвэл нууц үг оруулаагүй байна.", {
        duration: 2000,
        position: "top-right",
        className: "bg-red-400 text-white",
        style: {
          border: "2px solid rgb(192, 38, 19)",
        },
      });
    } else {
      setLoading(true);
      const result = await LoginViaCredentials({
        email: data.email,
        password: data.password,
      });

      if (lodash.isEmpty(result)) {
        toast.error("Нэвтрэлт амжилтгүй боллоо.", {
          duration: 2000,
          position: "top-right",
          className: "bg-red-400 text-white",
          style: {
            border: "2px solid rgb(192, 38, 19)",
          },
        });
      } else {
        redirect("/");
      }
      setLoading(false);
    }
  };

  return (
    <div className="h-full w-full flex flex-col justify-center items-center">
      <Toaster />
      <form
        className={`min-w-[400px] border-[1px] rounded-xl ${borderblue} flex flex-col p-10 gap-5`}
        onSubmit={(event) => handleSubmit(event)}
      >
        <WhiteInput
          label={t("auth.Email")}
          name="email"
          type="email"
          value={data.email}
          data={data}
          setData={setData}
        />
        <WhiteInput
          label={t("auth.Password")}
          name="password"
          type="password"
          value={data.password}
          data={data}
          setData={setData}
        />
        {loading ? (
          <Spinner />
        ) : (
          <FullSolidButton label={t("auth.LogIn")} color="blue" />
        )}

        <div
          className={`mt-3 text-xs flex justify-between items-center ${textblue}`}
        >
          <p className="cursor-pointer" onClick={() => redirect("/register")}>
            {allDatas[0][0]?.value === "1" ? t("auth.CreateAccount") : ""}
          </p>
          <p
            className="cursor-pointer"
            onClick={() => {
              redirect("/recovery");
            }}
          >
            {t("auth.RecoverAccount")}
          </p>
        </div>
      </form>
    </div>
  );
};

export default Login;
