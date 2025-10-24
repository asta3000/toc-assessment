import * as React from "react";
import { Html, Text } from "@react-email/components";

const Mail = ({ email, otp }) => {
  return (
    <Html>
      <Text>Сайн байна уу, {email}</Text>
      <Text className="mt-6">Нэг удаагийн нууц үг:</Text>
      <Text className="mt-2 text-2xl">{otp}</Text>
    </Html>
  );
};

export default Mail;
