import { getMeetings } from "../../lib/api";

export const metadata = {
  title: "Schedule | Formula 1 Central",
  description: "F1 Race Calendar",
};

export default async function SchedulePage() {
  let meetings = await getMeetings(2024);
  
  if (!meetings || meetings.length === 0) {
    meetings = await getMeetings(2023); // Fallback
  }

  const now = new Date().getTime();

  if (!meetings || meetings.length === 0) {
    return (
      <main className="min-h-screen bg-[#0a0f0c] text-white flex items-center justify-center p-8">
        <div className="text-center bg-white/5 border border-white/10 p-12 rounded-2xl backdrop-blur-md max-w-md">
          <div className="w-16 h-16 bg-[#e10600]/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <div className="w-8 h-8 rounded-full bg-[#e10600] animate-pulse" />
          </div>
          <h2 className="text-2xl font-black italic uppercase italic mb-4 font-[family-name:var(--font-barlow)]">Schedule Unavailable</h2>
          <p className="text-white/40 text-sm font-medium leading-relaxed mb-8">
            We are currently unable to establish a secure data link to the F1 Race Calendar. Please check back later.
          </p>
          <div className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20 font-[family-name:var(--font-space)]">
            {"// ERR_CODE.DATA_LINK_FAILURE"}
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#0a0f0c] text-white py-16 px-4 md:px-8">
      <div className="max-w-[1000px] mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-[3.5rem] font-extrabold uppercase tracking-tight mb-2">Race Calendar</h1>
          <p className="text-[#ff5500] text-xl font-semibold uppercase tracking-[0.15em]">2024 Season Schedule</p>
        </div>

        <div className="flex flex-col gap-6">
          {meetings.map((meeting: { meeting_key: number; date_start: string; date_end: string; country_name: string; country_flag: string; meeting_official_name: string; circuit_short_name: string }) => {
             const isCompleted = new Date(meeting.date_end).getTime() < now;
             return (
              <div 
                key={meeting.meeting_key} 
                className="group flex flex-col md:flex-row bg-[#111111] rounded-xl border border-white/10 overflow-hidden hover:-translate-y-1 hover:border-[#ff5500] hover:shadow-[0_10px_30px_rgba(255,85,0,0.15)] transition-all duration-300"
              >
                {/* Date Box */}
                <div className="bg-white/5 md:w-[120px] p-6 flex md:flex-col items-center justify-center md:border-r border-b md:border-b-0 border-white/10 gap-2 md:gap-0">
                  <span className="text-xl md:text-lg text-[#ff5500] font-extrabold uppercase leading-none">
                    {new Date(meeting.date_start).toLocaleString('default', { month: 'short' })}
                  </span>
                  <span className="text-3xl md:text-4xl font-extrabold leading-none text-white mt-0 md:mt-1">
                    {new Date(meeting.date_start).getDate()}
                  </span>
                </div>
                
                {/* Meeting Info */}
                <div className="p-6 flex-1 flex flex-col justify-center">
                  <div className="flex items-center gap-4 mb-2">
                    <h2 className="text-2xl font-extrabold uppercase tracking-tight">{meeting.country_name}</h2>
                    <div className="w-[30px] h-[20px] rounded-[2px] overflow-hidden shadow-md">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={meeting.country_flag} alt={`${meeting.country_name} flag`} className="w-full h-full object-cover" />
                    </div>
                  </div>
                  
                  <h3 className="text-lg text-white/70 font-medium mb-1">{meeting.meeting_official_name}</h3>
                  <p className="text-[0.95rem] text-white/50">{meeting.circuit_short_name}</p>
                </div>
                
                {/* Action/Status Box */}
                <div className="p-6 md:w-[180px] flex items-center justify-center border-t md:border-t-0 md:border-l border-white/10">
                  <span className={`px-4 py-2 rounded-md font-semibold text-sm uppercase tracking-wider transition-colors ${
                      isCompleted 
                      ? "bg-white/5 text-white/40 group-hover:bg-[#ff5500]/20 group-hover:text-[#ff5500]" 
                      : "bg-[#ff5500]/10 text-[#ff5500] group-hover:bg-[#ff5500] group-hover:text-white"
                  }`}>
                    {isCompleted ? 'Completed' : 'Upcoming'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </main>
  );
}
