"use client";

import { useState, useEffect } from "react";

interface CountDownProps {
  date: string;
  time: string;
}

export default function CountDown({ date, time }: CountDownProps) {
  const [timeLeft, setTimeLeft] = useState("");

  const raceDateTime = new Date(`${date}T${time}`);

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
  }, [date, time]);

  return (
    <div className="bg-black text-white py-2 px-3 rounded-xl text-center font-bold mb-4">
      Temps restant pour parier : <span className="text-white">{timeLeft}</span>
    </div>
  );
}
