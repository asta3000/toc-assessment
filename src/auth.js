import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import bcrypt from "bcryptjs";

import { prisma } from "@/libs/client";
import { autherror, authstatuserror } from "./libs/constants";
import { loginSchema } from "./libs/schemas";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Google,
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          const parsed = loginSchema?.safeParse(credentials);
          if (!parsed?.success) {
            const firstError = parsed?.error?.issues[0];
            throw new Error(firstError?.message);
          }

          const user = await prisma.user.findUnique({
            where: { email: credentials.email },
          });

          if (!user) {
            throw new Error(autherror);
          } else if (user.status === "0") {
            throw new Error(authstatuserror);
          }

          // Check whether passwords of user matched
          const matchedPassword = await bcrypt.compare(
            credentials.password,
            user.password
          );

          if (!matchedPassword) {
            // Нууц үг буруу хийсэн оролдлого 5 хүрсэн бол эрхийг хаана. Үгүй бол оролдлогыг 1-ээр нэмнэ.
            if (user.attempt >= 4) {
              await prisma.user.update({
                where: { id: user.id },
                data: { status: "0" },
              });
            } else {
              await prisma.user.update({
                where: { id: user.id },
                data: { attempt: user.attempt + 1 },
              });
            }

            throw new Error(autherror);
          } else {
            // Нууц үгийг зөв оруулбал оролдлогыг 0 болгоно.
            await prisma.user.update({
              where: { id: user.id },
              data: { attempt: 0 },
            });
          }

          return user;
        } catch (error) {
          console.log("E: ", error.message);
        }
      },
    }),
  ],
  trustHost: true,
  session: {
    strategy: "jwt",
    maxAge: 8 * 60 * 60,
  },
  jwt: { secret: process.env.NEXTAUTH_SECRET },
  callbacks: {
    async signIn({ account, profile }) {
      if (account.provider === "google") {
        return profile?.email_verified === true;
      }
      return true;
    },
    async jwt({ token }) {
      return token;
    },
    async session({ session }) {
      return session;
    },
  },
});
