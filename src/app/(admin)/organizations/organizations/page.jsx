"use client";

import allMetadatas from "@/jsons/metadatas.json";
import { FullModal } from "@/components/Modal";
import { SolidButton } from "@/components/MyButton";
import { MySearch } from "@/components/MyInput";
import { ListTable } from "@/components/MyTable";
import { MyError } from "@/components/MyText";
import { FullSpinner } from "@/components/Spinner";
import { fetcher } from "@/libs/client";
import { useTranslation } from "@/hooks/useTranslation";

import React, { Fragment, useMemo, useState } from "react";
import { Toaster } from "react-hot-toast";
import useSWR from "swr";
import lodash from "lodash";

const Organizations = () => {
  const uris = useMemo(() => {
    return [
      "/organizations",
      "/members/active",
      "/operations/active",
      "/sectors/active",
    ];
  }, []);
  const {
    data: allDatas = [],
    error,
    isLoading,
    isValidating,
    mutate,
  } = useSWR(uris, fetcher, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    refreshInterval: 0,
  });

  const [modal, setModal] = useState({
    open: false,
    action: "",
  });
  const metadatas = allMetadatas?.filter((m) => m.title === "organizations")[0]
    ?.metadatas;

  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({});
  const [search, setSearch] = useState("");
  const t = useTranslation();

  if (isLoading || isValidating) {
    return <FullSpinner />;
  }

  if (error) {
    console.error(error);
  }

  return (
    <div className="mx-20 flex flex-col justify-center items-start">
      <Toaster />
      <p className="my-3 font-bold text-blue-900 text-xl">
        {t("organizations.organizations.title")}
      </p>
      {modal.open ? (
        <FullModal
          action={modal.action}
          metadatas={metadatas}
          modal="simpleone"
          data={data}
          setModal={setModal}
          setData={setData}
          setLoading={setLoading}
          loading={loading}
          url={uris}
          selection={{
            members: allDatas[1],
            operations: allDatas[2],
            sectors: allDatas[3],
          }}
          mutate={mutate}
        />
      ) : (
        <Fragment>
          <div className="mb-5 w-full flex justify-start items-center gap-5">
            <SolidButton
              label={t("action.Add")}
              color="green"
              size="small"
              setModal={setModal}
              setData={setData}
              action={modal.action}
            />
            <MySearch setSearch={setSearch} />
          </div>
          {lodash.isEmpty(allDatas[0]) ? (
            <MyError />
          ) : (
            <ListTable
              metadatas={metadatas}
              datas={allDatas[0]}
              search={search}
              setModal={setModal}
              setData={setData}
            />
          )}
        </Fragment>
      )}
    </div>
  );
};

export default Organizations;
