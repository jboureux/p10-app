export default function BetsList() {
  // TODO: fetch users bets
  const bets = [
    {
      id: "1",
      grandPrix: { country: "Monaco", date: "2024-05-12" },
      piloteP10: "Charles Leclerc",
      pointP10: 12,
      piloteDNF: "Yuki Tsunoda",
      pointDNF: 0,
    },
    {
      id: "2",
      grandPrix: { country: "Australie", date: "2024-03-24" },
      piloteP10: "Fernando Alonso",
      pointP10: 8,
      piloteDNF: "Esteban Ocon",
      pointDNF: 6,
    },
  ];

  return (
    <div className="min-h-screen pb-24 px-4 md:px-0">
      <div className="w-full max-w-4xl mx-auto py-8 space-y-4">
        {bets.length === 0 && (
          <p className="text-center text-gray-600">
            Aucun pari trouvé pour le moment.
          </p>
        )}

        {bets.length > 0 &&
          bets.map((bet) => (
            <div
              key={bet.id}
              className="bg-white shadow-sm rounded-xl p-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
            >
              <div className="min-w-[100px]">
                <div className="text-sm text-gray-500">Grand Prix</div>
                <div className="text-lg font-bold">{bet.grandPrix.country}</div>
                <div className="text-sm text-gray-400">
                  {bet.grandPrix.date}
                </div>
              </div>

              <div className="flex-1">
                <div className="text-sm text-gray-500">Pilote P10</div>
                <div className="text-base font-semibold">{bet.piloteP10}</div>
                <div className="text-sm text-[#C62828] font-bold">
                  {bet.pointP10} pts
                </div>
              </div>

              <div className="flex-1">
                <div className="text-sm text-gray-500">Pilote DNF</div>
                <div className="text-base font-semibold">{bet.piloteDNF}</div>
                <div className="text-sm text-[#C62828] font-bold">
                  {bet.pointDNF} pts
                </div>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}
