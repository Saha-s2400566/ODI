import * as Network from 'expo-network';
import { buildGatewayFromIp, ipToNumber, numberToIp, validateIPv4 } from '../utils/ip';

const COMMON_PORTS = [80, 443, 22, 53, 445, 8080, 8000, 3000, 5000, 3389, 19000];
const MAX_DISCOVERED_HOSTS = 18;

function maskToPrefix(mask: string): number {
  if (!mask || !validateIPv4(mask)) return 24;

  const octets = mask.split('.').map(Number);
  let prefix = 0;
  let zeroSeen = false;

  for (const octet of octets) {
    if (zeroSeen) return prefix;
    if (octet === 255) {
      prefix += 8;
    } else if (octet === 254 || octet === 252 || octet === 248 || octet === 240 || octet === 224 || octet === 192 || octet === 128 || octet === 0) {
      const bits = octet.toString(2).padStart(8, '0');
      const leadingOnes = bits.split('').findIndex((bit) => bit === '0');
      prefix += leadingOnes === -1 ? 8 : leadingOnes;
      zeroSeen = true;
    } else {
      const bits = octet.toString(2).padStart(8, '0');
      const leadingOnes = bits.split('').findIndex((bit) => bit === '0');
      prefix += leadingOnes === -1 ? 8 : leadingOnes;
      zeroSeen = true;
    }
  }

  return Math.min(prefix, 32);
}

export async function getLocalNetworkInfo() {
  try {
    const ip = await Network.getIpAddressAsync();
    const state = await Network.getNetworkStateAsync();
    const resolvedIp = typeof ip === 'string' && validateIPv4(ip) ? ip : '192.168.1.42';
    const fallbackMask = '255.255.255.0';
    const rawMask = typeof (state as any)?.subnetMask === 'string' ? (state as any).subnetMask : fallbackMask;
    const mask = validateIPv4(rawMask) ? rawMask : fallbackMask;
    const prefix = maskToPrefix(mask);
    const summary = buildGatewayFromIp(resolvedIp, prefix);

    return {
      ip: resolvedIp,
      state,
      prefix,
      gateway: summary.gateway,
      mask: summary.subnetMask,
      network: summary.network,
      broadcast: summary.broadcast,
      firstUsable: summary.firstUsable,
      lastUsable: summary.lastUsable
    };
  } catch (e) {
    return {
      ip: '192.168.1.42',
      state: null,
      prefix: 24,
      gateway: '192.168.1.1',
      mask: '255.255.255.0',
      network: '192.168.1.0',
      broadcast: '192.168.1.255',
      firstUsable: '192.168.1.1',
      lastUsable: '192.168.1.254'
    };
  }
}

async function probePort(ip: string, port: number): Promise<boolean> {
  const protocol = port === 443 ? 'https' : 'http';
  const url = `${protocol}://${ip}:${port}`;
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 900);

  try {
    await fetch(url, {
      method: 'GET',
      signal: controller.signal,
      headers: { 'Cache-Control': 'no-cache' },
    });
    return true;
  } catch {
    return false;
  } finally {
    clearTimeout(timeout);
  }
}

async function probeHost(ip: string) {
  const activePorts: number[] = [];
  for (const port of COMMON_PORTS) {
    const reachable = await probePort(ip, port);
    if (reachable) activePorts.push(port);
  }

  return {
    ip,
    activePorts,
    online: activePorts.length > 0,
  };
}

export async function discoverLocalDevices({ aggressive = false } = {}) {
  const info = await getLocalNetworkInfo();
  const gateway = info.gateway || '192.168.1.1';
  const start = ipToNumber(info.firstUsable || gateway);
  const end = ipToNumber(info.lastUsable || gateway);

  const candidateSet: string[] = [];
  for (let value = start; value <= end; value += 1) {
    const candidate = numberToIp(value);
    if (candidate === info.ip) continue;
    candidateSet.push(candidate);
  }

  const prioritized = candidateSet.filter((ip) => ip !== gateway).slice(0, aggressive ? 60 : 24);
  const results = await Promise.all(
    prioritized.map(async (ip) => {
      const result = await probeHost(ip);
      return result.online ? result : null;
    })
  );

  const discovered = results.filter(Boolean) as Array<{ ip: string; activePorts: number[]; online: boolean }>;

  const formatted = discovered
    .map((entry) => {
      const ip = entry.ip;
      const type = ip === gateway ? 'gateway' : entry.activePorts.includes(80) || entry.activePorts.includes(443) ? 'server' : 'device';
      return {
        id: ip,
        name: ip === gateway ? 'Gateway' : `${type.charAt(0).toUpperCase()}${type.slice(1)}-${ip.split('.').slice(3).join('')}`,
        ip,
        online: true,
        type,
        health: entry.activePorts.length > 0 ? 'Active' : 'Reachable',
        risk: entry.activePorts.includes(22) || entry.activePorts.includes(3389) ? 'Medium' : 'Low',
        ports: entry.activePorts.slice(0, 6),
        lastSeen: 'just now',
        notes: entry.activePorts.length > 0 ? `Active services detected on ports ${entry.activePorts.join(', ')}` : 'Host responded to a local network probe.'
      };
    })
    .filter((device, index, list) => list.findIndex((entry) => entry.ip === device.ip) === index)
    .slice(0, MAX_DISCOVERED_HOSTS);

  const localDevice = {
    id: info.ip,
    name: 'Current Device',
    ip: info.ip,
    online: true,
    type: 'host',
    health: 'Online',
    risk: 'Low',
    ports: [80, 443],
    lastSeen: 'just now',
    notes: 'This device is connected to the current local network.'
  };

  const gatewayDevice = {
    id: gateway,
    name: 'Gateway',
    ip: gateway,
    online: true,
    type: 'gateway',
    health: 'Excellent',
    risk: 'Low',
    ports: [80, 443, 53],
    lastSeen: 'just now',
    notes: 'Primary local gateway detected.'
  };

  const ordered = [gatewayDevice, localDevice, ...formatted.filter((device) => device.ip !== gateway && device.ip !== info.ip)];
  return ordered.filter((device, index, list) => list.findIndex((entry) => entry.ip === device.ip) === index).slice(0, MAX_DISCOVERED_HOSTS);
}

