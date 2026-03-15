"use client";

export default function Loading() {
  return (
    <main className="min-h-screen bg-[#050706] text-white flex flex-col items-center justify-center font-technical relative overflow-hidden">
      {/* Decorative Grid */}
      <div className="absolute inset-0 opacity-5 pointer-events-none" 
           style={{ backgroundSize: '40px 40px', backgroundImage: 'linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)' }} />
      
      <div className="relative z-10 flex flex-col items-center">
        <div className="h-16 w-[1px] bg-[#e10600] animate-pulse glow-red mb-8" />
        <div className="font-heading-f1 text-2xl italic animate-pulse mb-2">LOADING_SYSTEM_RESOURCES</div>
        <div className="flex gap-1 h-3 items-end">
           {[60, 45, 80, 50, 90, 30, 70, 40, 85, 55, 75, 65].map((h, i) => (
             <div 
               key={i} 
               className="w-1 bg-[#00ffd5]/40 animate-bounce" 
               style={{ animationDelay: `${i * 0.1}s`, height: `${h}%` }} 
             />
           ))}
        </div>
        <div className="mt-8 text-[8px] text-white/20 tracking-[0.5em] uppercase">Establishing Secure Data Link...</div>
      </div>

      <div className="fixed top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#00ffd5] to-transparent animate-[marqueeLeft_4s_linear_infinite]" />
    </main>
  );
}
