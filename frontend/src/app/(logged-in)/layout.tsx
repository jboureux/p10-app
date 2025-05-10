import { isLoggedIn } from "@/lib/auth-server";
import { redirect } from "next/navigation";

const LoggedInLayout = async ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const isAuthenticated: boolean = await isLoggedIn();
  if (isAuthenticated) {
    return <>{children}</>;
  } else {
    redirect("/connexion");
  }
};

export default LoggedInLayout;
