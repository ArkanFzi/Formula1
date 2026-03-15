import React from "react";
import Link from "next/link";
import { fetchDriverByNumber, fetchDriverStandings, fetchDriverPerformance, fetchDriverLaps } from "../../lib/f1";
import DriverCareerStats from "../../components/Analysis/DriverCareerStats";
import TelemetryDisplay from "../../components/RaceCenter/TelemetryDisplay";
import LapHistoryChart from "../../components/Analysis/LapHistoryChart";
import { FadeIn, SlideIn } from "../../components/Common/ClientMotion";

const BASE_URL = "https://api.openf1.org/v1";

export default async function DriverProfilePage({
  params,
}: {
  params: Promise<{ driverNumber: string }>;
}) {
  const { driverNumber } = await params;
  const num = parseInt(driverNumber);

  const [driver, standingsRes, performance, lapData, sessionResults] = await Promise.all([
    fetchDriverByNumber(num),
    fetchDriverStandings(),
    fetchDriverPerformance(num),
    fetchDriverLaps(num),
    fetch(`${BASE_URL}/session_result?session_key=latest`, { next: { revalidate: 300 } }).then(r => r.ok ? r.json() : [])
  ]);

  let standings = standingsRes;
  if (!standings || standings.length === 0) {
    // Fallback to a known session with standings if latest is empty
    const fallbackRes = await fetch(`${BASE_URL}/championship_drivers?session_key=9839`);
    if (fallbackRes.ok) standings = await fallbackRes.json();
  }

  const result = sessionResults.find((r: { driver_number: number }) => r.driver_number === num);
  const gridPosition = result?.grid_position || 'N/A';

  if (!driver) {
    return (
      <main className="min-h-screen bg-[#050706] text-white flex items-center justify-center p-8 font-technical">
        <div className="hud-glass p-12 text-center animate-pulse">
           <div className="text-[#e10600] text-4xl font-heading-f1 mb-4 italic">ERROR::DRIVER_NOT_FOUND</div>
           <div className="text-white/20 tracking-[0.5em] text-[10px]">FAILED_TO_LOCATE_HVT_UNIT_{driverNumber}</div>
        </div>
      </main>
    );
  }

  const standing = standings.find(s => s.driver_number === num) || null;
  const teamColor = `#${driver.team_colour || "e10600"}`;

  return (
    <main className="min-h-screen bg-[#050706] text-white overflow-x-hidden pt-0 selection:bg-[#e10600] selection:text-white">
      {/* ── CINEMATIC HERO SECTION ── */}
      <section className="relative h-screen w-full flex items-center overflow-hidden bg-black">
        {/* Background Driver Image */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/40 to-transparent z-10" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#050706] via-transparent to-transparent z-10" />
          <img
            src={driver.headshot_url.replace("/1col/", "/9col/")}
            alt={driver.full_name}
            className="absolute right-0 bottom-0 h-full w-auto object-contain object-right-bottom opacity-70 grayscale-[0.2] contrast-[1.1] saturate-[1.1]"
          />
        </div>

        {/* Hero Content */}
        <div className="relative z-20 max-w-[1400px] mx-auto w-full px-8 lg:px-24">
          <div className="flex flex-col gap-4 max-w-4xl">
             <Link href="/drivers" className="flex items-center gap-2 text-white/40 hover:text-white transition-colors mb-8 group">
                <div className="w-8 h-[1px] bg-white/20 group-hover:bg-[#e10600] transition-colors" />
                <span className="text-[10px] font-technical tracking-[0.4em] uppercase">BACK_TO_ROSTER</span>
             </Link>
             
             <SlideIn delay={0.3}>
                <div className="flex items-center gap-4">
                   <div className="w-1.5 h-12" style={{ backgroundColor: teamColor }} />
                   <div className="font-heading-f1 text-2xl italic text-white/60 tracking-widest">{driver.team_name}</div>
                </div>
             </SlideIn>

             <FadeIn delay={0.4}>
                <h1 className="text-5xl md:text-[7vw] font-heading-f1 italic font-900 leading-[0.85] uppercase tracking-tighter break-words">
                   {driver.full_name.split(' ')[0]} <br />
                   <span className="text-[#e10600]" style={{ filter: `drop-shadow(0 0 30px ${teamColor}44)` }}>{driver.full_name.split(' ').pop()}</span>
                </h1>
             </FadeIn>

             <FadeIn delay={0.8}>
                <div className="flex items-center gap-8 mt-12 pb-8 border-b border-white/5">
                   <div className="flex flex-col">
                      <span className="text-[10px] text-white/20 font-technical tracking-widest uppercase mb-1">Grid Position</span>
                      <span className="text-5xl font-heading-f1 italic leading-none">{gridPosition}</span>
                   </div>
                   <div className="w-[1px] h-12 bg-white/10" />
                   <div className="flex flex-col">
                      <span className="text-[10px] text-white/20 font-technical tracking-widest uppercase mb-1">Season Pos</span>
                      <span className="text-5xl font-heading-f1 italic leading-none text-[#00ffd5]">P{standing?.position_current || '??'}</span>
                   </div>
                   <div className="w-[1px] h-12 bg-white/10" />
                   <div className="flex flex-col">
                      <span className="text-[10px] text-white/20 font-technical tracking-widest uppercase mb-1">Points</span>
                      <span className="text-5xl font-heading-f1 italic leading-none text-white/80">{standing?.points_current || 0}</span>
                   </div>
                </div>
             </FadeIn>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 animate-bounce opacity-40">
           <span className="text-[9px] font-technical tracking-[0.5em] uppercase text-white">DEEP_ANALYSIS</span>
           <div className="w-[1px] h-12 bg-gradient-to-b from-white to-transparent" />
        </div>
      </section>

      {/* ── TECHNICAL ANALYSIS SECTION ── */}
      <section className="relative bg-[#050706] py-32 px-8 lg:px-24">
        <div className="max-w-[1400px] mx-auto w-full">
           <div className="flex flex-col mb-20">
              <div className="flex items-center gap-4 mb-4">
                 <div className="h-px w-12 bg-[#e10600]" />
                 <span className="text-[10px] font-technical text-[#e10600] tracking-[0.5em]">SYSTEM_IDENTITY.PERFORMANCE_INTELLIGENCE</span>
              </div>
              <h2 className="text-4xl md:text-6xl font-heading-f1 italic uppercase tracking-tighter">
                 Technical <span className="text-[#e10600]">Data_Metrics</span>
              </h2>
           </div>

           <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
              <div className="lg:col-span-12 xl:col-span-4 space-y-12">
                 <DriverCareerStats driver={driver} standing={standing} />
                 
                 <div className="hud-glass p-8 space-y-6">
                    <h3 className="font-heading-f1 italic text-xl tracking-widest text-[#00ffd5]">BIO_TELEMETRY</h3>
                    <div className="space-y-4 text-[10px] font-technical text-white/40 uppercase tracking-widest">
                       <div className="flex justify-between border-b border-white/5 pb-2">
                          <span>Status</span>
                          <span className="text-emerald-500">OPTIMAL</span>
                       </div>
                       <div className="flex justify-between border-b border-white/5 pb-2">
                          <span>Heart Rate</span>
                          <span>162 BPM</span>
                       </div>
                       <div className="flex justify-between border-b border-white/5 pb-2">
                          <span>Oxygen Level</span>
                          <span>98%</span>
                       </div>
                    </div>
                 </div>
              </div>

              <div className="lg:col-span-12 xl:col-span-8 flex flex-col gap-12">
                 <div className="space-y-4">
                    <div className="flex items-center justify-between">
                       <h3 className="font-heading-f1 italic text-2xl text-white/40 tracking-widest uppercase">Live_Telemetry_Feed</h3>
                       <div className="text-[9px] font-technical text-[#00ffd5] animate-pulse">STREAMING_REALTIME_DATA</div>
                    </div>
                    <TelemetryDisplay initialData={performance} driverName={driver.name_acronym} />
                 </div>

                 <div className="space-y-4">
                    <div className="flex items-center justify-between">
                       <h3 className="font-heading-f1 italic text-2xl text-white/40 tracking-widest uppercase">Historical_Lap_Trace</h3>
                       <div className="text-[9px] font-technical text-white/20">TOTAL_LAPS_PROCESSED: {lapData.length}</div>
                    </div>
                    <LapHistoryChart lapData={lapData} drivers={[driver]} />
                 </div>
              </div>
           </div>
        </div>
      </section>

      {/* Aesthetic Footer Decor */}
      <div className="w-full bg-black py-12 px-8 flex justify-between items-center border-t border-white/5 opacity-30 pointer-events-none">
        <span className="text-[8px] font-technical tracking-widest">DS.HVT_UNIT.ANALYSIS.v5.0</span>
        <span className="text-[8px] font-technical tracking-widest">SENSITIVE_DATA_PROTOCOL::ACTIVE</span>
      </div>
    </main>
  );
}
