import { Ecurie } from "../page";

interface PilotesProps {
  ecuries: Ecurie[];
  selectedEcurie: string | null;
  selectedP10: string | null;
  selectedDNF: string | null;
  setSelectedP10: (pilote: string | null) => void;
  setSelectedDNF: (pilote: string | null) => void;
}

export default function Pilotes({
  ecuries,
  selectedEcurie,
  selectedP10,
  selectedDNF,
  setSelectedP10,
  setSelectedDNF,
}: PilotesProps) {
  return (
    <div className="max-w-4xl mx-auto mt-6 mb-10">
      <h3 className="text-lg md:text-xl font-semibold mb-4">
        Sélectionnez vos pilotes
      </h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {ecuries
          .find((e) => e.idApiEcurie === selectedEcurie)!
          .pilotes.map((pilote) => {
            const isSelectedP10 = selectedP10 === pilote.idApiPilote;
            const isSelectedDNF = selectedDNF === pilote.idApiPilote;

            return (
              <div
                key={pilote.idApiPilote}
                className="bg-white rounded-xl p-3 shadow-sm"
              >
                <img
                  src={pilote.picture}
                  alt={pilote.name}
                  className="w-full h-24 object-contain mb-2"
                />
                <p className="text-center font-semibold text-sm">
                  {pilote.name}
                </p>

                <div className="flex justify-center gap-2 mt-2">
                  <button
                    onClick={() => setSelectedP10(pilote.idApiPilote)}
                    className={`text-xs px-2 py-1 rounded-full border ${
                      isSelectedP10
                        ? "bg-[#C62828] text-white"
                        : "border-gray-300 text-gray-700"
                    }`}
                  >
                    P10
                  </button>
                  <button
                    onClick={() => setSelectedDNF(pilote.idApiPilote)}
                    className={`text-xs px-2 py-1 rounded-full border ${
                      isSelectedDNF
                        ? "bg-black text-white"
                        : "border-gray-300 text-gray-700"
                    }`}
                  >
                    DNF
                  </button>
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
}
