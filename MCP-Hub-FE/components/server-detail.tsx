"use client";

import { motion } from "framer-motion";
import { Terminal, Copy, Code } from "lucide-react";
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
      parameters?: Array<{
        name: string;
        type: string;
        required: boolean;
        description: string;
      }>;
    }>;
    connectionUrl: string;
    tags: string[];
    clients: {
      auto: string[];
      json: string[];
    };
  };
}

// Supported clients with icons
const supportedClients = {
  auto: [
    { name: "VS Code", icon: "💻" },
    { name: "Cursor", icon: "⚡" },
    { name: "Windsurf", icon: "🌊" },
    { name: "Claude Desktop", icon: "🧠" },
    { name: "ChatGPT", icon: "🤖" },
    { name: "Gemini", icon: "✨" },
  ],
  json: [
    { name: "VS Code", icon: "💻" },
    { name: "Cursor", icon: "⚡" },
    { name: "Windsurf", icon: "🌊" },
    { name: "Claude Desktop", icon: "🧠" },
    { name: "ChatGPT", icon: "🤖" },
    { name: "Gemini", icon: "✨" },
  ],
};

export default function ServerDetail({ server }: ServerDetailProps) {
  const [activeTab, setActiveTab] = useState<"auto" | "json">("auto");
  const [copied, setCopied] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const pullCommand = `mcphub pull ${server.handle}`;

  const copyCommand = () => {
    navigator.clipboard.writeText(pullCommand);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const filteredClients = supportedClients[activeTab].filter(client =>
    client.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="px-6 py-12 max-w-7xl mx-auto relative z-10"
    >
      {/* Server Header - Centered */}
      <div className="mb-12 pb-8 border-b border-white/10">
        <div className="flex flex-col items-center text-center mb-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col items-center"
          >
            <div className="w-20 h-20 rounded-xl bg-white/5 flex items-center justify-center text-5xl mb-4">
              {server.icon}
            </div>
            <div>
              <div className="flex items-center justify-center gap-2 mb-2">
                <h1 className="text-4xl font-bold text-white/95">{server.name}</h1>
                <span className="text-gray-500">⊚</span>
              </div>
              <p className="text-gray-400/80 text-sm">{server.handle}</p>
              <p className="text-gray-500/70 text-xs mt-2">
                last deployed {server.lastDeployed}
              </p>
            </div>
          </motion.div>
        </div>

        {/* Tags - Centered */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex items-center justify-center gap-2 flex-wrap"
        >
          {server.tags.map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center gap-1.5 text-xs text-gray-400/80 bg-white/5 px-3 py-1.5 rounded-full border border-white/10"
            >
              {tag === "Remote" && (
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400/80" />
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
              <h2 className="text-2xl font-bold text-white/95">About</h2>
            </div>
            <p className="text-gray-300/80 leading-relaxed">{server.about}</p>
          </section>

          {/* Tools Section - Improved */}
          <section>
            <div className="flex items-center gap-2 mb-6">
              <Code className="w-6 h-6 text-cyan-400" />
              <h2 className="text-2xl font-bold text-white/95">Tools</h2>
            </div>
            <div className="space-y-4">
              {server.tools.map((tool, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className="p-6 border border-white/10 rounded-xl bg-white/[0.02] hover:bg-white/[0.04] hover:border-white/20 transition-all duration-200"
                >
                  <h3 className="text-lg font-semibold text-white/95 mb-3">
                    {tool.name}
                  </h3>
                  <p className="text-gray-400/80 text-sm leading-relaxed mb-4">
                    {tool.description}
                  </p>
                  
                  {/* Parameters if available */}
                  {tool.parameters && tool.parameters.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-white/5">
                      <p className="text-xs font-semibold text-gray-400/80 mb-3 uppercase tracking-wider">
                        Parameters
                      </p>
                      <div className="space-y-2">
                        {tool.parameters.map((param, idx) => (
                          <div key={idx} className="flex items-start gap-3 text-sm">
                            <code className="px-2 py-1 bg-white/5 rounded text-cyan-400 font-mono text-xs">
                              {param.name}
                            </code>
                            <span className={`px-2 py-1 rounded text-xs ${
                              param.required 
                                ? "bg-orange-500/20 text-orange-400" 
                                : "bg-gray-500/20 text-gray-400"
                            }`}>
                              {param.required ? "required" : "optional"}
                            </span>
                            <span className="px-2 py-1 bg-white/5 rounded text-gray-400 text-xs">
                              {param.type}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
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
            <Terminal className="w-6 h-6 text-cyan-400" />
            <h2 className="text-2xl font-bold text-white/95">Connect</h2>
          </div>

          {/* Run Command */}
          <div className="mb-8">
            <p className="text-xs text-gray-400/80 mb-3 uppercase tracking-wider">
              Run Command
            </p>
            <div className="relative">
              <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                <code className="text-cyan-400 font-mono text-sm break-all">
                  {pullCommand}
                </code>
              </div>
              <button
                onClick={copyCommand}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-2 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 rounded-lg transition-all duration-200"
                title="Copy command"
              >
                <Copy className="w-4 h-4 text-gray-300" />
              </button>
              {copied && (
                <motion.p
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-xs text-cyan-400 mt-2"
                >
                  Copied!
                </motion.p>
              )}
            </div>
          </div>

          {/* Or add to your client */}
          <p className="text-sm text-gray-400/80 mb-6">Or add to your client</p>

          {/* Tabs - Only Auto and JSON */}
          <div className="flex gap-2 mb-6 border-b border-white/10">
            {(["auto", "json"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-3 text-sm font-semibold transition-colors border-b-2 ${
                  activeTab === tab
                    ? "text-white/95 border-cyan-400"
                    : "text-gray-400/80 border-transparent hover:text-gray-300"
                }`}
              >
                {tab === "auto" && "⚡ Auto"}
                {tab === "json" && "{} JSON"}
              </button>
            ))}
          </div>

          {/* Search Clients */}
          <div className="mb-4">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search clients..."
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-gray-300/90 placeholder-gray-500 focus:outline-none focus:border-white/20 focus:bg-white/[0.07] transition-all duration-300"
            />
          </div>

          {/* Clients List */}
          <div className="space-y-3">
            {filteredClients.length > 0 ? (
              filteredClients.map((client, index) => (
                <motion.div
                  key={client.name}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className="flex items-center gap-3 p-3 bg-white/[0.02] rounded-xl hover:bg-white/[0.04] border border-white/10 hover:border-white/20 transition-all duration-200 cursor-pointer"
                >
                  <span className="text-xl">{client.icon}</span>
                  <span className="text-gray-300/90 text-sm font-medium">
                    {client.name}
                  </span>
                </motion.div>
              ))
            ) : (
              <p className="text-gray-500/80 text-sm py-4 text-center">
                No clients found
              </p>
            )}
          </div>
        </motion.section>
      </div>
    </motion.div>
  );
}
