import { defineConfig } from 'vite'

export default defineConfig({
  root: '.', // Use current directory as root
  publicDir: 'public', // Directory to serve static assets from
  server: {
    port: 3000,
    host: true, // Allow external connections
    open: true  // Open browser automatically
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    // Copy additional assets like images and SVGs
    rollupOptions: {
      input: {
        main: './index.html'
      }
    }
  }
})
