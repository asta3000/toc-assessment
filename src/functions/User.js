"use client";

import { instance } from "@/libs/client";
import { redirect } from "next/navigation";

export const getUserData = async (email, setUser, storeUser) => {
  await instance
    .post("/auth/user", {
      email,
    })
    .then((result) => {
      if (result.status === 200) {
        setUser(result.data);
        storeUser(result.data);
      }
    })
    .catch((error) => {
      console.error(error);
      redirect("/login");
    });
};
