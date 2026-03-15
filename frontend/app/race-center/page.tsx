import React from "react";
import { 
  fetchDrivers, 
  fetchSessionStatus, 
  fetchRaceControl, 
  fetchDriverPerformance,
  fetchLatestWeather 
} from "../lib/f1";
import LiveLeaderboard from "../components/RaceCenter/LiveLeaderboard";
import TelemetryDisplay from "../components/RaceCenter/TelemetryDisplay";
import RaceControlCenter from "../components/RaceCenter/RaceControlCenter";
import WeatherHUDComponent from "../components/RaceCenter/WeatherHUD";

export default async function RaceCenterPage() {
  const [drivers, sessionStatus, raceControl, weather] = await Promise.all([
    fetchDrivers(),
    fetchSessionStatus(),
    fetchRaceControl(),
    fetchLatestWeather()
  ]);

  const topDriver = drivers[0] || null;
  const performance = topDriver ? await fetchDriverPerformance(topDriver.driver_number) : null;

  return (
    <main className="min-h-screen bg-[#050706] text-white flex flex-col font-technical overflow-x-hidden">
      {/* HUD Header */}
      <header className="h-20 border-b border-white/10 flex items-center justify-between px-8 bg-black/60 backdrop-blur-xl z-30 sticky top-0">
        <div className="flex items-center gap-10">
          <div className="flex items-center gap-4">
            <div className="h-10 w-1 bg-[#e10600] glow-red" />
            <div>
              <div className="font-heading-f1 text-xl italic leading-none">MISSION_CONTROL</div>
              <div className="text-[8px] font-technical text-white/40 tracking-[0.5em] mt-1">SYSTEMS.STABLE</div>
            </div>
          </div>
          
          <div className="hidden lg:flex gap-8">
            <div className="flex flex-col">
              <span className="text-[7px] text-white/20 mb-1">LATITUDE</span>
              <span className="text-[10px] text-white/50">26.03° N</span>
            </div>
            <div className="flex flex-col">
              <span className="text-[7px] text-white/20 mb-1">LONGITUDE</span>
              <span className="text-[10px] text-white/50">50.51° E</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-12">
          <div className="flex flex-col items-end">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-1.5 h-1.5 rounded-full bg-[#00ffd5] animate-pulse" />
              <span className="text-[10px] font-heading-f1 italic text-white/80">{sessionStatus.name || "LIVE_SESSION"}</span>
            </div>
            <span className="text-[7px] text-white/20 tracking-[0.3em]">ENCRYPT_MODE: AES_256</span>
          </div>

          <div className="hud-border px-4 py-1.5 bg-white/5">
            <div className="text-[7px] text-white/30 text-right mb-0.5">FLAG_STATUS</div>
            <div className={`text-sm font-heading-f1 italic ${sessionStatus.status === 'RED' ? 'text-red-500' : 'text-[#00ffd5]'}`}>
              {sessionStatus.status}_FLAG
            </div>
          </div>
        </div>
      </header>

      {/* Main Tactical Grid */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 p-6 lg:p-10 relative">
        {/* Left Col: Leaderboard (HUD Sidebar) */}
        <aside className="lg:col-span-3 h-[calc(100vh-160px)] sticky top-28">
          <div className="hud-border h-full bg-black/40 overflow-hidden flex flex-col">
            <div className="p-4 border-b border-white/10 flex justify-between items-center bg-white/5">
              <span className="font-technical text-[9px] text-white/60">LIVE_TIMING</span>
              <span className="text-[7px] text-[#00ffd5]/60">INTERVAL: 0.5S</span>
            </div>
            <div className="flex-1 overflow-y-auto no-scrollbar">
              <LiveLeaderboard drivers={drivers} />
            </div>
          </div>
        </aside>

        {/* Center/Right: Data Analysis HUD */}
        <div className="lg:col-span-9 flex flex-col gap-6">
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
            {/* Primary Telemetry (Main Viewport) */}
            <div className="xl:col-span-8">
              <TelemetryDisplay 
                initialData={performance} 
                driverName={topDriver?.full_name || "UNKNOWN"} 
              />
            </div>

            {/* Weather & Environment */}
            <div className="xl:col-span-4">
              <WeatherHUDComponent data={weather} />
              <div className="mt-6 hud-glass p-4 h-[120px] flex flex-col justify-center">
                <div className="text-[7px] font-technical text-white/20 mb-2">SYSTEM.ENCRYPTED_COMMS</div>
                <div className="h-10 flex gap-1 items-end overflow-hidden">
                  {[40, 70, 45, 90, 65, 30, 85, 40, 50, 75, 95, 60, 40, 80, 55, 90, 70, 35, 60, 85, 45, 75, 50, 95].map((h, i) => (
                    <div 
                      key={i} 
                      className="bg-[#00ffd5]/40 w-1 rounded-t-sm" 
                      style={{ height: `${h}%` }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Row: Control & Messages */}
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 flex-1">
            <div className="xl:col-span-12">
              <RaceControlCenter 
                messages={raceControl} 
                sessionStatus={sessionStatus}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Aesthetic Overlays */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-px h-full bg-white/5 pointer-events-none hidden xl:block" />
      <div className="fixed top-1/2 left-0 -translate-y-1/2 h-px w-full bg-white/5 pointer-events-none hidden xl:block" />
    </main>
  );
}
