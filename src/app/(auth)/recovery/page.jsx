"use client";

import React, {
  Fragment,
  useEffect,
  useMemo,
  useReducer,
  useState,
} from "react";
import lodash from "lodash";
import toast, { Toaster } from "react-hot-toast";
import { redirect } from "next/navigation";
import useSWR from "swr";

import { WhiteInput } from "@/components/MyInput";
import { borderblue, selfRegistration, textblue } from "@/libs/constants";
import { FullSolidButton } from "@/components/MyButton";
import { useTranslation } from "@/hooks/useTranslation";
import { FullSpinner, Spinner } from "@/components/Spinner";
import handleGenerateNumber from "@/libs/generate";
import { fetcher, instance } from "@/libs/client";

const Recovery = () => {
  const initialState = "SENDOTP";
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({
    email: "",
    otp: "",
    userOtp: "",
    password: "",
    confirmPassword: "",
  });

  const resetPassword = async () => {
    setLoading(true);
    await instance
      .post("/users/resetpassword", data)
      .then((result) => {
        if (result.status === 200) {
          toast.success("Нууц үгийг амжилттай сэргээлээ", {
            duration: 2000,
            position: "top-right",
            className: "bg-red-400 text-white",
            style: {
              border: "2px solid rgb(192, 38, 19)",
            },
          });
        }
      })
      .catch((error) => {
        console.log(error);
        toast.error(error.message, {
          duration: 2000,
          position: "top-right",
          className: "bg-red-400 text-white",
          style: {
            border: "2px solid rgb(192, 38, 19)",
          },
        });
      })
      .finally(setLoading(false));
  };

  const reducer = (state, action) => {
    switch (action.type) {
      case "SENDOTP":
        const otp = handleGenerateNumber(6);
        setData({
          ...data,
          otp,
        });
        return "VERIFY";

      case "VERIFY":
        if (
          data.email &&
          !lodash.isEmpty(data.otp) &&
          !lodash.isEmpty(data.userOtp) &&
          data.otp === data.userOtp
        ) {
          toast.success("Баталгаажилт амжилттай боллоо.", {
            duration: 2000,
            position: "top-right",
            className: "bg-red-400 text-white",
            style: {
              border: "2px solid rgb(192, 38, 19)",
            },
          });
        } else {
          toast.error("Баталгаажилт амжилтгүй боллоо.", {
            duration: 2000,
            position: "top-right",
            className: "bg-red-400 text-white",
            style: {
              border: "2px solid rgb(192, 38, 19)",
            },
          });
        }
        return "REFRESH";

      case "REFRESH":
        if (
          !lodash.isEmpty(data.password) &&
          data.password === data.confirmPassword
        ) {
          resetPassword();
          setData({
            email: "",
            otp: "",
            userOtp: "",
            password: "",
            confirmPassword: "",
          });
        }
        return "SENDOTP";
    }
    return state;
  };

  const [state, dispatch] = useReducer(reducer, initialState);
  const uris = useMemo(() => {
    return ["/parameters/" + selfRegistration];
  }, []);
  const t = useTranslation();
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

  const sendMail = async () => {
    await instance
      .post("/emailsender/otp", data)
      .then((result) => {
        if (result.status === 200) {
          toast.success("Бүртгэлтэй имэйл руу нэг удаагийн нууц үг илгээлээ.", {
            duration: 2000,
            position: "top-right",
            className: "bg-red-400 text-white",
            style: {
              border: "2px solid rgb(192, 38, 19)",
            },
          });
        }
      })
      .catch((error) => {
        console.log(error);
        toast.error("Нэг удаагийн нууц үг илгээхэд алдаа гарлаа.", {
          duration: 2000,
          position: "top-right",
          className: "bg-red-400 text-white",
          style: {
            border: "2px solid rgb(192, 38, 19)",
          },
        });
      });
  };

  useEffect(() => {
    if (
      !lodash.isEmpty(data.email) &&
      !lodash.isEmpty(data.otp) &&
      lodash.isEmpty(data.userOtp)
    ) {
      sendMail();
    }
  }, [data]);

  if (isLoading) {
    return <FullSpinner />;
  }

  if (error) {
    console.error(error);
  }

  return (
    <div className="h-full w-full flex flex-col justify-center items-center">
      <Toaster />
      <form
        method="POST"
        className={`min-w-[400px] border-[1px] rounded-xl ${borderblue} flex flex-col p-10 gap-5`}
        onSubmit={(event) => {
          event.preventDefault();
          dispatch({ type: state });
        }}
      >
        {state === "SENDOTP" && (
          <WhiteInput
            label={t("auth.Email")}
            name="email"
            type="email"
            value={data.email}
            data={data}
            setData={setData}
          />
        )}

        {state === "VERIFY" && (
          <WhiteInput
            label={t("auth.OTP")}
            name="userOtp"
            type="text"
            value={data.userOtp}
            data={data}
            setData={setData}
          />
        )}

        {state === "REFRESH" && (
          <Fragment>
            <WhiteInput
              label={t("auth.Password")}
              name="password"
              type="password"
              value={data.password}
              data={data}
              setData={setData}
            />
            <WhiteInput
              label={t("auth.ConfirmPassword")}
              name="confirmPassword"
              type="password"
              value={data.confirmPassword}
              data={data}
              setData={setData}
            />
          </Fragment>
        )}

        {loading ? (
          <Spinner />
        ) : (
          <FullSolidButton
            label={
              state === "SENDOTP"
                ? t("auth.SendOTP")
                : state === "VERIFY"
                  ? t("auth.Verify")
                  : state === "REFRESH"
                    ? t("action.ChangePassword")
                    : null
            }
            color="blue"
          />
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
              redirect("/login");
            }}
          >
            {t("auth.LogIn")}
          </p>
        </div>
      </form>
    </div>
  );
};

export default Recovery;
