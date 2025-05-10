"use client";

import { useState } from "react";

import GrandPrixList from "./components/GrandPrixList";
import Tabs from "./components/Tabs";

export default function CoursesPage() {
  const [activeTab, setActiveTab] = useState<"upcoming" | "past">("upcoming");

  // TODO: fetch GP list and add a method to split the list into past and upcoming
  const grandPrixList = [
    {
      date: "03–05",
      month: "Oct.",
      round: "Round 21",
      country: "Brazil",
      title: "Formula 2 Rolex Grande Premio de Sao Paulo 2023",
      result: [
        { status: "DNF", driver: "LEC" },
        { status: "P10", driver: "OCO" },
      ],
    },
    {
      date: "03–05",
      month: "Nov.",
      round: "Round 21",
      country: "Brazil",
      title: "Formula 2 Rolex Grande Premio de Sao Paulo 2023",
      result: [
        { status: "DNF", driver: "LEC" },
        { status: "P10", driver: "OCO" },
      ],
    },
  ];

  const upcomingGrandPrixList = [];

  const pastGrandPrixList = [];

  return (
    <div className="min-h-screen bg-[#EEF3F6] ">
      <Tabs activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* TODO: upcomingGrandPrixList */}
      {activeTab === "upcoming" && (
        <GrandPrixList activeTab={activeTab} grandPrixList={grandPrixList} />
      )}

      {/* TODO: pastGrandPrixList */}
      {activeTab === "past" && (
        <GrandPrixList activeTab={activeTab} grandPrixList={grandPrixList} />
      )}
    </div>
  );
}
