"use server";

import { callAPI } from "@/lib/api-client";
import { retrieveToken } from "@/lib/auth-server";
import { actionClient } from "@/lib/safe-action";
import {
  CreateBetSelectionResultResponse,
  HasUserBetOnGrandPrixResponse,
  UpdateBetSelectionResultResponse,
} from "@/types/bets";
import { GqlError } from "@/types/errors";
import { z } from "zod";

const schema = z.object({
  piloteP10Id: z.string(),
  piloteDNFId: z.string(),
  grandPrixId: z.string(),
});

export const bet = actionClient
  .schema(schema)
  .action(async ({ parsedInput }) => {
    const query = `
    query grandPrixPilotes($grandPrixId: String!) {
      hasUserBetOnGrandPrix(grandPrixId: $grandPrixId) {
        bet_id
        has_bet
      }
    }
    `;

    const variables = {
      grandPrixId: parsedInput.grandPrixId,
    };

    const result: HasUserBetOnGrandPrixResponse & GqlError =
      await callAPI<HasUserBetOnGrandPrixResponse>({
        query,
        variables,
        token: await retrieveToken(),
      });
    console.log(result);
    if (result.errors) {
      throw new Error(result.errors[0].message);
    }

    const hasUserBetOnGrandPrix = result.data.hasUserBetOnGrandPrix;

    if (!hasUserBetOnGrandPrix.has_bet) {
      const createBetQuery = `
        mutation CreateBet($input: CreateBetSelectionResultInput!) {
          createBet(input: $input) {
            id
          }
        }
      `;

      const createBetVariables = {
        input: {
          grandPrixId: parsedInput.grandPrixId,
          grandPrixPiloteIdP10: parsedInput.piloteP10Id,
          grandPrixPiloteIdDNF: parsedInput.piloteDNFId,
        },
      };

      const createBetResult: CreateBetSelectionResultResponse & GqlError =
        await callAPI<CreateBetSelectionResultResponse>({
          query: createBetQuery,
          variables: createBetVariables,
          token: await retrieveToken(),
        });

      console.log(createBetResult);

      if (createBetResult.errors) {
        throw new Error(createBetResult.errors[0].message);
      }

      return createBetResult.data.createBet;
    } else {
      const updateBetQuery = `
        mutation UpdateBet($input: UpdateBetSelectionResultInput!) {
          updateBet(input: $input) {
            id
          }
        }
      `;

      const updateBetVariables = {
        input: {
          id: hasUserBetOnGrandPrix.bet_id,
          grandPrixPiloteIdP10: parsedInput.piloteP10Id,
          grandPrixPiloteIdDNF: parsedInput.piloteDNFId,
        },
      };

      const updateBetResult: UpdateBetSelectionResultResponse & GqlError =
        await callAPI<UpdateBetSelectionResultResponse>({
          query: updateBetQuery,
          variables: updateBetVariables,
          token: await retrieveToken(),
        });

      if (updateBetResult.errors) {
        throw new Error(updateBetResult.errors[0].message);
      }

      return updateBetResult.data.updateBet;
    }
  });
