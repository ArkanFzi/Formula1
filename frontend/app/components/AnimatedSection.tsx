"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

const VARIANTS = {
  "fade-up": {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0 },
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const },
  },
  "fade-in": {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    transition: { duration: 0.5, ease: "easeOut" as const },
  },
  "slide-left": {
    hidden: { opacity: 0, x: -60 },
    visible: { opacity: 1, x: 0 },
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const },
  },
  "slide-right": {
    hidden: { opacity: 0, x: 60 },
    visible: { opacity: 1, x: 0 },
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const },
  },
};

interface AnimatedSectionProps {
  children: ReactNode;
  variant?: keyof typeof VARIANTS;
  delay?: number;
  className?: string;
  once?: boolean;
}

export default function AnimatedSection({
  children,
  variant = "fade-up",
  delay = 0,
  className,
  once = true,
}: AnimatedSectionProps) {
  const { hidden, visible, transition } = VARIANTS[variant];

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once, margin: "-80px" }}
      variants={{
        hidden,
        visible: {
          ...visible,
          transition: { ...transition, delay },
        },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}