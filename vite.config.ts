import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
// Configured for GitHub Pages deployment
export default defineConfig({
  plugins: [react()],
  base: '/salah/',
  build: {
    outDir: 'dist',
  },
})
