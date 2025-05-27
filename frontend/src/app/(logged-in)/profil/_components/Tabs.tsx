interface TabsProps {
  activeTab: string;
  setActiveTab: (tab: "bets" | "profile") => void;
}

export default function Tabs({ activeTab, setActiveTab }: TabsProps) {
  return (
    <div className="bg-white text-[#C62828] grid grid-cols-2 text-lg font-mono">
      <button
        onClick={() => setActiveTab("bets")}
        className={`py-2 border-b-4 cursor-pointer ${
          activeTab === "bets"
            ? "border-[#C62828]"
            : "border-white text-gray-300"
        }`}
      >
        Bets
      </button>
      <button
        onClick={() => setActiveTab("profile")}
        className={`py-2 border-b-4 cursor-pointer ${
          activeTab === "profile"
            ? "border-[#C62828]"
            : "border-white text-gray-300"
        }`}
      >
        Profil
      </button>
    </div>
  );
}
