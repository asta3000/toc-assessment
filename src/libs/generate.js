import lodash from "lodash";

const handleGenerateNumber = (length = null) => {
  let generate;
  let len;

  if (lodash.isEmpty(length)) {
    len = 6;
  }

  if ((len = 6)) {
    generate = Math.floor(Math.random() * (999999 - 100000) + 100000);
  } else if ((len = 4)) {
    generate = Math.floor(Math.random() * (9999 - 1000) + 1000);
  } else {
    generate = Math.floor(
      Math.random() * (9999999999 - 1000000000) + 1000000000
    );
  }

  return generate.toString();
};

export default handleGenerateNumber;

export const getRandomHexColor = () => {
  return (
    "#" +
    Math.floor(Math.random() * 16777215)
      .toString(16)
      .padStart(6, "0")
  );
};
