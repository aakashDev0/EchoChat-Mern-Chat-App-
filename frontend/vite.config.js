import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: undefined,
      },
    },
    // Ensures the _redirects file is included in the build
    outDir: 'dist',
  },
})



// import { defineConfig } from 'vite';
// import react from '@vitejs/plugin-react';

// export default defineConfig({
//     plugins: [react()],
//     server: {
//         host: '0.0.0.0', // Listen on all network interfaces
//         port: 5173,      // Default Vite port (adjust if needed)
//     },
// });
