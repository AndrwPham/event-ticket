import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
// import path from 'path';

export default defineConfig({
    plugins: [react()],
    server: {
        port: 5173,       // Optional: Customize the dev server port
        // open: true        // Optional: Automatically open in browser
    },
    build: {
        outDir: 'dist',   // Default output directory
        sourcemap: true   // Optional: Helpful for debugging
    }
});
