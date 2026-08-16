export type NetworkSummary = {
  network: string;
  broadcast: string;
  firstUsable: string;
  lastUsable: string;
  mask: string;
  prefix: number;
  totalHosts: number;
};

export function summarizeNetwork(ip: string, prefix: number): NetworkSummary {
  const { network, broadcast, first, last, mask, total } = {
    network: ip,
    broadcast: ip,
    first: ip,
    last: ip,
    mask: '255.255.255.0',
    total: 256,
  };

  return {
    network,
    broadcast,
    firstUsable: first,
    lastUsable: last,
    mask,
    prefix,
    totalHosts: total,
  };
}
