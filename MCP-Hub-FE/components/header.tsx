"use client";

import { motion } from "framer-motion";

export default function Header() {
  return (
    <header className="fixed top-0 w-full z-50 bg-black/50 backdrop-blur-md border-b border-cyan-900/20">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-2"
        >
          <div className="w-8 h-8 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-lg">⚙</span>
          </div>
          <span className="text-xl font-bold text-white">MCPHub</span>
        </motion.div>

        {/* Navigation */}
        <motion.nav
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-8"
        >
          <a
            href="#"
            className="text-gray-300 hover:text-white transition-colors"
          >
            Docs
          </a>
          <a
            href="#"
            className="text-gray-300 hover:text-white transition-colors"
          >
            Playground
          </a>
          <button className="px-6 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-lg font-semibold hover:from-cyan-400 hover:to-blue-500 transition-all duration-200 hover:shadow-lg hover:shadow-cyan-500/50">
            Publish Server
          </button>
          <a
            href="#"
            className="text-gray-300 hover:text-white transition-colors"
          >
            Login
          </a>
        </motion.nav>
      </div>
    </header>
  );
}
