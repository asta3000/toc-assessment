"use client";

import Module from "@/components/verification/module";
import Questions from "@/components/verification/questions";
import { FullSpinner } from "@/components/Spinner";
import { DataEditorBySlug } from "@/functions/Data";
import { fetcher, instance } from "@/libs/client";
import { useSystemStore } from "@/stores/storeSystem";
import { useUserStore } from "@/stores/storeUser";
import { useVerificationStore } from "@/stores/storeVerification";
import { STATUS_VERIFIED } from "@/libs/constants";

import lodash from "lodash";
import { redirect, useRouter } from "next/navigation";
import React, { useEffect, useMemo, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import useSWR from "swr";

const Verification = () => {
  const router = useRouter();
  const { user } = useUserStore();
  const { system } = useSystemStore();
  const { verification } = useVerificationStore();
  const [module, setModule] = useState();
  const [verificationCount, setVerificationCount] = useState([]);
  const [savedOrganizationAnswers, setSavedOrganizationAnswers] = useState({
    answers: [],
    optionAnswers: [],
  });
  const shouldFetch =
    !lodash.isEmpty(user.id) && !lodash.isEmpty(verification.assessmentId);

  useEffect(() => {
    if (lodash.isEmpty(verification.id)) {
      router.push("/assessments");
    }
  }, [verification]);

  const uris = useMemo(() => {
    return [
      "/modules/active",
      "/questions/assessment/" + verification?.assessmentId,
      "/options/assessment/" + verification?.assessmentId,
      "/questiontypes/active",
      "/subquestions/",
      "/statistics/questions/" + verification?.assessmentId,
    ];
  }, [verification.id]);

  const {
    data: allDatas = [],
    error,
    isLoading,
    mutate,
    isValidating,
  } = useSWR(shouldFetch ? uris : null, fetcher, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    dedupingInterval: 30000,
    refreshInterval: 0,
  });

  const [answer, setAnswer] = useState({
    organizationId: verification?.organizationId,
    yearId: verification?.yearId,
    assessmentId: verification?.assessmentId,
    moduleId: module?.id,
    verifierId: user?.id,
    comment: null,
  });

  const [optionAnswer, setOptionAnswer] = useState({
    organizationId: user?.organizationId,
    yearId: system?.yearId,
    assessmentId: verification?.assessmentId,
    moduleId: module?.id,
    verifierId: user?.id,
    options: [],
  });

  const getVerificationCount = async () => {
    if (shouldFetch) {
      const data = {
        assessmentId: verification?.assessmentId,
        organizationId: verification?.organizationId,
        yearId: verification?.yearId,
      };

      await instance.post("/statistics/verifications", data).then((result) => {
        if (result.status === 200) {
          setVerificationCount(result.data);
        }
      });
    }
  };

  const getData = async () => {
    await instance
      .post("/answers/get", {
        organizationId: verification?.organizationId,
        yearId: verification?.yearId,
        assessmentId: verification?.assessmentId,
      })
      .then((result) => {
        if (result.status === 200) {
          setSavedOrganizationAnswers({
            answers: result.data.answers,
            optionAnswers: result.data.optionAnswers,
          });
        }
      })
      .catch((error) => console.log(error));
  };

  useEffect(() => {
    getData();
  }, []);

  useEffect(() => {
    if (optionAnswer.options.length === 0) {
      getVerificationCount();
    }
  }, [optionAnswer]);

  useEffect(() => {
    if (!lodash.isEmpty(module)) {
      setAnswer((prev) => ({
        ...prev,
        moduleId: module.id,
      }));
      setOptionAnswer((prev) => ({
        ...prev,
        moduleId: module.id,
      }));
    }
  }, [module]);

  useEffect(() => {
    if (!lodash.isEmpty(allDatas)) setModule(allDatas[0][0]);
  }, [allDatas]);

  const handleChangeModule = (module) => {
    if (optionAnswer.options.length > 0) {
      toast.error("Сүүлийн баталгаажуулалтыг хадгалаагүй байна.", {
        duration: 2000,
        position: "top-right",
        className: "bg-red-400 text-white",
        style: {
          border: "2px solid rgb(192, 38, 19)",
        },
      });
    } else {
      setModule(module);
    }
  };

  const questions = allDatas[5]?.reduce((c, el) => c + (el.count ?? 0), 0) ?? 0;
  const verifications =
    verificationCount?.reduce((c, el) => c + (el.count ?? 0), 0) ?? 0;

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Ямар нэг утга өөрчилсөн бол энэ нөхцөл заавал биелэх ба state-д байгаа утгыг өгөгдлийн сан руу хадгална.
    if (optionAnswer.options?.length > 0) {
      await DataEditorBySlug("/verify", {
        answer: answer,
        optionAnswer: optionAnswer,
      });

      setOptionAnswer({
        organizationId: verification?.organizationId,
        yearId: verification?.yearId,
        assessmentId: verification?.assessmentId,
        moduleId: module?.id,
        verifierId: user?.id,
        options: [],
      });

      setAnswer({
        organizationId: verification?.organizationId,
        yearId: verification?.yearId,
        assessmentId: verification?.assessmentId,
        moduleId: module?.id,
        verifierId: user?.id,
        comment: null,
      });

      getData();
    }

    // Асуултын тоо, баталгаажуулалтын тоо тэнцүү бол үнэлгээний баталгаажуулалтыг шууд дуусгана.
    if (verifications === questions) {
      handleFinish(event);
    }
  };

  const handleFinish = async (event) => {
    event.preventDefault();

    // Асуултын тоо, баталгаажуулалтын тоо хоорондоо тэнцэхгүй бол өөрчлөлт ороогүй буюу баталгаажуулаагүй хариултуудыг бүгдийг автоматаар баталгаажуулна.
    if (verifications !== questions) {
      await instance
        .post("/verify", {
          yearId: verification?.yearId,
          assessmentId: verification?.assessmentId,
          organizationId: verification?.organizationId,
        })
        .then((result) => {
          if (result.status === 200) {
            toast.success("Үнэлгээний бүх хариултыг баталгаажууллаа.", {
              duration: 2000,
              position: "top-right",
              className: "bg-green-400 text-white",
              style: {
                border: "2px solid rgb(192, 38, 19)",
              },
            });
          } else {
            toast.error(
              "Үнэлгээний хариултуудыг баталгаажуулахад алдаа гарлаа.",
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
            "Үнэлгээний хариултуудыг баталгаажуулахад алдаа гарлаа.",
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
    }

    // Үнэлгээний төлвийг өөрчилнө.
    await instance
      .post("/performances/", {
        yearId: verification?.yearId,
        assessmentId: verification?.assessmentId,
        organizationId: verification?.organizationId,
        statusId: STATUS_VERIFIED,
      })
      .then(async (result) => {
        if (result.status === 200) {
          toast.success("Үнэлгээ илгээгдлээ.", {
            duration: 2000,
            position: "top-right",
            className: "bg-green-400 text-white",
            style: {
              border: "2px solid rgb(192, 38, 19)",
            },
          });

          await instance
            .post("/emailsender/verificationsend", {
              yearId: verification?.yearId,
              assessmentId: verification?.assessmentId,
              organizationId: verification?.organizationId,
            })
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
          toast.error("Үнэлгээ илгээхэд алдаа гарлаа.", {
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
        toast.error("Үнэлгээ илгээхэд алдаа гарлаа.", {
          duration: 2000,
          position: "top-right",
          className: "bg-red-400 text-white",
          style: {
            border: "2px solid rgb(192, 38, 19)",
          },
        });
      });

    redirect("/assessments");
  };

  if (isLoading || !shouldFetch) {
    return <FullSpinner />;
  }

  if (error) {
    console.error(error);
  }

  // console.log("Answer: ", answer);
  // console.log("OptionAnswer: ", optionAnswer);
  // console.log("Saved: ", savedOrganizationAnswers);

  return (
    <div>
      <div className="mx-20 flex flex-col justify-center items-start">
        <Toaster />
        <p className="mt-10 mb-5 font-bold text-blue-900 text-xl">
          {verification?.assessment} {verification?.year}
        </p>
      </div>
      <div className="mt-10 mx-20 flex justify-center items-start gap-8">
        <div className="min-w-[400px]">
          <Module
            modules={allDatas[0]}
            questions={allDatas[5]}
            handleChangeModule={handleChangeModule}
            handleSubmit={handleSubmit}
            module={module}
            verificationCount={verificationCount}
            handleFinish={handleFinish}
            length={optionAnswer?.options?.length}
          />
        </div>
        <div className="w-full">
          <Questions
            datas={allDatas}
            module={module}
            setOptionAnswer={setOptionAnswer}
            setAnswer={setAnswer}
            answer={answer}
            optionAnswer={optionAnswer}
            questions={allDatas[5]}
            savedOrganizationAnswers={savedOrganizationAnswers}
            getData={getData}
            user={user}
            verificationCount={verificationCount}
            handleSubmit={handleSubmit}
            handleFinish={handleFinish}
          />
        </div>
      </div>
    </div>
  );
};

export default Verification;
