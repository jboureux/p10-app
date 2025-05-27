"use client";

import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";

export default function ProfileHeader() {
  const auth = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await auth.logOut();
      router.push("/connexion");
    } catch (e) {
      let message = "Unknown Error";
      if (e instanceof Error) message = e.message;
      console.log(message);
    }
  };

  return (
    <div className="text-white px-4 py-4 lg:px-0 text-end">
      <button
        onClick={handleLogout}
        className="text-sm text-gray-800 hover:text-red-200 cursor-pointer"
      >
        Se déconnecter
      </button>
    </div>
  );
}
