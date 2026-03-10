"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LapData, OpenF1Driver } from "../../types/f1";
import { fetchAllLaps } from "../../lib/f1";

interface LiveLeaderboardProps {
  drivers: OpenF1Driver[];
}

export default function LiveLeaderboard({ drivers }: LiveLeaderboardProps) {
  const [laps, setLaps] = useState<LapData[]>([]);

  useEffect(() => {
    const loadLaps = async () => {
      const data = await fetchAllLaps();
      setLaps(data);
    };

    loadLaps();
    const interval = setInterval(loadLaps, 15000); // 15s refresh
    return () => clearInterval(interval);
  }, []);

  // Group latest lap per driver
  const latestLaps = drivers.map(driver => {
    const driverLaps = laps.filter(l => l.driver_number === driver.driver_number);
    return {
      driver,
      lastLap: driverLaps.length > 0 ? driverLaps[driverLaps.length - 1] : null
    };
  }).sort((a, b) => {
    if (!a.lastLap) return 1;
    if (!b.lastLap) return -1;
    return (a.lastLap.duration_sector_1 + a.lastLap.duration_sector_2 + a.lastLap.duration_sector_3) - 
           (b.lastLap.duration_sector_1 + b.lastLap.duration_sector_2 + b.lastLap.duration_sector_3);
  });

  return (
    <div className="flex flex-col h-full bg-black/20 backdrop-blur-sm border-r border-white/10">
      <div className="p-6 border-b border-white/10 bg-white/5 flex items-center justify-between">
        <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-[#e10600] font-[family-name:var(--font-space)]">
          {"// LIVE.CLASSIFICATION"}
        </h3>
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-[9px] font-bold text-white/40 uppercase tracking-widest">Streaming</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar">
        <div className="flex flex-col">
          {latestLaps.map((item, index) => (
            <motion.div 
              layout
              key={item.driver.driver_number}
              className="flex items-center group border-b border-white/5 hover:bg-white/5 transition-colors h-14"
            >
              {/* Pos */}
              <div className="w-12 h-full flex items-center justify-center bg-black/40 border-r border-white/5 shrink-0">
                <span className="text-sm font-black italic font-[family-name:var(--font-barlow)] text-white/40 group-hover:text-[#e10600]">
                  {index + 1}
                </span>
              </div>

              {/* Driver Info */}
              <div className="flex-1 flex items-center px-4 gap-3 overflow-hidden">
                <div 
                  className="w-1 h-5 shrink-0 rounded-full" 
                  style={{ backgroundColor: `#${item.driver.team_colour}` }}
                />
                <div className="flex items-baseline gap-2 overflow-hidden">
                  <span className="text-xs font-black uppercase italic font-[family-name:var(--font-barlow)] truncate">
                    {item.driver.name_acronym}
                  </span>
                  <span className="text-[9px] font-bold text-white/20 uppercase tracking-tighter truncate hidden md:block">
                    {item.driver.team_name}
                  </span>
                </div>
              </div>

              {/* Sectors */}
              <div className="flex items-center gap-1 px-4 shrink-0">
                {[1, 2, 3].map(s => {
                  const duration = item.lastLap ? (item.lastLap as any)[`duration_sector_${s}`] : 0;
                  const isPurple = duration > 0 && duration < 25; // Dummy logic for purple
                  return (
                    <div 
                      key={s} 
                      className={`w-4 h-1.5 skew-x-[-20deg] ${
                        duration > 0 
                          ? (isPurple ? 'bg-purple-500 shadow-[0_0_8px_#a855f7]' : 'bg-emerald-500 shadow-[0_0_8px_#10b981]') 
                          : 'bg-white/5'
                      }`} 
                    />
                  );
                })}
              </div>

              {/* Lap Time */}
              <div className="w-24 text-right pr-6 shrink-0">
                <span className="text-[11px] font-mono text-white/60">
                  {item.lastLap 
                    ? (item.lastLap.duration_sector_1 + item.lastLap.duration_sector_2 + item.lastLap.duration_sector_3).toFixed(3) 
                    : "---"}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
