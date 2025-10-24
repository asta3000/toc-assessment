import "@/styles/globals.css";
import "@/styles/spinner.css";

import { AdminBar, AdminSubBar } from "@/components/MyBar";
import ChangeLanguage from "@/components/ChangeLanguage";

export const metadata = {
  title: process.env.WEB_TITLE,
  description: process.env.WEB_DESCRIPTION,
};

export default function AdminLayout({ children }) {
  return (
    <html lang="en">
      <body className="h-screen w-screen antialiased caret-transparent">
        <AdminBar />
        <AdminSubBar />
        {children}
        <ChangeLanguage />
      </body>
    </html>
  );
}
