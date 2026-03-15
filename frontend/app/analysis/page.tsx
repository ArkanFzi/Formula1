import React from "react";
import { fetchDrivers, fetchAllPitStops, fetchAllLaps } from "../lib/f1";
import PitStopStrategy from "../components/Analysis/PitStopStrategy";
import LapHistoryChart from "../components/Analysis/LapHistoryChart";

export default async function AnalysisPage() {
  const [drivers, pitStops, lapData] = await Promise.all([
    fetchDrivers(),
    fetchAllPitStops(),
    fetchAllLaps()
  ]);

  return (
    <main className="min-h-screen bg-[#050706] text-white flex flex-col font-technical p-6 lg:p-12 overflow-x-hidden">
      {/* Header Section */}
      <header className="mb-12 flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6">
        <div>
          <div className="flex items-center gap-3 mb-4">
            <div className="flex gap-1">
              <div className="w-1.5 h-1.5 bg-[#e10600]" />
              <div className="w-1.5 h-1.5 bg-white/20" />
            </div>
            <span className="text-[10px] text-[#e10600]/80 tracking-[0.5em]">ANALYSIS.POST_SESSION</span>
          </div>
          <h1 className="font-heading-f1 text-5xl md:text-7xl italic leading-none">
            RACE_ANALYSIS <span className="text-[#e10600]">CENTER</span>
          </h1>
        </div>
        
        <div className="hud-border px-6 py-3 bg-white/5 flex gap-8">
          <div>
            <div className="text-[7px] text-white/20 mb-1 tracking-widest">SESSION_KEY</div>
            <div className="text-sm font-heading-f1 italic text-white/80">LATEST_READY</div>
          </div>
          <div>
            <div className="text-[7px] text-white/20 mb-1 tracking-widest">DRIVERS_LOGGED</div>
            <div className="text-sm font-heading-f1 italic text-[#00ffd5]">{drivers.length}</div>
          </div>
        </div>
      </header>

      {/* Analysis Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Pit Stop Strategy Section */}
        <div className="flex flex-col gap-4">
           <PitStopStrategy pitStops={pitStops} drivers={drivers} />
           <div className="hud-glass p-4 text-[8px] font-technical text-white/20">
              <span className="text-[#e10600] mr-2">{"// NOTICE:"}</span> 
              TYRE_DEGRADATION_MODEL_ESTIMATED_BASED_ON_LAP_TIMES
           </div>
        </div>

        {/* Lap History Chart Section */}
        <div className="flex flex-col gap-4">
          <LapHistoryChart lapData={lapData} drivers={drivers} />
          <div className="hud-glass p-4 text-[8px] font-technical text-white/20">
              <span className="text-[#00ffd5] mr-2">{"// DATA_FEED:"}</span> 
              TELEMETRY_SAMPLE_AT_S3_FINISH_LINE
           </div>
        </div>
      </div>

      {/* Technical Background Deco */}
      <div className="fixed bottom-0 left-0 w-full h-[300px] bg-gradient-to-t from-[#e10600]/5 to-transparent pointer-events-none" />
      <div className="fixed top-0 right-0 w-[400px] h-[400px] bg-[#00ffd5]/5 rounded-full blur-[100px] pointer-events-none" />
    </main>
  );
}
