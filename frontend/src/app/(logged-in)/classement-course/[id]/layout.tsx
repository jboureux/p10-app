import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Classement Course",
  description: "Classement des pilotes de la course",
};

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
}
