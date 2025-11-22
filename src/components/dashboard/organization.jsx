import React, { useMemo } from "react";
import useSWR from "swr";

import { useSystemStore } from "@/stores/storeSystem";
import { useUserStore } from "@/stores/storeUser";
import { FullSpinner } from "@/components/Spinner";
import { fetcher } from "@/libs/client";
import PieDefault from "@/components/charts/Pie";
import clsx from "clsx";
import { useTranslation } from "@/hooks/useTranslation";
import {
  STATUS_DONE,
  STATUS_FILLING,
  STATUS_NEW,
  STATUS_SENT,
  STATUS_VERIFIED,
  STATUS_VERIFYING,
} from "@/libs/constants";

const OrganizationDashboard = () => {
  const { system } = useSystemStore();
  const { user } = useUserStore();
  const t = useTranslation();
  const isGet = user?.organizationId && system?.yearId;

  const uris = useMemo(() => {
    return [
      "/statistics/organizations/" + user?.organizationId,
      "/statistics/verifications/" + user?.organizationId,
    ];
  }, [user]);

  const {
    data: allDatas = [],
    error,
    isLoading,
  } = useSWR(isGet && uris, fetcher, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    refreshInterval: 0,
  });

  if (isLoading || !isGet) {
    return <FullSpinner />;
  }

  if (error) {
    console.error(error);
  }

  // console.log("A: ", allDatas[1]);
  // console.log("S: ", system);
  // console.log("U: ", user);
  // console.log("D: ", savedAnswers);
  return (
    <div>
      <div className="mx-20 flex flex-col justify-center items-start">
        <p className="mt-10 mb-5 font-bold text-blue-900 text-xl">
          {system?.year}
        </p>
        <div className="flex flex-col gap-16">
          {/* Бөглөлтийн процессын хэсгийн dashboard */}
          {allDatas[0]?.assessments?.map((data, index) => {
            const performance = allDatas[0]?.performances.find(
              (p) => p.assessmentId === data.id
            );
            const questions = allDatas[0]?.questions.find(
              (q) => q.assessmentId === data.id
            )?.count;
            const answers = allDatas[0]?.answers.find(
              (q) => q.assessmentId === data.id && q.yearId === system?.yearId
            )?.count;

            return (
              <div key={index}>
                <p className="text-center">{data?.name}</p>
                <p className="text-center">({t("dashboard.Filling")})</p>
                <PieDefault total={questions} performance={answers} />
                <div className="flex justify-between items-center text-sm">
                  <p>{t("dashboard.Status")}</p>
                  <p className={clsx("text-center font-semibold uppercase")}>
                    {[STATUS_NEW, STATUS_FILLING, STATUS_SENT].includes(
                      performance?.Status?.id
                    )
                      ? performance?.Status?.name
                      : "БӨГЛӨЖ ДУУССАН"}
                  </p>
                </div>
              </div>
            );
          })}
          {/* Баталгаажуулалтын процессын хэсгийн dashboard */}
          {allDatas[1]?.assessments?.map((data, index) => {
            const performance = allDatas[1]?.performances.find(
              (p) => p.assessmentId === data.id
            );
            const questions = allDatas[1]?.questions.find(
              (q) => q.assessmentId === data.id
            )?.count;
            const answers = allDatas[1]?.answers.find(
              (q) => q.assessmentId === data.id && q.yearId === system?.yearId
            )?.count;

            return (
              <div key={index}>
                <p className="text-center">{data?.name}</p>
                <p className="text-center">({t("dashboard.Verifying")})</p>
                <PieDefault total={questions} performance={answers} />
                <div className="flex justify-between items-center text-sm">
                  <p>{t("dashboard.Status")}</p>
                  <p className={clsx("text-center font-semibold uppercase")}>
                    {[STATUS_VERIFYING, STATUS_VERIFIED, STATUS_DONE].includes(
                      performance?.Status?.id
                    )
                      ? performance?.Status?.name
                      : "ШИНЭ"}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default OrganizationDashboard;
