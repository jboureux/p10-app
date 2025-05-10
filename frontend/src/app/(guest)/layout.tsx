import { AUTH_REDIRECT_PATH } from "@/config/auth";
import { isLoggedIn } from "@/lib/auth-server";
import { redirect } from "next/navigation";

const GuestLayout = async ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const isAuthenticated: boolean = await isLoggedIn();
  if (isAuthenticated) {
    redirect(AUTH_REDIRECT_PATH);
  } else {
    return <>{children}</>;
  }
};

export default GuestLayout;
