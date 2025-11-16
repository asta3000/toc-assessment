"use server";

import { signIn, signOut, auth } from "@/auth";

// export const LoginViaGitHub = async () => {
//   await signIn("github", { callbackUrl: "/" });
// };

// export const LoginViaGoogle = async () => {
//   await signIn("google", { callbackUrl: "/" });
// };

// export const LoginViaMicrosoft = async () => {
//   await signIn("microsoft-entra-id", { callbackUrl: "/" });
// };

export const LoginViaCredentials = async ({ email, password }) => {
  try {
    const result = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });

    return result;
  } catch (error) {
    console.error("E: ", error);
    return null;
  }
};

export const Logout = async () => {
  await signOut({ redirectTo: "/login" });
};

export const getUserSession = async () => {
  try {
    const session = await auth();

    if (!session) {
      return null;
    }

    return session;
  } catch (error) {
    console.log("CATCH: ", error);
    return null;
  }
};
