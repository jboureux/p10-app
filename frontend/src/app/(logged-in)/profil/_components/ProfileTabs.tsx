"use client";

import { useState } from "react";
import BetsList from "./BetsList";
import Profile from "./Profile";
import Tabs from "./Tabs";
import { User } from "@/types/users";

const ProfileTabs = ({ user }: { user: User }) => {
  const [activeTab, setActiveTab] = useState<"bets" | "profile">("bets");

  return (
    <div className="bg-[#F5F7F9]">
      <Tabs activeTab={activeTab} setActiveTab={setActiveTab} />
      <div className="min-h-screen  text-gray-800 flex flex-col md:w-[80vw] lg:w-2/3 mx-auto">
        {activeTab === "bets" && <BetsList user={user} />}

        {activeTab === "profile" && <Profile user={user} />}
      </div>
    </div>
  );
};

export default ProfileTabs;
