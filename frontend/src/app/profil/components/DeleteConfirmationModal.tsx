import { Button } from "@/components/ui";

interface DeleteConfirmationModalProps {
  setShowDeleteModal: (show: boolean) => void;
}

export default function DeleteConfirmationModal({
  setShowDeleteModal,
}: DeleteConfirmationModalProps) {
  const handleDeleteAccount = () => {
    console.log("Compte supprimé");
    setShowDeleteModal(false);
  };

  return (
    <>
      <div className="fixed inset-0 z-40 bg-black opacity-50" />
      <div className="fixed inset-0 flex items-center justify-center z-50 px-4 text-gray-800">
        <div className="bg-white rounded-xl p-6 w-full max-w-sm relative">
          <button
            onClick={() => setShowDeleteModal(false)}
            className="absolute top-3 right-4 text-xl font-bold cursor-pointer"
          >
            X
          </button>
          <h2 className="text-lg font-bold mb-4">Confirmer la suppression</h2>
          <p className="text-sm text-gray-700 mb-6">
            Cette action est irréversible. Êtes-vous sûr de vouloir supprimer
            votre compte ?
          </p>
          <div className="flex justify-center gap-4">
            <button
              onClick={() => setShowDeleteModal(false)}
              className="px-4 py-2 rounded-xl border-2 border-[#C62828] text-[#C62828] font-semibold"
            >
              Annuler
            </button>
            <Button text="Supprimer" onClick={handleDeleteAccount} />
          </div>
        </div>
      </div>
    </>
  );
}
