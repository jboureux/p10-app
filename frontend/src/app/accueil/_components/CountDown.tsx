"use client";

import { useEffect, useState } from "react";

interface CountDownProps {
  dateTime: string;
}

export default function CountDown({ dateTime }: CountDownProps) {
  const [timeLeft, setTimeLeft] = useState("");

  const raceDateTime = new Date(dateTime);

  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date();
      const diff = raceDateTime.getTime() - now.getTime();

      if (diff <= 0) {
        setTimeLeft("En cours ou terminé");
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diff / (1000 * 60)) % 60);
      const seconds = Math.floor((diff / 1000) % 60);

      setTimeLeft(`${days}j ${hours}h ${minutes}m ${seconds}s`);
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 200);

    return () => clearInterval(interval);
  }, [dateTime]);

  return (
    <div className="bg-black text-white py-2 px-3 rounded-xl text-center font-bold mb-4">
      Temps restant pour parier : <span className="text-white">{timeLeft}</span>
    </div>
  );
}
