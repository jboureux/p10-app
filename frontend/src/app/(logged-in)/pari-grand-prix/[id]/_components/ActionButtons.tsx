import { Button } from "@/components/ui";

interface ActionButtonsProps {
  handleBet: () => void;
  handleCancelSelection: () => void;
}

export default function ActionButtons({
  handleBet,
  handleCancelSelection,
}: ActionButtonsProps) {
  return (
    <div className="text-center mb-10 gap-x-2">
      <button
        onClick={handleCancelSelection}
        className="px-4 py-2 m-1 rounded-xl border-2 border-[#C62828] bg-white text-[#C62828] font-semibold cursor-pointer"
      >
        Annuler
      </button>
      <Button text="Valider mon pari" onClick={handleBet} />
    </div>
  );
}
