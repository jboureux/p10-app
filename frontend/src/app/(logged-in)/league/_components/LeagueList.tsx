import Badge from "@/components/ui/Badge";
import { League } from "@/types/leagues";
import Link from "next/link";

interface LeagueListProps {
  teams: League[];
}

export default function LeagueList({ teams }: LeagueListProps) {
  return (
    <div className="p-4 md:w-[80vw] lg:w-2/3 mx-auto">
      <h2 className="text-lg md:text-2xl text-gray-700 font-semibold mb-4">
        Tes Leagues
      </h2>
      <div className="space-y-3">
        {teams.map((team, index) => (
          <Link
            key={index}
            href={`/classement-league/${team.id}`}
            className="bg-white rounded-xl p-4 flex items-center justify-between shadow-sm"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gray-300 rounded-full"></div>
              <div>
                <div className="font-semibold text-lg text-gray-700 flex items-center">
                  <span>{team.name}</span>
                  {team.isPrivate && (
                    <Badge className="bg-blue-400 text-white ml-2">
                      Privée
                    </Badge>
                  )}
                  {!team.isActive && (
                    <Badge className="bg-gray-700 text-white ml-2">
                      Inactive
                    </Badge>
                  )}
                </div>
                <div className="text-sm text-gray-500">
                  {team.user_league.length} membre
                  {team.user_league.length === 1 ? "" : "s"}
                </div>
              </div>
            </div>
            <span className="text-red-600 text-xl">✔</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
