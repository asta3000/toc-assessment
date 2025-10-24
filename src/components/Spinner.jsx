"use client";

import { useTranslation } from "@/hooks/useTranslation";

export const FullSpinner = () => {
  const t = useTranslation();
  return (
    <div className="fixed top-0 left-0 h-full w-full z-10 flex flex-col justify-center items-center gap-10">
      <div className="loader"></div>
      <p className="text-sm text-blue-950 font-semibold">
        {t("action.loading")}
      </p>
    </div>
  );
};

export const Spinner = () => {
  const t = useTranslation();
  return (
    <div className="flex flex-col justify-center items-center gap-5">
      <div className="loader"></div>
      <p className="text-sm text-blue-950 font-semibold">
        {t("action.loading")}
      </p>
    </div>
  );
};
