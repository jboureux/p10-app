"use client";

import { useState } from "react";
import Header from "./components/Header";
import OtherPlayers from "./components/OtherPlayers";
import LeagueCode from "./components/LeagueCode";

export default function LeagueRankingPage() {
  // TODO: fetch league infos
  const players = [
    { id: "19709", icon: "", name: "2e joueur", points: 125 },
    { id: "2UPOU", icon: "", name: "7e joueur", points: 101 },
    { id: "39790", icon: "", name: "5e joueur", points: 115 },
    { id: "JHIU4", icon: "", name: "3e joueur", points: 120 },
    { id: "5KJHLH", icon: "", name: "9e joueur", points: 95 },
    { id: "6009U", icon: "", name: "4e joueur", points: 120 },
    { id: "709907", icon: "", name: "1er joueur", points: 130 },
    { id: "809089", icon: "", name: "6e joueur", points: 110 },
    { id: "9O8U8", icon: "", name: "8e joueur", points: 98 },
  ];

  players.sort((a, b) => b.points - a.points);

  const podiumPlayers = players.slice(0, 3);
  const othersPlayers = players.slice(3);
  return (
    <div className="min-h-screen bg-white">
      <Header podiumPlayers={podiumPlayers} />

      <OtherPlayers othersPlayers={othersPlayers} />

      <LeagueCode code="C4KATFHTKO4" />
    </div>
  );
}
