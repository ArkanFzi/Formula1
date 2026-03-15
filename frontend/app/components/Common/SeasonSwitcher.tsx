"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

interface SeasonSwitcherProps {
  currentYear: number;
}

export default function SeasonSwitcher({ currentYear }: SeasonSwitcherProps) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  
  const years = [2025, 2024, 2023, 2022];

  return (
    <div className="relative z-50">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="hud-border px-4 py-2 bg-white/5 flex items-center gap-4 hover:bg-white/10 transition-colors"
      >
        <div className="flex flex-col items-start">
          <span className="text-[7px] font-technical text-white/40">SELECT_SEASON</span>
          <span className="font-heading-f1 text-xl italic text-white">{currentYear}</span>
        </div>
        <div className={`w-2 h-2 border-r border-b border-white/40 rotate-45 transition-transform ${isOpen ? '-rotate-[135deg] translate-y-1' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-full hud-glass glow-cyber border border-[#00ffd5]/20 animate-in fade-in slide-in-from-top-2 duration-200">
          {years.map((year) => (
            <button
              key={year}
              onClick={() => {
                setIsOpen(false);
                router.push(`/schedule?year=${year}`);
              }}
              className={`w-full text-left px-4 py-3 font-heading-f1 italic hover:bg-[#00ffd5]/10 hover:text-[#00ffd5] transition-colors border-b border-white/5 last:border-0 ${year === currentYear ? 'text-[#00ffd5] bg-[#00ffd5]/5' : 'text-white/60'}`}
            >
              {year} SEASON
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
