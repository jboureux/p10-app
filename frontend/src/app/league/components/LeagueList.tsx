"use client";

import { useRouter } from "next/navigation";

import { Button } from "@/components/ui";
import Link from "next/link";

interface LeagueListProps {
  teams: Array<{ id: string; name: string; members: number }>;
  setShowCreateModal: (show: boolean) => void;
  setShowJoinModal: (show: boolean) => void;
}

export default function LeagueList({
  teams,
  setShowCreateModal,
  setShowJoinModal,
}: LeagueListProps) {
  const router = useRouter();

  return (
    <div className="p-4">
      <h2 className="text-2xl text-gray-700 font-semibold mb-4">Tes Leagues</h2>
      <div className="space-y-3">
        {teams.map((team, index) => (
          <Link
            key={index}
            href={`/league-classement/${team.name}`}
            className="bg-white rounded-xl p-4 flex items-center justify-between shadow-sm"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gray-300 rounded-full"></div>
              <div>
                <div className="font-semibold text-lg text-gray-700">
                  {team.name}
                </div>
                <div className="text-sm text-gray-500">
                  {team.members} membres
                </div>
              </div>
            </div>
            <span className="text-red-600 text-xl">✔</span>
          </Link>
        ))}
      </div>
      <div className="flex justify-center gap-4 mt-6">
        <Button
          text="Créer"
          widthFull={false}
          onClick={() => setShowCreateModal(true)}
        />
        <Button
          text="Rejoindre"
          widthFull={false}
          onClick={() => setShowJoinModal(true)}
        />
      </div>
    </div>
  );
}
