"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { bet } from "../_actions/bet.action";
import ActionButtons from "./ActionButtons";
import Ecuries from "./Ecuries";
import Pilotes from "./Pilotes";

interface BetProps {
  grandPrixId: string;
  currentBet: {
    grand_prix_pilote_dnf: {
      id: string;
    };
    grand_prix_pilote_p10: {
      id: string;
    };
  };
  ecuries: {
    idApiEcurie: string;
    name: string;
    logo: string;
    color: string;
    pilotes: {
      idApiPilote: string;
      name: string;
      picture: string;
      nameAcronym: string;
    }[];
  }[];
}

const Bet = (props: BetProps) => {
  const router = useRouter();
  const [selectedEcurie, setSelectedEcurie] = useState<string | null>(null);
  const [selectedP10, setSelectedP10] = useState<string | null>(
    props.currentBet.grand_prix_pilote_p10
      ? props.currentBet.grand_prix_pilote_p10.id
      : null
  );
  const [selectedDNF, setSelectedDNF] = useState<string | null>(
    props.currentBet.grand_prix_pilote_dnf
      ? props.currentBet.grand_prix_pilote_dnf.id
      : null
  );

  const handleBet = async () => {
    if (selectedP10 && selectedDNF) {
      await bet({
        piloteP10Id: selectedP10,
        piloteDNFId: selectedDNF,
        grandPrixId: props.grandPrixId,
      });

      router.push(`/accueil`);
    }
  };

  const handleCancelSelection = () => {
    setSelectedP10(null);
    setSelectedDNF(null);
  };

  return (
    <div className="min-h-screen bg-[#EEF3F6] pb-24 px-4 md:px-0 text-gray-800">
      <Ecuries
        ecuries={props.ecuries}
        selectedEcurie={selectedEcurie}
        setSelectedEcurie={setSelectedEcurie}
      />

      {selectedEcurie && (
        <Pilotes
          ecuries={props.ecuries}
          selectedEcurie={selectedEcurie}
          selectedP10={selectedP10}
          selectedDNF={selectedDNF}
          setSelectedP10={setSelectedP10}
          setSelectedDNF={setSelectedDNF}
        />
      )}
      {selectedP10 && selectedDNF && (
        <ActionButtons
          handleBet={handleBet}
          handleCancelSelection={handleCancelSelection}
        />
      )}
    </div>
  );
};

export default Bet;
