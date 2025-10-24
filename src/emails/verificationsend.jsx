import * as React from "react";
import { Html, Text, Link } from "@react-email/components";

const Mail = ({ year, assessment, organization }) => {
  return (
    <Html>
      <Text>Сайн байна уу</Text>
      <Text className="mt-6">
        Танай байгууллагын үнэлгээг баталгааажуулж дууслаа.
      </Text>
      <Text className="mt-2">Байгууллага: {organization}</Text>
      <Text className="mt-2">Он: {year}</Text>
      <Text className="mt-2">Үнэлгээ: {assessment}</Text>
      <Link href={process.env.URL} target="_blank">
        Систем рүү очих
      </Link>
    </Html>
  );
};

export default Mail;
