"use server";

import { callAPI } from "@/lib/api-client";
import { retrieveToken } from "@/lib/auth-server";
import { actionClient } from "@/lib/safe-action";
import { GqlError } from "@/types/errors";
import { CreateLeagueResponse } from "@/types/leagues";
import { z } from "zod";

const schema = z.object({
  name: z.string(),
  isPrivate: z.coerce.boolean(),
});

export const createLeague = actionClient
  .schema(schema)
  .action(async ({ parsedInput }) => {
    const query = `
    mutation CreateLeague($input: CreateLeagueInput!) {
      createLeague(input: $input) {
        id
      }
    }
    `;

    const variables = {
      input: {
        ...parsedInput,
        apiAvatarId: parsedInput.name.toLowerCase().replace(" ", "-"),
      },
    };

    const result: CreateLeagueResponse & GqlError =
      await callAPI<CreateLeagueResponse>({
        query: query,
        variables: variables,
        token: await retrieveToken(),
      });

    return result;
  });
