import { GrandPrix } from "@/types/grandprix";

interface GrandPrixResultCardProps {
  gp: Partial<GrandPrix>;
}

export default function GrandPrixResult({ gp }: GrandPrixResultCardProps) {
  console.log(gp);
  const p10 = gp.grand_prix_classement?.find(
    (result) => result.position === 10
  );

  const firstDNF = gp.grand_prix_classement?.find((result) => result.is_dnf);
  return (
    <div className="flex mt-2 flex-wrap items-center gap-2">
      {p10 && (
        <div className="flex items-center text-sm px-2 rounded-full">
          <span className="font-bold">{p10.position}</span>
          <div className="h-5 border-2 border-red-500 mx-1" />
          <span className="font-bold bg-gray-200 rounded-r-lg pl-1 pr-2">
            {p10.grand_prix_pilote?.pilote?.name}
          </span>
        </div>
      )}
      {firstDNF && (
        <div className="flex items-center text-sm px-2 rounded-full">
          <span className="font-bold">DNF</span>
          <div className="h-5 border-2 border-gray-500 mx-1" />
          <span className="font-bold bg-gray-200 rounded-r-lg pl-1 pr-2">
            {firstDNF.grand_prix_pilote?.pilote?.name}
          </span>
        </div>
      )}
    </div>
  );
}
