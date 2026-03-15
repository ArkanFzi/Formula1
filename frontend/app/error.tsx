"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="min-h-screen bg-[#050706] text-white flex items-center justify-center p-8 font-technical relative overflow-hidden">
      <div className="hud-glass p-12 max-w-xl text-center relative z-10">
        <div className="w-16 h-16 bg-[#e10600]/20 rounded-full flex items-center justify-center mx-auto mb-8 border border-[#e10600]">
           <div className="w-8 h-8 rounded-full bg-[#e10600] animate-pulse glow-red" />
        </div>
        
        <h2 className="font-heading-f1 text-4xl italic mb-4 uppercase text-[#e10600]">SYSTEM_MALFUNCTION</h2>
        <p className="text-white/40 text-[10px] tracking-[0.2em] mb-8 leading-relaxed uppercase">
          A critical error occurred while processing the telemetry stream. The system has initiated a safety shutdown.
        </p>

        <div className="bg-white/5 border border-white/10 p-4 mb-10 text-left font-mono text-[10px] text-white/60">
           <div className="text-[#e10600] mb-2">{"// ERROR_LOG:"}</div>
           {error.message || "UNIDENTIFIED_NETWORK_FAILURE"}
        </div>

        <button
          onClick={() => reset()}
          className="hud-border px-8 py-3 bg-[#e10600] hover:bg-[#ff1a1a] transition-all font-heading-f1 italic text-white text-lg tracking-widest"
        >
          REBOOT_SYSTEM
        </button>
      </div>

      {/* Aesthetic Deco */}
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,rgba(225,6,0,0.05)_0%,transparent_70%)] pointer-events-none" />
    </main>
  );
}
