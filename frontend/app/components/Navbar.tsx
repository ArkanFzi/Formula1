"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_LINKS = [
  { href: "/",            label: "Home",        code: "01" },
  { href: "/drivers",     label: "Drivers",     code: "02" },
  { href: "/schedule",    label: "Schedule",    code: "03" },
  { href: "/race-center", label: "Race Center", code: "04" },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <nav
      className="sticky top-0 z-[100] transition-all duration-300"
      style={{
        background: "linear-gradient(to bottom, rgba(5,5,5,0.98) 0%, rgba(5,5,5,0.88) 100%)",
        backdropFilter: "blur(24px) saturate(180%)",
        WebkitBackdropFilter: "blur(24px) saturate(180%)",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
      }}
    >
      {/* Top accent line — racing stripe */}
      <div className="absolute top-0 left-0 right-0 h-[2px] pointer-events-none">
        <div
          className="h-full"
          style={{
            background: "linear-gradient(to right, transparent 0%, #e10600 20%, #ff8c00 50%, #e10600 80%, transparent 100%)",
          }}
        />
      </div>

      <div className="max-w-[1400px] mx-auto px-6 h-[60px] flex items-center justify-between">

        {/* ── Logo ── */}
        <Link href="/" className="flex items-center gap-3 group select-none">
          {/* Red flag icon */}
          <div className="flex gap-[3px] items-end">
            <div className="w-[3px] h-4 bg-red-600" />
            <div
              className="relative overflow-hidden"
              style={{
                width: "22px",
                height: "14px",
                background: "#e10600",
                clipPath: "polygon(0 0, 100% 0, 85% 100%, 0 100%)",
              }}
            />
          </div>

          {/* Wordmark */}
          <div className="flex items-baseline gap-[2px]">
            <span
              className="font-black uppercase leading-none tracking-[0.06em] text-white"
              style={{ fontSize: "17px", letterSpacing: "0.05em" }}
            >
              Formula
            </span>
            <span
              className="font-black leading-none text-red-500"
              style={{
                fontSize: "22px",
                fontStyle: "italic",
                lineHeight: 1,
              }}
            >
              1
            </span>
          </div>

          {/* Season badge */}
          <div
            className="hidden sm:flex items-center px-2 py-[2px] rounded-sm text-[9px] font-mono tracking-[0.15em] text-white/30 border border-white/10 uppercase"
          >
            2025
          </div>
        </Link>

        {/* ── Nav Links ── */}
        <div className="flex items-center gap-1">
          {NAV_LINKS.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className="relative flex items-center gap-2 px-4 py-2 group transition-all duration-300"
              >
                {/* Hover/Active background */}
                <div
                  className={`absolute inset-0 rounded-sm transition-opacity duration-300 ${
                    isActive ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                  }`}
                  style={{
                    background: isActive
                      ? "linear-gradient(135deg, rgba(225,6,0,0.12) 0%, rgba(255,140,0,0.06) 100%)"
                      : "rgba(255,255,255,0.04)",
                    border: isActive ? "1px solid rgba(225,6,0,0.25)" : "1px solid rgba(255,255,255,0.06)",
                  }}
                />

                {/* Code number */}
                <span
                  className={`relative font-mono text-[9px] transition-colors duration-300 ${
                    isActive ? "text-red-500" : "text-white/20 group-hover:text-white/40"
                  }`}
                >
                  {link.code}
                </span>

                {/* Label */}
                <span
                  className={`relative text-[12px] font-semibold uppercase tracking-[0.12em] transition-colors duration-300 ${
                    isActive ? "text-white" : "text-white/45 group-hover:text-white/80"
                  }`}
                >
                  {link.label}
                </span>

                {/* Active dot */}
                {isActive && (
                  <span className="relative w-[4px] h-[4px] rounded-full bg-red-500" />
                )}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
