import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Buffer } from 'buffer';
import App from './App.tsx';
import './index.css';

// Required polyfills for MultiversX SDK
window.Buffer = Buffer;
window.global = window;
window.process = { 
  env: {},
  browser: true,
  version: 'v16.0.0'
} as any;

// Additional crypto polyfills
if (!window.crypto || !window.crypto.subtle) {
  console.warn('Crypto API not available - using fallback');
  window.crypto = {
    getRandomValues: function(buffer: Uint8Array) {
      for (let i = 0; i < buffer.length; i++) {
        buffer[i] = Math.floor(Math.random() * 256);
      }
      return buffer;
    },
    subtle: {
      digest: async function(algorithm: string, data: ArrayBuffer) {
        throw new Error('Crypto.subtle not available');
      }
    }
  } as any;
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);