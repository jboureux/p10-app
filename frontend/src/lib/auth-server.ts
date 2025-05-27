import { TOKEN_STORE_LOCATION, USERID_STORE_LOCATION } from "@/config/auth";
import { IsLoggedInResponse } from "@/types/auth";
import { GqlError } from "@/types/errors";
import { cookies } from "next/headers";
import { callAPI } from "./api-client";

export const isLoggedIn = async (): Promise<boolean> => {
  try {
    const token = await retrieveToken();
    console.log(token);

    if (!token) throw new Error("A token is needed to verify auth status");

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

export const retrieveToken = async (): Promise<string | undefined> => {
  const cookieStore = await cookies();
  const token = cookieStore.get(TOKEN_STORE_LOCATION)?.value;

  return token;
};

export const retrieveUserId = async (): Promise<string | undefined> => {
  const cookieStore = await cookies();
  const uid = cookieStore.get(USERID_STORE_LOCATION)?.value;

  return uid;
};
