"use client";

import Header from "@/components/header";
import ServerDetail from "@/components/server-detail";
import { fetchServerByName, type ServerResponse } from "@/lib/api";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function ServerPage() {
  const params = useParams();
  const router = useRouter();
  const serverName = decodeURIComponent(params.id as string);
  const [server, setServer] = useState<ServerResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadServer = async () => {
      try {
        const data = await fetchServerByName(serverName);
        if (!data) {
          router.push("/explore");
          return;
        }
        setServer(data);
      } catch (error) {
        console.error("Failed to fetch server:", error);
        router.push("/explore");
      } finally {
        setLoading(false);
      }
    };

    loadServer();
  }, [serverName, router]);

  if (loading) {
    return (
      <div
        className="min-h-screen bg-black flex items-center justify-center"
        style={{
          backgroundImage: "linear-gradient(135deg, #000000 0%, #0a1e35 100%)",
        }}
      >
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400" />
      </div>
    );
  }

  if (!server) {
    return (
      <div
        className="min-h-screen bg-black flex items-center justify-center"
        style={{
          backgroundImage: "linear-gradient(135deg, #000000 0%, #0a1e35 100%)",
        }}
      >
        <div className="text-white text-2xl">Server not found</div>
      </div>
    );
  }

  // Transform API data to match component interface
  const transformedServer = {
    id: server.name,
    name: server.name,
    handle: server.author,
    lastDeployed: "Recently",
    icon: "📦",
    about: server.description,
    tools: [
      {
        name: server.entrypoint,
        description: `Entry point: ${server.entrypoint}`,
      },
    ],
    connectionUrl: server.repository.url,
    tags: [server.lang, server.license, `v${server.version}`],
    clients: {
      auto: [],
      json: [],
      typescript: [],
      python: [],
    },
    qualityScore: server.sonarqube
      ? 100 - Math.min(100, server.sonarqube.summary.total_issues * 5)
      : undefined,
    monthlyToolCalls: undefined,
    deployedFrom: server.repository
      ? {
          branch: "main",
          commit: server.repository.url.split("/").pop()?.slice(0, 7) || "N/A",
        }
      : undefined,
    uptime: server.sonarqube
      ? parseFloat(server.sonarqube.metrics.reliability_rating) <= 2
        ? 99.5
        : 95.0
      : undefined,
    latency: server.sonarqube
      ? {
          p95: parseFloat(server.sonarqube.metrics.complexity) / 10,
        }
      : undefined,
    license: server.license,
    isLocal: false,
    publishedDate: server.sonarqube
      ? new Date(server.sonarqube.analysis_date).toLocaleDateString()
      : undefined,
    pricing: server.pricing,
    sourceCode: {
      platform: server.repository.type,
      url: server.repository.url,
      repo: server.repository.url.replace("https://github.com/", ""),
    },
    homepage: {
      url: server.repository.url,
      domain: server.repository.url
        .replace("https://", "")
        .replace("http://", "")
        .split("/")[0],
    },
    security: server.sonarqube
      ? {
          summary: server.sonarqube.summary,
          metrics: server.sonarqube.metrics,
          issues: server.sonarqube.issues
            ? {
                by_severity: {
                  critical: server.sonarqube.issues.by_severity.critical || 0,
                  major: server.sonarqube.issues.by_severity.major || 0,
                  minor: server.sonarqube.issues.by_severity.minor || 0,
                },
                details: {
                  CRITICAL: server.sonarqube.issues.details.CRITICAL || [],
                  MAJOR: server.sonarqube.issues.details.MAJOR || [],
                },
              }
            : {
                by_severity: { critical: 0, major: 0, minor: 0 },
                details: { CRITICAL: [], MAJOR: [] },
              },
          security_hotspots: server.sonarqube.security_hotspots || [],
        }
      : undefined,
  };

  return (
    <div
      className="min-h-screen bg-black overflow-x-hidden"
      style={{
        backgroundImage: "linear-gradient(135deg, #000000 0%, #0a1e35 100%)",
      }}
    >
      <Header />
      <main className="pt-20">
        <ServerDetail server={transformedServer} />
      </main>
    </div>
  );
}
