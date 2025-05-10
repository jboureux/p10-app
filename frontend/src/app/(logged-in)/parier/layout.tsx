import type { Metadata } from "next";

import { AppHeader, Navbar } from "@/components/ui";

export const metadata: Metadata = {
  title: "Paris",
  description: "Choix de l'écurie",
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
        <div className="pt-15 md:pl-32 md:pt-16">{children}</div>
      </main>
    </>
  );
}
