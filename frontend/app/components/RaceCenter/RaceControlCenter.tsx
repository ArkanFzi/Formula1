"use client";

import { RaceControl } from "../../types/f1";

interface RaceControlCenterProps {
  messages: RaceControl[];
  sessionStatus: { name: string; status: string };
}

export default function RaceControlCenter({ messages, sessionStatus }: RaceControlCenterProps) {
  const flagColors: Record<string, string> = {
    GREEN: "bg-green-500",
    YELLOW: "bg-yellow-500",
    RED: "bg-red-500",
    BLUE: "bg-blue-500",
    WHITE: "bg-white",
    BLACK: "bg-black",
  };

  return (
    <div className="hud-glass p-0 flex flex-col h-full bg-black/40">
      {/* Session Banner */}
      <div className="p-4 border-b border-white/10 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={`w-3 h-3 rounded-full ${flagColors[sessionStatus.status] || "bg-white"} glow-cyber`} />
          <div className="font-technical text-[10px] text-white/80">{sessionStatus.name}</div>
        </div>
        <div className="font-heading-f1 text-sm italic text-[#e10600]">STATUS.{sessionStatus.status}</div>
      </div>

      {/* Messages List */}
      <div className="flex-1 overflow-y-auto max-h-[400px] p-4 space-y-4 custom-scrollbar">
        {messages.length === 0 ? (
          <div className="text-center py-8 font-technical text-[10px] text-white/10">
            NO_CONTROL_MESSAGES
          </div>
        ) : (
          messages.map((m, i) => (
            <div key={i} className="relative pl-4 border-l border-white/10 group">
              <div className="absolute left-[-1px] top-0 h-2 w-[2px] bg-[#e10600] opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="flex justify-between items-start mb-1">
                <span className="font-technical text-[8px] text-[#00ffd5]/60">{m.category}</span>
                <span className="font-technical text-[8px] text-white/20">
                  {new Date(m.date).toLocaleTimeString([], { hour12: false })}
                </span>
              </div>
              <p className="text-[11px] font-medium text-white/80 leading-relaxed uppercase">
                {m.message}
              </p>
            </div>
          ))
        )}
      </div>

      {/* Footer Decoration */}
      <div className="p-2 bg-white/5 border-t border-white/10 flex justify-between font-technical text-[7px] text-white/20">
        <span>RC_SERVER_LINK: ACTIVE</span>
        <span>LATENCY: 42MS</span>
      </div>
    </div>
  );
}
