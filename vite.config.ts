import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

declare const process: { env: Record<string, string | undefined> }

/**
 * Link previews (X, Telegram, WhatsApp) need absolute URLs. On Vercel the
 * production domain is read automatically; set SITE_URL to override
 * (e.g. once a custom domain is connected).
 */
const vercelHost = process.env.VERCEL_PROJECT_PRODUCTION_URL
const siteUrl = (process.env.SITE_URL ?? (vercelHost ? `https://${vercelHost}` : 'https://thegloryofweb3.vercel.app')).replace(/\/$/, '')

const siteUrlPlugin = (): Plugin => ({
  name: 'site-url',
  transformIndexHtml: (html) => html.replaceAll('%SITE_URL%', siteUrl),
})

// `base: './'` keeps the build portable: it works from a domain root,
// a GitHub Pages sub-path, or any static host without reconfiguration.
export default defineConfig({
  base: './',
  plugins: [react(), tailwindcss(), siteUrlPlugin()],
})
