interface PodiumPlayersProps {
  podiumPlayers: Array<{
    id: string;
    icon: string;
    name: string;
    points: number;
  }>;
}

export default function PodiumPlayers({ podiumPlayers }: PodiumPlayersProps) {
  return (
    <div className="mt-10 md:mt-16 flex justify-center items-end gap-6 md:gap-12">
      {podiumPlayers.map((player, index) => {
        const rank = index + 1;
        const colors = ["bg-[#B76E79]", "bg-[#C62828]", "bg-[#F28C8C]"];
        const heights = ["h-20 md:h-28", "h-28 md:h-36", "h-16 md:h-24"];

        return (
          <div key={player.id} className="flex flex-col items-center">
            <div className="w-12 h-12 md:w-16 md:h-16 bg-gray-300 rounded-full -mt-6 z-10 border-2 border-white" />
            <div
              className={`w-16 md:w-20 ${heights[index]} ${colors[index]} rounded-t-xl flex justify-center items-end text-white text-xl font-bold`}
            >
              <p className="p-4">{rank}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
