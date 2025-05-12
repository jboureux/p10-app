"use client";

import { useRouter } from "next/navigation";

import { Podium } from "@/components/ui";

interface LeagueRankingHeaderProps {
  teamName: string;
  podiumPlayers: Array<{
    isAdmin: boolean;
    fullName: string;
    points: number;
  }>;
}

export default function LeagueRankingHeader({
  teamName,
  podiumPlayers,
}: LeagueRankingHeaderProps) {
  const router = useRouter();

  const items = podiumPlayers.map((player, index) => ({
    id: `${index}-${player.fullName}`,
    label: player.fullName,
    points: player.points,
  }));

  return (
    <div className="relative bg-gradient-to-br from-black to-red-700 text-white pt-6 md:pt-10 rounded-b-3xl">
      <button
        onClick={() => router.back()}
        className="absolute top-4 left-4 md:left-8 text-2xl md:text-3xl cursor-pointer"
      >
        &lt;
      </button>
      <h1 className="text-center text-2xl md:text-3xl font-mono">{teamName}</h1>
      <Podium items={items} />
    </div>
  );
}