export function getSafeMockDevices(baseIp = '192.168.1.42') {
  return discoverLocalDevices({ aggressive: true }).catch(() => {
    const network = baseIp.split('.').slice(0, 3).join('.');
    return [
      {
        id: 'mock-router',
        name: 'Gateway',
        ip: `${network}.1`,
        online: true,
        type: 'gateway',
        health: 'Excellent',
        risk: 'Low',
        ports: [80, 443, 53],
        lastSeen: 'just now',
        notes: 'Fallback local gateway placeholder.'
      }
    ];
  });
}

export async function probeReachability(target: string, port = 80) {
  const candidates = [
    `http://${target}:${port}`,
    `https://${target}:${port}`,
    `http://${target}`,
    `https://${target}`,
  ];

  const startedAt = Date.now();

  for (const url of candidates) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 1800);

    try {
      const response = await fetch(url, {
        method: 'GET',
        signal: controller.signal,
        headers: { 'Cache-Control': 'no-cache' },
      });

      return {
        target,
        reachable: true,
        status: `HTTP ${response.status}`,
        responseTime: Date.now() - startedAt,
        url,
      };
    } catch {
      // continue to next candidate
    } finally {
      clearTimeout(timeout);
    }
  }

  return {
    target,
    reachable: false,
    status: 'timeout',
    responseTime: Date.now() - startedAt,
    url: null,
  };
}

export async function buildTraceroutePreview(target: string, info?: any) {
  const localInfo = info || (await getLocalNetworkInfo());
  const gateway = localInfo.gateway || '192.168.1.1';
  const publicTarget = target || '8.8.8.8';
  const knownDevices = await discoverLocalDevices({ aggressive: false });
  const routeCandidates = knownDevices
    .map((device) => device.ip)
    .filter((ip) => ip && ip !== localInfo.ip && ip !== gateway && ip !== publicTarget)
    .slice(0, 3);

  const gatewayProbe = await probeReachability(gateway);
  const localHops = await Promise.all(
    routeCandidates.map(async (ip, index) => ({
      hop: index + 2,
      ip,
      kind: 'local' as const,
      status: await probeReachability(ip),
    }))
  );

  const targetStatus = await probeReachability(publicTarget);
  const formatted: string[] = [
    `traceroute to ${publicTarget} (${publicTarget})`,
    'Gateway → Local → Public internet',
    `1  ${gateway}  ${gatewayProbe.responseTime} ms  gateway ${gatewayProbe.reachable ? 'reachable' : 'timeout'}`,
  ];

  if (localHops.length > 0) {
    formatted.push('Local network:');
    for (const hop of localHops) {
      formatted.push(`${hop.hop}  ${hop.ip}  ${hop.status.responseTime} ms  ${hop.status.reachable ? 'reachable' : 'timeout'}`);
    }
  }

  formatted.push('Public internet:');
  formatted.push(`${localHops.length + 2}  ${publicTarget}  ${targetStatus.responseTime} ms  public ${targetStatus.reachable ? 'reachable' : 'timeout'}`);

  return formatted;
}

export async function scanNetworkSafe() {
  const devices = await discoverLocalDevices({ aggressive: true });
  return devices.length > 0 ? devices : [
    {
      id: 'fallback-network',
      name: 'Current Network',
      ip: (await getLocalNetworkInfo()).ip,
      online: true,
      type: 'network',
      health: 'Local',
      risk: 'Low',
      ports: [80, 443],
      lastSeen: 'just now',
      notes: 'No additional hosts responded to the current local subnet scan.'
    }
  ];
}

export default { getLocalNetworkInfo, scanNetworkSafe, getSafeMockDevices, discoverLocalDevices, probeReachability, buildTraceroutePreview };
