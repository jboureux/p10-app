interface EcuriesProps {
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
  selectedEcurie: string | null;
  setSelectedEcurie: (ecurie: string | null) => void;
}

export default function Ecuries({
  ecuries,
  selectedEcurie,
  setSelectedEcurie,
}: EcuriesProps) {
  return (
    <div className="max-w-4xl mx-auto py-6">
      <h2 className="text-lg md:text-2xl text-gray-700 font-semibold mb-4">
        Sélectionnez une écurie
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {ecuries.map((ecurie) => (
          <div
            key={ecurie.idApiEcurie}
            onClick={() =>
              setSelectedEcurie(
                selectedEcurie === ecurie.idApiEcurie
                  ? null
                  : ecurie.idApiEcurie
              )
            }
            className={`bg-white rounded-xl shadow-sm p-4 cursor-pointer border-2 transition ${
              selectedEcurie === ecurie.idApiEcurie
                ? "border-[#C62828]"
                : "border-transparent"
            }`}
          >
            {ecurie.logo && (
              <img src={ecurie.logo} alt={ecurie.name} className="h-10 mb-2" />
            )}
            <p className="text-sm font-semibold">{ecurie.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
