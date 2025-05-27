interface PodiumProps {
  items: Array<{
    id: string | number;
    label: string;
    points?: number;
  }>;
}

export default function Podium({ items }: PodiumProps) {
  const first = items.length > 0 ? items[0] : null;
  const second = items.length > 1 ? items[1] : null;
  const third = items.length > 2 ? items[2] : null;

  const colors = ["bg-[#B76E79]", "bg-[#C62828]", "bg-[#F28C8C]"];
  const heights = ["h-20 md:h-28", "h-28 md:h-36", "h-16 md:h-24"];
  const ranks = [2, 1, 3];

  return (
    <div className="mt-10 md:mt-16 flex justify-center items-end gap-6 md:gap-12">
      {[second, first, third].map((item, index) => {
        if (!item) return null;

        return (
          <div key={item.id} className="flex flex-col items-center">
            <div className="text-center mb-8">
              <p className="font-bold">{item.label}</p>
            </div>
            <div className="w-12 h-12 md:w-16 md:h-16 bg-gray-300 rounded-full -mt-6 z-10 border-2 border-white" />
            <div
              className={`flex flex-col justify-around items-center h-12 md:h-16 w-16 md:w-20 ${heights[index]} ${colors[index]} rounded-t-xl text-white text-lg font-bold`}
            >
              <p className="">{ranks[index]}</p>
              <p>{item.points} pts</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
