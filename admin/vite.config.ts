import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // Run the admin dev server on a different port
    port: 5174,
    proxy: {
      // Proxy API requests to the backend server
      '/api': {
        target: 'http://localhost:5000', // Your backend URL
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
  // We'll build the admin app into a separate 'dist-admin' folder
  build: {
    outDir: 'dist-admin',
  },
});