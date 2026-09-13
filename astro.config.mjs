// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import { observatoireDevPlugin } from './src/server/observatoire.mjs';

export default defineConfig({
  site: 'https://peakfunding.eu',
  integrations: [react(), sitemap()],
  vite: { plugins: [tailwindcss(), observatoireDevPlugin()] },
});
