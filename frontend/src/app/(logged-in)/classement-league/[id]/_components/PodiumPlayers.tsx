interface PodiumPlayersProps {
  podiumPlayers: Array<{
    isAdmin: boolean;
    fullName: string;
    points: number;
  }>;
}

export default function PodiumPlayers({ podiumPlayers }: PodiumPlayersProps) {
  const first = podiumPlayers[0];
  const second = podiumPlayers[1];
  const third = podiumPlayers[2];

  return (
    <div className="mt-10 md:mt-16 flex justify-center items-end gap-6 md:gap-12">
      {[second, first, third].map((player, index) => {
        const colors = ["bg-[#B76E79]", "bg-[#C62828]", "bg-[#F28C8C]"];
        const heights = ["h-20 md:h-28", "h-28 md:h-36", "h-16 md:h-24"];
        const ranks = [2, 1, 3];

        return (
          <div key={index} className="flex flex-col items-center">
            <div className="text-center mb-6">
              <p>{player.fullName}</p>
              <p>{player.points}pts</p>
            </div>
            <div className="w-12 h-12 md:w-16 md:h-16 bg-gray-300 rounded-full -mt-6 z-10 border-2 border-white" />
            <div
              className={`w-16 md:w-20 ${heights[index]} ${colors[index]} rounded-t-xl flex justify-center items-end text-white text-xl font-bold`}
            >
              <p className="p-4">{ranks[index]}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
