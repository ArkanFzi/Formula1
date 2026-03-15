"use client";

import { PitStop, OpenF1Driver } from "../../types/f1";

interface PitStopStrategyProps {
  pitStops: PitStop[];
  drivers: OpenF1Driver[];
}

export default function PitStopStrategy({ pitStops, drivers }: PitStopStrategyProps) {
  // Sort drivers by their best pit stop or just use the list
  const driversWithPits = drivers.filter(d => pitStops.some(p => p.driver_number === d.driver_number));
  
  const maxLaps = Math.max(...pitStops.map(p => p.lap_number), 50);

  return (
    <div className="hud-glass p-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <div className="text-[10px] font-technical text-white/40 mb-1">STRATEGY_ANALYSIS.UNIT</div>
          <div className="font-heading-f1 text-2xl text-white italic">PIT_STOP_TIMELINE</div>
        </div>
        <div className="flex gap-4">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-[#00ffd5] glow-cyber" />
            <span className="font-technical text-[8px] text-white/60">WINDOW_OPEN</span>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        {driversWithPits.length === 0 ? (
          <div className="py-12 text-center font-technical text-[10px] text-white/20">
            AWAITING_PIT_STOP_DATA
          </div>
        ) : (
          driversWithPits.map((driver) => {
            const driverPits = pitStops.filter(p => p.driver_number === driver.driver_number);
            return (
              <div key={driver.driver_number} className="group">
                <div className="flex justify-between items-end mb-2">
                  <div className="flex items-center gap-3">
                    <div className="w-1 h-3" style={{ backgroundColor: `#${driver.team_colour}` }} />
                    <span className="font-heading-f1 text-sm text-white/80 group-hover:text-white transition-colors">
                      {driver.name_acronym}
                    </span>
                  </div>
                  <div className="font-technical text-[8px] text-white/20">
                    STOPS: {driverPits.length}
                  </div>
                </div>
                
                <div className="relative h-6 bg-white/5 hud-border">
                  {/* Lap markers */}
                  <div className="absolute inset-0 flex justify-between px-2 pointer-events-none opacity-10">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <div key={i} className="w-px h-full bg-white" />
                    ))}
                  </div>

                  {/* Pit stops */}
                  {driverPits.map((pit, idx) => {
                    const position = (pit.lap_number / maxLaps) * 100;
                    return (
                      <div 
                        key={idx}
                        className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 flex flex-col items-center group/pit"
                        style={{ left: `${position}%` }}
                      >
                        <div className="w-2 h-2 bg-[#e10600] glow-red rotate-45 group-hover/pit:scale-150 transition-transform" />
                        <div className="absolute -bottom-6 opacity-0 group-hover/pit:opacity-100 transition-opacity bg-black border border-white/20 px-2 py-1 z-20 whitespace-nowrap">
                          <div className="font-technical text-[8px] text-white">LAP {pit.lap_number}</div>
                          <div className="font-heading-f1 text-[10px] text-[#00ffd5]">{pit.stop_duration.toFixed(2)}s</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Axis Information */}
      <div className="mt-8 pt-4 border-t border-white/5 flex justify-between font-technical text-[8px] text-white/20">
        <span>LAP_0</span>
        <span>LAP_{maxLaps}</span>
      </div>
    </div>
  );
}
