// import { Geist, Geist_Mono } from "next/font/google";
import "@/styles/globals.css";
import "@/styles/spinner.css";

import { headers } from "next/headers";

import ChangeLanguage from "@/components/ChangeLanguage";
import { UserBar } from "@/components/MyBar";
import GoToTop from "@/components/GoToTop";

// const geistSans = Geist({
//   variable: "--font-geist-sans",
//   subsets: ["latin"],
// });

// const geistMono = Geist_Mono({
//   variable: "--font-geist-mono",
//   subsets: ["latin"],
// });

export const metadata = {
  title: process.env.WEB_TITLE,
  description: process.env.WEB_DESCRIPTION,
};

export default async function RootLayout({ children }) {
  const path = await headers();
  const pathname = path.get("x-invoke-path") || "";
  // console.log(pathname);
  const hideUserBar = pathname === "/";

  return (
    <html lang="en">
      <body className="h-screen w-screen antialiased caret-transparent">
        {!hideUserBar && <UserBar />}
        {children}
        <GoToTop />
        <ChangeLanguage />
      </body>
    </html>
  );
}
