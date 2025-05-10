"use client";

import { useState } from "react";

import Tabs from "./components/Tabs";
import BetsList from "./components/BetsList";
import Profile from "./components/Profile";

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState<"bets" | "profile">("bets");

  return (
    <div className="bg-[#F5F7F9]">
      <Tabs activeTab={activeTab} setActiveTab={setActiveTab} />
      <div className="min-h-screen  text-gray-800 flex flex-col md:w-[80vw] lg:w-2/3 mx-auto">
        {activeTab === "bets" && <BetsList />}

        {activeTab === "profile" && <Profile />}
      </div>
    </div>
  );
}
