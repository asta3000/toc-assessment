"use client";

import React, { Fragment, useMemo, useReducer } from "react";
import toast, { Toaster } from "react-hot-toast";
import useSWR from "swr";
import lodash from "lodash";
import clsx from "clsx";

import allMetadatas from "@/jsons/metadatas.json";
import { fetcher, instance } from "@/libs/client";
import { FullSpinner } from "@/components/Spinner";
import { AssessmentTable, VerificationTable } from "@/components/MyTable";
import { useUserStore } from "@/stores/storeUser";
import {
  CYCLE,
  ORGANIZATION,
  // STATUS_DONE,
  STATUS_FILLING,
} from "@/libs/constants";
import { useSystemStore } from "@/stores/storeSystem";
import AssessmentPurpose from "@/components/assessment/purpose";
import VerificationPurpose from "@/components/verification/purpose";
// import { useAssessmentStore } from "@/stores/storeAssessment";

const Assessments = () => {
  const initialState = "ASSESSMENTS";
  const orgMetadatas = allMetadatas?.filter((m) => m.title === "assessments")[0]
    ?.metadatas;
  const verMetadatas = allMetadatas?.filter(
    (m) => m.title === "verifications"
  )[0]?.metadatas;
  const { user } = useUserStore();
  const { system } = useSystemStore();
  const shouldFetch =
    !lodash.isEmpty(user) && !lodash.isEmpty(system) && system.year;

  const uris = useMemo(() => {
    return user.role === ORGANIZATION
      ? [
          "/performances/organization/" + user?.organizationId,
          "/years",
          "/parameters/" + CYCLE,
        ]
      : ["/performances", "/years", "/parameters/" + CYCLE];
  }, [user.role, system.year]);

  const {
    data: allDatas = [],
    error,
    isLoading,
    isValidating,
    mutate,
  } = useSWR(shouldFetch ? uris : null, fetcher, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    refreshInterval: 0,
  });

  const reducer = (state, action) => {
    switch (action.type) {
      case "ASSESSMENTS":
        return "PURPOSE";
    }
    return state;
  };

  const [state, dispatch] = useReducer(reducer, initialState);

  if (isLoading || !shouldFetch || isValidating) {
    return <FullSpinner />;
  }

  if (error) {
    console.error(error);
  }

  const handleAction = async (data, email) => {
    const emailUrl =
      data.statusId === STATUS_FILLING ||
      data?.cycle < Number(allDatas[2][0]?.value)
        ? "/emailsender/assessmentdecline"
        : "/emailsender/assessmentapprove";

    await instance
      .put("/performances/" + data.id, data)
      .then(async (result) => {
        if (result.status === 200) {
          toast.success("Үйлдлийг амжилттай гүйцэтгэлээ.", {
            duration: 2000,
            position: "top-right",
            className: "bg-green-400 text-white",
            style: {
              border: "2px solid rgb(192, 38, 19)",
            },
          });
          mutate();

          await instance
            .post(emailUrl, email)
            .then((result) => {
              if (result.status === 200) {
                toast.success("Автомат мэдэгдэл илгээгдлээ.", {
                  duration: 2000,
                  position: "top-right",
                  className: "bg-green-400 text-white",
                  style: {
                    border: "2px solid rgb(192, 38, 19)",
                  },
                });
              } else {
                toast.error(
                  "Автомат мэдэгдэл илгээгдсэнгүй. Та гараар мэдэгдэнэ үү.",
                  {
                    duration: 2000,
                    position: "top-right",
                    className: "bg-red-400 text-white",
                    style: {
                      border: "2px solid rgb(192, 38, 19)",
                    },
                  }
                );
              }
            })
            .catch((error) => {
              console.log("ERROR: ", error);
              toast.error(
                "Автомат мэдэгдэл илгээгдсэнгүй. Та гараар мэдэгдэнэ үү.",
                {
                  duration: 2000,
                  position: "top-right",
                  className: "bg-red-400 text-white",
                  style: {
                    border: "2px solid rgb(192, 38, 19)",
                  },
                }
              );
            });
        } else {
          toast.error("Үйлдлийг гүйцэтгэхэд алдаа гарлаа.", {
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
        console.log("ERROR: ", error);
        toast.error("Үйлдлийг гүйцэтгэхэд алдаа гарлаа.", {
          duration: 2000,
          position: "top-right",
          className: "bg-red-400 text-white",
          style: {
            border: "2px solid rgb(192, 38, 19)",
          },
        });
      });
  };

  return (
    <div>
      <div className="mx-20 flex flex-col justify-center items-start">
        <Toaster />
        {state === "ASSESSMENTS" ? (
          allDatas[1]?.map((year) => {
            return (
              <Fragment key={year.name}>
                <p
                  className={clsx(
                    "mt-10 mb-5 font-bold",
                    year.id === system.yearId
                      ? "font-bold text-3xl text-blue-900"
                      : "font-normal text-xl text-blue-900/80"
                  )}
                >
                  {year?.name}
                </p>

                {user.role === ORGANIZATION ? (
                  <AssessmentTable
                    metadatas={orgMetadatas}
                    allDatas={allDatas}
                    user={user}
                    dispatch={dispatch}
                    state={state}
                    year={year}
                    handleAction={handleAction}
                  />
                ) : (
                  <VerificationTable
                    metadatas={verMetadatas}
                    allDatas={allDatas}
                    user={user}
                    dispatch={dispatch}
                    state={state}
                    year={year}
                  />
                )}
              </Fragment>
            );
          })
        ) : user.role === ORGANIZATION ? (
          <AssessmentPurpose />
        ) : (
          <VerificationPurpose />
        )}
      </div>
    </div>
  );
};

export default Assessments;
