import { getMeetings } from "../../lib/api";
import ScheduleClient from "./ScheduleClient";
import SeasonSwitcher from "../components/Common/SeasonSwitcher";

export const metadata = {
  title: "Schedule | Formula 1 Central",
  description: "F1 Race Calendar",
};

export default async function SchedulePage({
  searchParams,
}: {
  searchParams: Promise<{ year?: string }>;
}) {
  const { year: yearParam } = await searchParams;
  const year = yearParam ? parseInt(yearParam) : 2025;
  let meetings = await getMeetings(year);

  if ((!meetings || meetings.length === 0) && year === 2025) {
    meetings = await getMeetings(2024);
  }

  return (
    <main className="min-h-screen bg-[#050706] text-white py-16 px-4 md:px-12 lg:px-24">
      <div className="max-w-[1200px] mx-auto">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8 mb-16">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-1.5 h-1.5 bg-[#e10600] glow-red" />
              <span className="font-technical text-[10px] text-white/40 tracking-[0.5em]">SYSTEM.CALENDAR</span>
            </div>
            <h1 className="font-heading-f1 text-5xl md:text-7xl italic leading-none uppercase">
              RACE <span className="text-[#e10600]">SCHEDULE</span>
            </h1>
          </div>
          
          <SeasonSwitcher currentYear={year} />
        </header>

        <ScheduleClient meetings={meetings} />
      </div>

      {/* Aesthetic Deco */}
      <div className="fixed top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#e10600]/20 to-transparent pointer-events-none" />
    </main>
  );
}
