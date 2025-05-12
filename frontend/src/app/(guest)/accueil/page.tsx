import HomeHeader from "./_components/HomeHeader";
import NextGrandPrixCard from "./_components/NextGrandPrixCard";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#EEF3F6] pb-24 md:pb-0">
      <HomeHeader />

      <NextGrandPrixCard />
    </div>
  );
}
