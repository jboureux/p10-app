import { TOKEN_STORE_LOCATION } from "@/config/auth";
import { IsLoggedInResponse } from "@/types/auth";
import { GqlError } from "@/types/errors";
import { cookies } from "next/headers";
import { callAPI } from "./api-client";

export const isLoggedIn = async (): Promise<boolean> => {
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

    if (result.data && result.data.isLogged) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.log(error);
    return false;
  }
};
