import { Suspense } from "react";
import Link from "next/link";
import { fetchDriverByNumber, fetchDriverPerformance, fetchLatestLap } from "../../lib/f1";

// ── Sub-component for Dynamic Telemetry ──
async function DriverTelemetry({ driverNum }: { driverNum: number }) {
  const [performance] = await Promise.all([
    fetchDriverPerformance(driverNum),
  ]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
      <div className="bg-white/[0.02] border border-white/5 p-8 lg:skew-x-[-6deg] hover:bg-white/[0.04] transition-colors relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-12 h-12 border-b border-l border-white/10 bg-white/5" />
        <div className="lg:skew-x-[6deg]">
          <h4 className="text-[10px] font-black uppercase tracking-widest text-white/30 mb-6 flex items-center gap-2">
            <div className="w-1 h-3 bg-[#e10600]" /> TELEMETRY snapshot
          </h4>
          <div className="flex items-baseline gap-2 mb-2">
            <span className="text-4xl font-[family-name:var(--font-barlow)] font-900 italic text-white group-hover:text-[#e10600] transition-colors">
              {performance?.speed || "---"}
            </span>
            <span className="text-xs font-bold text-white/20 uppercase">KM/H</span>
          </div>
          <p className="text-[9px] font-mono text-white/20 uppercase tracking-widest">UNIT.MAX_VELOCITY</p>
        </div>
      </div>

      <div className="bg-white/[0.02] border border-white/5 p-8 lg:skew-x-[-6deg] hover:bg-white/[0.04] transition-colors relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-12 h-12 border-b border-l border-white/10 bg-white/5" />
        <div className="lg:skew-x-[6deg]">
          <h4 className="text-[10px] font-black uppercase tracking-widest text-white/30 mb-6 flex items-center gap-2">
            <div className="w-1 h-3 bg-[#e10600]" /> DRIVE_TRAIN METRICS
          </h4>
          <div className="flex items-baseline gap-2 mb-2">
            <span className="text-4xl font-[family-name:var(--font-barlow)] font-900 italic text-white group-hover:text-[#e10600] transition-colors">
              {performance ? `G${performance.n_gear}` : "N/A"}
            </span>
            <span className="text-xs font-bold text-white/20 uppercase">GEAR</span>
          </div>
          <p className="text-[9px] font-mono text-white/20 uppercase tracking-widest">UNIT.ACTIVE_RATIO</p>
        </div>
      </div>
    </div>
  );
}

function TelemetrySkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16 animate-pulse">
      {[1, 2].map((i) => (
        <div key={i} className="bg-white/5 border border-white/5 p-8 lg:skew-x-[-6deg] h-32 flex flex-col justify-center">
          <div className="w-24 h-2 bg-white/10 mb-4" />
          <div className="w-16 h-8 bg-white/10" />
        </div>
      ))}
    </div>
  );
}

