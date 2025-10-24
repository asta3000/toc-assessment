"use client";

import { useRouter } from "next/navigation";
import React, { useEffect, useMemo, useState } from "react";
import { Toaster } from "react-hot-toast";
import lodash from "lodash";
import useSWR from "swr";

import allMetadatas from "@/jsons/metadatas.json";
import { useUserStore } from "@/stores/storeUser";
import { fetcher } from "@/libs/client";
import { useTranslation } from "@/hooks/useTranslation";
import { FullSpinner } from "@/components/Spinner";
import clsx from "clsx";
import { textblue } from "@/libs/constants";
import Link from "next/link";
import { FaArrowDown } from "react-icons/fa";

const Supports = () => {
  const router = useRouter();
  const t = useTranslation();
  const [selected, setSelected] = useState();
  const user = useUserStore.getState().user;
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
  const uris = useMemo(() => {
    return ["/contacts/active", "/guides/active", "/faqs/active"];
  }, []);
  const {
    data: allDatas = [],
    error,
    isLoading,
    isValidating,
  } = useSWR(uris, fetcher, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    refreshInterval: 0,
  });

  useEffect(() => {
    if (lodash.isEmpty(user.email) || lodash.isEmpty(user.role)) {
      router.push("/");
    }
  }, []);

  if (isLoading) {
    return <FullSpinner />;
  }

  if (error) {
    console.error(error);
  }

  const showContact = (datas) => {
    return (
      <div className="text-sm ml-10">
        {datas.map((data, index) => {
          return (
            <div key={index} className="grid grid-cols-2 gap-34 space-y-3">
              <p className="cursor-default">{data.name}</p>
              <p className={clsx(textblue, "font-semibold cursor-default")}>
                {data.value}
              </p>
            </div>
          );
        })}
      </div>
    );
  };

  const showGuide = (datas) => {
    const metadatas = allMetadatas?.filter((m) => m.title === "guides")[0]
      ?.metadatas;

    return (
      <table className="text-sm ml-10 w-[75%]">
        <tbody>
          {datas.map((data, index) => {
            return (
              <tr key={index} className="h-8">
                {metadatas.map((metadata, index) => {
                  return metadata.field === "name" ? (
                    <td key={index}>
                      {<p className="cursor-default">{data[metadata.field]}</p>}
                    </td>
                  ) : metadata.field === "description" ? (
                    <td key={index}>
                      {
                        <Link
                          href={data.value}
                          className={clsx(textblue, "font-semibold")}
                        >
                          {data[metadata.field]}
                        </Link>
                      }
                    </td>
                  ) : null;
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    );
  };

  const showFaq = (datas) => {
    return (
      <div className="text-sm ml-10 w-full">
        {datas.map((data, index) => {
          return (
            <div key={index} className="">
              <div
                className="flex justify-between items-center h-10 bg-blue-50 p-4 my-2 rounded-2xl group cursor-pointer"
                onClick={() => {
                  lodash.isEmpty(selected) ? setSelected(data) : setSelected();
                }}
              >
                <p className={clsx(textblue, "group-hover:font-semibold")}>
                  {data.question}
                </p>
                <FaArrowDown
                  size={16}
                  className={clsx(
                    "font-light group-hover:-rotate-90 duration-300 transition-all",
                    textblue,
                    !lodash.isEmpty(selected) && selected?.id === data.id
                      ? "rotate-0"
                      : "-rotate-180"
                  )}
                />
              </div>
              {!lodash.isEmpty(selected) && selected.id === data.id && (
                <p className="mx-5 mt-3 mb-5">{data.answer}</p>
              )}
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div>
      <div className="mx-20 flex flex-col justify-center items-start">
        <Toaster />
        {/* Гарын авлага үзэх */}
        <p className="mt-10 mb-5 font-bold text-blue-900 text-xl">
          {t("bases.guides.title")}
        </p>
        {showGuide(allDatas[1])}

        {/* Нийтлэг асуулт, хариулт */}
        <p className="mt-10 mb-5 font-bold text-blue-900 text-xl">
          {t("businesses.faqs.title")}
        </p>
        {showFaq(allDatas[2])}

        {/* Холбоо барих */}
        <p className="mt-10 mb-5 font-bold text-blue-900 text-xl">
          {t("bases.contacts.title")}
        </p>
        {showContact(allDatas[0])}
      </div>
    </div>
  );
};

export default Supports;
