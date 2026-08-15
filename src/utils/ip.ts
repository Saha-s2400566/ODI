// Pure utility functions for IPv4 and CIDR calculations

export function validateIPv4(ip: string) {
  const parts = ip.trim().split('.');
  if (parts.length !== 4) return false;
  return parts.every((p) => {
    if (!/^[0-9]+$/.test(p)) return false;
    const n = Number(p);
    return n >= 0 && n <= 255;
  });
}

export function cidrToMask(prefix: number) {
  if (prefix < 0 || prefix > 32) throw new Error('CIDR prefix must be 0-32');
  const mask = [] as number[];
  for (let i = 0; i < 4; i++) {
    const rem = Math.max(0, Math.min(8, prefix - i * 8));
    mask.push(256 - Math.pow(2, 8 - rem));
  }
  return mask.join('.');
}

export function ipToNumber(ip: string) {
  if (!validateIPv4(ip)) throw new Error('Invalid IPv4');
  return ip.split('.').reduce((acc, octet) => (acc << 8) + Number(octet), 0) >>> 0;
}

export function numberToIp(n: number) {
  return [(n >>> 24) & 255, (n >>> 16) & 255, (n >>> 8) & 255, n & 255].join('.');
}

export function networkRangeFromCidr(ip: string, prefix: number) {
  const ipNum = ipToNumber(ip);
  const maskNum = prefix === 0 ? 0 : (~0 << (32 - prefix)) >>> 0;
  const network = ipNum & maskNum;
  const broadcast = network | (~maskNum >>> 0);
  const first = network + 1;
  const last = broadcast - 1;
  return {
    network: numberToIp(network),
    broadcast: numberToIp(broadcast),
    first: numberToIp(first),
    last: numberToIp(last),
    total: broadcast - network + 1,
    usable: Math.max(0, broadcast - network - 1),
    mask: cidrToMask(prefix)
  };
}
