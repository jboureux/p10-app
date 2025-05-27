"use client";

import { useState } from "react";

import { GrandPrix } from "@/types/grandprix";
import GrandPrixCardList from "./GrandPrixCardList";
import Tabs from "./Tabs";

interface CoursesPageProps {
  grandPrixList: Partial<GrandPrix>[];
}

const CoursesPage = (props: CoursesPageProps) => {
  const [activeTab, setActiveTab] = useState<"upcoming" | "past">("upcoming");

  const now = new Date();

  const upcomingGrandPrixList = props.grandPrixList.filter(
    (gp) => gp.date && new Date(gp.date) > now
  );

  const pastGrandPrixList = props.grandPrixList
    .filter((gp) => gp.date && new Date(gp.date) < now)
    .sort(
      (a, b) =>
        new Date(b.date ?? "").getTime() - new Date(a.date ?? "").getTime()
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
};

export default CoursesPage;
