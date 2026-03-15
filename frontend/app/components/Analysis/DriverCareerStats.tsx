"use client";

import { OpenF1Driver, DriverStanding } from "../../types/f1";

interface DriverCareerStatsProps {
  driver: OpenF1Driver;
  standing: DriverStanding | null;
}

export default function DriverCareerStats({ driver, standing }: DriverCareerStatsProps) {
  // Mocking some career data since OpenF1 is session-based
  const careerData = [
    { label: "WC_TITLES", value: driver.last_name === "Verstappen" ? "3" : driver.last_name === "Hamilton" ? "7" : "0" },
    { label: "GRAND_PRIX_WINS", value: driver.last_name === "Verstappen" ? "61" : driver.last_name === "Hamilton" ? "105" : "–" },
    { label: "POLE_POSITIONS", value: driver.last_name === "Verstappen" ? "40" : driver.last_name === "Hamilton" ? "104" : "–" },
    { label: "SEASON_POINTS", value: standing?.points_current.toString() || "0" },
  ];

  return (
    <div className="hud-glass p-6 relative overflow-hidden bg-black/60">
      {/* Decorative Technical data */}
      <div className="absolute top-0 right-0 p-4 font-technical text-[7px] text-white/10 text-right">
        AUTH_UNIT: {driver.name_acronym}_{driver.driver_number}<br />
        SYNC: COMPLETE
      </div>

      <div className="flex flex-col items-center lg:items-start mb-12">
        <div className="flex-1 flex flex-col items-center lg:items-start text-center lg:text-left">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-1 h-10 bg-[#e10600] glow-red" />
            <h1 className="font-heading-f1 text-5xl md:text-7xl italic leading-none">
              {driver.full_name.split(' ')[0]} <span className="text-[#e10600]">{driver.full_name.split(' ').pop()}</span>
            </h1>
          </div>
          <div className="flex gap-6 items-center">
            <div className="font-technical text-xs text-white/40 tracking-[0.3em] uppercase">{driver.team_name}</div>
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <div className={`px-4 py-1 font-heading-f1 italic text-sm border border-[#00ffd5]/40 text-[#00ffd5] glow-cyber`}>
              POS_{standing?.position_current || 'N/A'}
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-2 gap-3">
        {careerData.map((stat, i) => (
          <div key={i} className="hud-border px-4 py-6 bg-white/5 group hover:bg-white/10 transition-colors">
            <div className="text-[8px] font-technical text-white/40 mb-1 tracking-[0.2em] uppercase whitespace-nowrap overflow-hidden">{stat.label.replace(/_/g, " ")}</div>
            <div className="font-heading-f1 text-4xl text-white group-hover:text-[#00ffd5] transition-colors italic leading-none">{stat.value}</div>
            <div className="mt-4 h-1 bg-white/5">
              <div className="h-full bg-[#e10600]/40 w-1/2 group-hover:bg-[#00ffd5] transition-all" />
            </div>
          </div>
        ))}
      </div>

      {/* Technical Log */}
      <div className="mt-12 pt-6 border-t border-white/5 flex flex-wrap gap-10 text-[7px] font-technical text-white/20">
        <div className="flex flex-col gap-1">
          <span>HVT_ID: {driver.full_name.toUpperCase().replace(/ /g, "_")}</span>
          <span>HVT_TYPE: CLASS_A_PILOT</span>
        </div>
        <div className="flex flex-col gap-1">
          <span>BIOMETRIC_SYNC: v9.4.2</span>
          <span>HEART_RATE: 162_BPM</span>
        </div>
        <div className="flex flex-col gap-1">
          <span>G_FORCE_TOLERANCE: 5.2G</span>
          <span>REACTION_TIME: 0.18S</span>
        </div>
      </div>
    </div>
  );
}
