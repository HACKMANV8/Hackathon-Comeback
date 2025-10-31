"use client";

import Header from "@/components/header";
import ServerDetail from "@/components/server-detail";

const serverData: Record<number, any> = {
  1: {
    id: 1,
    name: "Linkup",
    handle: "@LinkupPlatform/linkup-mcp-server",
    lastDeployed: "4 days ago",
    icon: "🔗",
    about:
      "Search the web in real time to get trustworthy, source-backed answers. Find the latest news and comprehensive results from the most relevant sources. Use natural language queries to quickly gather facts, citations, and context.",
    tools: [
      {
        name: "Linkup web search (linkup-search)",
        description:
          "Search the web in real time using Linkup to retrieve current information, facts, and news from trusted sources. Use this tool for: real-time data (weather, stocks, sports scores, events), breaking news, current events, recent research, product information, up-to-date prices, schedules, and any information not available in your knowledge base. Returns comprehensive content from the most relevant sources.",
      },
      {
        name: "Linkup page fetch (linkup-fetch)",
        description:
          "Fetch a URL and return the content of the page. If you are unable to fetch the page content, might be worth trying to render the JavaScript content.",
      },
    ],
    connectionUrl: "https://mcp.linkup.so/mcp",
    tags: ["Remote", "2 tools", "Open Source"],
    clients: {
      auto: ["ChatGPT"],
      json: [],
      typescript: [],
      python: ["Poke", "Claude Desktop", "Claude Code", "Cursor"],
    },
  },
  2: {
    id: 2,
    name: "Exa Search",
    handle: "exa",
    lastDeployed: "2 days ago",
    icon: "🔍",
    about:
      "Fast, intelligent web search and web crawling. New mcp tool! Exa-code is a context tool for advanced search capabilities and AI-powered content discovery.",
    tools: [
      {
        name: "Web Search (exa-search)",
        description:
          "Perform intelligent web searches with advanced filtering and ranking capabilities.",
      },
      {
        name: "Content Analysis (exa-analyze)",
        description:
          "Extract and analyze content from web pages with AI-powered comprehension.",
      },
    ],
    connectionUrl: "https://exa.ai/mcp",
    tags: ["Remote", "2 tools"],
    clients: {
      auto: ["ChatGPT", "Poke"],
      json: [],
      typescript: ["Claude Code"],
      python: ["Claude Desktop", "Cursor"],
    },
  },
  3: {
    id: 3,
    name: "Supabase",
    handle: "supabase",
    lastDeployed: "1 day ago",
    icon: "🟢",
    about:
      "Search the Supabase docs for up-to-date guidance and troubleshoot errors quickly. Access comprehensive documentation for database, authentication, and real-time features.",
    tools: [
      {
        name: "Documentation Search (supabase-search)",
        description:
          "Search through Supabase documentation to find answers and solutions.",
      },
      {
        name: "API Reference (supabase-api)",
        description:
          "Access API reference documentation for Supabase services.",
      },
    ],
    connectionUrl: "https://supabase.io/mcp",
    tags: ["Remote", "2 tools"],
    clients: {
      auto: [],
      json: ["ChatGPT"],
      typescript: [],
      python: ["Claude Desktop", "Poke", "Cursor"],
    },
  },
  4: {
    id: 4,
    name: "Browserbase",
    handle: "@browserbasehq/mcp-browserbase",
    lastDeployed: "3 days ago",
    icon: "🌐",
    about:
      "Provides cloud browser automation capabilities using Stagehand and modern web scraping techniques. Automate complex browser interactions, extract data, and test web applications.",
    tools: [
      {
        name: "Browser Automation (browserbase-automate)",
        description:
          "Automate browser interactions and web scraping with cloud infrastructure.",
      },
      {
        name: "Screenshot Capture (browserbase-screenshot)",
        description: "Capture screenshots and visual data from web pages.",
      },
    ],
    connectionUrl: "https://browserbase.com/mcp",
    tags: ["Remote", "2 tools"],
    clients: {
      auto: ["ChatGPT", "Poke"],
      json: [],
      typescript: ["Claude Code"],
      python: ["Claude Desktop", "Cursor"],
    },
  },
};

export default function ServerPage({ params }: { params: { id: string } }) {
  const serverId = Number.parseInt(params.id);
  const server = serverData[serverId];

  if (!server) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-2xl">Server not found</div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen bg-black overflow-x-hidden"
      style={{
        backgroundImage: "linear-gradient(135deg, #000000 0%, #0a1e35 100%)",
      }}
    >
      <Header />
      <main className="pt-20">
        <ServerDetail server={server} />
      </main>
    </div>
  );
}
