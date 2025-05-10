import { GrandPrix } from "./CoursesPage";

interface GrandPrixResultCardProps {
  gp: GrandPrix;
}

export default function GrandPrixResult({ gp }: GrandPrixResultCardProps) {
  return (
    <div className="flex mt-2 flex-wrap items-center gap-2">
      {/* TODO: update the logic */}
      {gp.grandPrixClassement?.slice(0, 2).map((result) => (
        <div
          key={result.driver + result.status}
          className="flex items-center text-sm px-2 rounded-full"
        >
          <span className="font-bold">{result.status}</span>
          <div className="h-5 border-2 border-red-500 mx-1" />
          <span className="font-bold bg-gray-200 rounded-r-lg pl-1 pr-2">
            {result.driver}
          </span>
        </div>
      ))}
    </div>
  );
}
