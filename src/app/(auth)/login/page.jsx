"use client";

import React, { useMemo, useState } from "react";
import lodash from "lodash";
import toast, { Toaster } from "react-hot-toast";
import { useRouter } from "next/navigation";
import useSWR from "swr";

import { LoginViaCredentials } from "@/functions/Login";
import { WhiteInput } from "@/components/MyInput";
import {
  borderblue,
  textblue,
  selfRegistration,
  toastperiod,
} from "@/libs/constants";
import { FullSolidButton } from "@/components/MyButton";
import { useTranslation } from "@/hooks/useTranslation";
import { FullSpinner, Spinner } from "@/components/Spinner";
import { fetcher } from "@/libs/client";
import { loginSchema } from "@/libs/schemas";

const Login = () => {
  const router = useRouter();
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

    const parsed = loginSchema.safeParse(data);
    if (!parsed.success) {
      const firstError = parsed.error.issues[0];
      toast.error(firstError.message, {
        duration: toastperiod,
        position: "top-right",
        className: "bg-red-400 text-white",
        style: { border: "2px solid rgb(192, 38, 19)" },
      });
      return;
    }

    try {
      setLoading(true);
      const result = await LoginViaCredentials({
        email: data.email,
        password: data.password,
      });

      // console.log("R: ", result);

      if (lodash.isEmpty(result)) {
        toast.error("Нэвтрэлт амжилтгүй боллоо.", {
          duration: toastperiod,
          position: "top-right",
          className: "bg-red-400 text-white",
          style: {
            border: "2px solid rgb(192, 38, 19)",
          },
        });
        return;
      }

      toast.success("Амжилттай нэвтэрлээ.", {
        duration: toastperiod,
        position: "top-right",
        className: "bg-green-400 text-white",
        style: {
          border: "2px solid rgb(192, 38, 19)",
        },
      });

      router.replace("/");
    } catch (error) {
      console.log("E: ", error);
    } finally {
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
          <p
            className="cursor-pointer"
            onClick={() => router.replace("/register")}
          >
            {allDatas[0][0]?.value === "1" ? t("auth.CreateAccount") : ""}
          </p>
          <p
            className="cursor-pointer"
            onClick={() => {
              router.replace("/recovery");
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
