interface TabsProps {
  activeTab: string;
  setActiveTab: (tab: "upcoming" | "past") => void;
}

export default function Tabs({ activeTab, setActiveTab }: TabsProps) {
  return (
    <div className="bg-white text-[#C62828] grid grid-cols-2 text-lg font-mono">
      <button
        onClick={() => setActiveTab("upcoming")}
        className={`py-2 border-b-4 cursor-pointer ${
          activeTab === "upcoming"
            ? "border-[#C62828]"
            : "border-white text-gray-300"
        }`}
      >
        A venir
      </button>
      <button
        onClick={() => setActiveTab("past")}
        className={`py-2 border-b-4 cursor-pointer ${
          activeTab === "past"
            ? "border-[#C62828]"
            : "border-white text-gray-300"
        }`}
      >
        Passées
      </button>
    </div>
  );
}
