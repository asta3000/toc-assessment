import React, { useMemo, Fragment } from "react";
import useSWR from "swr";

import { useSystemStore } from "@/stores/storeSystem";
import { useUserStore } from "@/stores/storeUser";
import { FullSpinner } from "@/components/Spinner";
import { fetcher } from "@/libs/client";
import PieDefault from "@/components/charts/Pie";
import clsx from "clsx";
import { useTranslation } from "@/hooks/useTranslation";

const OrganizationDashboard = () => {
  const { system } = useSystemStore();
  const { user } = useUserStore();
  const t = useTranslation();
  const isGet = user?.organizationId && system?.yearId;

  const uris = useMemo(() => {
    return ["/statistics/organizations/" + user?.organizationId];
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

  console.log("A: ", allDatas[0]);
  //   console.log("S: ", system);
  // console.log("U: ", user);
  // console.log("D: ", savedAnswers);
  return (
    <div>
      <div className="mx-20 flex flex-col justify-center items-start">
        <p className="mt-10 mb-5 font-bold text-blue-900 text-xl">
          {system?.year}
        </p>
        <div>
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
              <Fragment key={index}>
                <p className="text-center">{data?.name}</p>
                <PieDefault total={questions} performance={answers} />
                <div className="flex justify-between items-center text-sm">
                  <p>{t("dashboard.Status")}</p>
                  <p className={clsx("text-center font-semibold uppercase")}>
                    {performance?.Status?.name}
                  </p>
                </div>
              </Fragment>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default OrganizationDashboard;
