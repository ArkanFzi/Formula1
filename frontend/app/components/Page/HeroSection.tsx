import HeroCarousel from "./HeroCarousel";
import { fetchDrivers } from "../../lib/f1";
import RaceControlTicker from "./RaceControlTicker";

export default async function HeroSection() {
  const drivers = await fetchDrivers();

  return (
    <section className="relative bg-[#0C0C0C] text-white pb-20 overflow-hidden">
      {/* Race Control Ticker at the absolute top */}
      <div className="relative z-30">
        <RaceControlTicker />
      </div>

      {/* Background radial glow for brightness */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.03)_0%,transparent_70%)]" />
      </div>

      <div className="max-w-[1400px] mx-auto relative">
        {/* Header */}
        <div className="relative z-10 flex flex-col items-center text-center pt-24 pb-16 px-4">
          <p className="text-[11px] font-[family-name:var(--font-space)] tracking-[0.4em] uppercase text-[#e10600] font-bold mb-6 animate-pulse">
            {`// SEASON 2025 · DATA STREAM`}
          </p>
          <h1 className="text-5xl sm:text-6xl md:text-[5.5rem] text-[#e10600] drop-shadow-[0_0_15px_rgba(225,6,0,0.4)] font-[family-name:var(--font-barlow)] font-[900] uppercase tracking-[-0.04em] italic leading-[0.85] mb-2">
            <span className="text-white">F1 </span>
            <span className="text-[#e10600] drop-shadow-[0_0_15px_rgba(225,6,0,0.4)]">
              PERFORMANCE
            </span>
          </h1>
          <div className="flex items-center gap-3 mt-8">
            <div className="h-[1px] w-8 bg-white/20" />
            <p className="text-white/40 text-[10px] font-[family-name:var(--font-space)] uppercase tracking-[0.2em]">
              {drivers.length > 0 ? `${drivers.length} ACTIVE DRIVERS` : "LOADING ROSTER"}
            </p>
            <div className="h-[1px] w-8 bg-white/20" />
          </div>
        </div>
      </div>

      {/* Client carousel receives the server-fetched data */}
      <HeroCarousel drivers={drivers} />
    </section>
  );
}
