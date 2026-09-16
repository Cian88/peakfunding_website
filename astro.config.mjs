// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import { observatoireDevPlugin } from './src/server/observatoire.mjs';
import { dateArticle, dateISO } from './src/lib/editorial.mjs';
import articles from './src/data/articles.json' with { type: 'json' };

export default defineConfig({
  site: 'https://peakfunding.eu',
  i18n: {
    locales: ['fr', 'en'],
    defaultLocale: 'fr',
    routing: { prefixDefaultLocale: false },
  },
  integrations: [
    react(),
    sitemap({
      // Pages privées ou techniques : jamais dans le plan du site (elles portent déjà noindex).
      filter: (page) => !/\/(avis|404)(\/|$)/.test(new URL(page).pathname),
      i18n: { defaultLocale: 'fr', locales: { fr: 'fr-FR', en: 'en-GB' } },
      changefreq: 'weekly',
      // Date de dernière modification uniquement là où elle est connue : la date de l'article.
      serialize: (item) => {
        const slug = new URL(item.url).pathname.match(/^\/(?:en\/)?actualites\/([a-z0-9-]+)\/$/)?.[1];
        const article = slug && articles.find((a) => a.slug === slug);
        return article ? { ...item, lastmod: dateISO(dateArticle(article)) } : item;
      },
    }),
  ],
  vite: { plugins: [tailwindcss(), observatoireDevPlugin()] },
});
