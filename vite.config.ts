import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// `base: './'` keeps the build portable: it works from a domain root,
// a GitHub Pages sub-path, or any static host without reconfiguration.
export default defineConfig({
  base: './',
  plugins: [react(), tailwindcss()],
})
