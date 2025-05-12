"use client";

import { useRouter } from "next/navigation";

import { Podium } from "@/components/ui";

interface HeaderProps {
  raceCountry: string;
  podiumPilotes: Array<{
    id: number;
    scraped_at: string;
    position: string;
    driver: string;
    team: string;
    number: string;
    points: number;
  }>;
}

export default function RaceRankingHeader({
  podiumPilotes,
  raceCountry,
}: HeaderProps) {
  const router = useRouter();

  const items = podiumPilotes.map((player, index) => ({
    id: `${index}-${player.driver}`,
    label: player.driver,
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
      <h1 className="text-center text-2xl md:text-3xl font-mono">
        {raceCountry}
      </h1>
      <Podium items={items} />
    </div>
  );
}
