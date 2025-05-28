import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import fs from 'fs';
import path from 'path';

// HTTPS Configuration
const httpsConfig = (() => {
  if (process.env.SKIP_TLS === '1' || process.env.SKIP_TLS === 'true') {
    return undefined;
  }
  try {
    const keyPath = process.env.CITYLIGHTS_PRIVKEY;
    const certPath = process.env.CITYLIGHTS_CERT;
    const caPath = process.env.CITYLIGHTS_CA;

    if (!keyPath || !certPath) {
      console.warn('Private key or certificate path not provided for HTTPS. Skipping HTTPS setup.');
      return undefined;
    }

    const httpsOptions = {
      key: fs.readFileSync(keyPath),
      cert: fs.readFileSync(certPath),
    };

    if (caPath) {
      httpsOptions.ca = fs.readFileSync(caPath);
    }
    return httpsOptions;
  } catch (e) {
    console.error('Error reading HTTPS key/cert files:', e);
    return undefined;
  }
})();

// API Proxy Configuration
const API_HOST = process.env.SKIP_TLS === '1' || process.env.SKIP_TLS === 'true' ? 'devbox.citylights.io' : process.env.CITYLIGHTS_HOST || 'localhost';
const API_PORT = process.env.CITYLIGHTS_PORT || 3000; // Default to 3000 if not set
const httpProtocol = (process.env.SKIP_TLS === '1' || process.env.SKIP_TLS === 'true') ? 'http' : 'https';
const targetBase = `${httpProtocol}://${API_HOST}${API_PORT ? ':' + API_PORT : ''}`;

export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 8999,
    https: httpsConfig,
    proxy: {
      '/api': {
        target: targetBase,
        changeOrigin: true,
        secure: !(process.env.SKIP_TLS === '1' || process.env.SKIP_TLS === 'true'), // false if target is http, true if https
        rewrite: (path) => path.replace(/^\/api/, ''), // Remove /api prefix if backend doesn't expect it
        configure: (proxy, _options) => {
          proxy.on('error', (err, _req, _res) => {
            console.log('proxy error', err);
          });
          proxy.on('proxyReq', (proxyReq, req, _res) => {
            console.log('Sending Request to the Target:', req.method, req.url);
            console.log('Target Base:', targetBase);
            console.log('Original Host Header:', req.headers.host);
            console.log('Proxy Request Path:', proxyReq.path);
          });
          proxy.on('proxyRes', (proxyRes, req, _res) => {
            console.log('Received Response from the Target:', proxyRes.statusCode, req.url);
          });
        },
      }
    }
  },
  build: {
    outDir: 'build', // Output directory
    assetsDir: 'assets', // Default, but explicit
    manifest: 'manifest.json', // Generate manifest.json
    // sourcemap: true, // useful for debugging production issues
  },
  base: process.env.NODE_ENV === 'production' ? '/assets/' : '/',
  css: {
    preprocessorOptions: {
      scss: {
        // example: includePaths: [path.resolve(__dirname, 'src/styles')]
      }
    }
  },
  envPrefix: 'VITE_', // Default is VITE_
  // resolve: {
  //   alias: {
  //     // Example: '@': path.resolve(__dirname, './src')
  //   }
  // }
});
