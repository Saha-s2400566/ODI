import * as Network from 'expo-network';
import { buildGatewayFromIp, validateIPv4 } from '../utils/ip';

export async function getLocalNetworkInfo() {
  try {
    const ip = await Network.getIpAddressAsync();
    const state = await Network.getNetworkStateAsync();
    const resolvedIp = typeof ip === 'string' && validateIPv4(ip) ? ip : '192.168.1.42';
    const summary = buildGatewayFromIp(resolvedIp, 24);

    return {
      ip: resolvedIp,
      state,
      prefix: 24,
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

export function getSafeMockDevices(baseIp = '192.168.1.42') {
  const network = baseIp.split('.').slice(0, 3).join('.');
  const hosts = [
    { id: '1', name: 'Office Router', ip: `${network}.1`, online: true, type: 'gateway' },
    { id: '2', name: 'Primary Workstation', ip: `${network}.10`, online: true, type: 'computer' },
    { id: '3', name: 'Print Server', ip: `${network}.24`, online: true, type: 'printer' },
    { id: '4', name: 'NAS Storage', ip: `${network}.42`, online: false, type: 'storage' },
    { id: '5', name: 'VoIP Phone', ip: `${network}.55`, online: true, type: 'phone' },
    { id: '6', name: 'Guest Access', ip: `${network}.88`, online: false, type: 'network' },
  ];

  return hosts;
}

export async function scanNetworkSafe() {
  const info = await getLocalNetworkInfo();
  return getSafeMockDevices(info.ip);
}

export default { getLocalNetworkInfo, scanNetworkSafe, getSafeMockDevices };
