import { Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { fetchDriverByNumber, fetchLatestLap, getHDImage } from "../../lib/f1";
import DriverProfileClient from "./DriverProfileClient";

// ── Sub-component for Dynamic Telemetry ──
async function DriverTelemetry({ driverNum }: { driverNum: number }) {
  const { fetchDriverPerformance } = await import("../../lib/f1");
  const [performance] = await Promise.all([fetchDriverPerformance(driverNum)]);

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
        <DriverProfileClient
          driver={driver}
          latestLap={latestLap}
          driverNum={driverNum}
        >
          {/* Telemetry streaming section */}
          <Suspense fallback={<TelemetrySkeleton />}>
            <DriverTelemetry driverNum={driverNum} />
          </Suspense>

          {/* The main image, passed as named slot via children access */}
          <Image
            src={getHDImage(driver.headshot_url)}
            alt={driver.full_name}
            fill
            className="object-cover transform scale-110 group-hover:scale-[1.15] transition-transform duration-700 grayscale group-hover:grayscale-0 opacity-80 group-hover:opacity-100"
            sizes="(max-width: 768px) 100vw, 40vw"
          />
        </DriverProfileClient>
      </div>
    </main>
  );
}
