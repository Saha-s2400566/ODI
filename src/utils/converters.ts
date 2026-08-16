export function decimalToHex(value: number) {
  return value.toString(16).toUpperCase();
}

export function decimalToBinary(value: number) {
  return value.toString(2).padStart(8, '0');
}

export function hexToDecimal(value: string) {
  return Number.parseInt(value.replace(/^0x/i, ''), 16);
}

export function portRangeSummary(port: number) {
  if (port < 0 || port > 65535) return 'Invalid port range';
  if (port < 1024) return 'Well-known service port';
  if (port < 49152) return 'Registered service port';
  return 'Ephemeral / dynamic port';
}
