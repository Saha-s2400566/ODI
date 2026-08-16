export const commonPorts = [
  { port: 21, name: 'FTP', protocol: 'TCP', risk: 'Low' },
  { port: 22, name: 'SSH', protocol: 'TCP', risk: 'Medium' },
  { port: 23, name: 'Telnet', protocol: 'TCP', risk: 'High' },
  { port: 25, name: 'SMTP', protocol: 'TCP', risk: 'Low' },
  { port: 53, name: 'DNS', protocol: 'UDP/TCP', risk: 'Low' },
  { port: 80, name: 'HTTP', protocol: 'TCP', risk: 'Low' },
  { port: 110, name: 'POP3', protocol: 'TCP', risk: 'Low' },
  { port: 143, name: 'IMAP', protocol: 'TCP', risk: 'Low' },
  { port: 443, name: 'HTTPS', protocol: 'TCP', risk: 'Low' },
  { port: 3389, name: 'RDP', protocol: 'TCP', risk: 'High' },
  { port: 8080, name: 'HTTP Proxy', protocol: 'TCP', risk: 'Medium' },
  { port: 8443, name: 'HTTPS Alt', protocol: 'TCP', risk: 'Low' },
];

export const httpStatusCodes: Record<number, string> = {
  200: 'OK',
  201: 'Created',
  202: 'Accepted',
  204: 'No Content',
  301: 'Moved Permanently',
  302: 'Found',
  400: 'Bad Request',
  401: 'Unauthorized',
  403: 'Forbidden',
  404: 'Not Found',
  408: 'Request Timeout',
  500: 'Internal Server Error',
  502: 'Bad Gateway',
  503: 'Service Unavailable',
  504: 'Gateway Timeout',
};

export function getPortLabel(port: number) {
  const match = commonPorts.find((entry) => entry.port === port);
  return match ? `${match.port} (${match.name})` : `${port}`;
}
