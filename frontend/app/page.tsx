import { Suspense } from "react";
import HeroSection from "./components/Page/HeroSection";
import SessionResults from "./components/SessionResults";
import DriverStandings from "./components/DriverStandings";
import TeamStandings from "./components/TeamStandings";
import AnimatedSection from "./components/AnimatedSection";
import { getCompletedRounds } from "../lib/api";

function LoadingSkeleton({ title }: { title: string }) {
  return (
    <div className="bg-white/5 border border-white/10 p-12 lg:skew-x-[-12deg] flex flex-col items-center justify-center min-h-[400px] animate-pulse">
      <div className="text-[10px] font-black uppercase tracking-[0.5em] text-white/20 mb-4 font-[family-name:var(--font-space)]">
        {`// LOADING.${title}`}
      </div>
      <div className="w-12 h-1 bg-white/10" />
    </div>
  );
}

export default async function Home() {
  const { completed, total } = await getCompletedRounds(2025);

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
          <AnimatedSection variant="fade-up" className="mb-20">
            <div className="relative flex flex-col lg:flex-row justify-between items-end gap-8">

              {/* Left — main title block */}
              <div className="max-w-2xl">
                <div className="flex items-center gap-3 mb-6">
                  <div className="flex gap-1 items-center">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#e10600] animate-pulse" />
                    <div className="w-1.5 h-1.5 rounded-full bg-[#e10600]/40" />
                    <div className="w-1.5 h-1.5 rounded-full bg-[#e10600]/20" />
                  </div>
                  <span className="text-[10px] font-mono font-black uppercase tracking-[0.5em] text-[#e10600]/70">
                    Championship.Command_Center
                  </span>
                </div>

                <h2 className="font-[family-name:var(--font-barlow)] font-900 italic uppercase leading-[0.85] tracking-tighter mb-6">
                  <span className="block text-5xl md:text-7xl text-white/90">Championship</span>
                  <span className="block text-5xl md:text-7xl text-[#e10600] relative">
                    Standings
                    <span className="absolute -bottom-2 left-0 w-full h-[2px] bg-gradient-to-r from-[#e10600] via-[#e10600]/40 to-transparent" />
                  </span>
                </h2>

                <p className="text-white/35 text-sm md:text-base font-medium tracking-tight max-w-md leading-relaxed">
                  Real-time points distribution across the grid. The battle for the ultimate crown.
                </p>
              </div>

              {/* Right — live stats strip */}
              <div className="flex flex-row lg:flex-col gap-6 lg:gap-3 lg:items-end">
                <div className="flex flex-col items-end">
                  <span className="text-[8px] font-mono text-white/20 uppercase tracking-[0.4em] mb-1">Season</span>
                  <span className="font-[family-name:var(--font-barlow)] text-3xl font-900 italic text-white/15 leading-none">
                    2025
                  </span>
                </div>

                <div className="hidden lg:block h-[1px] w-16 bg-white/10 self-end" />

                {/* Rounds — from API via getCompletedRounds */}
                <div className="flex flex-col items-end">
                  <span className="text-[8px] font-mono text-white/20 uppercase tracking-[0.4em] mb-1">
                    Rounds {completed}/{total}
                  </span>
                  <div className="flex gap-[3px] flex-wrap justify-end max-w-[120px]">
                    {Array.from({ length: total }).map((_, i) => (
                      <div
                        key={i}
                        className="w-1.5 h-3 rounded-[1px]"
                        style={{
                          background: i < completed ? "#e10600" : "rgba(255,255,255,0.08)",
                        }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom separator */}
            <div className="mt-10 flex items-center gap-4">
              <div className="h-[1px] flex-1 bg-gradient-to-r from-[#e10600]/40 via-white/5 to-transparent" />
              <span className="text-[8px] font-mono text-white/15 uppercase tracking-widest flex-shrink-0">
                WDC · WCC
              </span>
            </div>
          </AnimatedSection>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
            <div className="lg:col-span-7">
              <Suspense fallback={<LoadingSkeleton title="DRIVER_STANDINGS" />}>
                <DriverStandings />
              </Suspense>
            </div>
            <div className="lg:col-span-5">
              <Suspense fallback={<LoadingSkeleton title="TEAM_STANDINGS" />}>
                <TeamStandings />
              </Suspense>
            </div>
          </div>
        </div>
      </section>

      <AnimatedSection variant="fade-up">
        <Suspense
          fallback={
            <section className="px-8 lg:px-24 py-32 bg-[#050706] text-center">
              <div className="text-[10px] font-black uppercase tracking-[0.5em] text-white/10 animate-pulse">
                {"// STREAMING.SESSION_RESULTS"}
              </div>
            </section>
          }
        >
          <SessionResults />
        </Suspense>
      </AnimatedSection>
    </main>
  );
}