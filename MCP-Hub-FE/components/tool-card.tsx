"use client";

import { motion } from "framer-motion";
import Link from "next/link";

interface ToolCardProps {
  tool: {
    id: number;
    name: string;
    handle: string;
    description: string;
    icon: string;
    tag: string;
    metric: string;
    color: string;
  };
}

export default function ToolCard({ tool }: ToolCardProps) {
  return (
    <Link href={`/server/${tool.id}`}>
      <motion.div
        whileHover={{ y: -8, transition: { duration: 0.2 } }}
        className="min-w-[300px] flex-shrink-0 group"
      >
        <div className="relative p-6 rounded-xl bg-gradient-to-br from-gray-900 to-gray-950 border border-cyan-900/30 hover:border-cyan-500/50 transition-all duration-300 h-full overflow-hidden cursor-pointer">
          {/* Gradient background on hover */}
          <div className="absolute inset-0 opacity-0 group-hover:opacity-10 bg-gradient-to-br from-cyan-500 to-blue-500 transition-opacity duration-300" />

          {/* Glow effect */}
          <div className="absolute inset-0 opacity-0 group-hover:opacity-30 blur-xl bg-gradient-to-br from-cyan-500 to-transparent transition-opacity duration-500 pointer-events-none" />

          {/* Content */}
          <div className="relative z-10">
            {/* Header */}
            <div className="flex items-start gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center text-xl">
                {tool.icon}
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-white">{tool.name}</h3>
                <p className="text-sm text-gray-400">{tool.handle}</p>
              </div>
            </div>

            {/* Description */}
            <p className="text-gray-300 text-sm leading-relaxed mb-6 line-clamp-3">
              {tool.description}
            </p>

            {/* Footer */}
            <div className="flex items-center justify-between pt-4 border-t border-gray-800">
              <span className="inline-flex items-center gap-2 text-xs font-semibold text-gray-400">
                <span className="w-2 h-2 rounded-full bg-cyan-500" />
                {tool.tag}
              </span>
              <span className="text-sm font-semibold text-cyan-400">
                ↗ {tool.metric}
              </span>
            </div>
          </div>
        </div>
      </motion.div>
    </Link>
  );
}
