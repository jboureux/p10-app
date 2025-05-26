import { User } from "@/types/users";

export default function BetsList({ user }: { user: User }) {
  const bets = user.bets_selection_results;

  if (!bets) {
    return <div>No bets found</div>;
  }

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
              {bet.grand_prix &&
                bet.grand_prix.track &&
                bet.grand_prix.date &&
                bet.grand_prix.track.country_name && (
                  <div className="min-w-[100px]">
                    <div className="text-sm text-gray-500">Grand Prix</div>
                    <div className="text-lg font-bold">
                      {bet.grand_prix.track.country_name}
                    </div>
                    <div className="text-sm text-gray-400">
                      {bet.grand_prix.date}
                    </div>
                  </div>
                )}

              <div className="flex-1">
                <div className="text-sm text-gray-500">Pilote P10</div>
                <div className="text-base font-semibold">
                  {bet.grand_prix_pilote_p10?.pilote?.name}
                </div>
                <div className="text-sm text-[#C62828] font-bold">
                  {bet.pointP10} pts
                </div>
              </div>

              <div className="flex-1">
                <div className="text-sm text-gray-500">Pilote DNF</div>
                <div className="text-base font-semibold">
                  {bet.grand_prix_pilote_dnf?.pilote?.name}
                </div>
                <div className="text-sm text-[#C62828] font-bold">
                  {bet.pointP10} pts
                </div>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}
