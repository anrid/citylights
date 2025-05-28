// app/config.js

const host = import.meta.env.VITE_API_HOST || 'localhost';
// Default port logic: if SKIP_TLS is true, default to 8080, otherwise 443 (standard HTTPS).
// This assumes VITE_API_PORT might not always be set, especially in .env files relying on defaults.
const defaultPort = import.meta.env.VITE_SKIP_TLS === 'true' ? '8080' : '443';
const port = import.meta.env.VITE_API_PORT || defaultPort;
const protocol = import.meta.env.VITE_SKIP_TLS === 'true' ? 'http' : 'https';

// Construct the port string: only add if not standard port for the protocol
const portString = (protocol === 'http' && port === '80') || (protocol === 'https' && port === '443') || !port ? '' : `:${port}`;

export const API_BASE_URL = `${protocol}://${host}${portString}`;
export const SOCKET_IO_URL = API_BASE_URL; // Socket.IO is served from the same base URL

// For debugging purposes, log the resolved URLs
console.log(`VITE_APP_NAME: ${import.meta.env.VITE_APP_NAME}`);
console.log(`API Base URL: ${API_BASE_URL}`);
console.log(`Socket.IO URL: ${SOCKET_IO_URL}`);

// You can also export individual components if needed elsewhere
export const ENV_CONFIG = {
  appName: import.meta.env.VITE_APP_NAME,
  apiHost: host,
  apiPort: port,
  skipTls: import.meta.env.VITE_SKIP_TLS === 'true',
  protocol: protocol,
  apiBaseUrl: API_BASE_URL,
  socketIoUrl: SOCKET_IO_URL,
};
