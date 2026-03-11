import { getMeetings } from "../../lib/api";
import ScheduleClient from "./ScheduleClient";
import AnimatedSection from "../components/AnimatedSection";

export const metadata = {
  title: "Schedule | Formula 1 Central",
  description: "F1 Race Calendar",
};

export default async function SchedulePage() {
  let meetings = await getMeetings(2024);

  if (!meetings || meetings.length === 0) {
    meetings = await getMeetings(2023);
  }

  if (!meetings || meetings.length === 0) {
    return (
      <main className="min-h-screen bg-[#0a0f0c] text-white flex items-center justify-center p-8">
        <div className="text-center bg-white/5 border border-white/10 p-12 rounded-2xl backdrop-blur-md max-w-md">
          <div className="w-16 h-16 bg-[#e10600]/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <div className="w-8 h-8 rounded-full bg-[#e10600] animate-pulse" />
          </div>
          <h2 className="text-2xl font-black italic uppercase mb-4 font-[family-name:var(--font-barlow)]">Schedule Unavailable</h2>
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
        <AnimatedSection variant="fade-up" className="text-center mb-16">
          <h1 className="text-4xl md:text-[3.5rem] font-extrabold uppercase tracking-tight mb-2">Race Calendar</h1>
          <p className="text-[#ff5500] text-xl font-semibold uppercase tracking-[0.15em]">2024 Season Schedule</p>
        </AnimatedSection>

        <ScheduleClient meetings={meetings} />
      </div>
    </main>
  );
}
