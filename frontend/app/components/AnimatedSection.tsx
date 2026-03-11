"use client";

import { motion, Variants } from "framer-motion";
import { ReactNode } from "react";

const fadeUpVariants: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  },
};

const fadeInVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

const slideLeftVariants: Variants = {
  hidden: { opacity: 0, x: -60 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
  },
};

const slideRightVariants: Variants = {
  hidden: { opacity: 0, x: 60 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
  },
};

const VARIANTS = {
  "fade-up": fadeUpVariants,
  "fade-in": fadeInVariants,
  "slide-left": slideLeftVariants,
  "slide-right": slideRightVariants,
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
  const selectedVariant = VARIANTS[variant];

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once, margin: "-80px" }}
      variants={{
        hidden: selectedVariant.hidden,
        visible: {
          ...(selectedVariant.visible as object),
          transition: {
            ...((selectedVariant.visible as { transition?: object }).transition ?? {}),
            delay,
          },
        },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
