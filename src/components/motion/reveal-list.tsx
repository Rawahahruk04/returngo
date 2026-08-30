"use client";

import * as React from "react";
import { motion, useReducedMotion } from "framer-motion";

/**
 * A staggered fade + rise, capped at a small offset and short
 * duration so it reads as polish, not a demo of the animation
 * library. Falls back to a plain fade under reduced-motion.
 */
export function RevealList({ children }: { children: React.ReactNode[] }) {
  const reduceMotion = useReducedMotion();

  return (
    <>
      {React.Children.map(children, (child, index) => (
        <motion.div
          initial={{ opacity: 0, y: reduceMotion ? 0 : 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: index * 0.06, ease: "easeOut" }}
        >
          {child}
        </motion.div>
      ))}
    </>
  );
}
