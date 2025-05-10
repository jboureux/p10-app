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
  try {
    const token = cookieStore.get(TOKEN_STORE_LOCATION)?.value;

    console.log(token);

    const query = `
      query Query {
        isLogged
      }
      `;

    const result: IsLoggedInResponse & GqlError =
      await callAPI<IsLoggedInResponse>({ query: query, token: token });

    console.log(result);

    if (result.data && result.data.isLogged) {
      return <>{children}</>;
    } else {
      redirect("/connexion");
    }
  } catch (error) {
    console.log(error);
  }
};

export default LoggedInLayout;
