"use client";

import { useEffect, useState } from "react";
import AnimatedSection from "../components/AnimatedSection";

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
    <div className="flex flex-col gap-6">
      {meetings.map((meeting, index) => {
        const isCompleted = now !== null && new Date(meeting.date_end).getTime() < now;
        return (
          <AnimatedSection
            key={meeting.meeting_key}
            variant="fade-up"
            delay={Math.min(index * 0.06, 0.6)}
          >
            <div className="group flex flex-col md:flex-row bg-[#111111] rounded-xl border border-white/10 overflow-hidden hover:-translate-y-1 hover:border-[#ff5500] hover:shadow-[0_10px_30px_rgba(255,85,0,0.15)] transition-all duration-300">
              {/* Date Box */}
              <div className="bg-white/5 md:w-[120px] p-6 flex md:flex-col items-center justify-center md:border-r border-b md:border-b-0 border-white/10 gap-2 md:gap-0">
                <span className="text-xl md:text-lg text-[#ff5500] font-extrabold uppercase leading-none">
                  {new Date(meeting.date_start).toLocaleString("default", { month: "short" })}
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

              {/* Status Box */}
              <div className="p-6 md:w-[180px] flex items-center justify-center border-t md:border-t-0 md:border-l border-white/10">
                <span className={`px-4 py-2 rounded-md font-semibold text-sm uppercase tracking-wider transition-colors ${
                  isCompleted
                    ? "bg-white/5 text-white/40 group-hover:bg-[#ff5500]/20 group-hover:text-[#ff5500]"
                    : "bg-[#ff5500]/10 text-[#ff5500] group-hover:bg-[#ff5500] group-hover:text-white"
                }`}>
                  {now === null ? "–" : isCompleted ? "Completed" : "Upcoming"}
                </span>
              </div>
            </div>
          </AnimatedSection>
        );
      })}
    </div>
  );
}
