"use client";

import CardHero from "../3D/CardHero";
import type { OpenF1Driver } from "../../types/f1";

interface HeroCarouselProps {
  drivers: OpenF1Driver[];
}

export default function HeroCarousel({ drivers }: HeroCarouselProps) {
  // 2× duplicate for seamless -50% loop
  const loopDrivers = [...drivers, ...drivers];

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        height: "380px",
        overflow: "hidden",
        perspective: "900px",
        perspectiveOrigin: "50% 50%",
      }}
    >
      {/* High-tech Dossier Grid Overlay */}
      <div 
        className="absolute inset-0 z-40 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage: `
            linear-gradient(to right, white 1px, transparent 1px),
            linear-gradient(to bottom, white 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px'
        }}
      />
      
      {/* Scanning Line Effect */}
      <div 
        className="absolute inset-0 z-40 pointer-events-none overflow-hidden opacity-[0.05]"
      >
        <div 
          className="w-full h-[100px] bg-gradient-to-b from-transparent via-white to-transparent"
          style={{
            animation: 'scanline 8s linear infinite',
            transform: 'translateY(-100%)'
          }}
        />
      </div>

      {/* Neon centre streak */}
      <div
        style={{
          position: "absolute",
          top: 0, bottom: 0,
          left: "50%",
          transform: "translateX(-50%)",
          width: "2px",
          zIndex: 30,
          pointerEvents: "none",
          background: "linear-gradient(to bottom, transparent 0%, rgba(225,6,0,0) 8%, rgba(225,6,0,0.95) 30%, rgba(225,6,0,0.95) 70%, rgba(225,6,0,0) 92%, transparent 100%)",
          boxShadow: "0 0 28px 8px rgba(225,6,0,0.45), 0 0 70px 20px rgba(225,6,0,0.14)",
        }}
      />

      {/* Scrolling track */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "20px",
          height: "100%",
          width: "max-content",
          willChange: "transform",
          animation: "marqueeLeft 70s linear infinite",
          transformStyle: "preserve-3d",
        }}
      >
        {loopDrivers.map((driver, idx) => (
          <CardHero
            key={`${driver.driver_number}-${idx}`}
            driver={driver}
          />
        ))}
      </div>
    </div>
  );
}
