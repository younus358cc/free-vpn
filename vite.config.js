import { defineConfig } from 'vite'

export default defineConfig({
  root: '.',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    rollupOptions: {
      input: {
        main: './index.html',
        auth: './firebase-auth.html'
      }
    }
  },
  server: {
    port: 3000,
    open: true
  }
})