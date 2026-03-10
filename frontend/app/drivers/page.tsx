import DriverHeroSlider from "../components/Page/DriverHeroSlider";
import DriverCard from "../components/Page/DriverCard";
import { fetchDrivers, fetchDriverStandings } from "../lib/f1";

export default async function DriversPage() {
  const [drivers, standings] = await Promise.all([
    fetchDrivers(),
    fetchDriverStandings()
  ]);

  return (
    <main className="min-h-screen bg-[#050706] text-white overflow-x-hidden">
      {/* ── Timed Cards Hero Slider ── */}
      <section className="w-full">
        <DriverHeroSlider drivers={drivers} standings={standings} />
      </section>

      {/* ── Technical Roster Section ── */}
      <section className="relative px-8 lg:px-24 py-32 overflow-hidden">
        {/* Decorative Grid & Lines */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundSize: '40px 40px', backgroundImage: 'linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)' }} />
        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent" />
        <div className="absolute left-[8%] top-0 w-[1px] h-full bg-white/5" />

        <div className="max-w-[1500px] mx-auto relative z-10">
          <div className="flex flex-col lg:flex-row justify-between items-end mb-24 gap-8">
            <div className="max-w-2xl">
              <h3 className="text-[10px] font-black uppercase tracking-[0.5em] text-[#e10600] mb-4 font-[family-name:var(--font-space)]">
                {"// ROSTER.UNIT_IDENTIFICATION"}
              </h3>
              <h2 className="text-5xl md:text-8xl font-[family-name:var(--font-barlow)] font-900 italic uppercase tracking-tighter leading-[0.8] mb-6">
                2025 <br/> <span className="text-[#e10600]">Roster</span>
              </h2>
              <p className="text-white/40 text-sm md:text-lg font-medium tracking-tight max-w-lg italic">
                The absolute pinnacle of motorsport. 20 seats, one championship.
              </p>
            </div>
            <div className="text-right hidden sm:block">
              <p className="text-[10px] font-black uppercase tracking-widest text-white/20 mb-2 font-[family-name:var(--font-space)]">Broadcast Feed Status</p>
              <div className="flex items-center gap-2 justify-end">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-xs font-bold uppercase tracking-widest text-emerald-500/80">Active Stream</span>
              </div>
            </div>
          </div>

          {/* Asymmetrical Asymmetric Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-12">
            {drivers.map((driver, index) => {
              // Create an asymmetrical feel by making some cards span more columns
              const spanClass = index % 5 === 0 ? "lg:col-span-4" : 
                                index % 5 === 1 ? "lg:col-span-5" :
                                index % 5 === 2 ? "lg:col-span-3" :
                                index % 5 === 3 ? "lg:col-span-6" : "lg:col-span-6";
              
              const standing = standings.find(s => s.driver_number === driver.driver_number);

              return (
                <div key={driver.driver_number} className={spanClass}>
                  <DriverCard 
                    driver={driver} 
                    position={standing?.position_current}
                  />
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer Technical ID */}
        <div className="mt-32 border-t border-white/5 pt-8 flex justify-between items-center opacity-30 select-none">
          <span className="text-[9px] font-mono tracking-widest">DS.SYSTEM.CORE.v4.0.1</span>
          <span className="text-[9px] font-mono tracking-widest">AUTH.UNIT.ENCRYPT</span>
        </div>
      </section>
    </main>
  );
}
