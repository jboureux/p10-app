import { TOKEN_STORE_LOCATION, USERID_STORE_LOCATION } from "@/config/auth";

export const retrieveToken = () => {
  return getCookie(TOKEN_STORE_LOCATION);
};

export const retrieveUserId = () => {
  return getCookie(USERID_STORE_LOCATION);
};

const getCookie = (name: string) => {
  if (typeof window === "undefined") {
    return undefined;
  }

  const value = document.cookie
    .split("; ")
    .find((row) => row.startsWith(`${name}=`))
    ?.split("=")[1];

  return value ? decodeURIComponent(value) : undefined;
};
