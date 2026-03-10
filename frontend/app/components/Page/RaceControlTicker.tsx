"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { RaceControl } from "../../types/f1";
import { fetchRaceControl } from "../../lib/f1";

export default function RaceControlTicker() {
  const [messages, setMessages] = useState<RaceControl[]>([]);

  useEffect(() => {
    const loadMessages = async () => {
      const data = await fetchRaceControl();
      setMessages(data);
    };

    loadMessages();
    const interval = setInterval(loadMessages, 30000); // 30s check
    return () => clearInterval(interval);
  }, []);

  if (messages.length === 0) return null;

  return (
    <div className="w-full bg-[#e10600]/5 border-y border-[#e10600]/20 py-2 overflow-hidden whitespace-nowrap relative">
      <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-black to-transparent z-10" />
      <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-black to-transparent z-10" />
      
      <motion.div 
        className="flex gap-12 px-24 items-center"
        animate={{ x: [0, -1000] }}
        transition={{ 
          duration: 40, 
          repeat: Infinity, 
          ease: "linear" 
        }}
      >
        {/* Duplicate messages for continuous loop effect */}
        {[...messages, ...messages].map((msg, idx) => (
          <div key={idx} className="flex items-center gap-4 shrink-0">
            <span className="text-[10px] font-[family-name:var(--font-space)] font-900 bg-[#e10600] text-white px-2 py-0.5 skew-x-[-12deg] tracking-tighter">
              {msg.category.toUpperCase()}
            </span>
            <span className="text-[11px] font-[family-name:var(--font-barlow)] font-600 uppercase tracking-widest text-white/80">
              {msg.message}
            </span>
            <div className="w-1.5 h-1.5 rounded-full bg-white/10" />
          </div>
        ))}
      </motion.div>
    </div>
  );
}
