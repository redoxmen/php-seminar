import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { copyFileSync, mkdirSync } from 'node:fs'

// For GitHub Pages project sites the app lives at /<repo-name>/ — set the
// PAGES_BASE env var at build time (the deploy workflow does this):
//   PAGES_BASE=/php-mysqli-site/ npm run build
const base = process.env.PAGES_BASE || '/'

export default defineConfig({
  base,
  plugins: [
    react(),
    {
      // SPA fallback for GitHub Pages: deep links like /learn are served
      // 404.html, which is a copy of index.html
      name: 'copy-404',
      closeBundle() {
        mkdirSync('dist', { recursive: true })
        copyFileSync('dist/index.html', 'dist/404.html')
      },
    },
  ],
  server: { port: 5173, host: true },
  preview: { port: 4173, host: true },
})
