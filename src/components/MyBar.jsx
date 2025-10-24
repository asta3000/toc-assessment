"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";
import clsx from "clsx";
import { useEffect, useMemo, useRef, useState } from "react";
import lodash from "lodash";
import { FaRegUserCircle } from "react-icons/fa";
import useSWR from "swr";

import adminmenus from "@/jsons/adminbar.json";
import adminsubmenus from "@/jsons/adminsubbar.json";
import usermenus from "@/jsons/userbar.json";
import usersubmenus from "@/jsons/usersubbar.json";
import profilemenus from "@/jsons/profilebar.json";
import {
  bgblue,
  textblue,
  borderblue,
  VERIFIER,
  ORGANIZATION,
} from "@/libs/constants";
import { useSystemStore } from "@/stores/storeSystem";
import { useTranslation } from "@/hooks/useTranslation";
import { getUserSession, Logout } from "@/functions/Login";
import { getUserData } from "@/functions/User";
import { useUserStore } from "@/stores/storeUser";
import { fetcher } from "@/libs/client";
import { FullSpinner } from "./Spinner";

export const AdminBar = () => {
  const path = usePathname();
  const router = useRouter();
  const [user, setUser] = useState();
  const { system } = useSystemStore();
  const { storeUser, clearUser } = useUserStore();
  const t = useTranslation();

  const getData = async () => {
    const session = await getUserSession();

    if (session) {
      await getUserData(session?.user?.email, setUser, storeUser);
    } else {
      clearUser();
      router.push("/login");
    }
  };

  useEffect(() => {
    if (lodash.isEmpty(user)) getData();

    if (user?.role === VERIFIER || user?.role === ORGANIZATION) {
      router.push("/dashboard");
    }
  }, [user]);

  return (
    <div
      className={`w-full px-[5%] ${bgblue} flex justify-between items-center`}
    >
      <Image
        src="/ToCLogo1.png"
        width={70}
        height={70}
        alt=""
        priority
        className="h-auto aspect-auto"
      />
      <div className="flex gap-5 text-sm">
        {adminmenus
          .filter((m) => m.role.includes(user?.role))
          .filter((m) => m.status === true)
          .map((menu, index) => {
            return (
              <Link
                key={index}
                href={menu.link}
                className={clsx(
                  "py-3 px-6 rounded-2xl ",
                  path.split("/")[1] === menu.link.split("/")[1]
                    ? textblue
                    : "text-white",
                  path.split("/")[1] === menu.link.split("/")[1]
                    ? "bg-white"
                    : "hover:bg-white/20"
                )}
              >
                {system.language === "mn" ? menu.name : menu.name_en}
              </Link>
            );
          })}
        <p
          className="py-3 px-6 text-white cursor-pointer hover:bg-white/20 rounded-2xl"
          onClick={() => {
            clearUser();
            Logout();
          }}
        >
          {t("auth.LogOut")}
        </p>
      </div>
    </div>
  );
};

export const AdminSubBar = () => {
  const path = usePathname();
  const { system } = useSystemStore();

  if (path === "/files") return;

  return (
    <div className={`text-sm mt-10 mb-5 border-b-[1px] ${borderblue}`}>
      <div className="mx-15 px-5 flex justify-start items-center gap-1">
        {adminsubmenus
          .filter((m) => m.title === path.split("/")[1])[0]
          .menus.filter((m) => m.status === true)
          .map((menu, index) => {
            return (
              <Link
                key={index}
                href={menu.link}
                className={clsx(
                  "py-2 px-5 rounded-t-xl",
                  path === menu.link ? bgblue : "bg-white hover:bg-blue-200",
                  path === menu.link ? "text-white" : textblue
                )}
              >
                {system.language === "mn" ? menu.name : menu.name_en}
              </Link>
            );
          })}
      </div>
    </div>
  );
};

