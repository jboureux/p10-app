import { GqlError } from "@/types/errors";

export const callAPI = async <T>({
  query,
  variables = {},
  token,
}: {
  query: string;
  variables?: object;
  token?: string;
}): Promise<T & GqlError> => {
  const body: { query: string; variables?: object } = { query: query };

  if (variables) {
    body.variables = variables;
  }

  const headers: { "Content-Type": string; Authorization?: string } = {
    "Content-Type": "application/json",
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/graphql`, {
    method: "POST",
    headers: headers,
    body: JSON.stringify(body),
  });

  return response.json() as Promise<T & GqlError>;
};
