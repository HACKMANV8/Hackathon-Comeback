"use client";

import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRef, useState } from "react";
import ToolCard from "./tool-card";

const tools = [
  {
    id: 1,
    name: "Linkup",
    handle: "@LinkupPlatform/linkup-mcp-server",
    description:
      "Search the web in real time to get trustworthy, source-backed answers. Find the latest news...",
    icon: "🔗",
    tag: "Remote",
    metric: "457",
    color: "from-orange-400 to-orange-600",
  },
  {
    id: 2,
    name: "Exa Search",
    handle: "exa",
    description:
      "Fast, intelligent web search and web crawling. New mcp tool! Exa-code is a context tool for...",
    icon: "🔍",
    tag: "Remote",
    metric: "418.81k",
    color: "from-blue-400 to-blue-600",
  },
  {
    id: 3,
    name: "Supabase",
    handle: "supabase",
    description:
      "Search the Supabase docs for up-to-date guidance and troubleshoot errors quickly...",
    icon: "🟢",
    tag: "Remote",
    metric: "46.91k",
    color: "from-green-400 to-green-600",
  },
  {
    id: 4,
    name: "Browserbase",
    handle: "@browserbasehq/mcp-browserbase",
    description:
      "Provides cloud browser automation capabilities using Stagehand and...",
    icon: "🌐",
    tag: "Remote",
    metric: "44.41k",
    color: "from-red-400 to-red-600",
  },
];

export default function ExploreSection() {
  const scrollContainer = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const scroll = (direction: "left" | "right") => {
    if (scrollContainer.current) {
      const scrollAmount = 400;
      scrollContainer.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
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
          <h2 className="text-3xl font-bold text-white">Explore</h2>
          <a
            href="/explore"
            className="text-sm font-medium text-gray-300/90 hover:text-white transition-colors duration-200 flex items-center gap-2"
          >
            View all <span>→</span>
          </a>
        </div>

        {/* Scrollable Container */}
        <div className="relative">
          <div
            ref={scrollContainer}
            onScroll={handleScroll}
            className="flex gap-6 overflow-x-auto scroll-smooth py-2 pb-4 hide-scrollbar"
          >
            {tools.map((tool, index) => (
              <motion.div
                key={tool.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="w-[340px] flex-shrink-0"
              >
                <ToolCard tool={tool} />
              </motion.div>
            ))}
          </div>

          {/* Navigation Arrows - Enhanced */}
          {canScrollLeft && (
            <button
              onClick={() => scroll("left")}
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-12 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 text-white p-3 rounded-full transition-all duration-200 z-20 backdrop-blur-sm"
              aria-label="Scroll left"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
          )}
          {canScrollRight && (
            <button
              onClick={() => scroll("right")}
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-12 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 text-white p-3 rounded-full transition-all duration-200 z-20 backdrop-blur-sm"
              aria-label="Scroll right"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          )}
        </div>
      </motion.div>
    </section>
  );
}
