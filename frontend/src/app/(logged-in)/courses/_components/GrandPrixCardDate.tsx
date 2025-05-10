interface GrandPrixCardDateProps {
  gpDate: string;
}

export default function GrandPrixCardDate({ gpDate }: GrandPrixCardDateProps) {
  const date = new Date(gpDate);
  const formattedDate = `${date.getDate().toString().padStart(2, "0")}/${(
    date.getMonth() + 1
  )
    .toString()
    .padStart(2, "0")}`;

  return (
    <div className="text-center mr-4">
      <div className="text-xl font-bold">{formattedDate}</div>
      <div className="text-sm bg-gray-200 text-gray-700 rounded-full px-2 mt-1">
        {date.toLocaleString("default", { month: "short" })}
      </div>
    </div>
  );
}
