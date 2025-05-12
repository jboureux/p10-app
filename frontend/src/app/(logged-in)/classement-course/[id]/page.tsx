"use client";

import { useParams } from "next/navigation";

import RaceRankingHeader from "./_components/RaceRankingHeader";
import RaceRanking from "./_components/RaceRanking";

export default function RaceRankingPage() {
  const params = useParams();

  // TODO: fetch race infos then race results (hiren api works by searching by a specific date)
  //const racingId = decodeURIComponent(params.id as string);
  const raceCountry = "Japan";

  const raceResult = [
    {
      id: 269,
      scraped_at: "2025-05-05 00:00:06",
      position: "9",
      driver: "Carlos Sainz Jnr",
      team: "Williams",
      number: "55",
    },
    {
      id: 261,
      scraped_at: "2025-05-05 00:00:06",
      position: "1",
      driver: "Oscar Piastri",
      team: "McLaren",
      number: "81",
    },
    {
      id: 278,
      scraped_at: "2025-05-05 00:00:06",
      position: "not classified",
      driver: "Gabriel Bortoleto",
      team: "Sauber",
      number: "5",
    },
    {
      id: 265,
      scraped_at: "2025-05-05 00:00:06",
      position: "5",
      driver: "Alexander Albon",
      team: "Williams",
      number: "23",
    },
    {
      id: 273,
      scraped_at: "2025-05-05 00:00:06",
      position: "13",
      driver: "Pierre Gasly",
      team: "Alpine",
      number: "10",
    },
    {
      id: 263,
      scraped_at: "2025-05-05 00:00:06",
      position: "3",
      driver: "George Russell",
      team: "Mercedes",
      number: "63",
    },
    {
      id: 270,
      scraped_at: "2025-05-05 00:00:06",
      position: "10",
      driver: "Yuki Tsunoda",
      team: "Red Bull",
      number: "22",
    },
    {
      id: 274,
      scraped_at: "2025-05-05 00:00:06",
      position: "14",
      driver: "Nico Hulkenberg",
      team: "Sauber",
      number: "27",
    },
    {
      id: 266,
      scraped_at: "2025-05-05 00:00:06",
      position: "6",
      driver: "Kimi Antonelli",
      team: "Mercedes",
      number: "12",
    },
    {
      id: 275,
      scraped_at: "2025-05-05 00:00:06",
      position: "15",
      driver: "Fernando Alonso",
      team: "Aston Martin",
      number: "14",
    },
    {
      id: 280,
      scraped_at: "2025-05-05 00:00:06",
      position: "not classified",
      driver: "Jack Doohan",
      team: "Alpine",
      number: "7",
    },
    {
      id: 271,
      scraped_at: "2025-05-05 00:00:06",
      position: "11",
      driver: "Isack Hadjar",
      team: "RB",
      number: "6",
    },
    {
      id: 267,
      scraped_at: "2025-05-05 00:00:06",
      position: "7",
      driver: "Charles Leclerc",
      team: "Ferrari",
      number: "16",
    },
    {
      id: 268,
      scraped_at: "2025-05-05 00:00:06",
      position: "8",
      driver: "Lewis Hamilton",
      team: "Ferrari",
      number: "44",
    },
    {
      id: 277,
      scraped_at: "2025-05-05 00:00:06",
      position: "not classified",
      driver: "Liam Lawson",
      team: "RB",
      number: "30",
    },
    {
      id: 276,
      scraped_at: "2025-05-05 00:00:06",
      position: "16",
      driver: "Lance Stroll",
      team: "Aston Martin",
      number: "18",
    },
    {
      id: 279,
      scraped_at: "2025-05-05 00:00:06",
      position: "not classified",
      driver: "Oliver Bearman",
      team: "Haas",
      number: "87",
    },
    {
      id: 272,
      scraped_at: "2025-05-05 00:00:06",
      position: "12",
      driver: "Esteban Ocon",
      team: "Haas",
      number: "31",
    },
    {
      id: 264,
      scraped_at: "2025-05-05 00:00:06",
      position: "4",
      driver: "Max Verstappen",
      team: "Red Bull",
      number: "1",
    },
    {
      id: 262,
      scraped_at: "2025-05-05 00:00:06",
      position: "2",
      driver: "Lando Norris",
      team: "McLaren",
      number: "4",
    },
  ];

  raceResult.sort((a, b) => {
    if (a.position === "not classified") return 1;
    if (b.position === "not classified") return -1;
    return parseInt(a.position) - parseInt(b.position);
  });

  const pointByPosition: { [key: string]: number } = {
    "1": 1,
    "2": 2,
    "3": 4,
    "4": 6,
    "5": 8,
    "6": 10,
    "7": 12,
    "8": 15,
    "9": 18,
    "10": 25,
    "11": 18,
    "12": 15,
    "13": 12,
    "14": 10,
    "15": 8,
    "16": 6,
    "17": 4,
    "18": 2,
    "19": 1,
    "20": 1,
    "not classified": 0,
  };

  const raceResultWithPoints = raceResult.map((driver) => ({
    ...driver,
    points: pointByPosition[driver.position] ?? 0,
  }));

  const podiumPilote = raceResultWithPoints.slice(0, 3);
  const othersPilote = raceResultWithPoints.slice(3);

  return (
    <div className="min-h-screen bg-white">
      <RaceRankingHeader
        raceCountry={raceCountry}
        podiumPilotes={podiumPilote}
      />

      <RaceRanking othersPilotes={othersPilote} />
    </div>
  );
}
