"use client";

import Image from "next/image";
import { useState } from "react";

import LeagueList from "./components/LeagueList";
import CreateModal from "./components/CreateModal";
import JoinModal from "./components/JoinModal";

export default function LeaguePage() {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showJoinModal, setShowJoinModal] = useState(false);

  // TODO: Fetch users teams from the API
  const teams = [
    { id: "1", icon: "", name: "Super équipe 1", members: 9 },
    { id: "2", icon: "", name: "Super équipe 2", members: 9 },
    { id: "3", icon: "", name: "Super équipe 3", members: 9 },
  ];

  return (
    <div className="min-h-screen bg-[#EEF3F6] pb-24 md:pb-0">
      <LeagueList
        teams={teams}
        setShowCreateModal={setShowCreateModal}
        setShowJoinModal={setShowJoinModal}
      />

      {showCreateModal && (
        <CreateModal setShowCreateModal={setShowCreateModal} />
      )}

      {showJoinModal && <JoinModal setShowJoinModal={setShowJoinModal} />}
    </div>
  );
}
