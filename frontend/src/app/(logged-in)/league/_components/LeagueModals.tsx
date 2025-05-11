"use client";

import { Button } from "@/components/ui";
import { useState } from "react";
import CreateModal from "./CreateModal";
import JoinModal from "./JoinModal";

const LeagueModals = () => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showJoinModal, setShowJoinModal] = useState(false);
  return (
    <>
      <div className="flex justify-center gap-4 mt-6">
        <Button
          text="Créer"
          widthFull={false}
          onClick={() => setShowCreateModal(true)}
        />
        <Button
          text="Rejoindre"
          widthFull={false}
          onClick={() => setShowJoinModal(true)}
        />
      </div>

      {showCreateModal && (
        <CreateModal setShowCreateModal={setShowCreateModal} />
      )}

      {showJoinModal && <JoinModal setShowJoinModal={setShowJoinModal} />}
    </>
  );
};

export default LeagueModals;
