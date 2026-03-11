"use client";

import AnimatedSection from "./AnimatedSection";

type Standing = {
  team_name: string;
  position_current: number;
  points_current: number;
};

function getTeamCode(name: string): string {
  if (!name) return "???";
  const words = name.trim().split(/\s+/);
  if (words.length === 1) return words[0].slice(0, 3).toUpperCase();
  if (words.length === 2) return (words[0].slice(0, 2) + words[1][0]).toUpperCase();
  return words.slice(0, 3).map((w) => w[0]).join("").toUpperCase();
}

export default function TeamStandingsClient({
  standings,
  colorMap,
}: {
  standings: Standing[];
  colorMap: Record<string, string>;
}) {
  const maxPoints = standings[0]?.points_current || 1;
  const leader = standings[0];
  const leaderColor = colorMap[leader?.team_name] ?? "#e10600";
  const leaderCode = getTeamCode(leader?.team_name);

  return (
    <div className="relative w-full">
      {/* Header */}
      <AnimatedSection variant="fade-up" delay={0}>
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <div className="w-[3px] h-6 bg-[#e10600]" />
            <span className="text-xs font-mono font-bold uppercase tracking-[0.5em] text-white/40">
              Constructors
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-[1px] w-8 bg-white/10" />
            <span className="text-[10px] font-mono text-white/15 uppercase tracking-widest">WCC</span>
          </div>
        </div>
      </AnimatedSection>

      {/* Leader card */}
      {leader && (
        <AnimatedSection variant="fade-up" delay={0.1}>
          <div
            className="relative mb-3 p-5 overflow-hidden"
            style={{ background: `linear-gradient(135deg, ${leaderColor}18 0%, ${leaderColor}06 50%, transparent 100%)` }}
          >
            <div
              className="absolute top-0 right-0 w-28 h-28 opacity-10 pointer-events-none"
              style={{ background: `radial-gradient(circle at top right, ${leaderColor}, transparent 70%)` }}
            />
            <div className="absolute bottom-0 left-0 right-0 h-[1px]" style={{ background: `linear-gradient(90deg, ${leaderColor}60, transparent)` }} />
            <div className="absolute left-0 top-0 bottom-0 w-[3px]" style={{ background: leaderColor }} />

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-5">
                <div className="flex flex-col items-center">
                  <span className="font-mono text-[10px] text-white/30 uppercase tracking-widest leading-none mb-1">POS</span>
                  <span className="font-mono text-4xl font-black leading-none" style={{ color: leaderColor }}>1</span>
                </div>
                <div className="w-[1px] h-12 bg-white/10" />
                <div>
                  <div
                    className="inline-flex items-center px-2.5 py-1 mb-2 rounded-[2px]"
                    style={{ background: `${leaderColor}20`, border: `1px solid ${leaderColor}40` }}
                  >
                    <span className="font-mono text-xs font-black tracking-widest" style={{ color: leaderColor }}>{leaderCode}</span>
                  </div>
                  <h4 className="text-base font-black uppercase tracking-tight text-white leading-none">
                    {leader.team_name}
                  </h4>
                </div>
              </div>
              <div className="text-right">
                <span className="font-mono text-[10px] text-white/20 uppercase tracking-widest block mb-1">Points</span>
                <span className="font-mono text-4xl font-black leading-none" style={{ color: leaderColor }}>
                  {leader.points_current}
                </span>
              </div>
            </div>

            <div className="mt-4 h-[2px] w-full overflow-hidden" style={{ background: "rgba(255,255,255,0.05)" }}>
              <div className="h-full w-full" style={{ background: `linear-gradient(90deg, ${leaderColor}40, ${leaderColor})` }} />
            </div>
          </div>
        </AnimatedSection>
      )}

      {/* Rows P2–P10 */}
      <div className="flex flex-col">
        {standings.slice(1, 10).map((standing, idx) => {
          const color = colorMap[standing.team_name] ?? "#e10600";
          const code = getTeamCode(standing.team_name);
          const percentage = (standing.points_current / maxPoints) * 100;
          const gap = standings[0].points_current - standing.points_current;
          const isEven = idx % 2 === 0;

          return (
            <AnimatedSection
              key={`${standing.team_name}-${idx}`}
              variant="slide-left"
              delay={0.15 + idx * 0.07}
            >
              <div
                className="group relative flex items-center gap-4 py-3 px-4 overflow-hidden transition-all duration-150"
                style={{ background: isEven ? "rgba(255,255,255,0.015)" : "transparent" }}
              >
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                  style={{ background: `linear-gradient(90deg, ${color}0D 0%, transparent 60%)` }}
                />
                <div
                  className="absolute left-0 top-[20%] bottom-[20%] w-[2px] opacity-0 group-hover:opacity-100 transition-all duration-200 rounded-full"
                  style={{ background: color }}
                />

                {/* Position */}
                <div className="relative z-10 w-6 flex-shrink-0 text-right">
                  <span className="font-mono text-xs text-white/25 group-hover:text-white/50 transition-colors">
                    {String(standing.position_current).padStart(2, "0")}
                  </span>
                </div>

                {/* Code badge */}
                <div
                  className="relative z-10 flex-shrink-0 w-10 flex items-center justify-center py-1 rounded-[2px] transition-all duration-200 group-hover:scale-105"
                  style={{ background: `${color}15`, border: `1px solid ${color}25` }}
                >
                  <span className="font-mono text-[10px] font-black" style={{ color: `${color}CC` }}>
                    {code}
                  </span>
                </div>

                {/* Name + bar */}
                <div className="relative z-10 flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-sm font-bold uppercase tracking-tight text-white/60 group-hover:text-white/90 transition-colors truncate leading-none">
                      {standing.team_name}
                    </span>
                    <span className="font-mono text-sm font-bold text-white/45 group-hover:text-white/75 transition-colors leading-none ml-3 flex-shrink-0">
                      {standing.points_current}
                    </span>
                  </div>
                  <div className="relative h-[1px] w-full overflow-hidden" style={{ background: "rgba(255,255,255,0.05)" }}>
                    <div
                      className="absolute inset-y-0 left-0"
                      style={{ width: `${percentage}%`, background: `${color}55` }}
                    />
                  </div>
                </div>

                {/* Gap */}
                <div className="relative z-10 flex-shrink-0 w-12 text-right">
                  <span className="font-mono text-[10px] text-white/15 group-hover:text-white/30 transition-colors">
                    -{gap}
                  </span>
                </div>
              </div>
            </AnimatedSection>
          );
        })}
      </div>
    </div>
  );
}