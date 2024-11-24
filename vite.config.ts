import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      crypto: 'crypto-browserify',
      stream: 'stream-browserify',
      buffer: 'buffer',
      events: 'events',
      util: 'util',
      process: 'process'
    },
  },
  define: {
    'global': 'globalThis',
    'process.env': {},
    'process.browser': true,
    'process.version': '"v16.0.0"',
  },
  optimizeDeps: {
    include: [
      '@multiversx/sdk-wallet',
      'buffer',
      'crypto-browserify',
      'events',
      'stream-browserify',
      'util'
    ],
    esbuildOptions: {
      define: {
        global: 'globalThis'
      }
    }
  }
});