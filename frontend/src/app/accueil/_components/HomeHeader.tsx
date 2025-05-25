import Image from "next/image";

export default function HomeHeader() {
  return (
    <>
      <div className="text-gray-800 text-center font-bold text-xl md:text-xl py-8">
        Pariez sur vos champion !
      </div>
      <div className="relative w-full flex justify-center pt-2 px-2">
        <Image
          src="/random-driver.png"
          alt="pilote"
          width={300}
          height={200}
          className="object-contain max-w-full h-auto"
        />
      </div>
    </>
  );
}
