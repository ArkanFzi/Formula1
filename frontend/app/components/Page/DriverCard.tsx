"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { OpenF1Driver } from "../../types/f1";

interface DriverCardProps {
  driver: OpenF1Driver;
  position?: number;
}

export default function DriverCard({ driver, position }: DriverCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      whileHover={{ y: -5 }}
      viewport={{ once: true }}
      className="group relative h-72 lg:skew-x-[-6deg] bg-black/40 border border-white/5 hover:border-white/20 transition-all duration-300 overflow-hidden"
    >
      {/* ── Technical Scanlines Overlay ── */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%]" />

      {/* ── Background Watermark (Driver Number) ── */}
      <div 
        className="absolute -bottom-4 -right-4 text-[12rem] font-[family-name:var(--font-barlow)] font-900 italic text-white/[0.03] select-none group-hover:text-white/[0.05] transition-colors leading-none"
      >
        {driver.driver_number}
      </div>

      {/* ── Team Glow Border (Hover) ── */}
      <div 
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
        style={{ 
          boxShadow: `inset 0 0 40px -10px #${driver.team_colour}33`,
          border: `1px solid #${driver.team_colour}4d`
        }}
      />

      {/* ── Technical Header ── */}
      <div className="absolute top-4 left-6 flex items-center justify-between w-[calc(100%-48px)] lg:skew-x-[6deg]">
        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#e10600] font-[family-name:var(--font-space)]">
          {"// DRV.UNIT_"}{driver.driver_number}
        </span>
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-[8px] font-mono text-white/20 uppercase tracking-tighter italic">LIVE_FEED.Active</span>
        </div>
      </div>

      {/* ── Main Content Area ── */}
      <div className="absolute inset-0 p-8 flex flex-col justify-end lg:skew-x-[6deg]">
        <div className="flex flex-col mb-4">
          <div className="flex items-center gap-3 mb-2">
            <div 
              className="w-1 h-6 rounded-full shadow-[0_0_10px_currentColor]" 
              style={{ backgroundColor: `#${driver.team_colour}`, color: `#${driver.team_colour}` }}
            />
            <span className="text-[10px] font-bold text-white/30 uppercase tracking-[0.2em] font-[family-name:var(--font-space)]">
              {driver.team_name}
            </span>
          </div>
          <h3 className="text-3xl font-[family-name:var(--font-barlow)] font-900 italic uppercase leading-[0.85] tracking-tighter">
            <span className="block text-white/50 text-xl font-800">{driver.name_acronym}</span>
            <span className="text-white group-hover:text-[#e10600] transition-colors">
              {driver.full_name.split(' ').pop()}
            </span>
          </h3>
        </div>

        {/* ── Footer ── */}
        <div className="flex items-center justify-between border-t border-white/5 pt-4 mt-2">
          <div className="flex items-baseline gap-1">
            <span className="text-[9px] font-black text-white/20 uppercase">RK</span>
            <span className="text-xl font-[family-name:var(--font-barlow)] font-900 italic text-white/40">
              #{position || driver.driver_number}
            </span>
          </div>
          <Link 
            href={`/drivers/${driver.driver_number}`}
            className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-white/40 group-hover:text-white transition-colors"
          >
            DS.PROFILE <span>→</span>
          </Link>
        </div>
      </div>

      {/* ── Corner Accent ── */}
      <div 
        className="absolute top-0 right-0 w-12 h-12 bg-white/[0.02] border-l border-b border-white/5 lg:skew-x-[45deg] translate-x-6 -translate-y-6"
      />
    </motion.div>
  );
}
