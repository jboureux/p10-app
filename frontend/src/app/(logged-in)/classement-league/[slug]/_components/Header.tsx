"use client";

import { useParams, useRouter } from "next/navigation";

import PodiumPlayers from "./PodiumPlayers";

interface HeaderProps {
  podiumPlayers: Array<{
    id: string;
    icon: string;
    name: string;
    points: number;
  }>;
}

export default function Header({ podiumPlayers }: HeaderProps) {
  const router = useRouter();

  const params = useParams();
  const teamId = decodeURIComponent(params.slug as string);

  return (
    <div className="relative bg-gradient-to-br from-black to-red-700 text-white pt-6 md:pt-10 rounded-b-3xl">
      <button
        onClick={() => router.back()}
        className="absolute top-4 left-4 md:left-8 text-2xl md:text-3xl cursor-pointer"
      >
        &lt;
      </button>
      <h1 className="text-center text-2xl md:text-3xl font-mono">{teamId}</h1>

      <PodiumPlayers podiumPlayers={podiumPlayers} />
    </div>
  );
}
