"use client";

import { useState } from "react";

import DeleteConfirmationModal from "./DeleteConfirmationModal";

export default function DeleteAccountContainer() {
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  return (
    <>
      <div className="text-center py-8">
        <button
          onClick={() => setShowDeleteModal(true)}
          className="text-sm text-red-600 underline hover:text-red-800"
        >
          Supprimer mon compte
        </button>
      </div>
      {showDeleteModal && (
        <DeleteConfirmationModal setShowDeleteModal={setShowDeleteModal} />
      )}
    </>
  );
}
