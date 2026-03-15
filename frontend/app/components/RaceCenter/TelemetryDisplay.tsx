"use client";

import { CarPerformance } from "../../types/f1";
import { useState } from "react";

interface TelemetryDisplayProps {
  initialData: CarPerformance | null;
  driverName: string;
}

export default function TelemetryDisplay({ initialData, driverName }: TelemetryDisplayProps) {
  const [data] = useState<CarPerformance | null>(initialData);

  // In a real scenario, we might poll here. For now, we'll display the initial data with HUD styling.
  
  if (!data) return (
    <div className="hud-glass p-6 text-white/20 font-technical flex items-center justify-center min-h-[200px]">
      NO_TELEMETRY_DATA_RECEIVED
    </div>
  );

  const rpmPercent = (data.rpm / 15000) * 100; // Max RPM approx 15k

  return (
    <div className="hud-glass p-6 glow-cyber">
      <div className="flex justify-between items-start mb-6">
        <div>
          <div className="text-[10px] font-technical text-white/40 mb-1">TELEMETRY.STREAM</div>
          <div className="font-heading-f1 text-2xl text-white italic">{driverName}</div>
        </div>
        <div className="text-right">
          <div className="text-[10px] font-technical text-[#00ffd5] mb-1 animate-pulse">LIVE</div>
          <div className="font-technical text-white/60">CAR_NO_{data.driver_number}</div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-8 relative">
        {/* Speed & Gear */}
        <div className="flex flex-col items-center justify-center border-r border-white/10">
          <div className="relative">
            <div className="text-[80px] font-heading-f1 leading-none text-white">{data.speed}</div>
            <div className="absolute -right-8 bottom-2 font-technical text-white/40">KM/H</div>
          </div>
          <div className="mt-4 flex gap-4 items-end">
            <div className="text-4xl font-heading-f1 text-[#00ffd5]">G{data.n_gear === 0 ? "N" : data.n_gear}</div>
            <div className={`px-2 py-0.5 font-technical text-[8px] border transition-colors ${data.drs >= 10 ? "border-[#00ffd5] text-[#00ffd5] bg-[#00ffd5]/10" : "border-white/10 text-white/20"}`}>
              DRS
            </div>
          </div>
        </div>

        {/* RPM & Throttle/Brake */}
        <div className="flex flex-col justify-center gap-6">
          <div className="space-y-2">
            <div className="flex justify-between font-technical text-[8px] text-white/40">
              <span>RPM_GAUGE</span>
              <span>{data.rpm.toLocaleString()}</span>
            </div>
            <div className="h-2 bg-white/5 hud-border overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-[#00ffd5] via-[#00ffd5] to-[#e10600] transition-all duration-300"
                style={{ width: `${Math.min(rpmPercent, 100)}%` }}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <div className="font-technical text-[8px] text-white/40">THR_INPUT</div>
              <div className="h-1 bg-white/5">
                <div className="h-full bg-[#00ffd5]" style={{ width: `${data.throttle}%` }} />
              </div>
            </div>
            <div className="space-y-1">
              <div className="font-technical text-[8px] text-white/40">BRK_INPUT</div>
              <div className="h-1 bg-white/5">
                <div className="h-full bg-[#e10600]" style={{ width: `${data.brake}%` }} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative Technical data */}
      <div className="mt-6 pt-4 border-t border-white/5 flex gap-4 text-[8px] font-technical text-white/20">
        <span>STR_ANGLE: 0.00°</span>
        <span>TYRE_PRES: 21.5 PSI</span>
        <span>FUEL_FLOW: 98.2 KG/H</span>
      </div>
    </div>
  );
}
