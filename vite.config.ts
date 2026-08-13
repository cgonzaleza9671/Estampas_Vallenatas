
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      'node-fetch': path.resolve(__dirname, 'src/custom-fetch.ts'),
      'formdata-polyfill': path.resolve(__dirname, 'src/custom-fetch.ts'),
      'formdata-polyfill/esm.min.js': path.resolve(__dirname, 'src/custom-fetch.ts'),
      'cross-fetch': path.resolve(__dirname, 'src/custom-fetch.ts'),
      'prop-types': path.resolve(__dirname, 'src/mock-prop-types.ts'),
    }
  },
  build: {
    outDir: 'dist',
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom', 'motion/react', 'lucide-react']
        }
      }
    }
  }
});
