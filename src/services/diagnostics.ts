/**
 * Simplified diagnostic services for ODI
 * - HTTP Reachability Check
 * - DNS Lookup
 * - Port Check
 */

export interface ReachabilityResult {
  target: string;
  reachable: boolean;
  status: string;
  responseTime: number;
  method: 'HTTP/HTTPS';
}

export interface DnsResult {
  hostname: string;
  ipv4: string[];
  ipv6: string[];
  error?: string;
}

export interface PortCheckResult {
  host: string;
  port: number;
  open: boolean;
  responseTime: number;
  service?: string;
}

const COMMON_PORTS: Record<number, string> = {
  21: 'FTP',
  22: 'SSH',
  23: 'Telnet',
  25: 'SMTP',
  53: 'DNS',
  80: 'HTTP',
  110: 'POP3',
  143: 'IMAP',
  443: 'HTTPS',
  445: 'SMB',
  3306: 'MySQL',
  3389: 'RDP',
  5432: 'PostgreSQL',
  5900: 'VNC',
  8080: 'HTTP Alt',
};

export async function checkReachability(target: string, port = 80): Promise<ReachabilityResult> {
  const startTime = Date.now();
  const candidates = [
    `http://${target}:${port}`,
    `https://${target}:${port}`,
    `http://${target}`,
    `https://${target}`,
  ];

  for (const url of candidates) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3000);

    try {
      const response = await fetch(url, {
        method: 'GET',
        signal: controller.signal,
        headers: { 'Cache-Control': 'no-cache' },
      });

      clearTimeout(timeoutId);
      return {
        target,
        reachable: response.ok,
        status: `HTTP ${response.status}`,
        responseTime: Date.now() - startTime,
        method: 'HTTP/HTTPS',
      };
    } catch (error) {
      clearTimeout(timeoutId);
      // continue to next candidate
    }
  }

  return {
    target,
    reachable: false,
    status: 'Timeout',
    responseTime: Date.now() - startTime,
    method: 'HTTP/HTTPS',
  };
}

export async function performDnsLookup(hostname: string): Promise<DnsResult> {
  try {
    // Use cloudflare DNS API as a fallback since fetch doesn't have native DNS
    const response = await fetch(`https://dns.google/resolve?name=${encodeURIComponent(hostname)}`, {
      headers: { Accept: 'application/json' },
    });

    if (!response.ok) {
      throw new Error('DNS lookup failed');
    }

    const data = await response.json() as any;
    const ipv4: string[] = [];
    const ipv6: string[] = [];

    if (data.Answer) {
      for (const answer of data.Answer) {
        if (answer.type === 1) {
          // A record (IPv4)
          ipv4.push(answer.data);
        } else if (answer.type === 28) {
          // AAAA record (IPv6)
          ipv6.push(answer.data);
        }
      }
    }

    return {
      hostname,
      ipv4,
      ipv6,
    };
  } catch (error) {
    return {
      hostname,
      ipv4: [],
      ipv6: [],
      error: `Failed to resolve ${hostname}`,
    };
  }
}

export async function checkPort(host: string, port: number): Promise<PortCheckResult> {
  const startTime = Date.now();
  const protocol = port === 443 ? 'https' : 'http';

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 2000);

  try {
    const response = await fetch(`${protocol}://${host}:${port}`, {
      method: 'GET',
      signal: controller.signal,
      headers: { 'Cache-Control': 'no-cache' },
    });

    clearTimeout(timeoutId);
    return {
      host,
      port,
      open: response.ok,
      responseTime: Date.now() - startTime,
      service: COMMON_PORTS[port],
    };
  } catch (error) {
    clearTimeout(timeoutId);
    return {
      host,
      port,
      open: false,
      responseTime: Date.now() - startTime,
      service: COMMON_PORTS[port],
    };
  }
}

export function getServiceName(port: number): string {
  return COMMON_PORTS[port] || 'Unknown';
}

export function getCommonPorts(): Array<{ port: number; service: string }> {
  return Object.entries(COMMON_PORTS).map(([port, service]) => ({
    port: parseInt(port),
    service,
  }));
}
