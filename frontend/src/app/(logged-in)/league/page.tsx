// "use client";

// import { useState } from "react";

// import CreateModal from "./_components/CreateModal";
// import JoinModal from "./_components/JoinModal";
import { callAPI } from "@/lib/api-client";
import { retrieveToken } from "@/lib/auth-server";
import { GqlError } from "@/types/errors";
import { MyLeaguesResponse } from "@/types/leagues";
import LeagueList from "./_components/LeagueList";
import LeagueModals from "./_components/LeagueModals";

export default async function LeaguePage() {
  const query = `
  query MyLeagues {
    myLeagues {
      id
      isActive
      isPrivate
      name
      user_league {
        id
      }
    }
  }
  `;

  const result: MyLeaguesResponse & GqlError = await callAPI<MyLeaguesResponse>(
    {
      query: query,
      token: await retrieveToken(),
    }
  );

  return (
    <div className="min-h-screen bg-[#EEF3F6] pb-24 md:pb-0">
      <LeagueList teams={result.data.myLeagues} />
      <LeagueModals />
    </div>
  );
}