export const UserBar = () => {
  const path = usePathname();
  const router = useRouter();
  const menuRef = useRef(null);
  const [user, setUser] = useState();
  const [showMenu, setShowMenu] = useState(false);
  const { system, storeYear } = useSystemStore();
  const { storeUser, clearUser } = useUserStore();
  const t = useTranslation();
  const uris = useMemo(() => {
    return ["/years/active"];
  }, []);
  const { data, error, isLoading } = useSWR(uris, fetcher, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    refreshInterval: 0,
  });

  const getData = async () => {
    const session = await getUserSession();

    if (session) {
      await getUserData(session?.user?.email, setUser, storeUser);
    } else {
      clearUser();
      router.push("/login");
    }
  };

  useEffect(() => {
    if (lodash.isEmpty(user)) getData();
  }, [user]);

  useEffect(() => {
    if (!lodash.isEmpty(data)) {
      storeYear({ year: data[0].name, yearId: data[0].id });
    }
  }, [data]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  if (isLoading) {
    return <FullSpinner />;
  }

  if (error) {
    console.error(error);
  }

  return (
    <div
      className={`w-full px-[5%] ${bgblue} flex justify-between items-center`}
    >
      <Image
        src="/ToCLogo1.png"
        width={70}
        height={70}
        alt=""
        priority
        className="h-auto aspect-auto"
      />
      <div className="relative flex gap-5 text-sm">
        {usermenus
          .filter((m) => m.role.includes(user?.role))
          .filter((m) => m.status === true)
          .map((menu, index) => {
            return (
              <Link
                key={index}
                href={menu.link}
                className={clsx(
                  "py-3 px-6 rounded-2xl ",
                  path.split("/")[1] === menu.link.split("/")[1]
                    ? textblue
                    : "text-white",
                  path.split("/")[1] === menu.link.split("/")[1]
                    ? "bg-white"
                    : "hover:bg-white/20"
                )}
              >
                {system.language === "mn" ? menu.name : menu.name_en}
              </Link>
            );
          })}
        <p
          className="py-3 px-6 text-white cursor-pointer hover:bg-white/20 rounded-2xl"
          onClick={() => {
            clearUser();
            Logout();
          }}
        >
          {t("auth.LogOut")}
        </p>
        <p
          className="p-3 text-white cursor-pointer hover:bg-white/20 rounded-2xl"
          onClick={() => {
            setShowMenu((prev) => !prev);
          }}
        >
          <FaRegUserCircle size={22} />
        </p>
      </div>
      {showMenu && (
        <div
          ref={menuRef}
          className="absolute text-sm p-3 right-20 top-15 min-w-[200px] min-h-[50px] rounded-xl shadow-md shadow-gray-500 bg-gray-100 flex flex-col gap-2 justify-center items-start"
        >
          {profilemenus
            .filter((m) => m.status === true)
            .map((menu, index) => {
              return (
                <Link
                  key={index}
                  href={menu.link}
                  className={clsx(
                    "ml-1 px-2 py-1 hover:font-semibold hover:border-l-2 hover:border-l-blue-900"
                  )}
                  onClick={() => setShowMenu(false)}
                >
                  {system.language === "mn" ? menu.name : menu.name_en}
                </Link>
              );
            })}
        </div>
      )}
    </div>
  );
};

export const UserSubBar = () => {
  const path = usePathname();
  const { system } = useSystemStore();

  if (path.split("/")[1] !== "registration") return;

  return (
    <div className={`text-sm mt-10 mb-5 border-b-[1px] ${borderblue}`}>
      <div className="mx-15 px-5 flex justify-start items-center gap-1">
        {usersubmenus
          .filter((m) => m.title === path.split("/")[1])[0]
          .menus.filter((m) => m.status === true)
          .map((menu, index) => {
            return (
              <Link
                key={index}
                href={menu.link}
                className={clsx(
                  "py-2 px-5 rounded-t-xl",
                  path === menu.link ? bgblue : "bg-white hover:bg-blue-200",
                  path === menu.link ? "text-white" : textblue
                )}
              >
                {system.language === "mn" ? menu.name : menu.name_en}
              </Link>
            );
          })}
      </div>
    </div>
  );
};
