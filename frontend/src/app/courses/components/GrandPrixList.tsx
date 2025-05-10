interface GrandPrixCardsProps {
  activeTab: "upcoming" | "past";
  grandPrixList: Array<{
    date: string;
    month: string;
    round: string;
    country: string;
    title: string;
    result: Array<{ status: string; driver: string }>;
  }>;
}

export default function GrandPrixList({
  activeTab,
  grandPrixList,
}: GrandPrixCardsProps) {
  return (
    <div className="pt-4 px-4 space-y-4 md:px-0">
      {grandPrixList.map((groupe, index) => (
        <div
          key={index}
          className="bg-white rounded-2xl shadow-md p-4 text-gray-800 md:w-[80vw] lg:w-2/3 mx-auto"
        >
          <div className="flex justify-between items-start">
            <div className="text-center mr-4">
              <div className="text-xl font-bold">{groupe.date}</div>
              <div className="text-xs bg-gray-200 text-gray-700 rounded-full px-2 mt-1">
                {groupe.month}
              </div>
            </div>

            <div className="h-25 border-l border-dotted border-gray-400 mx-4" />

            <div className="flex-1">
              <div className="text-sm text-[#C62828] font-semibold">
                {groupe.round}
              </div>
              <div className="text-lg font-bold">{groupe.country}</div>
              <div className="text-sm text-gray-500">{groupe.title}</div>
              {activeTab === "past" && (
                <div className="flex mt-2">
                  <div className="flex items-center text-sm mr-2">
                    <span className=" px-2 bg-green-200 rounded-full">
                      {groupe.result[0].status}
                    </span>
                    <div className="h-4 border-2 border-red-500 mx-1" />
                    <span className="font-semibold">
                      {groupe.result[0].driver}
                    </span>
                  </div>

                  <div className="flex items-center text-sm">
                    <span className=" px-2 bg-red-300 rounded-full">
                      {groupe.result[1].status}
                    </span>
                    <div className="h-4 border-2 border-red-500 mx-1" />
                    <span className="font-semibold">
                      {groupe.result[1].driver}
                    </span>
                  </div>
                </div>
              )}
            </div>

            <div className="text-[#C62828] text-xl pr-1">&gt;</div>
          </div>
        </div>
      ))}
    </div>
  );
}
