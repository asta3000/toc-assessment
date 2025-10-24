"use client";

import React from "react";
import { useRouter } from "next/navigation";

import { useTranslation } from "@/hooks/useTranslation";
import { FullSolidButton } from "../MyButton";
import { useAssessmentStore } from "@/stores/storeAssessment";
import { STATUS_DONE, STATUS_VERIFIED } from "@/libs/constants";

const AssessmentPurpose = () => {
  const router = useRouter();
  const t = useTranslation();
  const { assessment } = useAssessmentStore();
  return (
    <div className="w-full">
      <div className="mx-20 flex flex-col justify-center items-start">
        <p className="mt-15 mb-5 font-bold text-blue-900 text-xl">
          {t("assessment.Abstract")}
        </p>
        <p className="text-justify ml-5">{assessment?.abstract}</p>
        <p className="mt-15 mb-5 font-bold text-blue-900 text-xl">
          {t("assessment.Goal")}
        </p>
        <p className="text-justify ml-5">{assessment?.goal}</p>
        <p className="mt-15 mb-5 font-bold text-blue-900 text-xl">
          {t("assessment.Content")}
        </p>
        <p className="text-justify ml-5">{assessment?.content}</p>
      </div>
      <form
        method="POST"
        className="mt-15 flex items-center justify-center"
        onSubmit={(event) => {
          event.preventDefault();
          router.push(
            assessment.statusId === STATUS_VERIFIED ||
              assessment.statusId === STATUS_DONE
              ? "/verification"
              : "/organization"
          );
        }}
      >
        <FullSolidButton size="small" color="blue" label={t("action.Start")} />
      </form>
    </div>
  );
};

export default AssessmentPurpose;
