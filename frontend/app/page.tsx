import HeroSection from "./components/Page/HeroSection";
import SessionResults from "./components/SessionResults";
import DriverStandings from "./components/DriverStandings";
import TeamStandings from "./components/TeamStandings";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col bg-[#0a0f0c] text-white">
      <HeroSection />
      
      
      {/* Championship Command Center */}
      <section className="relative px-8 lg:px-24 py-32 bg-[#050706] overflow-hidden">
        {/* Technical Deco */}
        <div className="absolute top-0 right-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent" />
        <div className="absolute bottom-0 right-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/5 to-transparent" />
        <div className="absolute left-[15%] top-0 w-[1px] h-full bg-white/5 hidden lg:block" />

        <div className="max-w-[1400px] mx-auto relative z-10">
          <div className="flex flex-col lg:flex-row justify-between items-end mb-20 gap-8">
            <div className="max-w-2xl">
              <h3 className="text-[10px] font-black uppercase tracking-[0.5em] text-[#e10600] mb-4 font-[family-name:var(--font-space)]">
                {"// CHAMPIONSHIP.COMMAND_CENTER"}
              </h3>
              <h2 className="text-5xl md:text-7xl font-[family-name:var(--font-barlow)] font-900 italic uppercase tracking-tighter leading-[0.85] mb-6">
                Championship <br/> <span className="text-[#e10600]">Standings</span>
              </h2>
              <p className="text-white/40 text-sm md:text-lg font-medium tracking-tight max-w-lg">
                The battle for the ultimate crown. Real-time points distribution across the grid.
              </p>
            </div>
            <div className="hidden lg:block text-right">
              <p className="text-[10px] font-black uppercase tracking-widest text-white/20 mb-2 font-[family-name:var(--font-space)]">Data Stream Status</p>
              <div className="flex items-center gap-2 justify-end">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-xs font-bold uppercase tracking-widest text-emerald-500/80">Active</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
            <div className="lg:col-span-7">
              <DriverStandings />
            </div>
            <div className="lg:col-span-5">
              <TeamStandings />
            </div>
          </div>
        </div>
      </section>
      <SessionResults />
    </main>
  );
}
