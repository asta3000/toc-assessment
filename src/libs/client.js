// Prisma үүсгэх
import { PrismaClient } from "@prisma/client";
import { url } from "@/libs/constants";
export const prisma = new PrismaClient();

// Fetcher үүсгэх
import axios from "axios";

export const fetcher = async (url) => {
  try {
    const responses = await Promise.all(url.map((u) => instance.get(u)));
    return responses.map((res) => res.data);
  } catch (error) {
    console.error("CATCH_FETCHER: ", error);
  }
};

export const instance = axios.create({
  baseURL: url,
  headers: {
    "Content-Type": "application/json",
  },
});
