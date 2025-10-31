"use client";

import { motion } from "framer-motion";
import { AlertCircle, ChevronDown, Copy } from "lucide-react";
import { useState } from "react";

interface ServerDetailProps {
  server: {
    id: number;
    name: string;
    handle: string;
    lastDeployed: string;
    icon: string;
    about: string;
    tools: Array<{
      name: string;
      description: string;
    }>;
    connectionUrl: string;
    tags: string[];
    clients: {
      auto: string[];
      json: string[];
      typescript: string[];
      python: string[];
    };
  };
}

export default function ServerDetail({ server }: ServerDetailProps) {
  const [expandedTool, setExpandedTool] = useState<number | null>(0);
  const [activeTab, setActiveTab] = useState<
    "auto" | "json" | "typescript" | "python"
  >("auto");
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(server.connectionUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="px-6 py-12 max-w-7xl mx-auto relative z-10"
    >
      {/* Server Header */}
      <div className="mb-12 pb-8 border-b border-cyan-900/30">
        <div className="flex items-start justify-between mb-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-start gap-4"
          >
            <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center text-4xl">
              {server.icon}
            </div>
            <div>
              <div className="flex items-center gap-2 mb-2">
                <h1 className="text-4xl font-bold text-white">{server.name}</h1>
                <span className="text-gray-500">⊚</span>
              </div>
              <p className="text-gray-400 text-sm">{server.handle}</p>
              <p className="text-gray-500 text-xs mt-2">
                last deployed {server.lastDeployed}
              </p>
            </div>
          </motion.div>
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-lg font-semibold hover:from-cyan-400 hover:to-blue-500 transition-all duration-200 hover:shadow-lg hover:shadow-cyan-500/50"
          >
            Explore capabilities +
          </motion.button>
        </div>

        {/* Tags */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex items-center gap-2"
        >
          {server.tags.map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center gap-1 text-xs text-gray-400 bg-gray-900/50 px-3 py-1 rounded-full border border-gray-800/50"
            >
              {tag === "Remote" && (
                <span className="w-2 h-2 rounded-full bg-cyan-500" />
              )}
              {tag === "Open Source" && <span>✓</span>}
              {tag === "2 tools" && <span>⚙</span>}
              {tag}
            </span>
          ))}
        </motion.div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-3 gap-12">
        {/* Left Column */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="col-span-2 space-y-12"
        >
          {/* About Section */}
          <section>
            <div className="flex items-center gap-2 mb-6">
              <span className="text-2xl">ℹ</span>
              <h2 className="text-2xl font-bold text-white">About</h2>
            </div>
            <p className="text-gray-300 leading-relaxed">{server.about}</p>
          </section>

          {/* Tools Section */}
          <section>
            <div className="flex items-center gap-2 mb-6">
              <span className="text-2xl">⚙</span>
              <h2 className="text-2xl font-bold text-white">Tools</h2>
            </div>
            <div className="space-y-3">
              {server.tools.map((tool, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className="border border-gray-800 rounded-lg overflow-hidden bg-gray-900/30 hover:bg-gray-900/50 transition-colors"
                >
                  <button
                    onClick={() =>
                      setExpandedTool(expandedTool === index ? null : index)
                    }
                    className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-800/50 transition-colors"
                  >
                    <h3 className="text-white font-semibold text-left">
                      {tool.name}
                    </h3>
                    <ChevronDown
                      className={`w-5 h-5 text-gray-400 transition-transform ${expandedTool === index ? "rotate-180" : ""}`}
                    />
                  </button>
                  {expandedTool === index && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="px-6 pb-4 border-t border-gray-800"
                    >
                      <p className="text-gray-400 text-sm">
                        {tool.description}
                      </p>
                    </motion.div>
                  )}
                </motion.div>
              ))}
            </div>
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="mt-8 px-6 py-3 bg-gray-900/50 hover:bg-gray-800 text-gray-300 rounded-lg font-semibold border border-gray-800 transition-colors"
            >
              Explore capabilities +
            </motion.button>
          </section>
        </motion.div>

        {/* Right Column - Connect Section */}
        <motion.section
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="col-span-1"
        >
          <div className="flex items-center gap-2 mb-6">
            <span className="text-2xl">🔗</span>
            <h2 className="text-2xl font-bold text-white">Connect</h2>
            <button className="ml-auto text-gray-400 hover:text-white transition-colors">
              <span className="text-xl">⚙</span>
            </button>
          </div>

          {/* Connection URL */}
          <div className="mb-8">
            <p className="text-xs text-gray-400 mb-3 uppercase tracking-wider">
              Get connection URL
            </p>
            <div className="relative">
              <input
                type="text"
                value={server.connectionUrl}
                readOnly
                className="w-full bg-gray-900/50 border border-gray-800 rounded-lg px-4 py-3 text-gray-300 text-sm font-mono"
              />
              <button
                onClick={copyToClipboard}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-cyan-400 transition-colors"
              >
                <Copy className="w-4 h-4" />
              </button>
              {copied && <p className="text-xs text-cyan-400 mt-2">Copied!</p>}
            </div>
          </div>

          {/* Warning */}
          <div className="flex items-start gap-2 p-4 bg-orange-900/20 border border-orange-800/50 rounded-lg mb-8">
            <AlertCircle className="w-4 h-4 text-orange-500 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-orange-200">
              Client doesn't support OAuth yet or link isn't working?{" "}
              <a
                href="#"
                className="text-orange-400 hover:text-orange-300 underline"
              >
                Get URL with keys instead
              </a>
            </p>
          </div>

          {/* Or add to your client */}
          <p className="text-sm text-gray-400 mb-6">Or add to your client</p>

          {/* Tabs */}
          <div className="flex gap-1 mb-6 border-b border-gray-800">
            {(["auto", "json", "typescript", "python"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-3 text-sm font-semibold transition-colors border-b-2 ${
                  activeTab === tab
                    ? "text-white border-cyan-500"
                    : "text-gray-400 border-transparent hover:text-gray-300"
                }`}
              >
                {tab === "auto" && "⚡ Auto"}
                {tab === "json" && "{} JSON"}
                {tab === "typescript" && "TS TypeScript"}
                {tab === "python" && "🐍 Python"}
              </button>
            ))}
          </div>

          {/* Clients List */}
          <div className="space-y-3">
            <input
              type="text"
              placeholder="Search clients"
              className="w-full bg-gray-900/50 border border-gray-800 rounded-lg px-4 py-2 text-sm text-gray-300 placeholder-gray-500 mb-4"
            />
            {server.clients[activeTab] &&
            server.clients[activeTab].length > 0 ? (
              server.clients[activeTab].map((client, index) => (
                <motion.div
                  key={client}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className="flex items-center gap-3 p-3 bg-gray-900/30 rounded-lg hover:bg-gray-900/50 transition-colors cursor-pointer"
                >
                  <span className="text-lg">
                    {client === "ChatGPT" && "🤖"}
                    {client === "Poke" && "👉"}
                    {client === "Claude Desktop" && "🧠"}
                    {client === "Claude Code" && "💻"}
                    {client === "Cursor" && "⚡"}
                  </span>
                  <span className="text-gray-300 text-sm font-medium">
                    {client}
                  </span>
                </motion.div>
              ))
            ) : (
              <p className="text-gray-500 text-sm py-4 text-center">
                No clients available for this tab
              </p>
            )}
          </div>
        </motion.section>
      </div>
    </motion.div>
  );
}
