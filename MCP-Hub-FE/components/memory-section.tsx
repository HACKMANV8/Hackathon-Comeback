"use client";

import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRef, useState } from "react";

const memoryItems = [
  { id: 1, name: "Cache Management", metric: "234" },
  { id: 2, name: "Vector Storage", metric: "189" },
  { id: 3, name: "Session State", metric: "456" },
  { id: 4, name: "Token Optimization", metric: "312" },
  { id: 5, name: "Context Windows", metric: "128" },
];

export default function MemorySection() {
  const scrollContainer = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const scroll = (direction: "left" | "right") => {
    if (scrollContainer.current) {
      scrollContainer.current.scrollBy({
        left: direction === "left" ? -300 : 300,
        behavior: "smooth",
      });
    }
  };

  const handleScroll = () => {
    if (scrollContainer.current) {
      setCanScrollLeft(scrollContainer.current.scrollLeft > 0);
      setCanScrollRight(
        scrollContainer.current.scrollLeft <
          scrollContainer.current.scrollWidth -
            scrollContainer.current.clientWidth,
      );
    }
  };

  return (
    <section className="py-20 px-6 max-w-7xl mx-auto relative z-10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
      >
        <div className="flex items-center justify-between mb-12">
          <div className="flex items-center gap-3">
            <h2 className="text-3xl font-bold text-white">Memory Management</h2>
            <span className="bg-cyan-500/20 text-cyan-300 px-3 py-1 rounded-full text-sm font-semibold">
              11
            </span>
          </div>
          <a
            href="#"
            className="text-cyan-400 hover:text-cyan-300 font-semibold flex items-center gap-1"
          >
            View all <span>→</span>
          </a>
        </div>

        {/* Scrollable Container */}
        <div className="relative">
          <div
            ref={scrollContainer}
            onScroll={handleScroll}
            className="flex gap-4 overflow-x-auto scroll-smooth pb-4"
            style={{ scrollBehavior: "smooth", scrollbarWidth: "none" }}
          >
            {memoryItems.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
                viewport={{ once: true }}
                className="min-w-max flex-shrink-0"
              >
                <div className="px-4 py-3 rounded-lg bg-gradient-to-br from-gray-900 to-gray-950 border border-cyan-900/30 hover:border-cyan-500/50 transition-all duration-300 group cursor-pointer">
                  <p className="text-white font-semibold text-sm">
                    {item.name}
                  </p>
                  <p className="text-cyan-400 text-xs font-bold mt-1">
                    ↗ {item.metric}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Navigation Arrows */}
          {canScrollLeft && (
            <button
              onClick={() => scroll("left")}
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-12 bg-cyan-500/20 hover:bg-cyan-500/40 text-white p-2 rounded-full transition-colors z-20"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
          )}
          {canScrollRight && (
            <button
              onClick={() => scroll("right")}
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-12 bg-cyan-500/20 hover:bg-cyan-500/40 text-white p-2 rounded-full transition-colors z-20"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          )}
        </div>
      </motion.div>
    </section>
  );
}
