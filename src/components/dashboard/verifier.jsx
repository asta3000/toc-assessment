"use client";

import React, { useMemo } from "react";
import useSWR from "swr";

import { fetcher } from "@/libs/client";
import { FullSpinner } from "@/components/Spinner";
import { PieCustom } from "@/components/charts/Pie";
import clsx from "clsx";
import { blue } from "@/libs/constants";

const VerifierDashboard = () => {
  const uris = useMemo(() => {
    return ["/statistics/organizations"];
  }, []);

  const {
    data: allDatas = [],
    error,
    isLoading,
  } = useSWR(uris, fetcher, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    refreshInterval: 0,
  });

  if (isLoading) {
    return <FullSpinner />;
  }

  if (error) {
    console.error(error);
  }

  // console.log("A: ", allDatas);

  return (
    <div className="mx-20 mt-10">
      <div className="flex flex-col justify-center items-start">
        <div className="flex flex-col justify-center items-center">
          <p className={clsx(blue, "text-sm")}>
            Байгууллагын тоо, гишүүнчлэлийн төрлөөр
          </p>
          <PieCustom
            data={allDatas[0]?.dashboard1}
            colors={allDatas[0]?.colors}
          />
        </div>
      </div>
    </div>
  );
};

export default VerifierDashboard;
