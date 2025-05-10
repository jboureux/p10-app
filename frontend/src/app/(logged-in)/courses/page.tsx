"use client";

import { useState } from "react";

import GrandPrixCardList from "./_components/GrandPrixCardList";
import Tabs from "./_components/Tabs";

export type GrandPrix = {
  idApiRaces: string;
  season: string;
  date: string;
  time: string;
  track: {
    country: string;
    name: string;
  };
  grandPrixClassement?: Array<{
    status: string;
    driver: string;
  }>;
};

export default function CoursesPage() {
  const [activeTab, setActiveTab] = useState<"upcoming" | "past">("upcoming");

  // TODO: fetch GP GPClassement
  const allGrandPrixList: GrandPrix[] = [
    {
      idApiRaces: "bahrain2025",
      season: "2024",
      date: "2025-08-20T14:00:00Z",
      time: "2025-03-02T14:00:00Z",
      track: {
        country: "Bahrain",
        name: "Bahrain International Circuit",
      },
      grandPrixClassement: [],
    },
    {
      idApiRaces: "australia2025",
      season: "2025",
      date: "2025-03-24T05:00:00Z",
      time: "2025-03-24T05:00:00Z",
      track: {
        country: "Australia",
        name: "Albert Park Circuit",
      },
      grandPrixClassement: [
        { status: "P10", driver: "ALB" },
        { status: "DNF", driver: "OCO" },
      ],
    },
    {
      idApiRaces: "japan2024",
      season: "2024",
      date: "2024-09-22T06:00:00Z",
      time: "2024-09-22T06:00:00Z",
      track: {
        country: "Japan",
        name: "Suzuka International Racing Course",
      },
      grandPrixClassement: [
        { status: "P10", driver: "GAS" },
        { status: "DNF", driver: "VER" },
      ],
    },
  ];

  const now = new Date();

  const upcomingGrandPrixList = allGrandPrixList.filter(
    (gp) => new Date(gp.date) > now
  );

  const pastGrandPrixList = allGrandPrixList.filter(
    (gp) => new Date(gp.date) < now
  );

  return (
    <div className="min-h-screen bg-[#EEF3F6]">
      <Tabs activeTab={activeTab} setActiveTab={setActiveTab} />

      {activeTab === "upcoming" && (
        <GrandPrixCardList
          activeTab="upcoming"
          grandPrixList={upcomingGrandPrixList}
        />
      )}

      {activeTab === "past" && (
        <GrandPrixCardList activeTab="past" grandPrixList={pastGrandPrixList} />
      )}
    </div>
  );
}
