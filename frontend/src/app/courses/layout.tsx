import type { Metadata } from "next";

import { AppHeader, Navbar } from "@/components/ui";

export const metadata: Metadata = {
  title: "Courses",
  description: "Courses à venir ou passées",
};

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <main>
        <AppHeader />
        <Navbar />
        <div className="pt-15 md:pl-32 md:pt-12">{children}</div>
      </main>
    </>
  );
}
