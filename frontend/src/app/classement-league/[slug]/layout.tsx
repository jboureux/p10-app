import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Classement",
  description: "Classement des joueurs de la league",
};

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
}
