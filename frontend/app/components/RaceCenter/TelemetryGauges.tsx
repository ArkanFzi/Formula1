"use client";

import React, { useEffect, useState } from "react";
import { motion, useSpring, useTransform } from "framer-motion";
import { CarPerformance } from "../../types/f1";
import { fetchDriverPerformance } from "../../lib/f1";

interface TelemetryGaugesProps {
  driverNumber: number;
}

export default function TelemetryGauges({ driverNumber }: TelemetryGaugesProps) {
  const [perf, setPerf] = useState<CarPerformance | null>(null);

  useEffect(() => {
    const loadPerf = async () => {
      const data = await fetchDriverPerformance(driverNumber);
      setPerf(data);
    };

    loadPerf();
    const interval = setInterval(loadPerf, 2000); // 2s refresh
    return () => clearInterval(interval);
  }, [driverNumber]);

  // Spring physics for smooth needle movement
  const speedValue = useSpring(0, { stiffness: 100, damping: 30 });
  const rpmValue = useSpring(0, { stiffness: 100, damping: 30 });

  useEffect(() => {
    if (perf) {
      speedValue.set(perf.speed || 0);
      rpmValue.set(perf.rpm || 0);
    }
  }, [perf, speedValue, rpmValue]);

  const rpmRotate = useTransform(rpmValue, [0, 15000], [-30, 210]);
  const speedRotate = useTransform(speedValue, [0, 360], [-30, 210]);

  if (!perf) return (
    <div className="flex items-center justify-center h-full text-white/20 font-mono text-[10px] uppercase tracking-widest">
      {"[ LINKING.TELEMETRY... ]"}
    </div>
  );

  return (
    <div className="flex flex-col gap-8 h-full p-8 bg-black/40 backdrop-blur-md rounded-xl border border-white/10 relative overflow-hidden">
      {/* Decorative Scanlines */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%]" />

      <div className="flex items-center justify-between">
        <h3 className="text-[10px] font-black uppercase tracking-[0.5em] text-[#e10600] font-[family-name:var(--font-space)]">
          {"// UNIT.TELEMETRY_02"}
        </h3>
        <span className="text-[8px] font-mono text-white/20 uppercase">HS_DATA_LINK.v3</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 flex-1 items-center">
        {/* RPM Gauge */}
        <div className="relative flex justify-center">
          <svg width="240" height="240" viewBox="0 0 240 240">
            {/* Background Arc */}
            <path 
              d="M 60 210 A 90 90 0 1 1 180 210" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="12" 
              className="text-white/5"
            />
            {/* Markers */}
            {[0, 2500, 5000, 7500, 10000, 12500, 15000].map((m, i) => {
              const angle = (m / 15000) * 240 - 30;
              const rad = (angle - 90) * (Math.PI / 180);
              const x1 = 120 + 84 * Math.cos(rad);
              const y1 = 120 + 84 * Math.sin(rad);
              const x2 = 120 + 96 * Math.cos(rad);
              const y2 = 120 + 96 * Math.sin(rad);
              return (
                <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke={m >= 12000 ? '#e10600' : 'white'} strokeWidth="2" opacity="0.3" />
              );
            })}
            {/* Needle */}
            <motion.line 
              x1="120" y1="120" 
              x2="120" y2="30" 
              stroke="#e10600" 
              strokeWidth="4" 
              style={{ originX: "120px", originY: "120px", rotate: rpmRotate }}
            />
            <circle cx="120" cy="120" r="10" fill="#000" stroke="#e10600" strokeWidth="2" />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center translate-y-8">
            <span className="text-3xl font-black italic font-[family-name:var(--font-barlow)] leading-none">{perf.rpm}</span>
            <span className="text-[9px] font-bold text-white/20 uppercase tracking-widest mt-1">RPM</span>
          </div>
          <p className="absolute -bottom-2 text-[9px] font-bold text-white/30 uppercase tracking-[0.3em]">{"TEL.RPM_UNIT"}</p>
        </div>

        {/* Speed Gauge */}
        <div className="relative flex justify-center">
          <svg width="240" height="240" viewBox="0 0 240 240">
            <path 
              d="M 60 210 A 90 90 0 1 1 180 210" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="12" 
              className="text-white/5"
            />
            {[0, 80, 160, 240, 320, 360].map((m, i) => {
              const angle = (m / 360) * 240 - 30;
              const rad = (angle - 90) * (Math.PI / 180);
              const x1 = 120 + 84 * Math.cos(rad);
              const y1 = 120 + 84 * Math.sin(rad);
              const x2 = 120 + 96 * Math.cos(rad);
              const y2 = 120 + 96 * Math.sin(rad);
              return (
                <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="white" strokeWidth="2" opacity="0.3" />
              );
            })}
            <motion.line 
              x1="120" y1="120" 
              x2="120" y2="30" 
              stroke="white" 
              strokeWidth="4" 
              style={{ originX: "120px", originY: "120px", rotate: speedRotate }}
            />
            <circle cx="120" cy="120" r="10" fill="#000" stroke="white" strokeWidth="2" />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center translate-y-8">
            <span className="text-5xl font-black italic font-[family-name:var(--font-barlow)] leading-none text-[#e10600]">{perf.speed}</span>
            <span className="text-[9px] font-bold text-white/20 uppercase tracking-widest mt-1">KM/H</span>
          </div>
          <p className="absolute -bottom-2 text-[9px] font-bold text-white/30 uppercase tracking-[0.3em]">{"TEL.SPD_KMH"}</p>
        </div>
      </div>

      {/* Footer Info: Gear & DRS */}
      <div className="flex items-center justify-around bg-white/5 p-6 rounded-lg mt-4 border border-white/5">
        <div className="text-center">
          <p className="text-[9px] font-bold text-white/20 uppercase tracking-widest mb-1">Gear</p>
          <span className="text-4xl font-black italic font-[family-name:var(--font-barlow)] leading-none text-white">{perf.n_gear}</span>
        </div>
        <div className="h-12 w-[1px] bg-white/10" />
        <div className="text-center">
          <p className="text-[9px] font-bold text-white/20 uppercase tracking-widest mb-1">DRS Status</p>
          <span className={`text-xl font-black italic font-[family-name:var(--font-barlow)] leading-none ${perf.drs >= 10 ? 'text-emerald-500' : 'text-white/20'}`}>
            {perf.drs >= 10 ? 'ENABLED' : 'STBY'}
          </span>
        </div>
      </div>
    </div>
  );
}
