import { GrHomeRounded, GrFlag } from "react-icons/gr";
import { HiOutlineTrophy } from "react-icons/hi2";
import { FiUser } from "react-icons/fi";
import Link from "next/link";

export default function Navbar() {
  const items = [
    { name: "Accueil", icon: <GrHomeRounded size={24} />, href: "/accueil" },
    { name: "Courses", icon: <GrFlag size={24} />, href: "/courses" },
    { name: "League", icon: <HiOutlineTrophy size={24} />, href: "/league" },
    { name: "Profil", icon: <FiUser size={24} />, href: "/profil" },
  ];
  return (
    <nav className="fixed bottom-0 md:top-0 md:bottom-auto w-full md:w-auto md:h-screen bg-white border-t md:border-t-0 md:border-r border-gray-200 flex md:flex-col justify-around md:justify-start md:items-center z-50 shadow md:shadow-none">
      {items.map((item) => (
        <Link
          key={item.name}
          href={item.href}
          className="flex flex-col items-center md:flex-row md:gap-3 text-gray-500 hover:text-black px-4 py-2 md:py-4"
        >
          {item.icon}
          <span className="text-sm mt-1 md:mt-0 md:text-base">{item.name}</span>
        </Link>
      ))}
    </nav>
  );
}
