"use client";

import { useEffect, useState } from "react";

type Meeting = {
  meeting_key: number;
  date_start: string;
  date_end: string;
  country_name: string;
  country_flag: string;
  meeting_official_name: string;
  circuit_short_name: string;
};

export default function ScheduleClient({ meetings }: { meetings: Meeting[] }) {
  const [now, setNow] = useState<number | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => setNow(Date.now()), 0);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="grid grid-cols-1 gap-4">
      {meetings.map((meeting) => {
        const isCompleted = now !== null && new Date(meeting.date_end).getTime() < now;
        return (
          <div 
            key={meeting.meeting_key}
            className={`hud-glass group flex flex-col md:flex-row items-stretch transition-all duration-300 hover:glow-cyber hover:border-[#00ffd5]/40 ${isCompleted ? 'opacity-60 grayscale-[0.5] hover:grayscale-0' : ''}`}
          >
            {/* Date Block */}
            <div className="md:w-32 p-6 flex md:flex-col items-center justify-center bg-white/5 border-r border-white/10">
               <div className="text-[10px] font-technical text-white/40 mb-1">
                 {new Date(meeting.date_start).toLocaleString("default", { month: "short" }).toUpperCase()}
               </div>
               <div className="font-heading-f1 text-4xl text-white italic">
                 {new Date(meeting.date_start).getDate()}
               </div>
            </div>

            {/* Info Block */}
            <div className="flex-1 p-6 flex flex-col justify-center">
               <div className="flex items-center gap-4 mb-2">
                 <div className="w-1 h-6 bg-[#e10600] group-hover:bg-[#00ffd5] transition-colors" />
                 <h2 className="font-heading-f1 text-2xl italic text-white uppercase">{meeting.country_name}</h2>
                 <img src={meeting.country_flag} alt="" className="h-4 w-6 rounded-sm opacity-60 group-hover:opacity-100 transition-opacity" />
               </div>
               <div className="text-[10px] font-technical text-white/40 group-hover:text-white/60 transition-colors uppercase">
                 {meeting.meeting_official_name}
               </div>
               <div className="text-[8px] font-technical text-white/20 mt-1 uppercase">
                 CIRCUIT::{meeting.circuit_short_name.replace(/ /g, "_")}
               </div>
            </div>

            {/* Status Block */}
            <div className="md:w-32 p-6 flex items-center justify-center border-t md:border-t-0 md:border-l border-white/10 bg-white/5">
              <div className={`px-4 py-1.5 font-heading-f1 italic text-xs tracking-widest ${isCompleted ? 'text-white/30 border border-white/10' : 'text-[#00ffd5] border border-[#00ffd5]/40 glow-cyber'}`}>
                {isCompleted ? "COMPLETED" : "UPCOMING"}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
