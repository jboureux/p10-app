import type { Metadata } from "next";
import { AppHeader } from "@/components/ui";

export const metadata: Metadata = {
  title: "Connexion",
  description: "Connexion utilisateur",
};

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <AppHeader />
      <main>{children}</main>
    </>
  );
}
