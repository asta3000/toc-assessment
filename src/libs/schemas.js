import { z } from "zod";

export const loginSchema = z.object({
  email: z.email("Имэйл хаяг буруу эсвэл оруулаагүй байна").trim(),
  password: z
    .string()
    .trim()
    .min(1, "Нууц үгээ оруулна уу")
    .min(8, "Нууц үг хамгийн багадаа 8 тэмдэгтээс бүрдэнэ")
    .regex(/[A-Z]/, "Том үсэг агуулсан байх ёстой")
    .regex(/[a-z]/, "Жижиг үсэг агуулсан байх ёстой")
    .regex(/[0-9]/, "Тоон тэмдэгт агуулсан байх ёстой")
    .regex(/[^A-Za-z0-9]/, "Тусгай тэмдэгт агуулсан байх ёстой"),
});

export const recoveryEmailSchema = z.object({
  email: z.email("Имэйл хаяг буруу эсвэл оруулаагүй байна").trim(),
});

export const recoveryOTPSchema = z
  .object({
    otp: z.coerce.number().min(100000, "OTP-ийн урт багадаа 6 оронтой байна."),
    userOtp: z.coerce
      .number()
      .min(0, "OTP кодыг оруулна уу")
      .min(100000, "OTP-ийн урт багадаа 6 оронтой байна."),
  })
  .refine((data) => data.otp === data.userOtp, {
    error: "OTP код буруу байна",
    path: ["userOtp"],
  });

