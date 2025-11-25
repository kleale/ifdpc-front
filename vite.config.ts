import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

const CSP_HOSTS =
  'localhost:3000 localhost:8080 localhost:8083 spa-back.gazprom-neft.local';

const HEADERS = {
  'cache-control': 's-maxage=360000, public',
  //'content-security-policy': `default-src 'self' ${CSP_HOSTS}; script-src 'self' 'unsafe-inline' 'unsafe-eval' ${CSP_HOSTS}; script-src-elem 'self' 'unsafe-inline' ${CSP_HOSTS}; style-src 'self' 'unsafe-inline' ${CSP_HOSTS}; img-src 'self' data: ${CSP_HOSTS}; font-src 'self' data: ${CSP_HOSTS}; connect-src 'self' ws: ${CSP_HOSTS}; form-action 'self' ${CSP_HOSTS};`,
  'cross-origin-embedder-policy': 'unsafe-none',
  'cross-origin-opener-policy': 'same-origin',
  'origin-agent-cluster': '?1',
  'referrer-policy': 'no-referrer',
  'strict-transport-security': 'max-age=15678000; includeSubDomains; preload',
  'x-content-type-options': 'nosniff',
  'x-dns-prefetch-control': 'on',
  'x-download-options': 'noopen',
  'x-frame-options': 'SAMEORIGIN',
  'x-permitted-cross-domain-policies': 'none',
  'x-xss-protection': '1; mode=block',
  'Public-Key-Pins': 'pin-sha256="hash123"; max-age=5184000',
};

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      app: '/src/app/',
      entities: '/src/entities/',
      features: '/src/features/',
      pages: '/src/pages/',
      shared: '/src/shared/',
      widgets: '/src/widgets/'
    },
  },
  css: {
    modules: {
      generateScopedName: '[name]_[local]__[hash:base64:6]',
    },
  },
  build: {
    outDir: './build',
  },
  preview: {
    port: 3000,
    headers: HEADERS,
    open: true, // this will open directly to your browser
  },
  server: {
    port: 3000,
    headers: HEADERS,
    // open: true, // this will open directly to your browser
  },
});
