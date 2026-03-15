import { getTeamStandings } from "../../lib/api";

type TeamStandingItem = {
  team_name: string;
  position_current: number;
  points_current: number;
};

export default async function TeamStandings() {
<<<<<<< Updated upstream
  let standings = await getTeamStandings("latest");
  
  if (!standings || standings.length === 0) {
    standings = await getTeamStandings(9165);
    if (!standings || standings.length === 0) {
      return (
        <div className="bg-white/5 border border-white/10 rounded-xl p-8 text-center text-white/30 font-[family-name:var(--font-space)] uppercase tracking-widest text-[10px]">
          [ CONSTRUCTORS.UNAVAILABLE ]
        </div>
      );
    }
  }
=======
  const [latestStandings, teamColors] = await Promise.all([
    getTeamStandings("latest"),
    fetchTeamColors(),
  ]);

  const standings =
    latestStandings && latestStandings.length > 0
      ? latestStandings
      : await getTeamStandings(9839);
>>>>>>> Stashed changes

  const maxPoints = standings[0]?.points_current || 1;

  return (
    <div className="flex flex-col gap-4 w-full">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-[10px] font-black uppercase tracking-[0.5em] text-[#e10600] font-[family-name:var(--font-space)]">
          {"// CONSTRUCTOR.ENGINE_UNIT"}
        </h3>
        <span className="text-[8px] font-mono text-white/20 uppercase tracking-tighter italic">SYS.META.CLASSIFIED</span>
      </div>

      <div className="flex flex-col gap-3">
        {standings.slice(0, 10).map((standing: TeamStandingItem, idx: number) => {
          const percentage = (standing.points_current / maxPoints) * 100;
          return (
            <div 
              key={`${standing.team_name ?? 'team'}-${idx}`} 
              className="group relative bg-black/40 border border-white/5 hover:border-white/20 transition-all duration-300 p-4 lg:skew-x-[-12deg] overflow-hidden"
            >
              <div className="flex items-center justify-between relative z-10 lg:skew-x-[12deg]">
                <div className="flex items-center gap-4">
                  <span className="text-xl font-[family-name:var(--font-barlow)] font-900 italic text-white/20 group-hover:text-[#e10600] transition-colors">
                    {standing.position_current}
                  </span>
                  <h4 className="text-sm font-[family-name:var(--font-barlow)] font-800 italic uppercase tracking-tighter">
                    {standing.team_name}
                  </h4>
                </div>
                <span className="text-lg font-[family-name:var(--font-barlow)] font-900 italic text-[#e10600]">
                  {standing.points_current}
                </span>
              </div>

              {/* Technical Power Bar */}
              <div className="mt-2 h-1 bg-white/5 w-full relative overflow-hidden">
                <div 
                  className="absolute top-0 left-0 h-full bg-white/20 group-hover:bg-[#e10600] transition-all duration-500"
                  style={{ width: `${percentage}%` }}
                />
              </div>

              {/* Accent Corner */}
              <div className="absolute top-0 right-0 w-8 h-8 bg-white/5 lg:skew-x-[45deg] translate-x-4 -translate-y-4" />
            </div>
          );
        })}
      </div>
    </div>
  );
}
