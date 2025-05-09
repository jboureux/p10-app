import type { Metadata } from "next";

import { AppHeader, Navbar } from "@/components/ui";

export const metadata: Metadata = {
  title: "League",
  description: "Gestion de la ligue",
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
        <div className="pt-22 md:pl-32 md:pt-16">{children}</div>
      </main>
    </>
  );
}
