import * as Network from 'expo-network';

export async function getLocalNetworkInfo() {
  try {
    const ip = await Network.getIpAddressAsync();
    const state = await Network.getNetworkStateAsync();
    return { ip, state };
  } catch (e) {
    return { ip: null, state: null };
  }
}

// Safe scanner stub: returns local info and a small mocked device list for UI/demo.
export async function scanNetworkSafe() {
  const info = await getLocalNetworkInfo();
  // In a real implementation, replace this with an authorized LAN discovery.
  const mockDevices = [
    { id: '1', name: 'Office Router', ip: info.ip || '192.168.1.1', online: true, type: 'gateway' },
    { id: '2', name: 'Workstation-01', ip: '192.168.1.42', online: true, type: 'computer' },
    { id: '3', name: 'Printer-HP', ip: '192.168.1.55', online: false, type: 'printer' }
  ];
  return mockDevices;
}

export default { getLocalNetworkInfo, scanNetworkSafe };
