import React from "react";
import { fetchDrivers, fetchSessionStatus, fetchRaceControl } from "../lib/f1";
import LiveLeaderboard from "../components/RaceCenter/LiveLeaderboard";
import TelemetryGauges from "../components/RaceCenter/TelemetryGauges";
import WeatherConditionCard from "../components/RaceCenter/WeatherConditionCard";
import RaceControlTicker from "../components/Page/RaceControlTicker";

export default async function RaceCenterPage() {
  const [drivers, sessionStatus, raceControl] = await Promise.all([
    fetchDrivers(),
    fetchSessionStatus(),
    fetchRaceControl()
  ]);

  const topDriver = drivers[0] || null;

  return (
    <main className="h-screen w-screen bg-[#050706] text-white overflow-hidden flex flex-col font-[family-name:var(--font-barlow)]">
      {/* Top Header Bar */}
      <header className="h-16 border-b border-white/10 flex items-center justify-between px-8 bg-black/40 backdrop-blur-md shrink-0 z-20">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-[#e10600] animate-pulse shadow-[0_0_10px_#e10600]" />
            <span className="text-sm font-black italic uppercase tracking-tighter">Live Race Center</span>
          </div>
          <div className="h-4 w-[1px] bg-white/20" />
          <span className="text-[10px] font-bold text-white/40 uppercase tracking-[0.3em] font-[family-name:var(--font-space)]">
            {sessionStatus.name || "UNIDENTIFIED.SESSION"}
          </span>
        </div>

        <div className="flex items-center gap-8">
          <div className="flex flex-col items-end">
            <span className="text-[8px] font-bold text-white/20 uppercase tracking-widest mb-1">Session Status</span>
            <span className={`text-xs font-black italic uppercase tracking-widest ${sessionStatus.status === 'RED' ? 'text-[#e10600]' : 'text-emerald-500'}`}>
              {sessionStatus.status} FLAG
            </span>
          </div>
          <div className="h-10 w-[1px] bg-white/10" />
          <div className="text-right">
            <p className="text-[8px] font-bold text-white/20 uppercase tracking-widest mb-1">System Time</p>
            <p className="text-sm font-mono text-white/60">11:38.21 UTC</p>
          </div>
        </div>
      </header>

      {/* Main Dashboard Grid */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Technical Background Grid */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
             style={{ backgroundSize: '40px 40px', backgroundImage: 'linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)' }} />

        {/* Left Side: Leaderboard */}
        <aside className="w-[350px] shrink-0 z-10">
          <LiveLeaderboard drivers={drivers} />
        </aside>

        {/* Right Side: Primary Telemetry & Control */}
        <section className="flex-1 flex flex-col p-8 gap-8 overflow-hidden z-10">
          
          {/* Top Row: Focus Telemetry */}
          <div className="flex-1 flex gap-8 min-h-0">
            {/* Primary Gauges */}
            <div className="flex-1 min-w-0">
              {topDriver ? (
                <div className="h-full flex flex-col">
                  <div className="mb-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-1 h-8 rounded-full" style={{ backgroundColor: `#${topDriver.team_colour}` }} />
                      <div>
                        <p className="text-[9px] font-black text-white/30 uppercase tracking-[0.3em] mb-0.5">Focus: Lead Driver</p>
                        <h2 className="text-2xl font-black italic uppercase italic">{topDriver.full_name}</h2>
                      </div>
                    </div>
                  </div>
                  <div className="flex-1">
                    <TelemetryGauges driverNumber={topDriver.driver_number} />
                  </div>
                </div>
              ) : (
                <div className="h-full bg-white/5 border border-white/10 rounded-xl flex items-center justify-center">
                  <span className="text-xs font-bold text-white/20 uppercase tracking-widest animate-pulse italic">Awaiting Telemetry Feed...</span>
                </div>
              )}
            </div>

            {/* Sidebar Data: Weather & Feed */}
            <div className="w-80 flex flex-col gap-8 shrink-0">
              <WeatherConditionCard />
              
              <div className="flex-1 bg-black/40 backdrop-blur-md border border-white/10 rounded-xl p-6 flex flex-col gap-6 overflow-hidden">
                <div className="flex items-center gap-2 shrink-0">
                  <div className="w-2 h-2 rounded-full bg-[#e10600] animate-pulse" />
                  <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/50 font-[family-name:var(--font-space)]">
                    {"// RC.MESSAGE_FEED"}
                  </span>
                </div>
                <div className="flex-1 overflow-y-auto no-scrollbar flex flex-col gap-4">
                  {raceControl.map((msg, i) => (
                    <div key={i} className="border-l border-white/10 pl-3 py-1">
                      <p className="text-[8px] font-mono text-white/20 uppercase mb-1">{msg.category}</p>
                      <p className="text-[11px] font-medium text-white/80 leading-tight uppercase italic">{msg.message}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Row: Race Control Ticker (Wide) */}
          <div className="h-12 border-t border-white/10 bg-black/40 -mx-8 -mb-8 mt-auto flex items-center shrink-0">
            <RaceControlTicker />
          </div>
        </section>

        {/* HUD Elements (Glassmorphism Overlays) */}
        <div className="absolute bottom-16 right-8 w-48 h-48 pointer-events-none border border-[#e10600]/10 rounded-full opacity-10 animate-spin-slow" 
             style={{ borderStyle: 'dashed' }} />
      </div>
    </main>
  );
}