export const recoveryPasswordSchema = z
  .object({
    email: z.email("Имэйл хаяг буруу эсвэл оруулаагүй байна").trim(),
    password: z
      .string("Нууц үгийг оруулна уу.")
      .trim()
      .min(1, "Нууц үгээ оруулна уу")
      .min(8, "Нууц үг хамгийн багадаа 8 тэмдэгтээс бүрдэнэ")
      .regex(/[A-Z]/, "Том үсэг агуулсан байх ёстой")
      .regex(/[a-z]/, "Жижиг үсэг агуулсан байх ёстой")
      .regex(/[0-9]/, "Тоон тэмдэгт агуулсан байх ёстой")
      .regex(/[^A-Za-z0-9]/, "Тусгай тэмдэгт агуулсан байх ёстой"),
    confirmPassword: z
      .string("Батлах нууц үгийг оруулна уу.")
      .trim()
      .min(1, "Нууц үгээ оруулна уу")
      .min(8, "Нууц үг хамгийн багадаа 8 тэмдэгтээс бүрдэнэ")
      .regex(/[A-Z]/, "Том үсэг агуулсан байх ёстой")
      .regex(/[a-z]/, "Жижиг үсэг агуулсан байх ёстой")
      .regex(/[0-9]/, "Тоон тэмдэгт агуулсан байх ёстой")
      .regex(/[^A-Za-z0-9]/, "Тусгай тэмдэгт агуулсан байх ёстой"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    error: "Нууц үгүүд хоорондоо тохирсонгүй",
    path: ["confirmPassword"],
  });

export const organizationSchema = z.object({
  name: z
    .string({ error: "Байгууллагын нэрийг оруулна уу" })
    .trim()
    .min(2, "Байгууллагын нэрний урт багадаа 2 үсэгтэй байна"),
  memberId: z
    .string({ error: "Гишүүнчлэлийг сонгоно уу" })
    .trim()
    .regex(/^[a-f\d]{24}$/i, { error: "Гишүүнчлэлийг сонгоно уу" }),
  operationId: z
    .string({ error: "Үйл ажиллагааны төрлийг сонгоно уу" })
    .trim()
    .regex(/^[a-f\d]{24}$/i, { error: "Үйл ажиллагааны төрлийг сонгоно уу" }),
  sectorId: z
    .string({ error: "Бизнесийн салбарыг сонгоно уу" })
    .trim()
    .regex(/^[a-f\d]{24}$/i, { error: "Бизнесийн салбарыг сонгоно уу" }),
});

export const userBaseSchema = z.object({
  firstname: z
    .string({ error: "Нэрийг оруулна уу" })
    .trim()
    .min(2, "Нэрний урт багадаа 2 үсэгтэй байна"),
  lastname: z
    .string({ error: "Овгийг оруулна уу" })
    .trim()
    .min(2, "Овгийн урт багадаа 2 үсэгтэй байна"),
  email: z.email("Имэйл хаяг буруу эсвэл оруулаагүй байна").trim(),
  position: z
    .string({ error: "Албан тушаалыг оруулна уу" })
    .trim()
    .min(2, "Албан тушаалын урт багадаа 2 үсэгтэй байна"),
  gender: z
    .string({ error: "Хүйсийг сонгоно уу" })
    .trim()
    .min(4)
    .regex(/^(MALE|FEMALE)$/, "Хүйсийн утга буруу байна"),
  mobile: z
    .string({ error: "Утасны дугаарыг оруулна уу" })
    .trim()
    .min(8, "Утасны дугаарын урт багадаа 2 үсэгтэй байна"),
  role: z
    .string({ error: "Үүргийг сонгоно уу" })
    .trim()
    .min(5)
    .regex(/^(ADMIN|VERIFIER|ORGANIZATION)$/, "Үүргийн утга буруу байна"),
  organizationId: z
    .string({ error: "Байгууллагыг сонгоно уу" })
    .trim()
    .regex(/^[a-f\d]{24}$/i, { error: "Байгууллагыг сонгоно уу" }),
});

export const userRegisterSchema = userBaseSchema
  .extend({
    password: z
      .string("Нууц үгийг оруулна уу.")
      .trim()
      .min(1, "Нууц үгээ оруулна уу")
      .min(8, "Нууц үг хамгийн багадаа 8 тэмдэгтээс бүрдэнэ")
      .regex(/[A-Z]/, "Том үсэг агуулсан байх ёстой")
      .regex(/[a-z]/, "Жижиг үсэг агуулсан байх ёстой")
      .regex(/[0-9]/, "Тоон тэмдэгт агуулсан байх ёстой")
      .regex(/[^A-Za-z0-9]/, "Тусгай тэмдэгт агуулсан байх ёстой"),
    confirmPassword: z
      .string("Батлах нууц үгийг оруулна уу.")
      .trim()
      .min(1, "Нууц үгээ оруулна уу")
      .min(8, "Нууц үг хамгийн багадаа 8 тэмдэгтээс бүрдэнэ")
      .regex(/[A-Z]/, "Том үсэг агуулсан байх ёстой")
      .regex(/[a-z]/, "Жижиг үсэг агуулсан байх ёстой")
      .regex(/[0-9]/, "Тоон тэмдэгт агуулсан байх ёстой")
      .regex(/[^A-Za-z0-9]/, "Тусгай тэмдэгт агуулсан байх ёстой"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    error: "Нууц үгүүд хоорондоо тохирсонгүй",
    path: ["confirmPassword"],
  });

export const resetPasswordSchema = z
  .object({
    email: z.email("Имэйл хаяг буруу эсвэл оруулаагүй байна").trim(),
    password: z
      .string("Нууц үгийг оруулна уу.")
      .trim()
      .min(1, "Нууц үгээ оруулна уу")
      .min(8, "Нууц үг хамгийн багадаа 8 тэмдэгтээс бүрдэнэ")
      .regex(/[A-Z]/, "Том үсэг агуулсан байх ёстой")
      .regex(/[a-z]/, "Жижиг үсэг агуулсан байх ёстой")
      .regex(/[0-9]/, "Тоон тэмдэгт агуулсан байх ёстой")
      .regex(/[^A-Za-z0-9]/, "Тусгай тэмдэгт агуулсан байх ёстой"),
    confirmPassword: z
      .string("Батлах нууц үгийг оруулна уу.")
      .trim()
      .min(1, "Нууц үгээ оруулна уу")
      .min(8, "Нууц үг хамгийн багадаа 8 тэмдэгтээс бүрдэнэ")
      .regex(/[A-Z]/, "Том үсэг агуулсан байх ёстой")
      .regex(/[a-z]/, "Жижиг үсэг агуулсан байх ёстой")
      .regex(/[0-9]/, "Тоон тэмдэгт агуулсан байх ёстой")
      .regex(/[^A-Za-z0-9]/, "Тусгай тэмдэгт агуулсан байх ёстой"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    error: "Нууц үгүүд хоорондоо тохирсонгүй",
    path: ["confirmPassword"],
  });

export const parameterSchema = z.object({
  name: z
    .string({ error: "Параметрийн нэрийг оруулна уу" })
    .trim()
    .min(10, "Параметрийн нэрний урт багадаа 10 үсэгтэй байна"),
  value: z
    .string({ error: "Параметрийн утгыг оруулна уу" })
    .trim()
    .min(1, "Параметрийн утгын урт багадаа 1 үсэгтэй байна"),
  description: z
    .string({ error: "Параметрийн тайлбарыг оруулна уу" })
    .trim()
    .min(15, "Параметрийн тайлбарын урт багадаа 15 үсэгтэй байна"),
});

export const yearSchema = z.object({
  name: z
    .string({ error: "Жилийг оруулна уу" })
    .trim()
    .min(4, "Жилийн урт багадаа 4 оронтой байна")
    .max(4, "Жилийн урт ихдээ 4 оронтой байна")
    .regex(/^2[01]/, {
      message: "Эхний тэмдэгт 2, дараагийнх нь 0 эсвэл 1 байх ёстой",
    }),
});

export const memberSchema = z.object({
  name: z
    .string({ error: "Гишүүнчлэлийн нэрийг оруулна уу" })
    .trim()
    .min(5, "Гишүүнчлэлийн нэрний урт багадаа 5 үсэгтэй байна"),
  description: z
    .string({ error: "Гишүүнчлэлийн тайлбарыг оруулна уу" })
    .trim()
    .min(15, "Гишүүнчлэлийн тайлбарын урт багадаа 15 үсэгтэй байна"),
});

export const operationSchema = z.object({
  name: z
    .string({ error: "Үйл ажиллагааны нэрийг оруулна уу" })
    .trim()
    .min(5, "Үйл ажиллагааны нэрний урт багадаа 5 үсэгтэй байна"),
  description: z
    .string({ error: "Үйл ажиллагааны тайлбарыг оруулна уу" })
    .trim()
    .min(15, "Үйл ажиллагааны тайлбарын урт багадаа 15 үсэгтэй байна"),
});

export const sectorSchema = z.object({
  name: z
    .string({ error: "Бизнесийн салбарын нэрийг оруулна уу" })
    .trim()
    .min(5, "Бизнесийн салбарын нэрний урт багадаа 5 үсэгтэй байна"),
  description: z
    .string({ error: "Бизнесийн салбарын тайлбарыг оруулна уу" })
    .trim()
    .min(15, "Бизнесийн салбарын тайлбарын урт багадаа 15 үсэгтэй байна"),
});

export const statusSchema = z.object({
  name: z
    .string({ error: "Төлвийн нэрийг оруулна уу" })
    .trim()
    .min(5, "Төлвийн нэрний урт багадаа 5 үсэгтэй байна"),
  description: z
    .string({ error: "Төлвийн тайлбарыг оруулна уу" })
    .trim()
    .min(15, "Төлвийн тайлбарын урт багадаа 15 үсэгтэй байна"),
});

export const symbolSchema = z.object({
  name: z
    .string({ error: "Тэмдэглээний нэрийг оруулна уу" })
    .trim()
    .min(1, "Тэмдэглээний нэрний урт багадаа 1 үсэгтэй байна"),
  min: z.coerce
    .number({ error: "Доод онооны утгыг оруулна уу" })
    .min(0, "Доод тал нь 0 байна")
    .max(999, "Хамгийн ихдээ 999 байна"),
  max: z.coerce
    .number({ error: "Дээд онооны утгыг оруулна уу" })
    .min(1, "Доод тал нь 1 байна")
    .max(1000, "Хамгийн ихдээ 1000 байна"),
});

export const guideSchema = z.object({
  name: z
    .string({ error: "Зааврын нэрийг оруулна уу" })
    .trim()
    .min(5, "Зааврын нэрний урт багадаа 5 үсэгтэй байна"),
  value: z
    .string({ error: "Зааврын утгыг оруулна уу" })
    .trim()
    .min(15, "Зааврын утгын урт багадаа 15 үсэгтэй байна"),
  guideType: z
    .string({ error: "Зааврын төрлийг оруулна уу" })
    .trim()
    .min(3)
    .regex(/^(VIDEO|PDF|LINK)$/, "Зааврын төрөл буруу байна"),
  description: z
    .string({ error: "Зааврын тайлбарыг оруулна уу" })
    .trim()
    .min(15, "Зааврын тайлбарын урт багадаа 15 үсэгтэй байна"),
});

export const contactSchema = z.object({
  name: z
    .string({ error: "Холбоосын нэрийг оруулна уу" })
    .trim()
    .min(5, "Холбоосын нэрний урт багадаа 5 үсэгтэй байна"),
  value: z
    .string({ error: "Холбоосын утгыг оруулна уу" })
    .trim()
    .min(15, "Холбоосын утгын урт багадаа 15 үсэгтэй байна"),
});

export const assessmentSchema = z.object({
  name: z
    .string({ error: "Үнэлгээний нэрийг оруулна уу" })
    .trim()
    .min(5, "Үнэлгээний нэрний урт багадаа 5 үсэгтэй байна"),
  abstract: z
    .string({ error: "Товч тайлбарыг оруулна уу" })
    .trim()
    .min(10, "Товч тайлбарын урт багадаа 10 үсэгтэй байна"),
  content: z
    .string({ error: "Агуулгыг оруулна уу" })
    .trim()
    .min(10, "Агуулгын урт багадаа 10 үсэгтэй байна"),
  goal: z
    .string({ error: "Зорилгыг оруулна уу" })
    .trim()
    .min(10, "Зорилгын урт багадаа 10 үсэгтэй байна"),
});

export const moduleSchema = z.object({
  name: z
    .string({ error: "Үнэлгээний нэрийг оруулна уу" })
    .trim()
    .min(5, "Үнэлгээний нэрний урт багадаа 5 үсэгтэй байна"),
  goal: z
    .string({ error: "Зорилгыг оруулна уу" })
    .trim()
    .min(10, "Зорилгын урт багадаа 10 үсэгтэй байна"),
  description: z
    .string({ error: "Товч тайлбарыг оруулна уу" })
    .trim()
    .min(10, "Товч тайлбарын урт багадаа 10 үсэгтэй байна"),
  assessmentId: z
    .string({ error: "Үнэлгээг сонгоно уу" })
    .trim()
    .regex(/^[a-f\d]{24}$/i, { error: "Үнэлгээг сонгоно уу" }),
});

export const questionTypeSchema = z.object({
  name: z
    .string({ error: "Асуултын төрлийн нэрийг оруулна уу" })
    .trim()
    .min(5, "Асуултын төрлийн нэрний урт багадаа 5 үсэгтэй байна"),
  classification: z
    .string({ error: "Ангиллыг оруулна уу" })
    .trim()
    .min(6)
    .regex(/^(GENERAL|SECTOR)$/, "Ангилал буруу байна"),
  description: z
    .string({ error: "Товч тайлбарыг оруулна уу" })
    .trim()
    .min(10, "Товч тайлбарын урт багадаа 10 үсэгтэй байна"),
  moduleId: z
    .string({ error: "Модулийг сонгоно уу" })
    .trim()
    .regex(/^[a-f\d]{24}$/i, { error: "Модулийг сонгоно уу" }),
  assessmentId: z
    .string({ error: "Үнэлгээг сонгоно уу" })
    .trim()
    .regex(/^[a-f\d]{24}$/i, { error: "Үнэлгээг сонгоно уу" }),
});

export const answerTypeSchema = z.object({
  name: z
    .string({ error: "Асуултын төрлийн нэрийг оруулна уу" })
    .trim()
    .min(5, "Асуултын төрлийн нэрний урт багадаа 5 үсэгтэй байна"),
  classification: z
    .string({ error: "Ангиллыг оруулна уу" })
    .trim()
    .min(4)
    .regex(/^(RADIO|CHECKBOX|TEXT|COMBINE)$/, "Ангилал буруу байна"),
  description: z
    .string({ error: "Товч тайлбарыг оруулна уу" })
    .trim()
    .min(10, "Товч тайлбарын урт багадаа 10 үсэгтэй байна"),
});

export const faqSchema = z.object({
  question: z
    .string({ error: "Асуултын төрлийн нэрийг оруулна уу" })
    .trim()
    .min(5, "Асуултын төрлийн нэрний урт багадаа 5 үсэгтэй байна"),
  answer: z
    .string({ error: "Асуултын төрлийн нэрийг оруулна уу" })
    .trim()
    .min(5, "Асуултын төрлийн нэрний урт багадаа 5 үсэгтэй байна"),
});

// import { RADIO, CHECKBOX, TEXT } from "./constants";

export const questionnaireBaseSchema = z.object({
  assessmentId: z
    .string({ error: "Үнэлгээг сонгоно уу" })
    .trim()
    .regex(/^[a-f\d]{24}$/i, { error: "Үнэлгээг сонгоно уу" }),
  moduleId: z
    .string({ error: "Модулийг сонгоно уу" })
    .trim()
    .regex(/^[a-f\d]{24}$/i, { error: "Модулийг сонгоно уу" }),
  questionTypeId: z
    .string({ error: "Асуултын төрлийг сонгоно уу" })
    .trim()
    .regex(/^[a-f\d]{24}$/i, { error: "Асуултын төрлийг сонгоно уу" }),
  name: z
    .string({ error: "Асуултыг оруулна уу" })
    .trim()
    .min(5, "Асуултын урт багадаа 5 үсэгтэй байна"),
  answerTypeId: z
    .string({ error: "Хариултын төрлийг сонгоно уу" })
    .trim()
    .regex(/^[a-f\d]{24}$/i, { error: "Хариултын төрлийг сонгоно уу" }),
});

// const subQuestionSchema = z.object({
//   name: z
//     .string({ error: "Нэмэлт асуултыг оруулна уу" })
//     .trim()
//     .min(5, "Нэмэлт асуултын урт багадаа 5 үсэгтэй байна"),
// });

// const optionSchemas = z.object({
//   name: z
//     .string({ error: "Нэмэлт асуултыг оруулна уу" })
//     .trim()
//     .min(5, "Нэмэлт асуултын урт багадаа 5 үсэгтэй байна"),
//   score: z.coerce
//     .number({ error: "Хариултын хувилбарын оноог оруулна уу" })
//     .min(0, "Доод тал нь 0 байна")
//     .max(20, "Дээд тал нь 20 байна"),
// });

// const questionnaireSchema = z.discriminatedUnion("answerTypeId", [
//   z.object({
//     ...questionnaireBaseSchema.shape,
//     answerTypeId: z.literal(TEXT),
//     condition: z.never().optional(),
//     subQuestions: z.never().optional(),
//     options: z.never().optional(),
//   }),
//   z.object({
//     ...questionnaireBaseSchema.shape,
//     answerTypeId: z.literal(RADIO),
//     condition: z
//       .number({ error: "Нэмэлт асуулт харуулах оноог оруулна уу" })
//       .min(0, "Доод тал нь 0 байна")
//       .max(20, "Дээд тал нь 20 байна")
//       .optional(),
//     subQuestions: z.array(subQuestionSchema).optional(),
//     options: z
//       .array(optionSchemas)
//       .min(2, "Доод тал нь 2 сонголт шаардлагатай"),
//   }),
//   z.object({
//     ...questionnaireBaseSchema.shape,
//     answerTypeId: z.literal(CHECKBOX),
//     condition: z.never().optional(),
//     subQuestions: z.array(subQuestionSchema).optional(),
//     options: z
//       .array(optionSchemas)
//       .min(1, "Доод тал нь 1 сонголт шаардлагатай"),
//   }),
// ]);
