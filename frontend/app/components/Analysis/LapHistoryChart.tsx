"use client";

import { LapData, OpenF1Driver } from "../../types/f1";

interface LapHistoryChartProps {
  lapData: LapData[];
  drivers: OpenF1Driver[];
}

export default function LapHistoryChart({ lapData, drivers }: LapHistoryChartProps) {
  // We'll focus on the top 5 drivers to keep the chart clean
  const topDrivers = drivers.slice(0, 5);
  
  const maxLaps = Math.max(...lapData.map(l => l.lap_number), 1);
  const minSector = Math.min(...lapData.map(l => l.duration_sector_1 + l.duration_sector_2 + l.duration_sector_3).filter(t => t > 0), 90);
  const maxSector = Math.max(...lapData.map(l => l.duration_sector_1 + l.duration_sector_2 + l.duration_sector_3), 110);

  return (
    <div className="hud-glass p-6 h-full flex flex-col">
      <div className="flex justify-between items-start mb-10">
        <div>
          <div className="text-[10px] font-technical text-white/40 mb-1">PERFORMANCE_GRAPH.UNIT</div>
          <div className="font-heading-f1 text-2xl text-white italic">LAP_TIME_COMPARISON</div>
        </div>
        <div className="flex gap-4">
          {topDrivers.map((d) => (
            <div key={d.driver_number} className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: `#${d.team_colour}` }} />
              <span className="font-technical text-[8px] text-white/60">{d.name_acronym}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="flex-1 relative mt-10 mb-10 border-l border-b border-white/10 mx-10">
        {/* Y-Axis Label */}
        <div className="absolute -left-12 top-0 h-full flex flex-col justify-between font-technical text-[8px] text-white/20">
          <span>{maxSector.toFixed(1)}S</span>
          <span>{minSector.toFixed(1)}S</span>
        </div>

        {/* X-Axis Label */}
        <div className="absolute -bottom-6 left-0 w-full flex justify-between font-technical text-[8px] text-white/20">
          <span>LAP_1</span>
          <span>LAP_{maxLaps}</span>
        </div>

        {/* Chart Lines (Custom SVG) */}
        <svg className="absolute inset-0 w-full h-full overflow-visible" preserveAspectRatio="none">
          {topDrivers.map((driver) => {
            const driverLaps = lapData
              .filter(l => l.driver_number === driver.driver_number)
              .sort((a, b) => a.lap_number - b.lap_number);

            if (driverLaps.length < 2) return null;

            const points = driverLaps.map(l => {
              const x = ((l.lap_number - 1) / (maxLaps - 1)) * 100;
              const totalTime = l.duration_sector_1 + l.duration_sector_2 + l.duration_sector_3;
              const y = 100 - ((totalTime - minSector) / (maxSector - minSector)) * 100;
              return `${x},${y}`;
            }).join(" ");

            return (
              <polyline
                key={driver.driver_number}
                fill="none"
                stroke={`#${driver.team_colour}`}
                strokeWidth="2"
                points={points}
                className="transition-all duration-500 hover:stroke-white cursor-pointer"
                vectorEffect="non-scaling-stroke"
                style={{ filter: `drop-shadow(0 0 2px #${driver.team_colour}44)` }}
              />
            );
          })}
        </svg>

        {/* Grid Lines */}
        <div className="absolute inset-0 pointer-events-none opacity-5">
           <div className="h-1/2 w-full border-b border-white" />
           <div className="h-full w-1/2 border-r border-white" />
        </div>
      </div>

      <div className="mt-auto pt-4 border-t border-white/5 flex gap-6 text-[7px] font-technical text-white/20">
        <span>DATA_SOURCE: OPENF1_V1</span>
        <span>SAMPLE_RATE: 1_LAP</span>
        <span>SMOOTHING: NONE</span>
      </div>
    </div>
  );
}
