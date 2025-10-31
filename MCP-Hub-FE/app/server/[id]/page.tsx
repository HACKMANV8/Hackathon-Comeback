"use client";

import Header from "@/components/header";
import PremiumPaywall from "@/components/premium-paywall";
import ServerDetail from "@/components/server-detail";
import { useUser } from "@clerk/nextjs";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

const serverData: Record<number, any> = {
  1: {
    id: 1,
    name: "Linkup",
    handle: "@LinkupPlatform/linkup-mcp-server",
    lastDeployed: "4 days ago",
    icon: "🔗",
    isPremium: false,
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
    isPremium: true,
    price: 49,
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
    isPremium: true,
    price: 29,
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
    isPremium: false,
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
  5: {
    id: 5,
    name: "GitHub",
    handle: "@github/mcp-server",
    lastDeployed: "5 days ago",
    icon: "🐙",
    about:
      "Access GitHub repositories, issues, and pull requests. Manage your development workflow directly through the MCP interface with full API access.",
    tools: [
      {
        name: "Repository Manager (github-repo)",
        description:
          "Create, update, and manage GitHub repositories including settings and collaborators.",
      },
      {
        name: "Issue Tracker (github-issues)",
        description:
          "Create, update, search and manage issues and pull requests across repositories.",
      },
    ],
    connectionUrl: "https://api.github.com/mcp",
    tags: ["Remote", "2 tools", "Popular"],
    clients: {
      auto: ["ChatGPT"],
      json: [],
      typescript: ["Claude Code"],
      python: ["Poke", "Claude Desktop", "Cursor"],
    },
  },
  6: {
    id: 6,
    name: "Slack",
    handle: "@slack/mcp-integration",
    lastDeployed: "2 days ago",
    icon: "💬",
    about:
      "Send and receive messages, manage channels, and integrate with your team communication workflows seamlessly.",
    tools: [
      {
        name: "Message Manager (slack-messages)",
        description:
          "Send messages, react to messages, and manage conversations in channels and DMs.",
      },
      {
        name: "Channel Admin (slack-channels)",
        description:
          "Create, archive, and manage Slack channels with member management capabilities.",
      },
    ],
    connectionUrl: "https://slack.com/api/mcp",
    tags: ["Remote", "2 tools"],
    clients: {
      auto: ["ChatGPT", "Poke"],
      json: [],
      typescript: [],
      python: ["Claude Desktop", "Cursor"],
    },
  },
  7: {
    id: 7,
    name: "Notion",
    handle: "@notion/mcp-connector",
    lastDeployed: "1 day ago",
    icon: "📝",
    about:
      "Connect to Notion workspace, query databases, and manage pages. Perfect for documentation and knowledge management integration.",
    tools: [
      {
        name: "Database Query (notion-db)",
        description:
          "Query and filter Notion databases with advanced search capabilities.",
      },
      {
        name: "Page Manager (notion-pages)",
        description:
          "Create, update, and manage Notion pages with full content editing support.",
      },
    ],
    connectionUrl: "https://api.notion.com/mcp",
    tags: ["Remote", "2 tools"],
    clients: {
      auto: [],
      json: ["ChatGPT"],
      typescript: ["Claude Code"],
      python: ["Claude Desktop", "Poke", "Cursor"],
    },
  },
  8: {
    id: 8,
    name: "PostgreSQL",
    handle: "@postgres/mcp-database",
    lastDeployed: "6 hours ago",
    icon: "🐘",
    about:
      "Direct database access with query execution, schema management, and data operations. Secure connection pooling included.",
    tools: [
      {
        name: "Query Executor (postgres-query)",
        description:
          "Execute SQL queries with prepared statements and transaction support.",
      },
      {
        name: "Schema Manager (postgres-schema)",
        description:
          "Manage database schemas, tables, indexes, and relationships.",
      },
    ],
    connectionUrl: "postgresql://localhost:5432/mcp",
    tags: ["Local", "2 tools", "Database"],
    clients: {
      auto: ["ChatGPT"],
      json: [],
      typescript: [],
      python: ["Claude Desktop", "Cursor"],
    },
  },
  9: {
    id: 9,
    name: "Redis Cache",
    handle: "@redis/mcp-cache",
    lastDeployed: "12 hours ago",
    icon: "🔴",
    about:
      "High-performance caching layer with pub/sub support and real-time data synchronization capabilities.",
    tools: [
      {
        name: "Cache Manager (redis-cache)",
        description:
          "Set, get, and delete cache entries with TTL support and atomic operations.",
      },
      {
        name: "Pub/Sub Handler (redis-pubsub)",
        description:
          "Publish and subscribe to channels for real-time message broadcasting.",
      },
    ],
    connectionUrl: "redis://localhost:6379",
    tags: ["Local", "2 tools", "Cache"],
    clients: {
      auto: ["Poke"],
      json: [],
      typescript: ["Claude Code"],
      python: ["Claude Desktop", "Cursor"],
    },
  },
  10: {
    id: 10,
    name: "MongoDB",
    handle: "@mongodb/mcp-nosql",
    lastDeployed: "1 day ago",
    icon: "🍃",
    about:
      "NoSQL database integration with document queries, aggregation pipelines, and collections management.",
    tools: [
      {
        name: "Document Manager (mongodb-docs)",
        description:
          "CRUD operations on documents with advanced query and filtering capabilities.",
      },
      {
        name: "Aggregation Pipeline (mongodb-aggregate)",
        description:
          "Complex data processing with multi-stage aggregation pipelines.",
      },
    ],
    connectionUrl: "mongodb://localhost:27017",
    tags: ["Local", "2 tools", "NoSQL"],
    clients: {
      auto: [],
      json: ["ChatGPT"],
      typescript: [],
      python: ["Claude Desktop", "Poke", "Cursor"],
    },
  },
  11: {
    id: 11,
    name: "OpenAI",
    handle: "@openai/mcp-gpt",
    lastDeployed: "3 days ago",
    icon: "🤖",
    about:
      "Access GPT models, embeddings, and AI capabilities. Generate content, analyze text, and leverage advanced AI features.",
    tools: [
      {
        name: "Text Generation (openai-gpt)",
        description:
          "Generate text using GPT-4 and other models with customizable parameters.",
      },
      {
        name: "Embeddings (openai-embeddings)",
        description:
          "Create vector embeddings for semantic search and similarity matching.",
      },
    ],
    connectionUrl: "https://api.openai.com/v1/mcp",
    tags: ["Remote", "2 tools", "AI"],
    clients: {
      auto: ["ChatGPT", "Poke"],
      json: [],
      typescript: ["Claude Code"],
      python: ["Claude Desktop", "Cursor"],
    },
  },
  12: {
    id: 12,
    name: "Stripe",
    handle: "@stripe/mcp-payments",
    lastDeployed: "2 days ago",
    icon: "💳",
    about:
      "Process payments, manage subscriptions, and handle financial transactions securely with full PCI compliance.",
    tools: [
      {
        name: "Payment Processor (stripe-payments)",
        description:
          "Process one-time and recurring payments with support for multiple currencies.",
      },
      {
        name: "Subscription Manager (stripe-subscriptions)",
        description:
          "Create and manage subscription plans, invoices, and billing cycles.",
      },
    ],
    connectionUrl: "https://api.stripe.com/mcp",
    tags: ["Remote", "2 tools", "Payments"],
    clients: {
      auto: ["ChatGPT"],
      json: [],
      typescript: [],
      python: ["Claude Desktop", "Poke", "Cursor"],
    },
  },
  13: {
    id: 13,
    name: "AWS S3",
    handle: "@aws/mcp-s3-storage",
    lastDeployed: "4 days ago",
    icon: "☁️",
    about:
      "Object storage with high availability. Upload, download, and manage files in the cloud with enterprise-grade security.",
    tools: [
      {
        name: "File Manager (s3-files)",
        description:
          "Upload, download, delete, and list objects in S3 buckets with presigned URLs.",
      },
      {
        name: "Bucket Admin (s3-buckets)",
        description:
          "Create and manage S3 buckets with policies and lifecycle rules.",
      },
    ],
    connectionUrl: "https://s3.amazonaws.com/mcp",
    tags: ["Remote", "2 tools", "Storage"],
    clients: {
      auto: ["Poke"],
      json: ["ChatGPT"],
      typescript: [],
      python: ["Claude Desktop", "Cursor"],
    },
  },
  14: {
    id: 14,
    name: "Docker",
    handle: "@docker/mcp-containers",
    lastDeployed: "1 day ago",
    icon: "🐳",
    about:
      "Container management and orchestration. Build, deploy, and monitor containerized applications with full Docker API access.",
    tools: [
      {
        name: "Container Manager (docker-containers)",
        description:
          "Start, stop, and manage Docker containers with logs and stats monitoring.",
      },
      {
        name: "Image Builder (docker-images)",
        description:
          "Build, tag, push, and pull Docker images from registries.",
      },
    ],
    connectionUrl: "unix:///var/run/docker.sock",
    tags: ["Local", "2 tools", "DevOps"],
    clients: {
      auto: ["ChatGPT"],
      json: [],
      typescript: ["Claude Code"],
      python: ["Claude Desktop", "Cursor"],
    },
  },
  15: {
    id: 15,
    name: "Figma",
    handle: "@figma/mcp-design",
    lastDeployed: "3 days ago",
    icon: "🎨",
    about:
      "Design system integration with component exports, style tokens, and collaborative features for design-to-code workflows.",
    tools: [
      {
        name: "Component Exporter (figma-components)",
        description:
          "Export Figma components and design tokens for development use.",
      },
      {
        name: "File Manager (figma-files)",
        description:
          "Access and manage Figma files with version history and collaboration features.",
      },
    ],
    connectionUrl: "https://api.figma.com/mcp",
    tags: ["Remote", "2 tools", "Design"],
    clients: {
      auto: [],
      json: ["ChatGPT"],
      typescript: ["Claude Code"],
      python: ["Claude Desktop", "Poke", "Cursor"],
    },
  },
  16: {
    id: 16,
    name: "Jira",
    handle: "@atlassian/mcp-jira",
    lastDeployed: "2 days ago",
    icon: "📊",
    about:
      "Project management and issue tracking. Create tickets, manage sprints, and track progress across your development teams.",
    tools: [
      {
        name: "Issue Manager (jira-issues)",
        description:
          "Create, update, and search issues with custom fields and workflows.",
      },
      {
        name: "Sprint Planner (jira-sprints)",
        description:
          "Manage sprints, backlogs, and agile boards with velocity tracking.",
      },
    ],
    connectionUrl: "https://your-domain.atlassian.net/mcp",
    tags: ["Remote", "2 tools", "Project Management"],
    clients: {
      auto: ["ChatGPT", "Poke"],
      json: [],
      typescript: [],
      python: ["Claude Desktop", "Cursor"],
    },
  },
};

export default function ServerPage() {
  const params = useParams();
  const serverId = Number.parseInt(params.id as string);
  const server = serverData[serverId];
  const { user } = useUser();
  const [hasAccess, setHasAccess] = useState(false);

  // Check if user has premium access
  useEffect(() => {
    if (server && server.isPremium && user) {
      // Check if user has purchased this server
      // In production, this would check your database
      const purchasedServers = localStorage.getItem(
        `purchased_servers_${user.id}`,
      );
      if (purchasedServers) {
        const purchased = JSON.parse(purchasedServers);
        setHasAccess(purchased.includes(serverId));
      }
    } else if (server && !server.isPremium) {
      setHasAccess(true);
    }
  }, [server, user, serverId]);

  const handlePaymentSuccess = () => {
    if (user) {
      // Store purchase in localStorage (in production, use a real database)
      const purchasedServers = localStorage.getItem(
        `purchased_servers_${user.id}`,
      );
      const purchased = purchasedServers ? JSON.parse(purchasedServers) : [];
      purchased.push(serverId);
      localStorage.setItem(
        `purchased_servers_${user.id}`,
        JSON.stringify(purchased),
      );
      setHasAccess(true);
    }
  };

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
        {server.isPremium && !hasAccess ? (
          <PremiumPaywall
            server={{
              id: server.id,
              name: server.name,
              icon: server.icon,
              price: server.price,
            }}
            onPurchase={handlePaymentSuccess}
          />
        ) : (
          <ServerDetail server={server} />
        )}
      </main>
    </div>
  );
}
