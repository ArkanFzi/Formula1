"use client";

interface CircuitMapProps {
  circuitName: string;
  country: string;
}

export default function CircuitMap({ circuitName, country }: CircuitMapProps) {
  return (
    <div className="hud-glass p-6 relative overflow-hidden bg-[#0a100d]/80">
      {/* Decorative Track Grid */}
      <div className="absolute inset-0 opacity-5 pointer-events-none" 
           style={{ backgroundSize: '20px 20px', backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)' }} />

      <div className="flex justify-between items-start mb-8 relative z-10">
        <div>
          <div className="text-[9px] font-technical text-white/40 mb-1">CIRCUIT_GEOMETRY.UNIT</div>
          <div className="font-heading-f1 text-2xl text-white italic">{circuitName.toUpperCase()}</div>
        </div>
        <div className="text-right">
          <div className="text-[8px] font-technical text-[#00ffd5]/60 mb-1">{country.toUpperCase()}</div>
          <div className="text-[10px] font-heading-f1 text-white/40">LOC_COORD: 26.03N 50.51E</div>
        </div>
      </div>

      {/* Futuristic Track Visualization (Abstract SVG) */}
      <div className="aspect-[16/9] relative mb-8 flex items-center justify-center">
        <svg viewBox="0 0 400 200" className="w-full h-full opacity-80">
          <defs>
            <linearGradient id="trackGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" style={{ stopColor: '#e10600', stopOpacity: 1 }} />
              <stop offset="100%" style={{ stopColor: '#00ffd5', stopOpacity: 1 }} />
            </linearGradient>
          </defs>
          {/* Abstract futuristic track shape */}
          <path 
            d="M 50 150 Q 80 50 200 100 T 350 50 Q 380 150 200 180 T 50 150" 
            fill="none" 
            stroke="url(#trackGradient)" 
            strokeWidth="4" 
            strokeDasharray="10, 5"
            className="animate-[marqueeLeft_20s_linear_infinite]"
          />
          {/* Sector dots */}
          <circle cx="50" cy="150" r="4" fill="#e10600" className="glow-red" />
          <circle cx="200" cy="100" r="4" fill="#ffffff" />
          <circle cx="350" cy="50" r="4" fill="#00ffd5" className="glow-cyber" />
        </svg>

        {/* Floating Technical Labels */}
        <div className="absolute top-4 left-4 hud-border px-2 py-1 bg-black/60 scale-75">
           <div className="text-[6px] text-white/40">SECTOR_1</div>
           <div className="text-[10px] font-heading-f1 text-white">28.4s</div>
        </div>
        <div className="absolute bottom-4 right-4 hud-border px-2 py-1 bg-black/60 scale-75">
           <div className="text-[6px] text-white/40">DRS_ZONE_2</div>
           <div className="text-[10px] font-heading-f1 text-[#00ffd5]">ACTIVE</div>
        </div>
      </div>

      {/* Technical Data Grid */}
      <div className="grid grid-cols-2 gap-4 relative z-10">
        <div className="hud-border p-3 bg-white/5">
           <div className="text-[7px] font-technical text-white/40 mb-1">TOTAL_DISTANCE</div>
           <div className="text-xl font-heading-f1 text-white">308.238<span className="text-xs text-white/40 ml-1 italic">KM</span></div>
        </div>
        <div className="hud-border p-3 bg-white/5">
           <div className="text-[7px] font-technical text-white/40 mb-1">TOTAL_LAPS</div>
           <div className="text-xl font-heading-f1 text-white">57</div>
        </div>
        <div className="hud-border p-3 bg-white/5">
           <div className="text-[7px] font-technical text-white/40 mb-1">TRACK_RECORD</div>
           <div className="text-xl font-heading-f1 text-[#00ffd5]">1:31.447</div>
        </div>
        <div className="hud-border p-3 bg-white/5">
           <div className="text-[7px] font-technical text-white/40 mb-1">ALTITUDE</div>
           <div className="text-xl font-heading-f1 text-white">-1.2<span className="text-xs text-white/40 ml-1 italic">M</span></div>
        </div>
      </div>
    </div>
  );
}
