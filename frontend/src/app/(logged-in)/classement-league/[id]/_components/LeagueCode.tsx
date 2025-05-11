"use client";

import { useState } from "react";

import { Button } from "@/components/ui";

interface LeagueCodeProps {
  code: string;
}

export default function LeagueCode({ code }: LeagueCodeProps) {
  const [showCode, setShowCode] = useState(false);

  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      <div className="text-center my-4">
        <Button
          text={showCode ? "Masquer" : "Partager"}
          onClick={() => setShowCode(!showCode)}
        />
      </div>

      {showCode && (
        <div className="pb-10">
          <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 mx-4 pb-6 md:mx-auto md:max-w-md shadow-sm">
            <p className="font-bold text-gray-800 mb-1">Code de la league</p>
            <p className="text-sm text-gray-600 mb-2">
              Vos amis peuvent aussi rejoindre la league en entrant ce code
            </p>

            <div className="relative">
              <input
                readOnly
                value={code}
                className="w-full text-[#C62828] font-extrabold text-lg px-4 py-2 rounded-lg border border-gray-300 bg-white tracking-wider pr-12"
              />
              <button
                onClick={handleCopy}
                className={`absolute right-2 top-1/2 -translate-y-1/2 border-2 border-[#C62828] text-[#C62828] py-1 ${
                  copied ? "px-[10px]" : "px-2"
                } rounded-md`}
              >
                {copied ? "✓" : "📋"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
