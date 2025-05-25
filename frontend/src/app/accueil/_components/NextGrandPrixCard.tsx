import Link from "next/link";

import CountDown from "./CountDown";

export default function NextGrandPrixCard() {
  //TODO: fetch next grand prix
  const nextGrandPrix = {
    idApiRaces: "japan2024",
    season: "2025",
    date: "2025-05-22",
    time: "06:00:00",
    track: {
      countryName: "Japan",
      pictureCountry: "🏁",
      trackName: "Suzuka Circuit",
    },
  };

  return (
    <div className="bg-[#2E2E2E] text-white rounded-2xl mx-4 p-4 md:mx-auto md:max-w-md">
      <div className="flex gap-2 items-center mb-1">
        <span className="text-xl">
          {nextGrandPrix.track.pictureCountry ? (
            <img
              src={nextGrandPrix.track.pictureCountry}
              alt={nextGrandPrix.track.countryName}
              className="w-6 h-4 object-cover rounded-sm"
            />
          ) : (
            "🏁"
          )}
        </span>
        <h2 className="text-lg font-semibold">
          {nextGrandPrix.track.countryName}
        </h2>
      </div>

      <p className="text-sm text-gray-300 mb-3 pl-3 border-l-4 border-[#C62828]">
        Formula 1 {nextGrandPrix.season} • {nextGrandPrix.track.trackName}
      </p>

      <CountDown date={nextGrandPrix.date} time={nextGrandPrix.time} />

      <Link
        href={`/pari-grand-prix/${nextGrandPrix.idApiRaces}`}
        className="bg-[#E35050] hover:bg-[#d03c3c] text-white w-full py-2 rounded-xl font-semibold transition block text-center"
      >
        Choisissez votre écurie &gt;
      </Link>
    </div>
  );
}
