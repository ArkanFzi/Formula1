import { getLatestSession, getSessionResults, getDrivers } from "../../lib/api";
import WeatherWidget from "./Page/WeatherWidget";

type DriverInfo = {
  driver_number: number;
  broadcast_name: string;
  team_colour: string;
  team_name: string;
};

type SessionResultItem = {
  position: number;
  driver_number: number;
  gap_to_leader: number | string | null;
  driver?: DriverInfo;
};

export default async function SessionResults() {
  let session;
  try {
    session = await getLatestSession();
  } catch {
    return null;
  }

  if (!session) return null;

  const [results, drivers] = await Promise.all([
    getSessionResults(session.session_key),
    getDrivers(session.session_key)
  ]);

  if (!results || results.length === 0) return null;

  const enrichedResults = results.slice(0, 10).map((result: SessionResultItem) => {
    const driver = drivers.find((d: DriverInfo) => d.driver_number === result.driver_number);
    return { ...result, driver };
  });

  return (
    <section className="relative px-8 lg:px-24 py-32 bg-[#050706] overflow-hidden">
      {/* Technical Background Elements */}
      <div className="absolute top-0 right-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      <div className="absolute top-0 right-[20%] w-[1px] h-full bg-white/5 hidden lg:block" />
      
      <div className="max-w-[1400px] mx-auto relative z-10">
        <div className="flex flex-col lg:flex-row gap-16">
          
          {/* Left Column: Atmospheric Telemetry */}
          <div className="lg:w-[350px] shrink-0">
            <div className="sticky top-24">
              <div className="mb-12">
                <h3 className="text-[10px] font-black uppercase tracking-[0.5em] text-[#e10600] mb-3 font-[family-name:var(--font-space)]">
                  {"// ATMOSPHERIC.UNIT"}
                </h3>
                <h2 className="text-4xl font-[family-name:var(--font-barlow)] font-900 italic uppercase tracking-tighter leading-none mb-6">
                  Track <br/><span className="text-white/20">Conditions</span>
                </h2>
                <div className="h-[2px] w-12 bg-[#e10600]" />
              </div>

              <WeatherWidget />

              <div className="mt-12 p-6 border-l-2 border-white/10 bg-white/5">
                <p className="text-[10px] text-white/40 uppercase tracking-[0.2em] font-bold mb-2 font-[family-name:var(--font-space)]">Next Event</p>
                <p className="text-sm font-[family-name:var(--font-barlow)] font-700 italic uppercase">Qualifying Session {"//"} 14:00 GMT</p>
              </div>
            </div>
          </div>

          {/* Right Column: Session Classification */}
          <div className="flex-1">
            <div className="flex justify-between items-end mb-12">
              <div>
                <h3 className="text-[10px] font-black uppercase tracking-[0.5em] text-[#e10600] mb-3 font-[family-name:var(--font-space)]">
                  {"// SESSION.CLASSIFICATION"}
                </h3>
                <h2 className="text-4xl md:text-5xl font-[family-name:var(--font-barlow)] font-900 italic uppercase tracking-tighter">
                  Latest <span className="text-[#e10600]">Results</span>
                </h2>
              </div>
              <div className="text-right hidden sm:block">
                <p className="text-[10px] font-black uppercase tracking-widest text-white/30 mb-1 font-[family-name:var(--font-space)]">Event Code</p>
                <span className="text-xs font-bold bg-[#e10600] text-white px-3 py-1 skew-x-[-15deg] inline-block uppercase tracking-widest">
                  {session.session_name}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3">
              {enrichedResults.map((result: SessionResultItem) => (
                <div 
                  key={result.driver_number} 
                  className="group relative flex items-center bg-white/5 border border-white/5 hover:border-white/20 transition-all duration-300 hover:bg-white/10"
                >
                  {/* Position indicator */}
                  <div className="w-16 md:w-20 h-16 md:h-20 flex items-center justify-center shrink-0 border-r border-white/10">
                    <span className="text-3xl md:text-4xl font-[family-name:var(--font-barlow)] font-900 italic text-white/20 group-hover:text-[#e10600] transition-colors">
                      {result.position}
                    </span>
                  </div>

                  {/* Driver Info */}
                  <div className="flex-1 px-6 md:px-8 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-6">
                      <div 
                        className="w-1 h-8 rounded-full" 
                        style={{ backgroundColor: `#${result.driver?.team_colour || "fff"}` }}
                      />
                      <div>
                        <p className="text-[8px] md:text-[10px] font-bold text-white/30 uppercase tracking-[0.3em] font-[family-name:var(--font-space)] mb-1">
                          {result.driver?.team_name || "Independent"}
                        </p>
                        <h4 className="text-lg md:text-2xl font-[family-name:var(--font-barlow)] font-800 italic uppercase">
                          {result.driver?.broadcast_name || `Driver ${result.driver_number}`}
                        </h4>
                      </div>
                    </div>

                    <div className="text-right">
                      <p className="text-[8px] md:text-[10px] font-bold text-white/30 uppercase tracking-widest mb-1 font-[family-name:var(--font-space)]">Interval</p>
                      <span className="text-sm md:text-lg font-mono text-white/60 tabular-nums">
                        {result.gap_to_leader !== null 
                          ? (result.gap_to_leader === 0 ? "LEADER" : `+${result.gap_to_leader}${typeof result.gap_to_leader === 'number' ? 's' : ''}`) 
                          : "---"}
                      </span>
                    </div>
                  </div>

                  {/* Accent Line */}
                  <div 
                    className="absolute right-0 top-0 bottom-0 w-[2px] opacity-0 group-hover:opacity-100 transition-opacity"
                    style={{ backgroundColor: `#${result.driver?.team_colour || "e10600"}` }}
                  />
                </div>
              ))}
            </div>

            <button className="w-full mt-10 py-4 border border-white/10 hover:border-[#e10600]/50 text-[10px] font-black uppercase tracking-[0.4em] transition-all hover:bg-[#e10600] hover:text-white font-[family-name:var(--font-space)]">
              View Full Classification ↘
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
