import { callAPI } from "@/lib/api-client";
import { retrieveToken } from "@/lib/auth-server";
import { GetUserBetForGrandPrixResponse } from "@/types/bets";
import { GqlError } from "@/types/errors";
import { GrandPrixPilotesResponse } from "@/types/grandprix";
import Bet from "./_components/Bet";

export default async function ParierPage(props: { params: { id: string } }) {
  const query = `
  query grandPrixPilotes($grandPrixId: String!) {
    grandPrixPilotes(grandPrixId: $grandPrixId) {
      id
      pilote {
        id_api_pilote
        name
        name_acronym
        picture
        pilote_ecurie {
          ecurie {
            id_api_ecurie
            name
            logo
            color
          }
        }
      }
    }
  }
  `;

  const params = await props.params;

  const variables = {
    grandPrixId: params.id,
  };

  const result: GrandPrixPilotesResponse & GqlError =
    await callAPI<GrandPrixPilotesResponse>({
      query,
      variables,
      token: await retrieveToken(),
    });

  if (result.errors) {
    return <div>Error: {result.errors[0].message}</div>;
  }

  const currentBetQuery = `
    query GrandPrixPilotes($grandPrixId: String!) {
      getUserBetForGrandPrix(grandPrixId: $grandPrixId) {
        grand_prix_pilote_dnf {
          id
        }
        grand_prix_pilote_p10 {
          id
        }
      }
    }
  `;

  const currentBetResult: GetUserBetForGrandPrixResponse & GqlError =
    await callAPI<GetUserBetForGrandPrixResponse>({
      query: currentBetQuery,
      variables,
      token: await retrieveToken(),
    });

  if (currentBetResult.errors) {
    return <div>Error: {currentBetResult.errors[0].message}</div>;
  }

  const currentBet = currentBetResult.data.getUserBetForGrandPrix;

  const ecuries: {
    idApiEcurie: string;
    name: string;
    logo: string;
    color: string;
    pilotes: {
      idApiPilote: string;
      name: string;
      picture: string;
      nameAcronym: string;
    }[];
  }[] = [];

  for (const grandPrixPilote of result.data.grandPrixPilotes) {
    const pilote = grandPrixPilote.pilote;
    if (!pilote) {
      continue;
    }

    const piloteEcurie = pilote.pilote_ecurie?.[0];
    if (!piloteEcurie) {
      continue;
    }

    const ecurie = piloteEcurie.ecurie;
    if (ecurie && ecurie.id_api_ecurie && ecurie.name && ecurie.color) {
      const savedEcurie = ecuries.find(
        (e) => e.idApiEcurie === ecurie.id_api_ecurie
      );
      if (!savedEcurie) {
        ecuries.push({
          idApiEcurie: ecurie.id_api_ecurie,
          name: ecurie.name,
          logo: ecurie.logo || "",
          color: ecurie.color,
          pilotes:
            pilote.name && pilote.name_acronym && grandPrixPilote.id
              ? [
                  {
                    idApiPilote: grandPrixPilote.id,
                    name: pilote.name,
                    picture: pilote.picture || "",
                    nameAcronym: pilote.name_acronym,
                  },
                ]
              : [],
        });
      } else {
        if (pilote.name && pilote.name_acronym && grandPrixPilote.id) {
          savedEcurie.pilotes.push({
            idApiPilote: grandPrixPilote.id,
            name: pilote.name,
            picture: pilote.picture || "",
            nameAcronym: pilote.name_acronym,
          });
        }
      }
    }
  }

  console.log(ecuries);

  return (
    <Bet currentBet={currentBet} ecuries={ecuries} grandPrixId={params.id} />
  );
}