// ── Main Page Component ──
export default async function DriverProfilePage({
  params,
}: {
  params: Promise<{ driverNumber: string }>;
}) {
  const { driverNumber } = await params;
  const driverNum = parseInt(driverNumber);

  if (isNaN(driverNum)) {
    return (
      <div className="min-h-screen bg-[#050706] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-black text-white/20 mb-4 tracking-tighter uppercase italic">Invalid ID</h1>
          <Link href="/drivers" className="text-[#e10600] uppercase font-bold tracking-widest hover:underline">
            ← Return to Roster
          </Link>
        </div>
      </div>
    );
  }

  // Fetch only essential driver info for the layout shell
  const [driver, latestLap] = await Promise.all([
    fetchDriverByNumber(driverNum),
    fetchLatestLap(driverNum),
  ]);

  if (!driver) {
    return (
      <div className="min-h-screen bg-[#050706] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-black text-white/20 mb-4 tracking-tighter uppercase italic">Driver Not Found</h1>
          <Link href="/drivers" className="text-[#e10600] uppercase font-bold tracking-widest hover:underline">
            ← Return to Roster
          </Link>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#050706] text-white overflow-hidden relative">
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundSize: '40px 40px', backgroundImage: 'linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)' }} />
      <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-[#e10600]/5 to-transparent pointer-events-none" />

      <div className="relative z-10 px-8 lg:px-24 py-8">
        <Link href="/drivers" className="text-[10px] font-black uppercase tracking-[0.3em] text-white/30 hover:text-white transition-colors">
          {"// DATABASE.DRIVERS"} <span className="text-[#e10600]">/</span> {driver.full_name}
        </Link>
      </div>

      <div className="max-w-[1600px] mx-auto px-8 lg:px-24 py-12 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
          <div className="lg:col-span-5 relative">
            <div className="relative aspect-[4/5] bg-white/5 border border-white/10 lg:skew-x-[-4deg] overflow-hidden group">
              <div className="absolute inset-0 z-20 pointer-events-none opacity-[0.05] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%]" />
              <img 
                src={driver.headshot_url} 
                alt={driver.full_name}
                className="w-full h-full object-cover transform scale-110 group-hover:scale-115 transition-transform duration-700 grayscale group-hover:grayscale-0 opacity-80 group-hover:opacity-100"
              />
              <div className="absolute -bottom-8 -left-8 text-[8rem] font- black italic text-white/[0.03] select-none leading-none rotate-[-90deg] origin-top-left uppercase">
                {driver.team_name}
              </div>
              <div 
                className="absolute bottom-0 left-0 w-full h-2 z-30 shadow-[0_-10px_30px_rgba(0,0,0,0.5)]"
                style={{ backgroundColor: `#${driver.team_colour}` }}
              />
            </div>

            <div className="grid grid-cols-3 gap-4 mt-8 lg:skew-x-[-4deg]">
              <div className="bg-white/5 border border-white/5 p-4 transition-colors hover:bg-white/10">
                <p className="text-[8px] font-black text-white/20 uppercase tracking-widest mb-1">Status</p>
                <div className="flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-xs font-black uppercase tracking-tighter">Active</span>
                </div>
              </div>
              <div className="bg-white/5 border border-white/5 p-4 transition-colors hover:bg-white/10 text-center">
                <p className="text-[8px] font-black text-white/20 uppercase tracking-widest mb-1">Unit ID</p>
                <span className="text-xs font-black uppercase tracking-tighter font-mono">DRV.{driver.driver_number}</span>
              </div>
              <div className="bg-white/5 border border-white/5 p-4 transition-colors hover:bg-white/10 text-right">
                <p className="text-[8px] font-black text-white/20 uppercase tracking-widest mb-1">Session</p>
                <span className="text-xs font-black uppercase tracking-tighter font-mono text-[#e10600]">
                  {latestLap ? `LAP.${latestLap.lap_number}` : "LIVE.F1"}
                </span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7">
            <div className="mb-16">
              <div className="flex items-center gap-4 mb-4">
                <span className="text-[10px] font-black uppercase tracking-[0.5em] text-[#e10600] font-[family-name:var(--font-space)]">
                  {"// EXECUTIVE_DOSSIER.V4"}
                </span>
                <div className="h-[1px] flex-1 bg-white/5" />
              </div>
              
              <div className="flex items-center justify-between gap-8 mb-6">
                <div>
                  <h1 className="text-5xl md:text-8xl font-[family-name:var(--font-barlow)] font-900 italic uppercase leading-[0.8] tracking-tighter mb-2">
                    {driver.full_name.split(' ').slice(0, -1).join(' ')} <br/>
                    <span className="text-[#e10600]">{driver.full_name.split(' ').pop()}</span>
                  </h1>
                  <h2 className="text-xl md:text-2xl font-[family-name:var(--font-barlow)] font-700 italic text-white/40 uppercase tracking-tight">
                    {driver.team_name}
                  </h2>
                </div>
                <div className="text-[8rem] font-[family-name:var(--font-barlow)] font-900 italic text-white/[0.05] leading-none select-none">
                  {driver.driver_number}
                </div>
              </div>
            </div>

            {/* Sub-section with Suspense for telemetry data */}
            <Suspense fallback={<TelemetrySkeleton />}>
              <DriverTelemetry driverNum={driverNum} />
            </Suspense>

            <div className="bg-white/[0.01] border border-white/5 p-10 relative overflow-hidden">
              {/* Corner brackets */}
              <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-[#e10600]/40" />
              <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-white/10" />
              <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-white/10" />
              <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-white/10" />

              <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-white/30 mb-10 flex items-center justify-between">
                <span>{"// BIOMETRIC.PROFILE_IDENTIFICATION"}</span>
                <span className="font-mono text-emerald-500/50">SECURE_LINK.v3.1</span>
              </h4>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-12">
                {[
                  { label: "Country", value: "INTL.UNIT" },
                  { label: "Age", value: "CAT.SENIOR" },
                  { label: "Points", value: "DB.LATEST" },
                  { label: "Gear", value: "TRANS.v8" }
                ].map((stat, i) => (
                  <div key={i}>
                    <p className="text-[9px] font-bold text-white/20 uppercase tracking-widest mb-3">{stat.label}</p>
                    <p className="text-lg font-[family-name:var(--font-barlow)] font-900 italic uppercase italic text-white/80">{stat.value}</p>
                  </div>
                ))}
              </div>

              <div className="mt-12 pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between gap-8">
                <div className="max-w-md">
                   <p className="text-[10px] font-black uppercase tracking-widest text-[#e10600] mb-3 font-[family-name:var(--font-space)]">Unit Objective</p>
                   <p className="text-sm text-white/40 italic leading-relaxed tracking-tight font-medium">
                     This unit is currently engaged in high-performance competitive operations for {driver.team_name}. Strategic objectives include championship point accumulation and technical car development.
                   </p>
                </div>
                <div className="flex flex-col justify-end">
                   <p className="text-[10px] font-black uppercase tracking-widest text-white/20 mb-3 text-right">Data Integrity Status</p>
                   <div className="flex items-center gap-2 justify-end">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_10px_#10b981]" />
                      <span className="text-[10px] font-black uppercase tracking-widest text-emerald-500">Verified.LIVE</span>
                   </div>
                </div>
              </div>
            </div>

            <div className="mt-16 flex justify-between items-center opacity-20 select-none">
                <span className="text-[8px] font-mono tracking-widest uppercase">system_auth: hash_8b2f902c</span>
                <span className="text-[8px] font-mono tracking-widest uppercase">unit_enc: hash_x9{driver.driver_number}</span>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
