import Link from "next/link";

import { GrandPrix } from "@/types/grandprix";
import GrandPrixCardDate from "./GrandPrixCardDate";
import GrandPrixResult from "./GrandPrixCardResult";

interface GrandPrixCardListProps {
  activeTab: "upcoming" | "past";
  grandPrixList: Partial<GrandPrix>[];
}

export default function GrandPrixCardList({
  activeTab,
  grandPrixList,
}: GrandPrixCardListProps) {
  console.log(grandPrixList);

  return (
    <div className="pt-4 px-4 space-y-3 md:px-0">
      {grandPrixList.map((gp) => {
        return (
          <Link
            key={gp.id_api_races}
            href={`/classement-course/${gp.id_api_races}`}
            className={`${
              activeTab === "upcoming" && "pointer-events-none"
            } mb-2 text-gray-800 md:w-[80vw] lg:w-2/3 mx-auto block`}
          >
            <div className="flex justify-between items-start bg-white rounded-2xl shadow-md p-4">
              <GrandPrixCardDate gpDate={gp.date ?? ""} />

              <div className="h-25 border-l border-dotted border-gray-400 mx-4" />

              <div className="flex-1">
                <div className="text-sm text-[#C62828] font-semibold">
                  Saison {gp.season}
                </div>
                <div className="text-lg font-bold">
                  {gp.track?.country_name}
                </div>
                <div className="text-sm text-gray-500">
                  {gp.track?.track_name}
                </div>

                {/* TODO: create logic to pass P10 and P20/first DNF */}
                {activeTab === "past" && gp.grand_prix_classement?.length && (
                  <GrandPrixResult gp={gp} />
                )}
              </div>

              {activeTab === "past" && (
                <div className="text-[#C62828] text-xl pr-1">&gt;</div>
              )}
            </div>
          </Link>
        );
      })}
    </div>
  );
}
