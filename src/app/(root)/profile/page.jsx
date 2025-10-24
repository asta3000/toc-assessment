"use client";

import React, { Fragment, useEffect, useMemo, useState } from "react";
import lodash from "lodash";
import { useRouter } from "next/navigation";
import useSWR from "swr";
import { Toaster } from "react-hot-toast";
import clsx from "clsx";

import allMetadatas from "@/jsons/metadatas.json";
import { useUserStore } from "@/stores/storeUser";
import { fetcher } from "@/libs/client";
import { FullSpinner, Spinner } from "@/components/Spinner";
import { useTranslation } from "@/hooks/useTranslation";
import { MyError } from "@/components/MyText";
import { WhiteInput } from "@/components/MyInput";
import { useSystemStore } from "@/stores/storeSystem";
import { SolidButton } from "@/components/MyButton";
import { DataEditorBySlug } from "@/functions/Data";

const Profile = () => {
  const router = useRouter();
  const user = useUserStore.getState().user;
  const { system } = useSystemStore();
  const t = useTranslation();
  const uris = useMemo(() => {
    return ["/organizations/" + user.organizationId, "/users/" + user.id];
  }, []);
  const {
    data: allDatas = [],
    error,
    isLoading,
    mutate,
    isValidating,
  } = useSWR(uris, fetcher, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    refreshInterval: 0,
  });
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState();
  const metadataOrgs = allMetadatas?.filter(
    (m) => m.title === "organizations"
  )[0]?.metadatas;
  const metadataStaffs = allMetadatas?.filter((m) => m.title === "users")[0]
    ?.metadatas;

  useEffect(() => {
    if (lodash.isEmpty(user?.email) || lodash.isEmpty(user?.role)) {
      router.push("/");
    }
  }, []);

  useEffect(() => {
    if (lodash.isEmpty(allDatas)) {
      // setData(allDatas[1][0]);
      console.log(allDatas);
    }
  }, [allDatas]);

  if (isLoading || isValidating) {
    return <FullSpinner />;
  }

  if (error) {
    console.error(error);
  }

  const handleClickSave = async () => {
    setLoading(true);
    delete data.password;
    await DataEditorBySlug("/users", {
      firstname: data.firstname,
      lastname: data.lastname,
      mobile: data.mobile,
      position: data.position,
      id: data.id,
    });

    mutate();
    setData();
    setLoading(false);
  };

  return (
    <div>
      <div className="mx-20 flex flex-col justify-center items-start">
        <Toaster />
        {/* Байгууллагын мэдээллийг харах */}
        <p className="mt-10 mb-5 font-bold text-blue-900 text-xl">
          {t("organizations.profile.organization.title")}
        </p>
        {lodash.isEmpty(allDatas[0]) ? (
          <MyError />
        ) : (
          <div className="mx-10">
            {metadataOrgs.map((metadata, index) => {
              return (
                <div key={index} className="grid grid-cols-2 gap-20 my-2">
                  <p>{metadata.name}:</p>
                  <p>
                    {metadata.field === "status"
                      ? metadata.selection?.filter(
                          (s) => s.value === allDatas[0][0]?.[metadata.field]
                        )[0]?.description
                      : metadata.field === "operationId"
                        ? allDatas[0][0]?.Operation?.name || "-"
                        : metadata.field === "sectorId"
                          ? allDatas[0][0]?.Sector?.name || "-"
                          : metadata.field === "memberId"
                            ? allDatas[0][0]?.Member?.name || "-"
                            : allDatas[0][0]?.[metadata.field]}
                  </p>
                </div>
              );
            })}
          </div>
        )}
        {/* Өөрийн мэдээллийг харах */}
        <p className="mt-10 mb-5 font-bold text-blue-900 text-xl">
          {t("organizations.profile.staff.title")}
        </p>
        {lodash.isEmpty(allDatas[1]) ? (
          <MyError />
        ) : (
          <Fragment>
            <div className="mx-10">
              {metadataStaffs.map((metadata, index) => {
                return metadata.type === "select" &&
                  metadata.field !== "password" &&
                  metadata.field !== "confirmPassword" ? (
                  <div className="grid grid-cols-2 gap-20 my-2" key={index}>
                    <p>{metadata.name}</p>
                    <p>
                      {metadata.field === "status" ||
                      metadata.field === "role" ||
                      metadata.field === "gender"
                        ? metadata.selection?.filter(
                            (s) => s.value === allDatas[1][0]?.[metadata.field]
                          )[0]?.description
                        : metadata.field === "organizationId"
                          ? allDatas[1][0]?.Organization?.name || "-"
                          : allDatas[1][0]?.[metadata.field]}
                    </p>
                  </div>
                ) : null;
              })}
            </div>
            {/* Өөрийн зарим мэдээллийг өөрчлөх хэсэг */}
            <form
              method="POST"
              onSubmit={(event) => {
                event.preventDefault();
                lodash.isEmpty(data)
                  ? setData(allDatas[1][0])
                  : handleClickSave();
              }}
              className={clsx(
                "mx-10 mb-10",
                !lodash.isEmpty(data) && "py-3 w-full h-full space-y-6"
              )}
            >
              {metadataStaffs.map((metadata, index) => {
                return (
                  metadata.field !== "password" &&
                  metadata.field !== "confirmPassword" &&
                  metadata.type !== "select" &&
                  (lodash.isEmpty(data) ? (
                    <div
                      className={clsx(
                        "grid grid-cols-2 my-2",
                        lodash.isEmpty(data) && "gap-43"
                      )}
                      key={index}
                    >
                      <p>{metadata.name}</p>
                      <p>
                        {metadata.field === "status" ||
                        metadata.field === "role" ||
                        metadata.field === "gender"
                          ? metadata.selection?.filter(
                              (s) =>
                                s.value === allDatas[1][0]?.[metadata.field]
                            )[0]?.description
                          : metadata.field === "organizationId"
                            ? allDatas[1][0]?.Organization?.name || "-"
                            : allDatas[1][0]?.[metadata.field]}
                      </p>
                    </div>
                  ) : (
                    <WhiteInput
                      name={metadata.field}
                      type={metadata.type}
                      label={
                        system.language === "mn"
                          ? metadata.name
                          : metadata.name_en
                      }
                      value={data[metadata.field]}
                      key={index}
                      disabled={metadata.field === "email" ? true : false}
                      data={data}
                      setData={setData}
                    />
                  ))
                );
              })}
              {loading ? (
                <Spinner />
              ) : (
                <div className="flex justify-start items-center gap-3">
                  <SolidButton
                    color="green"
                    size="small"
                    action="save"
                    mutate={mutate}
                    label={
                      lodash.isEmpty(data)
                        ? t("action.Change")
                        : t("action.Edit")
                    }
                  />
                  {lodash.isEmpty(data) ? null : (
                    <SolidButton
                      setData={setData}
                      size="small"
                      color="red"
                      label={t("action.Cancel")}
                      action="decline"
                    />
                  )}
                </div>
              )}
            </form>
          </Fragment>
        )}
      </div>
    </div>
  );
};

export default Profile;
