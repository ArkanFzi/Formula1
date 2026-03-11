"use client";

import React, { useEffect, useState } from "react";
import { WeatherData } from "../../types/f1";
import { fetchLatestWeather } from "../../lib/f1";

export default function WeatherConditionCard() {
  const [weather, setWeather] = useState<WeatherData | null>(null);

  useEffect(() => {
    const loadWeather = async () => {
      const data = await fetchLatestWeather();
      setWeather(data);
    };

    loadWeather();
    const interval = setInterval(loadWeather, 60000); // 1min check
    return () => clearInterval(interval);
  }, []);

  if (!weather) return null;

  return (
    <div className="bg-white/5 border border-white/10 p-6 rounded-xl flex flex-col gap-6">
      <div className="flex items-center gap-2">
        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
        <span className="text-[10px] font-bold text-white/40 uppercase tracking-[0.2em] font-[family-name:var(--font-space)]">
          {"// ATM.MONITOR_UNIT"}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div>
          <p className="text-[8px] text-white/20 uppercase tracking-widest font-black mb-1">Air Temp</p>
          <div className="flex items-baseline gap-1">
            <span className="text-xl font-black italic font-[family-name:var(--font-barlow)]">{weather.air_temperature}</span>
            <span className="text-[10px] text-white/40 italic">°C</span>
          </div>
        </div>
        <div>
          <p className="text-[8px] text-white/20 uppercase tracking-widest font-black mb-1">Track Temp</p>
          <div className="flex items-baseline gap-1">
            <span className="text-xl font-black italic font-[family-name:var(--font-barlow)] text-[#e10600]">{weather.track_temperature}</span>
            <span className="text-[10px] text-[#e10600]/40 italic">°C</span>
          </div>
        </div>
        <div>
          <p className="text-[8px] text-white/20 uppercase tracking-widest font-black mb-1">Humidity</p>
          <div className="flex items-baseline gap-1">
            <span className="text-xl font-black italic font-[family-name:var(--font-barlow)]">{weather.humidity}</span>
            <span className="text-[10px] text-white/40 italic">%</span>
          </div>
        </div>
        <div>
          <p className="text-[8px] text-white/20 uppercase tracking-widest font-black mb-1">Precipitation</p>
          <span className={`text-sm font-black italic font-[family-name:var(--font-barlow)] uppercase ${weather.rainfall > 0 ? 'text-[#e10600]' : 'text-emerald-500'}`}>
            {weather.rainfall > 0 ? 'Detected' : 'Dry'}
          </span>
        </div>
      </div>
    </div>
  );
}
