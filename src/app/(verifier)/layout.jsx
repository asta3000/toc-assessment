import "@/styles/globals.css";
import "@/styles/spinner.css";

import { UserBar, UserSubBar } from "@/components/MyBar";
import ChangeLanguage from "@/components/ChangeLanguage";

export const metadata = {
  title: process.env.WEB_TITLE,
  description: process.env.WEB_DESCRIPTION,
};

export default function VerifierLayout({ children }) {
  return (
    <html lang="en">
      <body className="h-screen w-screen antialiased caret-transparent">
        <UserBar />
        <UserSubBar />
        {children}
        <ChangeLanguage />
      </body>
    </html>
  );
}
