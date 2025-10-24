import { instance } from "@/libs/client";

export const EmailSend = async (data) => {
  // console.log("MAIL_DATA: ", data);

  let notification = "";
  let full_url = "";
  if (data.type === "loan") {
    full_url = url + "/emailsender/loan";
    notification = "Зээлийн хүсэлтийг илгээлээ.";
  }

  console.log("FULL_URL: ", full_url);

  // await instance
  //   .post(full_url, data)
  //   .then((result) => {
  //     if (result.status === 200) {
  //       alert("Мэдэгдэл", notification);
  //     } else {
  //       alert(
  //         "Мэдэгдэл",
  //         "Мэдэгдлийг илгээхэд алдаа гарлаа. Дахин оролдоно уу."
  //       );
  //     }
  //   })
  //   .catch((error) => {
  //     console.log("EMAIL_SEND_ERROR: ", error);
  //     alert("Мэдэгдэл", "Мэдэгдлийг илгээхэд алдаа гарлаа. Дахин оролдоно уу.");
  //   });
};
