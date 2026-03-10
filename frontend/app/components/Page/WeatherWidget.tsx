"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { WeatherData } from "../../types/f1";
import { fetchLatestWeather } from "../../lib/f1";

export default function WeatherWidget() {
  const [weather, setWeather] = useState<WeatherData | null>(null);

  useEffect(() => {
    const loadWeather = async () => {
      const data = await fetchLatestWeather();
      setWeather(data);
    };

    loadWeather();
    const interval = setInterval(loadWeather, 120000); // 2min check
    return () => clearInterval(interval);
  }, []);

  if (!weather) return null;

  return (
    <motion.div 
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="relative group lg:skew-x-[-6deg] overflow-hidden"
    >
      {/* Background Frame */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent backdrop-blur-md border border-white/10" />
      
      {/* Scanning Line Effect */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-10">
        <motion.div 
          animate={{ translateY: ["-100%", "200%"] }}
          transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
          className="w-full h-1/2 bg-gradient-to-b from-transparent via-white to-transparent"
        />
      </div>

      <div className="relative p-7 flex flex-col gap-8 lg:skew-x-[6deg]">
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-[#e10600] animate-pulse shadow-[0_0_10px_#e10600]" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/50 font-[family-name:var(--font-space)]">
              {"ATM.TELEMETRY_01"}
            </span>
          </div>
          <span className="text-[8px] font-mono text-white/20 tracking-tighter">REF: 2025_TRK_01</span>
        </div>

        <div className="grid grid-cols-2 gap-x-12 gap-y-8">
          <div className="relative">
            <p className="text-[9px] text-[#e10600] uppercase tracking-widest font-black mb-2 font-[family-name:var(--font-space)]">AIR.TMP</p>
            <p className="text-3xl font-black italic font-[family-name:var(--font-barlow)] leading-none">
              {weather.air_temperature}<span className="text-xs align-top ml-1 text-white/40">°C</span>
            </p>
          </div>

          <div className="relative">
            <p className="text-[9px] text-white/30 uppercase tracking-widest font-black mb-2 font-[family-name:var(--font-space)]">TRK.TMP</p>
            <p className="text-3xl font-black italic font-[family-name:var(--font-barlow)] leading-none text-white">
              {weather.track_temperature}<span className="text-xs align-top ml-1 text-white/20">°C</span>
            </p>
          </div>

          <div className="relative">
            <p className="text-[9px] text-white/30 uppercase tracking-widest font-black mb-2 font-[family-name:var(--font-space)]">HMD.PRC</p>
            <p className="text-3xl font-black italic font-[family-name:var(--font-barlow)] leading-none">
              {weather.humidity}<span className="text-xs align-top ml-1 text-white/40">%</span>
            </p>
          </div>

          <div className="relative">
            <p className="text-[9px] text-white/30 uppercase tracking-widest font-black mb-2 font-[family-name:var(--font-space)]">RNF.STAT</p>
            <p className={`text-3xl font-black italic font-[family-name:var(--font-barlow)] leading-none ${weather.rainfall > 0 ? 'text-[#e10600]' : 'text-white/60'}`}>
              {weather.rainfall > 0 ? "WET" : "DRY"}
            </p>
          </div>
        </div>

        <div className="flex justify-between items-center pt-4 border-t border-white/5 mt-2">
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className={`w-1 h-3 skew-x-[-20deg] ${i <= 3 ? 'bg-[#e10600]' : 'bg-white/10'}`} />
            ))}
          </div>
          <span className="text-[8px] font-bold text-white/20 uppercase font-[family-name:var(--font-space)]">Unit Active</span>
        </div>
      </div>
    </motion.div>
  );
}
