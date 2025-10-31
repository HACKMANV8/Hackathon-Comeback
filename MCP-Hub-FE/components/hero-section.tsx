"use client";

import { motion } from "framer-motion";
import { Search } from "lucide-react";
import GradientLines from "./gradient-lines";

export default function HeroSection() {
  return (
    <section className="relative min-h-[90vh] flex flex-col items-center justify-center px-6 py-20">
      {/* Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center max-w-3xl z-10"
      >
        <h1 className="text-6xl md:text-7xl font-bold text-white mb-6 leading-tight">
          Your Agent's Gateway to the World
        </h1>
        <p className="text-xl text-gray-300 mb-12">
          Extend your AI with 2317 tools and skills built by the community.
        </p>

        {/* Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative max-w-2xl mx-auto mb-20"
        >
          <input
            type="text"
            placeholder="automate web browser interact"
            className="w-full px-6 py-4 bg-gradient-to-b from-gray-800 to-gray-900 border border-cyan-500/30 rounded-2xl text-white placeholder-gray-500 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 transition-all duration-300"
          />
          <Search className="absolute right-6 top-4 w-5 h-5 text-gray-400" />
        </motion.div>
      </motion.div>

      {/* Animated Gradient Lines */}
      <GradientLines />
    </section>
  );
}
