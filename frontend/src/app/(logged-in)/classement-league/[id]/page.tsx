import { callAPI } from "@/lib/api-client";
import { retrieveToken } from "@/lib/auth-server";
import { GqlError } from "@/types/errors";
import { LeagueResponse } from "@/types/leagues";
import { redirect } from "next/navigation";
import Header from "./_components/Header";
import LeagueCode from "./_components/LeagueCode";
import OtherPlayers from "./_components/OtherPlayers";

interface LeagueRankingPageProps {
  params: Promise<{
    id: string;
  }>;
}

const LeagueRankingPage = async (props: LeagueRankingPageProps) => {
  const query = `
  query League($leagueId: String!) {
    league(id: $leagueId) {
      id
      isActive
      isPrivate
      name
      sharedLink
      user_league {
        id
        is_admin
        user {
          firstname
          lastname
          bets_selection_results {
            pointP10
          }
        }
      }
    }
  }
  `;
  const leagueParams = await props.params;
  const variables = { leagueId: leagueParams.id };

  const result: LeagueResponse & GqlError = await callAPI<LeagueResponse>({
    query: query,
    variables: variables,
    token: await retrieveToken(),
  });

  if (result.errors) {
    console.log(result.errors);
    redirect("/league");
  }

  if (!result.data.league.user_league) {
    redirect("/league");
  }

  const players = result.data.league.user_league
    .map((userLeague) => {
      if (userLeague.user) {
        return {
          fullName: `${userLeague.user.firstname} ${userLeague.user.lastname}`,
          isAdmin: userLeague.is_admin ? userLeague.is_admin : false,
          points:
            userLeague.user.bets_selection_results &&
            userLeague.user.bets_selection_results !== null
              ? userLeague.user.bets_selection_results
                  .map((bet) => {
                    if (bet.pointP10) {
                      return bet.pointP10;
                    }
                  })
                  .filter((points) => points !== undefined)
                  .reduce((curr, acc) => curr + acc)
              : 0,
        };
      }
    })
    .filter((player) => player !== undefined);

  players.sort((a, b) => b.points - a.points);

  const podiumPlayers = players.slice(0, 3);
  const othersPlayers = players.slice(3);
  return (
    <div className="min-h-screen bg-white">
      <Header
        teamName={
          result.data.league.name ? result.data.league.name : "Name not found"
        }
        podiumPlayers={podiumPlayers}
      />

      <OtherPlayers othersPlayers={othersPlayers} />

      <LeagueCode
        code={
          result.data.league.sharedLink
            ? result.data.league.sharedLink
            : "ERROR WHILE GATHERING CODE"
        }
      />
    </div>
  );
};

export default LeagueRankingPage;
