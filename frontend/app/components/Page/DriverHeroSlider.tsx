"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { 
  OpenF1Driver, 
  DriverStanding, 
  CarPerformance, 
  PitStop, 
  LapData 
} from "../../types/f1";
import { fetchDriverPerformance, fetchBestPitStop, fetchLatestLap } from "../../lib/f1";

interface DriverHeroSliderProps {
  drivers: OpenF1Driver[];
  standings?: DriverStanding[];
}

const DISPLAY_DURATION = 8000; // 8 seconds per driver

export default function DriverHeroSlider({ drivers, standings = [] }: DriverHeroSliderProps) {
  // Use a much larger multiplier to provide a massive buffer
  const MULTIPLIER = 10;
  const [virtualIndex, setVirtualIndex] = useState(drivers.length * (MULTIPLIER / 2));
  const [isJumping, setIsJumping] = useState(false);
  const [progress, setProgress] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number>(0);
  const isMounted = useRef(false);

  // Stats State
  const [perf, setPerf] = useState<CarPerformance | null>(null);
  const [pit, setPit] = useState<PitStop | null>(null);
  const [lap, setLap] = useState<LapData | null>(null);

  const activeIndex = virtualIndex % drivers.length;
  const currentDriver = drivers[activeIndex];

  // Get current standing
  const currentStanding = standings.find(s => s.driver_number === currentDriver?.driver_number);

  const nextDriver = React.useCallback(() => {
    setVirtualIndex((prev) => prev + 1);
    setProgress(0);
  }, []);

  const selectDriver = (targetOriginalIdx: number) => {
    const currentOriginalIdx = virtualIndex % drivers.length;
    let stepsForward = targetOriginalIdx - currentOriginalIdx;
    if (stepsForward <= 0) stepsForward += drivers.length;
    
    setVirtualIndex(virtualIndex + stepsForward);
    setProgress(0);
  };

  // Fetch real-time stats when driver changes
  useEffect(() => {
    if (!currentDriver) return;

    const loadStats = async () => {
      // Reset stats while loading (in async flow to avoid cascade warning)
      setPerf(null);
      setPit(null);
      setLap(null);

      const [p, pt, l] = await Promise.all([
        fetchDriverPerformance(currentDriver.driver_number),
        fetchBestPitStop(currentDriver.driver_number),
        fetchLatestLap(currentDriver.driver_number)
      ]);
      
      if (isMounted.current) {
        setPerf(p);
        setPit(pt);
        setLap(l);
      }
    };

    isMounted.current = true;
    loadStats();

    return () => {
      isMounted.current = false;
    };
  }, [currentDriver]);

  // Seamless jump logic - only reset when far from the edges of the massive buffer
  useEffect(() => {
    if (drivers.length === 0) return;
    
    // Reset to the middle sets if we wander too far
    if (virtualIndex >= drivers.length * (MULTIPLIER - 2)) {
      const jump = () => {
        setIsJumping(true);
        setVirtualIndex(virtualIndex - (drivers.length * 3));
        setTimeout(() => setIsJumping(false), 50);
      };
      jump();
    } else if (virtualIndex < drivers.length * 2) {
      const jump = () => {
        setIsJumping(true);
        setVirtualIndex(virtualIndex + (drivers.length * 3));
        setTimeout(() => setIsJumping(false), 50);
      };
      jump();
    }
  }, [virtualIndex, drivers.length]);

  // Handle auto-rotation
  useEffect(() => {
    if (drivers.length === 0) return;

    startTimeRef.current = Date.now();

    const updateProgress = () => {
      const elapsed = Date.now() - startTimeRef.current;
      const newProgress = Math.min(100, (elapsed / DISPLAY_DURATION) * 100);
      setProgress(newProgress);

      if (newProgress >= 100) {
        nextDriver();
      } else {
        timerRef.current = setTimeout(updateProgress, 16); 
      }
    };

    timerRef.current = setTimeout(updateProgress, 16);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [virtualIndex, drivers.length, nextDriver]);

  if (!currentDriver) return null;

  return (
    <div className="relative w-full h-[100vh] min-h-[700px] overflow-hidden bg-black text-white group/hero">
      {/* ── Background Image Layer ── */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentDriver.driver_number}
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className="absolute inset-0 z-0"
        >
          {/* Background Image (Headshot but zoomed/overlayed) */}
          <div className="absolute inset-0 bg-[#111512]" />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={currentDriver.headshot_url.replace("/1col/", "/9col/")}
            alt={currentDriver.full_name}
            className="absolute right-0 bottom-0 h-full w-auto object-contain object-right-bottom opacity-85 contrast-[1.1] saturate-[1.1] grayscale-[0.05] transition-transform duration-[10s] ease-linear scale-105 group-hover/hero:scale-100"
            style={{ 
              maskImage: 'radial-gradient(circle at 75% 50%, black 40%, transparent 95%)',
              WebkitMaskImage: 'radial-gradient(circle at 75% 50%, black 40%, transparent 95%)'
            }}
          />
          
          {/* Refined masks for text readability and cinematic feel - lightened */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/95 via-black/30 to-transparent z-10" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent z-10" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.2)_100%)] z-10" />
        </motion.div>
      </AnimatePresence>

      {/* ── Main Content Overlay ── */}
      <div className="relative z-10 w-full h-full max-w-[1400px] mx-auto px-8 md:px-16 flex flex-col justify-center pb-20 md:pb-32">
        <div className="max-w-2xl mb-12">
          {/* Tagline */}
          <motion.div
            key={`tag-${currentDriver.driver_number}`}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="flex items-center gap-3 mb-6"
          >
            <div className="w-10 h-[2px]" style={{ backgroundColor: `#${currentDriver.team_colour}` }} />
            <span className="text-xs font-[family-name:var(--font-space)] tracking-[0.4em] uppercase text-white/60">
              {currentDriver.team_name} {`// 2025`}
            </span>
          </motion.div>

          {/* Large Title */}
          <AnimatePresence mode="wait">
            <motion.div
              key={`name-${currentDriver.driver_number}`}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            >
              <h1 className="text-7xl md:text-[8vw] font-[family-name:var(--font-barlow)] font-900 leading-[0.85] tracking-tight italic uppercase mb-8">
                {currentDriver.full_name.split(' ')[0]}
                <br />
                <span className="text-[#e10600]">{currentDriver.last_name}</span>
              </h1>
            </motion.div>
          </AnimatePresence>

          {/* Real-time Stats Bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="flex gap-8 mb-10 overflow-x-auto pb-4 no-scrollbar border-y border-white/5 py-6"
          >
            {/* Standings */}
            <div className="flex flex-col shrink-0">
              <span className="text-[10px] text-white/30 font-bold uppercase tracking-widest mb-1 font-[family-name:var(--font-space)]">Standings</span>
              <div className="text-2xl font-black italic text-[#e10600] font-[family-name:var(--font-barlow)]">
                P{currentStanding?.position_current || '??'} <span className="text-xs text-white/60 ml-1">({currentStanding?.points_current || 0} PTS)</span>
              </div>
            </div>
            
            {/* Top Speed */}
            <div className="flex flex-col shrink-0 border-l border-white/10 pl-8">
              <span className="text-[10px] text-white/30 font-bold uppercase tracking-widest mb-1 font-[family-name:var(--font-space)]">Top Speed</span>
              <div className="text-2xl font-black italic font-[family-name:var(--font-barlow)] uppercase">
                {perf?.speed || '---'} <span className="text-xs text-white/60 ml-1">KM/H</span>
              </div>
            </div>

            {/* Pit Efficiency */}
            <div className="flex flex-col shrink-0 border-l border-white/10 pl-8">
              <span className="text-[10px] text-white/30 font-bold uppercase tracking-widest mb-1 font-[family-name:var(--font-space)]">Best Pit</span>
              <div className="text-2xl font-black italic font-[family-name:var(--font-barlow)]">
                {pit?.stop_duration ? pit.stop_duration.toFixed(2) : '--.--'} <span className="text-xs text-white/60 ml-1">S</span>
              </div>
            </div>

            {/* Sectors */}
            <div className="flex flex-col shrink-0 border-l border-white/10 pl-8">
              <span className="text-[10px] text-white/30 font-bold uppercase tracking-widest mb-1 font-[family-name:var(--font-space)]">Sectors</span>
              <div className="flex gap-1.5 mt-2">
                {[lap?.duration_sector_1, lap?.duration_sector_2, lap?.duration_sector_3].map((s, i) => (
                  <div 
                    key={i} 
                    className={`w-4 h-4 rounded-sm transition-colors duration-500 ${
                      s ? 'bg-[#9b15b3] shadow-[0_0_10px_rgba(155,21,179,0.5)]' : 'bg-white/10'
                    }`} 
                    title={s ? `Sector ${i+1}: ${s}s` : `Sector ${i+1}`}
                  />
                ))}
              </div>
            </div>
          </motion.div>

          {/* Description & CTA */}
          <motion.div
            key={`desc-${currentDriver.driver_number}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="flex flex-col sm:flex-row items-start sm:items-center gap-8"
          >
            <div className="text-sm font-[family-name:var(--font-space)] text-white/50 max-w-xs leading-relaxed uppercase tracking-wider">
              Representing {currentDriver.team_name} in the 2025 World Championship. Racing with number {currentDriver.driver_number}.
            </div>
            
            <button
              className="group relative px-8 py-4 overflow-hidden border border-white/10 hover:border-[#e10600]/50 transition-colors"
            >
              <div className="absolute inset-0 bg-[#e10600] translate-y-[101%] group-hover:translate-y-0 transition-transform duration-300" />
              <span className="relative z-10 text-xs font-bold uppercase tracking-[0.2em] group-hover:text-white transition-colors">
                Discover Details
              </span>
            </button>
          </motion.div>
        </div>
      </div>

      {/* ── Bottom Cards Slider ── */}
      <div className="absolute bottom-12 right-0 left-0 z-20 px-8 md:px-16 flex flex-col items-end pointer-events-none overflow-hidden h-[180px] md:h-[220px]">
        <div className="w-full max-w-[1400px] relative h-full pointer-events-auto">
          <motion.div 
            className="flex flex-row-reverse gap-3 md:gap-4 absolute right-0 bottom-8 h-[140px] md:h-[180px]"
            animate={{ x: virtualIndex * (90 + 16) }} 
            transition={isJumping ? { duration: 0 } : { type: "spring", stiffness: 60, damping: 15 }}
          >
            {/* Render a large set to match our MULTIPLIER buffer for seamlessness */}
            {Array.from({ length: MULTIPLIER }).flatMap((_, mIdx) => 
              drivers.map((driver, dIdx) => {
                const globalIdx = mIdx * drivers.length + dIdx;
                const isTarget = virtualIndex === globalIdx; 
                const originalIdx = dIdx;
                
                return (
                  <button
                    key={`${driver.driver_number}-${globalIdx}`}
                    onClick={() => selectDriver(originalIdx)}
                    className={`relative group h-full rounded-lg overflow-hidden transition-all duration-700 ease-out shrink-0 ${
                      isTarget ? "w-[120px] md:w-[150px] shadow-[0_0_40px_rgba(225,6,0,0.4)] ring-1 ring-[#e10600]/50" : "w-[70px] md:w-[90px] opacity-40 hover:opacity-100"
                    }`}
                  >
                    {/* Bg Image */}
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={driver.headshot_url.replace("/1col/", "/9col/")}
                      alt={driver.full_name}
                      className="absolute inset-0 w-full h-full object-cover grayscale-[0.2] group-hover:grayscale-0 group-hover:scale-110 transition-all duration-500 contrast-[1.1] saturate-[1.2]"
                    />
                    {/* Overlay */}
                    <div className={`absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent`} />
                    
                    {/* Progress bar at bottom of active card */}
                    {isTarget && (
                      <div className="absolute bottom-0 left-0 right-0 h-[4px] bg-white/20">
                        <motion.div
                          className="h-full bg-[#e10600]"
                          animate={{ width: `${progress}%` }}
                          transition={{ duration: 0.1, ease: "linear" }}
                        />
                      </div>
                    )}

                    {/* Info Text */}
                    <div className="absolute bottom-4 left-3 right-3 text-left">
                      <p className="text-[10px] md:text-xs font-bold font-[family-name:var(--font-barlow)] leading-none italic uppercase tracking-wider text-white">
                        {driver.last_name}
                      </p>
                    </div>
                  </button>
                );
              })
            )}
          </motion.div>
        </div>

        {/* Counter - positioned below the cards */}
        <div className="absolute bottom-0 right-8 md:right-16 flex items-center gap-4 text-white/30 font-[family-name:var(--font-space)] text-[10px] tracking-[0.3em]">
          <span className="text-white">{String(activeIndex + 1).padStart(2, '0')}</span>
          <div className="w-12 h-[1px] bg-white/10" />
          <span>{String(drivers.length).padStart(2, '0')}</span>
        </div>
      </div>
    </div>
  );
}
