import ChangeLanguage from "@/components/ChangeLanguage";
import "@/styles/globals.css";
import "@/styles/spinner.css";

export const metadata = {
  title: process.env.WEB_TITLE,
  description: process.env.WEB_DESCRIPTION,
};

export default function AuthLayout({ children }) {
  return (
    <html lang="en">
      <body className="h-screen w-screen antialiased caret-transparent">
        <div className="w-full h-full bg-[url('/ToCLogo4.png'),url('/ToCLogo5.png')] bg-container bg-no-repeat bg-[position:left_bottom,right_top]">
          {children}
        </div>
        <ChangeLanguage />
      </body>
    </html>
  );
}
