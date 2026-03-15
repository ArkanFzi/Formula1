"use client";

import { WeatherData } from "../../types/f1";

interface WeatherHUDProps {
  data: WeatherData | null;
}

export default function WeatherHUD({ data }: WeatherHUDProps) {
  if (!data) return (
    <div className="hud-glass p-4 font-technical text-[8px] text-white/20 flex items-center justify-center">
      WEATHER_STATION_OFFLINE
    </div>
  );

  return (
    <div className="hud-glass p-4 bg-[#0a100d]/60">
      <div className="text-[9px] font-technical text-white/40 mb-4 flex justify-between">
        <span>METEOROLOGICAL.UNIT</span>
        <span className="text-[#00ffd5]">STABLE</span>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-4">
          <div className="hud-border p-2 bg-white/5">
            <div className="text-[7px] font-technical text-white/30 mb-1">AIR_TEMP</div>
            <div className="text-xl font-heading-f1 text-white">{data.air_temperature}°<span className="text-xs italic text-white/40">C</span></div>
          </div>
          <div className="hud-border p-2 bg-white/5 border-[#00ffd5]/20">
            <div className="text-[7px] font-technical text-white/30 mb-1">TRACK_TEMP</div>
            <div className="text-xl font-heading-f1 text-[#00ffd5]">{data.track_temperature}°<span className="text-xs italic text-[#00ffd5]/60">C</span></div>
          </div>
        </div>

        <div className="flex flex-col justify-between py-1">
          <div className="space-y-2">
            <div className="flex justify-between font-technical text-[7px] text-white/40">
              <span>HUMIDITY</span>
              <span>{data.humidity}%</span>
            </div>
            <div className="h-1 bg-white/5 hud-border">
              <div className="h-full bg-white/40" style={{ width: `${data.humidity}%` }} />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between font-technical text-[7px] text-white/40">
              <span>RAINFALL</span>
              <span>{data.rainfall === 0 ? "NONE" : "ACTIVE"}</span>
            </div>
            <div className="h-1 bg-white/5 hud-border">
              <div className="h-full bg-[#00ffd5]" style={{ width: data.rainfall > 0 ? "100%" : "0%" }} />
            </div>
          </div>

          <div className="pt-2 border-t border-white/5">
            <div className="text-[7px] font-technical text-white/20 text-center">PRECIP_CHANCE: 0%</div>
          </div>
        </div>
      </div>
    </div>
  );
}
