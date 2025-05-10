import { TOKEN_STORE_LOCATION } from "@/config/auth";
import { callAPI } from "@/lib/api-client";
import { IsLoggedInResponse } from "@/types/auth";
import { GqlError } from "@/types/errors";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const LoggedInLayout = async ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const cookieStore = await cookies();
  const token = cookieStore.get(TOKEN_STORE_LOCATION)?.value;

  const query = `
    query Query {
      isLogged
    }
    `;

  const result: IsLoggedInResponse & GqlError =
    await callAPI<IsLoggedInResponse>({ query: query, token: token });

  if (result.data && result.data.isLogged) {
    return <>{children}</>;
  } else {
    redirect("/connexion");
  }
};

export default LoggedInLayout;
