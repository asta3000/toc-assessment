"use client";

import Module from "@/components/assessment/module";
import Questions from "@/components/assessment/questions";
import { FullSpinner } from "@/components/Spinner";
import { DataEditorBySlug, DataRegister } from "@/functions/Data";
import { fetcher, instance } from "@/libs/client";
import {
  fileAttachment,
  STATUS_DONE,
  STATUS_SENT,
  STATUS_VERIFIED,
} from "@/libs/constants";
import { useAssessmentStore } from "@/stores/storeAssessment";
import { useSystemStore } from "@/stores/storeSystem";
import { useUserStore } from "@/stores/storeUser";

import lodash from "lodash";
import { redirect, useRouter } from "next/navigation";
import React, { useEffect, useMemo, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import useSWR from "swr";

const Organization = () => {
  const router = useRouter();
  const { user } = useUserStore();
  const { system } = useSystemStore();
  const { assessment } = useAssessmentStore();
  const [module, setModule] = useState();
  const [answerCount, setAnswerCount] = useState([]);
  const [savedAnswers, setSavedAnswers] = useState({
    answers: [],
    optionAnswers: [],
  });
  const shouldFetch =
    !lodash.isEmpty(user.id) && !lodash.isEmpty(assessment.assessmentId);

  useEffect(() => {
    if (lodash.isEmpty(assessment.assessmentId)) {
      router.push("/assessments");
    }
  }, [assessment]);

  const uris = useMemo(() => {
    return [
      "/modules/active",
      "/questions/assessment/" + assessment?.assessmentId,
      "/options/assessment/" + assessment?.assessmentId,
      "/questiontypes/active",
      "/subquestions/",
      "/parameters/" + fileAttachment,
      "/statistics/questions/" + assessment?.assessmentId,
    ];
  }, [assessment.assessmentId]);

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
    organizationId: user?.organizationId,
    yearId: system?.yearId,
    assessmentId: assessment?.assessmentId,
    moduleId: module?.id,
    userId: user?.id,
    questionId: null,
    answerTypeId: null,
    descriptions: [],
  });
  const [optionAnswer, setOptionAnswer] = useState({
    organizationId: user?.organizationId,
    yearId: system?.yearId,
    assessmentId: assessment?.assessmentId,
    moduleId: module?.id,
    userId: user?.id,
    questionId: null,
    answerTypeId: null,
    verifyId: null,
    options: [],
  });

  const getAnswerCount = async () => {
    if (shouldFetch) {
      const data = {
        assessmentId: assessment?.assessmentId,
        organizationId: user?.organizationId,
        yearId: system?.yearId,
      };

      await instance.post("/statistics/answers", data).then((result) => {
        if (result.status === 200) {
          setAnswerCount(result.data);
        }
      });
    }
  };

  const getData = async () => {
    await instance
      .post("/answers/get", {
        organizationId: user?.organizationId,
        yearId: system?.yearId,
        assessmentId: assessment?.assessmentId,
      })
      .then((result) => {
        if (result.status === 200) {
          setSavedAnswers({
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
    if (answer.descriptions.length === 0 || optionAnswer.options.length === 0) {
      getAnswerCount();
    }
  }, [answer, optionAnswer]);

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
    if (optionAnswer.options.length > 0 || answer.descriptions.length > 0) {
      toast.error("Сүүлийн хариултыг хадгалаагүй байна.", {
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

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Хариулт бөглөсөн эсэхийг шалгах. Бөглөсөн бол 0-с их байна.
    // Нэмэлт асуултгүй асуултын хувьд descriptions хоосон байж болно. Тиймээс || тэмдэгээр аль нэг нь биелэхийг шалгана.
    if (answer.descriptions?.length > 0 || optionAnswer.options?.length > 0) {
      const descriptions = answer.descriptions;
      const options = optionAnswer.options;

      // Өөрчлөлт үү, шинэ хариулт уу гэдгийг шалгана. id хоосон бол шинэ, биш бол өөрчлөлт
      if (
        lodash.isEmpty(descriptions[0]?.id) &&
        lodash.isEmpty(options[0]?.id)
      ) {
        await DataRegister("/answers", {
          answer,
          optionAnswer,
        });
      } else {
        await DataEditorBySlug("/answers", {
          answer,
          optionAnswer,
        });
      }

      setOptionAnswer({
        organizationId: user?.organizationId,
        yearId: system?.yearId,
        assessmentId: assessment?.assessmentId,
        moduleId: module?.id,
        userId: user?.id,
        questionId: null,
        answerTypeId: null,
        verifyId: null,
        options: [],
      });

      setAnswer({
        organizationId: user?.organizationId,
        yearId: system?.yearId,
        assessmentId: assessment?.assessmentId,
        moduleId: module?.id,
        userId: user?.id,
        questionId: null,
        answerTypeId: null,
        descriptions: [],
      });

      getData();
    }

    // Асуултын тоо, хариултын тоо хоёр тэнцүү буюу бүх асуултад хариулсан бол үнэлгээний төлвийг өөрчилнө.
    const answers = answerCount?.reduce((c, el) => c + (el.count ?? 0), 0) ?? 0;
    const questions =
      allDatas[6]?.reduce((c, el) => c + (el.count ?? 0), 0) ?? 0;

    if (answers === questions) {
      await instance
        .post("/performances/", {
          yearId: system?.yearId,
          assessmentId: assessment?.assessmentId,
          organizationId: user?.organizationId,
          statusId: STATUS_SENT,
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
              .post("/emailsender/assessmentsend", {
                year: system?.year,
                organizationId: user?.organizationId,
                assessment: assessment?.name,
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
    } else {
      toast.error("Бүх асуултыг хариулаагүй байна.", {
        duration: 2000,
        position: "top-right",
        className: "bg-red-400 text-white",
        style: {
          border: "2px solid rgb(192, 38, 19)",
        },
      });
    }
  };

  if (isLoading || !shouldFetch) {
    return <FullSpinner />;
  }

  if (error) {
    console.error(error);
  }

  // console.log("Answer: ", props.answer);
  // console.log("Answer Option: ", props.optionAnswer);
  console.log("Saved: ", savedAnswers);
  console.log("All: ", allDatas);
  console.log("Ass: ", assessment);

  return (
    <div>
      <div className="mx-20 flex flex-col justify-center items-start">
        <Toaster />
        <p className="mt-10 mb-5 font-bold text-blue-900 text-xl">
          {assessment?.name} {assessment?.year}
        </p>
      </div>
      <div className="mt-10 mx-20 flex justify-center items-start gap-8">
        <div className="min-w-[400px]">
          <Module
            modules={allDatas[0]}
            questions={allDatas[6]}
            answerCount={answerCount}
            assessmentId={assessment?.assessmentId}
            handleChangeModule={handleChangeModule}
            handleSubmit={handleSubmit}
            module={module}
          />
        </div>
        <div className="w-full">
          {assessment.status === STATUS_VERIFIED ||
          assessment.status === STATUS_DONE ? null : (
            <Questions
              datas={allDatas}
              module={module}
              setAnswer={setAnswer}
              answer={answer}
              setOptionAnswer={setOptionAnswer}
              optionAnswer={optionAnswer}
              questions={allDatas[6]}
              answerCount={answerCount}
              handleSubmit={handleSubmit}
              savedAnswers={savedAnswers}
              setSavedAnswers={setSavedAnswers}
              getData={getData}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Organization;
