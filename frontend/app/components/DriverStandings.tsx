import { getDriverStandings, getDrivers } from "../../lib/api";
import { OpenF1Driver } from "../types/f1";

type DriverStandingItem = {
  driver_number: number;
  position_current: number;
  points_current: number;
};

export default async function DriverStandings() {
  let standings = await getDriverStandings("latest");
  
  if (!standings || standings.length === 0) {
    standings = await getDriverStandings(9165); 
    if (!standings || standings.length === 0) {
      return (
        <div className="bg-white/5 border border-white/10 rounded-xl p-8 text-center text-white/30 font-[family-name:var(--font-space)] uppercase tracking-widest text-[10px]">
          [ STANDINGS.UNAVAILABLE ]
        </div>
      );
    }
  }

  let drivers = await getDrivers("latest");
  if (!drivers || drivers.length === 0) {
    drivers = await getDrivers(9165);
  }

  const enrichedStandings = standings.slice(0, 10).map((standing: DriverStandingItem) => {
    const driver = drivers.find((d: { driver_number: number }) => d.driver_number === standing.driver_number);
    return { ...standing, driver };
  });

  return (
    <div className="flex flex-col gap-4 w-full">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-[10px] font-black uppercase tracking-[0.5em] text-[#e10600] font-[family-name:var(--font-space)]">
          {"// DRIVER.STANDINGS_UNIT"}
        </h3>
        <span className="text-[8px] font-mono text-white/20 uppercase tracking-tighter italic">2025.RNK.V1</span>
      </div>

      <div className="grid grid-cols-1 gap-2">
        {enrichedStandings.map((standing: DriverStandingItem & { driver?: OpenF1Driver }) => (
          <div 
            key={standing.driver_number} 
            className="group relative flex items-center bg-white/5 border border-white/5 hover:border-white/20 transition-all duration-300 lg:skew-x-[-12deg] overflow-hidden hover:bg-white/10"
          >
            {/* {"Background Grid Pattern for texture"} */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundSize: '20px 20px', backgroundImage: 'linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)' }} />

            {/* Rank Box */}
            <div className="w-16 h-14 md:w-20 md:h-16 flex items-center justify-center shrink-0 border-r border-white/10 bg-black/40">
              <span className="text-2xl md:text-3xl font-[family-name:var(--font-barlow)] font-900 italic text-white group-hover:text-[#e10600] transition-colors">
                {standing.position_current}
              </span>
            </div>

            {/* Content Area */}
            <div className="flex-1 px-4 md:px-6 py-3 flex items-center justify-between lg:skew-x-[12deg]">
              <div className="flex items-center gap-4">
                <div 
                  className="w-1 h-6 rounded-full shadow-[0_0_10px_currentColor]" 
                  style={{ backgroundColor: `#${standing.driver?.team_colour || "fff"}`, color: `#${standing.driver?.team_colour || "fff"}` }}
                />
                <div>
                  <p className="text-[8px] font-bold text-white/30 uppercase tracking-[0.2em] font-[family-name:var(--font-space)] mb-0.5">
                    {standing.driver?.team_name || "PRO DRIVER"}
                  </p>
                  <h4 className="text-sm md:text-lg font-[family-name:var(--font-barlow)] font-800 italic uppercase leading-none">
                    {standing.driver?.full_name || `Driver ${standing.driver_number}`}
                  </h4>
                </div>
              </div>

              <div className="text-right">
                <p className="text-[8px] font-black text-[#e10600] uppercase tracking-widest mb-0.5 font-[family-name:var(--font-space)]">PTS</p>
                <div className="flex items-end justify-end gap-1">
                  <span className="text-lg md:text-2xl font-[family-name:var(--font-barlow)] font-900 italic leading-none">
                    {standing.points_current}
                  </span>
                </div>
              </div>
            </div>

            {/* Glow Trim */}
            <div 
              className="absolute top-0 bottom-0 left-0 w-[3px] opacity-0 group-hover:opacity-100 transition-opacity"
              style={{ backgroundColor: `#${standing.driver?.team_colour || "e10600"}` }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
