"use client";

import { useRef, useEffect } from "react";
import Link from "next/link";
import type { OpenF1Driver } from "../../types/f1";

interface CardHeroProps {
  driver: OpenF1Driver;
}

export default function CardHero({ driver }: CardHeroProps) {
  const cardRef = useRef<HTMLAnchorElement>(null);
  const imgRef  = useRef<HTMLImageElement>(null);
  const dotRef  = useRef<HTMLDivElement>(null);

  const displayName = driver.last_name.toUpperCase();

  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;

    let raf: number;

    const update = () => {
      const rect       = card.getBoundingClientRect();
      const cardCenterX = rect.left + rect.width / 2;
      const vpCenterX  = window.innerWidth / 2;
      const offset     = cardCenterX - vpCenterX;
      const maxOffset  = window.innerWidth * 0.52;

      const raw     = -(offset / maxOffset) * 58;
      const rotateY = Math.max(-65, Math.min(65, raw));

      const angleRad   = (rotateY * Math.PI) / 180;
      const translateZ = -Math.abs(Math.sin(angleRad)) * 80;

      card.style.transform = `rotateY(${rotateY}deg) translate3d(0, 0, ${translateZ}px)`;

      // Asymmetric effect: Color on right, Grayscale on left
      // offset > 0 is right, offset < 0 is left
      const transitionWidth = 150; 
      const gs = Math.min(1, Math.max(0, (-offset + 40) / transitionWidth));
      
      // Brightness also dims as it moves to the archive (left)
      const bright = Math.max(0.4, Math.min(0.85, 0.65 + (offset / maxOffset) * 0.35));

      if (imgRef.current) {
        imgRef.current.style.filter = `grayscale(${gs}) brightness(${bright})`;
      }
      if (dotRef.current) {
        // Halftone dots only appear for the grayscale/archive side (left)
        dotRef.current.style.opacity = String(Math.min(0.45, gs * 0.8));
      }

      raf = requestAnimationFrame(update);
    };

    raf = requestAnimationFrame(update);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <Link 
      href={`/drivers/${driver.driver_number}`}
      ref={cardRef}
      className="relative flex-shrink-0 rounded-2xl overflow-hidden border cursor-pointer group block"
      style={{
        width: "210px",
        height: "340px",
        borderColor: "rgba(255,255,255,0.12)",
        boxShadow: "0 0 0 1px rgba(255,255,255,0.08), 0 20px 50px rgba(0,0,0,0.8)",
        transformStyle: "preserve-3d",
        backfaceVisibility: "hidden",
      }}
    >
      {/* Driver headshot from OpenF1 — upgrade 1col → 4col for higher res */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        ref={imgRef}
        src={driver.headshot_url.replace("/1col/", "/4col/")}
        alt={driver.full_name}
        className="absolute inset-0 w-full h-full object-cover object-top"
        style={{ filter: "grayscale(0) brightness(0.85)" }}
        onError={(e) => {
          // Fallback to 1col if 4col doesn't exist
          const el = e.target as HTMLImageElement;
          if (el.src.includes("/4col/")) {
            el.src = driver.headshot_url;
          } else {
            el.style.display = "none";
          }
        }}
      />

      {/* Halftone dot overlay */}
      <div
        ref={dotRef}
        className="absolute inset-0 z-10 pointer-events-none mix-blend-overlay"
        style={{
          opacity: 0,
          backgroundImage: "radial-gradient(circle, rgba(255,255,255,1) 1px, transparent 1px)",
          backgroundSize: "5px 5px",
        }}
      />

      {/* Team colour top bar */}
      <div
        className="absolute top-0 left-0 right-0 h-[3px] z-20"
        style={{ backgroundColor: `#${driver.team_colour}` }}
      />

      {/* Vignette */}
      <div className="absolute inset-0 z-20 bg-gradient-to-t from-black/95 via-black/10 to-transparent pointer-events-none" />

      {/* Info */}
      <div className="absolute bottom-0 left-0 right-0 z-30 p-5">
        <span className="text-[10px] font-[family-name:var(--font-space)] font-bold text-white/30 block mb-1 tracking-[0.2em]">
          NO. {driver.driver_number}
        </span>
        <h3 className="text-2xl font-[family-name:var(--font-barlow)] font-[900] uppercase tracking-[-0.04em] italic text-white leading-[0.8]">
          {displayName}
        </h3>
        <p className="text-[10px] font-[family-name:var(--font-space)] font-semibold uppercase tracking-[0.25em] mt-3" style={{ color: `#${driver.team_colour}` }}>
          {driver.team_name}
        </p>
      </div>
    </Link>
  );
}