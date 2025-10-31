"use client";

import Header from "@/components/header";
import ToolCard from "@/components/tool-card";
import { motion } from "framer-motion";

const allTools = [
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
  {
    id: 5,
    name: "GitHub",
    handle: "@github/mcp-server",
    description:
      "Access GitHub repositories, issues, and pull requests. Manage your development workflow...",
    icon: "🐙",
    tag: "Remote",
    metric: "523.2k",
    color: "from-purple-400 to-purple-600",
  },
  {
    id: 6,
    name: "Slack",
    handle: "@slack/mcp-integration",
    description:
      "Send and receive messages, manage channels, and integrate with your team communication...",
    icon: "💬",
    tag: "Remote",
    metric: "389.5k",
    color: "from-pink-400 to-pink-600",
  },
  {
    id: 7,
    name: "Notion",
    handle: "@notion/mcp-connector",
    description:
      "Connect to Notion workspace, query databases, and manage pages. Perfect for documentation...",
    icon: "📝",
    tag: "Remote",
    metric: "234.7k",
    color: "from-indigo-400 to-indigo-600",
  },
  {
    id: 8,
    name: "PostgreSQL",
    handle: "@postgres/mcp-database",
    description:
      "Direct database access with query execution, schema management, and data operations...",
    icon: "🐘",
    tag: "Local",
    metric: "678.9k",
    color: "from-blue-400 to-cyan-600",
  },
  {
    id: 9,
    name: "Redis Cache",
    handle: "@redis/mcp-cache",
    description:
      "High-performance caching layer with pub/sub support and real-time data synchronization...",
    icon: "🔴",
    tag: "Local",
    metric: "445.3k",
    color: "from-red-400 to-orange-600",
  },
  {
    id: 10,
    name: "MongoDB",
    handle: "@mongodb/mcp-nosql",
    description:
      "NoSQL database integration with document queries, aggregation pipelines, and collections...",
    icon: "🍃",
    tag: "Local",
    metric: "567.8k",
    color: "from-green-400 to-teal-600",
  },
  {
    id: 11,
    name: "OpenAI",
    handle: "@openai/mcp-gpt",
    description:
      "Access GPT models, embeddings, and AI capabilities. Generate content, analyze text, and more...",
    icon: "🤖",
    tag: "Remote",
    metric: "892.1k",
    color: "from-green-400 to-blue-600",
  },
  {
    id: 12,
    name: "Stripe",
    handle: "@stripe/mcp-payments",
    description:
      "Process payments, manage subscriptions, and handle financial transactions securely...",
    icon: "💳",
    tag: "Remote",
    metric: "321.4k",
    color: "from-purple-400 to-blue-600",
  },
  {
    id: 13,
    name: "AWS S3",
    handle: "@aws/mcp-s3-storage",
    description:
      "Object storage with high availability. Upload, download, and manage files in the cloud...",
    icon: "☁️",
    tag: "Remote",
    metric: "756.2k",
    color: "from-orange-400 to-yellow-600",
  },
  {
    id: 14,
    name: "Docker",
    handle: "@docker/mcp-containers",
    description:
      "Container management and orchestration. Build, deploy, and monitor containerized apps...",
    icon: "🐳",
    tag: "Local",
    metric: "634.5k",
    color: "from-blue-400 to-cyan-600",
  },
  {
    id: 15,
    name: "Figma",
    handle: "@figma/mcp-design",
    description:
      "Design system integration with component exports, style tokens, and collaborative features...",
    icon: "🎨",
    tag: "Remote",
    metric: "289.6k",
    color: "from-pink-400 to-purple-600",
  },
  {
    id: 16,
    name: "Jira",
    handle: "@atlassian/mcp-jira",
    description:
      "Project management and issue tracking. Create tickets, manage sprints, and track progress...",
    icon: "📊",
    tag: "Remote",
    metric: "412.8k",
    color: "from-blue-400 to-indigo-600",
  },
];

export default function ExplorePage() {
  return (
    <div
      className="min-h-screen bg-black overflow-x-hidden"
      style={{
        backgroundImage: "linear-gradient(135deg, #000000 0%, #0a1e35 100%)",
      }}
    >
      <Header />
      <main className="pt-20 px-6 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="py-12"
        >
          <div className="flex items-center gap-3 mb-12">
            <h1 className="text-4xl font-bold text-white">Explore All MCP Servers</h1>
            <span className="bg-cyan-500/20 text-cyan-300 px-4 py-2 rounded-full text-lg font-semibold">
              {allTools.length}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {allTools.map((tool, index) => (
              <motion.div
                key={tool.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
              >
                <ToolCard tool={tool} />
              </motion.div>
            ))}
          </div>
        </motion.div>
      </main>
    </div>
  );
}
