const API_URL = process.env.NEXT_PUBLIC_API_URL!;

export interface ServerResponse {
  name: string;
  version: string;
  description: string;
  author: string;
  lang: string;
  license: string;
  entrypoint: string;
  repository: {
    type: string;
    url: string;
  };
  pricing?: {
    currency: string;
    amount: number;
  };
  sonarqube?: {
    project_key: string;
    analysis_date: string;
    sonarcloud_url: string;
    summary: {
      total_issues: number;
      bugs: number;
      vulnerabilities: number;
      code_smells: number;
      security_hotspots: number;
    };
    metrics: {
      coverage: string;
      bugs: string;
      reliability_rating: string;
      complexity: string;
      code_smells: string;
      duplicated_lines_density: string;
      security_rating: string;
      ncloc: string;
      vulnerabilities: string;
      security_hotspots: string;
      sqale_rating: string;
    };
    issues?: {
      by_severity: {
        blocker: number;
        critical: number;
        major: number;
        minor: number;
        info: number;
      };
      details: {
        BLOCKER: Array<any>;
        CRITICAL: Array<any>;
        MAJOR: Array<any>;
        MINOR: Array<any>;
        INFO: Array<any>;
      };
    };
    security_hotspots?: Array<any>;
  };
}

export async function fetchServers(): Promise<ServerResponse[]> {
  const response = await fetch(`${API_URL}/servers`);
  if (!response.ok) {
    throw new Error("Failed to fetch servers");
  }
  const data = await response.json();
  // API returns {total: number, servers: [...]}
  return data.servers || [];
}

export async function fetchServerByName(
  name: string,
): Promise<ServerResponse | null> {
  const servers = await fetchServers();
  return servers.find((s) => s.name === name) || null;
}

