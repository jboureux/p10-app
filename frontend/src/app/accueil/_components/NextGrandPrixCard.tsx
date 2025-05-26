import Link from "next/link";

import { callAPI } from "@/lib/api-client";
import { NextGrandPrixResponse } from "@/types/grandprix";
import CountDown from "./CountDown";

export default async function NextGrandPrixCard() {
  const query = `
  query NextGrandPrix {
    nextGrandPrix {
      id_api_races
      season
      date
      time
      track {
        country_name
        track_name
      }
    }
  }
  `;

  const result: NextGrandPrixResponse = await callAPI<NextGrandPrixResponse>({
    query,
  });

  const nextGrandPrix = result.data.nextGrandPrix;

  return (
    <div className="bg-[#2E2E2E] text-white rounded-2xl mx-4 p-4 md:mx-auto md:max-w-md">
      <div className="flex gap-2 items-center mb-1">
        <span className="text-xl">
          {nextGrandPrix.track?.picture_country ? (
            <img
              src={nextGrandPrix.track.picture_country}
              alt={nextGrandPrix.track.country_name}
              className="w-6 h-4 object-cover rounded-sm"
            />
          ) : (
            "🏁"
          )}
        </span>
        <h2 className="text-lg font-semibold">
          {nextGrandPrix.track?.country_name}
        </h2>
      </div>

      <p className="text-sm text-gray-300 mb-3 pl-3 border-l-4 border-[#C62828]">
        Formula 1 {nextGrandPrix.season} • {nextGrandPrix.track?.track_name}
      </p>

      <CountDown dateTime={nextGrandPrix.time ?? ""} />

      <Link
        href={`/pari-grand-prix/${nextGrandPrix.id_api_races ?? ""}`}
        className="bg-[#E35050] hover:bg-[#d03c3c] text-white w-full py-2 rounded-xl font-semibold transition block text-center"
      >
        Choisissez votre écurie &gt;
      </Link>
    </div>
  );
}
