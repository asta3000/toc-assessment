"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import lodash from "lodash";

import { FullSpinner } from "@/components/Spinner";
import { ADMIN } from "@/libs/constants";
import { getUserSession, Logout } from "@/functions/Login";
import { getUserData } from "@/functions/User";
import { useUserStore } from "@/stores/storeUser";

const RootHome = () => {
  const router = useRouter();
  const [user, setUser] = useState();
  const { clearUser, storeUser } = useUserStore();

  const getData = async () => {
    const session = await getUserSession();

    if (session) {
      await getUserData(session?.user?.email, setUser, storeUser);
    } else {
      console.log("SESSION: ", session);
      router.push("/login");
    }
  };

  useEffect(() => {
    if (lodash.isEmpty(user?.role)) getData();

    if (!lodash.isEmpty(user)) {
      if (user?.status === "0") {
        clearUser();
        Logout();
      }

      if (user?.role === ADMIN) {
        router.push("/organizations/organizations");
      } else {
        router.push("/dashboard");
      }
    }
  }, [user]);

  return (
    <div className="w-full h-full bg-[url('/ToCLogo4.png'),url('/ToCLogo5.png')] bg-container bg-no-repeat bg-[position:left_bottom,right_top]">
      <FullSpinner />
    </div>
  );
};

export default RootHome;
