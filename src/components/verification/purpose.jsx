"use client";

import React from "react";
import { useRouter } from "next/navigation";

import { useTranslation } from "@/hooks/useTranslation";
import { FullSolidButton } from "../MyButton";
import { useVerificationStore } from "@/stores/storeVerification";

const VerificationPurpose = () => {
  const router = useRouter();
  const t = useTranslation();
  const { verification } = useVerificationStore();
  return (
    <div className="w-full">
      <div className="mx-20 flex flex-col justify-center items-start">
        <p className="mt-15 mb-5 font-bold text-blue-900 text-xl">
          {t("verification.organization")}
        </p>
        <p className="text-justify ml-5">{verification?.organization}</p>
        <p className="mt-15 mb-5 font-bold text-blue-900 text-xl">
          {t("verification.year")}
        </p>
        <p className="text-justify ml-5">{verification?.year}</p>
        <p className="mt-15 mb-5 font-bold text-blue-900 text-xl">
          {t("verification.assessment")}
        </p>
        <p className="text-justify ml-5">{verification?.assessment}</p>
      </div>
      <form
        method="POST"
        className="mt-15 flex items-center justify-center"
        onSubmit={(event) => {
          event.preventDefault();
          router.push("/verification");
        }}
      >
        <FullSolidButton size="small" color="blue" label={t("action.Start")} />
      </form>
    </div>
  );
};

export default VerificationPurpose;
