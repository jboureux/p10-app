interface OtherPlayersProps {
  othersPlayers: Array<{
    isAdmin: boolean;
    fullName: string;
    points: number;
  }>;
}

export default function OtherPlayers({ othersPlayers }: OtherPlayersProps) {
  return (
    <div className="bg-white rounded-t-3xl -mt-4 pt-6 px-4 md:px-10 md:w-[90vw] lg:w-2/3 xl:w-1/2 mx-auto">
      {othersPlayers.map((player, index) => (
        <div
          key={index}
          className="flex items-center justify-between py-4 border-b border-gray-200 text-sm md:text-base text-gray-800"
        >
          <div className="flex items-center gap-3">
            <div className="text-lg font-semibold">{index + 4}</div>
            <div className="w-8 h-8 bg-gray-300 rounded-full" />
            <div className="font-bold">{player.fullName}</div>
          </div>
          <div className="font-bold">{player.points}pt</div>
        </div>
      ))}
    </div>
  );
}
