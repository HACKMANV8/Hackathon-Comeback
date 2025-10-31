"use client";

import { motion } from "framer-motion";

export default function GradientLines() {
  return (
    <svg
      viewBox="0 0 1000 400"
      className="w-full max-w-4xl h-auto opacity-40 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-0"
      preserveAspectRatio="xMidYMid meet"
    >
      <defs>
        <linearGradient id="gradient1" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" style={{ stopColor: "#00b7ff", stopOpacity: 0 }} />
          <stop
            offset="50%"
            style={{ stopColor: "#00b7ff", stopOpacity: 0.8 }}
          />
          <stop
            offset="100%"
            style={{ stopColor: "#4dd0ff", stopOpacity: 0 }}
          />
        </linearGradient>
      </defs>

      {/* Central lines fanning out */}
      {[...Array(5)].map((_, i) => {
        const angle = (i - 2) * 25;
        const endX = 500 + Math.sin((angle * Math.PI) / 180) * 300;
        const endY = 350;

        return (
          <motion.line
            key={i}
            x1="500"
            y1="0"
            x2={endX}
            y2={endY}
            stroke="url(#gradient1)"
            strokeWidth="2"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{
              duration: 2,
              delay: i * 0.2,
              repeat: Number.POSITIVE_INFINITY,
              repeatType: "reverse",
            }}
          />
        );
      })}

      {/* Animated dots */}
      {[...Array(5)].map((_, i) => (
        <motion.circle
          key={`dot-${i}`}
          cx={500 + Math.sin(((i - 2) * 25 * Math.PI) / 180) * 300}
          cy={350}
          r="4"
          fill="#ff6b35"
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: i * 0.1 + 1 }}
        />
      ))}
    </svg>
  );
}
