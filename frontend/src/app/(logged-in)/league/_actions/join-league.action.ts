"use server";

import { callAPI } from "@/lib/api-client";
import { retrieveToken } from "@/lib/auth-server";
import { actionClient } from "@/lib/safe-action";
import { GqlError } from "@/types/errors";
import { JoinPrivateLeagueResponse } from "@/types/leagues";
import { z } from "zod";

const schema = z.object({
  sharedLink: z.string(),
});

export const joinLeague = actionClient
  .schema(schema)
  .action(async ({ parsedInput }) => {
    const query = `
    mutation JoinPrivateLeagueWithLink($sharedLink: String!) {
      joinPrivateLeagueWithLink(sharedLink: $sharedLink)
    }
    `;

    const variables = {
      sharedLink: parsedInput.sharedLink.toUpperCase(),
    };

    const result: JoinPrivateLeagueResponse & GqlError =
      await callAPI<JoinPrivateLeagueResponse>({
        query: query,
        variables: variables,
        token: await retrieveToken(),
      });

    return result;
  });
