interface RacePodiumProps {
  podiumPilotes: Array<{
    id: number;
    scraped_at: string;
    position: string;
    driver: string;
    team: string;
    number: string;
  }>;
}

export default function RacePodium({ podiumPilotes }: RacePodiumProps) {
  return (
    <div className="mt-10 md:mt-16 flex justify-center items-end gap-6 md:gap-12">
      {podiumPilotes.map((player, index) => {
        const rank = index + 1;
        const colors = ["bg-[#B76E79]", "bg-[#C62828]", "bg-[#F28C8C]"];
        const heights = ["h-22 md:h-30", "h-30 md:h-38", "h-18 md:h-26"];

        return (
          <div key={player.id} className="flex flex-col items-center">
            <div className="w-12 h-12 md:w-16 md:h-16 bg-gray-300 rounded-full -mt-6 z-10 border-2 border-white" />
            <div
              className={`w-18 md:w-20 ${heights[index]} ${colors[index]} rounded-t-xl flex justify-center items-end text-white text-xl font-bold`}
            >
              <div className="text-center">
                <p className="">{rank}</p>
                <p className="text-sm ">{player.driver}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
