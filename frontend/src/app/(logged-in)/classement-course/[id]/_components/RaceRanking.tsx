interface RaceResultProps {
  othersPilotes: Array<{
    id: number;
    position: string;
    driver: string;
    team: string;
    number: string;
    scraped_at: string;
    points: number;
  }>;
}

export default function RaceRanking({ othersPilotes }: RaceResultProps) {
  return (
    <div className="bg-white rounded-t-3xl -mt-4 pt-6 px-4 md:px-10 md:w-[90vw] lg:w-2/3 xl:w-1/2 mx-auto">
      {othersPilotes.map((player, index) => (
        <div
          key={player.id}
          className={`flex items-center justify-between text-sm  py-4 border-b border-gray-200 md:text-base text-gray-800 ${
            player.position == "10" || player.position == "not classified"
              ? "border-l-3 border-l-red-500 pl-2"
              : ""
          }`}
        >
          <div className="flex items-center gap-3">
            <p className="text-lg font-semibold">{index + 4}</p>
            <div className="w-8 h-8 bg-gray-300 rounded-full" />
            <p className="font-bold">{player.driver}</p>
          </div>
          <div className="flex gap-8 font-bold">
            <p className="text-red-500">
              {player.position == "not classified" && "DNF"}
            </p>
            <p>{player.points} pt</p>
          </div>
        </div>
      ))}
    </div>
  );
}
