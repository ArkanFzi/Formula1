"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";
import { OpenF1Driver, LapData } from "../../types/f1";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (delay: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1], delay },
  }),
};

const slideFromLeft = {
  hidden: { opacity: 0, x: -60 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] },
  },
};

const slideFromRight = {
  hidden: { opacity: 0, x: 60 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.1 },
  },
};

interface DriverProfileClientProps {
  driver: OpenF1Driver;
  latestLap: LapData | null;
  driverNum: number;
  children: ReactNode;
}

export default function DriverProfileClient({ driver, latestLap, children }: DriverProfileClientProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
      {/* ── Left Column: Driver Visual (slide from left) ── */}
      <motion.div
        className="lg:col-span-5 relative"
        initial="hidden"
        animate="visible"
        variants={slideFromLeft}
      >
        <div className="relative aspect-[4/5] bg-white/5 border border-white/10 lg:skew-x-[-4deg] overflow-hidden group">
          <div className="absolute inset-0 z-20 pointer-events-none opacity-[0.05] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%]" />
          {/* Image slot — passed via children (first element) */}
          {Array.isArray(children) ? children[1] : null}
          <div className="absolute -bottom-8 -left-8 text-[8rem] font-black italic text-white/[0.03] select-none leading-none rotate-[-90deg] origin-top-left uppercase">
            {driver.team_name}
          </div>
          <div
            className="absolute bottom-0 left-0 w-full h-2 z-30 shadow-[0_-10px_30px_rgba(0,0,0,0.5)]"
            style={{ backgroundColor: `#${driver.team_colour}` }}
          />
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-4 mt-8 lg:skew-x-[-4deg]">
          {[
            { label: "Status", content: <><div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /><span className="text-xs font-black uppercase tracking-tighter">Active</span></> },
            { label: "Unit ID", content: <span className="text-xs font-black uppercase tracking-tighter font-mono">DRV.{driver.driver_number}</span> },
            { label: "Session", content: <span className="text-xs font-black uppercase tracking-tighter font-mono text-[#e10600]">{latestLap ? `LAP.${latestLap.lap_number}` : "LIVE.F1"}</span> },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              className="bg-white/5 border border-white/5 p-4 hover:bg-white/10 transition-colors"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + i * 0.08, duration: 0.5, ease: "easeOut" }}
            >
              <p className="text-[8px] font-black text-white/20 uppercase tracking-widest mb-1">{stat.label}</p>
              <div className="flex items-center gap-1.5">{stat.content}</div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* ── Right Column: Dossier (slide from right) ── */}
      <motion.div
        className="lg:col-span-7"
        initial="hidden"
        animate="visible"
        variants={slideFromRight}
      >
        {/* Header */}
        <div className="mb-16">
          <motion.div
            className="flex items-center gap-4 mb-4"
            custom={0}
            variants={fadeUp}
            initial="hidden"
            animate="visible"
          >
            <span className="text-[10px] font-black uppercase tracking-[0.5em] text-[#e10600] font-[family-name:var(--font-space)]">
              {"// EXECUTIVE_DOSSIER.V4"}
            </span>
            <div className="h-[1px] flex-1 bg-white/5" />
          </motion.div>

          <div className="flex items-center justify-between gap-8 mb-6">
            <div>
              <h1 className="text-5xl md:text-8xl font-[family-name:var(--font-barlow)] font-900 italic uppercase leading-[0.8] tracking-tighter mb-2">
                {driver.full_name.split(" ").slice(0, -1).join(" ")} <br />
                <span className="text-[#e10600]">{driver.full_name.split(" ").pop()}</span>
              </h1>
              <h2 className="text-xl md:text-2xl font-[family-name:var(--font-barlow)] font-700 italic text-white/40 uppercase tracking-tight">
                {driver.team_name}
              </h2>
            </div>
            <div className="text-[8rem] font-[family-name:var(--font-barlow)] font-900 italic text-white/[0.05] leading-none select-none">
              {driver.driver_number}
            </div>
          </div>
        </div>

        {/* Telemetry slot — first child */}
        {Array.isArray(children) ? children[0] : children}

        {/* Biometric Metadata */}
        <motion.div
          className="bg-white/[0.01] border border-white/5 p-10 relative overflow-hidden"
          custom={0.3}
          variants={fadeUp}
          initial="hidden"
          animate="visible"
        >
          <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-[#e10600]/40" />
          <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-white/10" />
          <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-white/10" />
          <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-white/10" />

          <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-white/30 mb-10 flex items-center justify-between">
            <span>{"// BIOMETRIC.PROFILE_IDENTIFICATION"}</span>
            <span className="font-mono text-emerald-500/50">SECURE_LINK.v3.1</span>
          </h4>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-12">
            {[
              { label: "Country", value: "INTL.UNIT" },
              { label: "Age", value: "CAT.SENIOR" },
              { label: "Points", value: "DB.LATEST" },
              { label: "Gear", value: "TRANS.v8" }
            ].map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + i * 0.08, duration: 0.5, ease: "easeOut" }}
              >
                <p className="text-[9px] font-bold text-white/20 uppercase tracking-widest mb-3">{stat.label}</p>
                <p className="text-lg font-[family-name:var(--font-barlow)] font-900 italic uppercase text-white/80">{stat.value}</p>
              </motion.div>
            ))}
          </div>

          <div className="mt-12 pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between gap-8">
            <div className="max-w-md">
              <p className="text-[10px] font-black uppercase tracking-widest text-[#e10600] mb-3 font-[family-name:var(--font-space)]">Unit Objective</p>
              <p className="text-sm text-white/40 italic leading-relaxed tracking-tight font-medium">
                This unit is currently engaged in high-performance competitive operations for {driver.team_name}. Strategic objectives include championship point accumulation and technical car development.
              </p>
            </div>
            <div className="flex flex-col justify-end">
              <p className="text-[10px] font-black uppercase tracking-widest text-white/20 mb-3 text-right">Data Integrity Status</p>
              <div className="flex items-center gap-2 justify-end">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_10px_#10b981]" />
                <span className="text-[10px] font-black uppercase tracking-widest text-emerald-500">Verified.LIVE</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Footer IDs */}
        <div className="mt-16 flex justify-between items-center opacity-20 select-none">
          <span className="text-[8px] font-mono tracking-widest uppercase">system_auth: hash_8b2f902c</span>
          <span className="text-[8px] font-mono tracking-widest uppercase">unit_enc: hash_x9{driver.driver_number}</span>
        </div>
      </motion.div>
    </div>
  );
}
