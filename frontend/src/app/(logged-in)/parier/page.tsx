"use client";

import { useState } from "react";

import ActionButtons from "./_components/ActionButtons";
import Ecuries from "./_components/Ecuries";
import Pilotes from "./_components/Pilotes";

export interface Ecurie {
  idApiEcurie: string;
  name: string;
  logo: string;
  color: string;
  pilotes: Pilote[];
}

interface Pilote {
  idApiPilote: string;
  name: string;
  picture: string;
  nameAcronym: string;
}

export default function ParierPage() {
  const [selectedEcurie, setSelectedEcurie] = useState<string | null>(null);
  const [selectedP10, setSelectedP10] = useState<string | null>(null);
  const [selectedDNF, setSelectedDNF] = useState<string | null>(null);

  // TODO: fetch ecuries
  const ecuries = [
    {
      idApiEcurie: "ferrari",
      name: "Ferrari",
      logo: "",
      color: "#C62828",
      pilotes: [
        {
          idApiPilote: "lec",
          name: "Charles Leclerc",
          picture: "",
          nameAcronym: "LEC",
        },
        {
          idApiPilote: "sai",
          name: "Carlos Sainz",
          picture: "",
          nameAcronym: "SAI",
        },
      ],
    },
    {
      idApiEcurie: "bugatti",
      name: "Bugatti",
      logo: "",
      color: "#2E2E2E",
      pilotes: [
        {
          idApiPilote: "ham",
          name: "Lewis Hamilton",
          picture: "",
          nameAcronym: "HAM",
        },
        {
          idApiPilote: "rus",
          name: "George Russell",
          picture: "",
          nameAcronym: "RUS",
        },
      ],
    },
    {
      idApiEcurie: "BMW",
      name: "BMW",
      logo: "",
      color: "#2E2E2E",
      pilotes: [
        {
          idApiPilote: "ham",
          name: "Lewis Hamilton",
          picture: "",
          nameAcronym: "HAM",
        },
        {
          idApiPilote: "rus",
          name: "George Russell",
          picture: "",
          nameAcronym: "RUS",
        },
      ],
    },
    {
      idApiEcurie: "mercedes",
      name: "Mercedes",
      logo: "",
      color: "#2E2E2E",
      pilotes: [
        {
          idApiPilote: "ham",
          name: "Lewis Hamilton",
          picture: "",
          nameAcronym: "HAM",
        },
        {
          idApiPilote: "rus",
          name: "George Russell",
          picture: "",
          nameAcronym: "RUS",
        },
      ],
    },
  ];

  const handleBet = () => {
    if (selectedP10 && selectedDNF) {
      //TODO: create bet
    }
  };

  const handleCancelSelection = () => {
    setSelectedP10(null);
    setSelectedDNF(null);
  };

  return (
    <div className="min-h-screen bg-[#EEF3F6] pb-24 px-4 md:px-0 text-gray-800">
      <Ecuries
        ecuries={ecuries}
        selectedEcurie={selectedEcurie}
        setSelectedEcurie={setSelectedEcurie}
      />

      {selectedEcurie && (
        <Pilotes
          ecuries={ecuries}
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
}
