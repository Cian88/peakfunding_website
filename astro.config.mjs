// @ts-check
import { defineConfig } from 'astro/config';
import { loadEnv } from 'vite';
import { salesIndexable } from './src/lib/sales-indexing.mjs';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import { observatoireDevPlugin } from './src/server/observatoire.mjs';
import { dateArticle, dateISO } from './src/lib/editorial.mjs';
import articles from './src/data/articles.json' with { type: 'json' };

const salesEnv = loadEnv(process.env.NODE_ENV || 'production', process.cwd(), 'PUBLIC_');

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
      filter: (page) => salesIndexable(new URL(page).pathname, salesEnv) && !/\/(avis|404|conditions-peak-exchange|conditions-ebook|conditions-peak-pitch)(\/|$)/.test(new URL(page).pathname),
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
  // Politique de sécurité du contenu, émise en <meta> (GitHub Pages ne permet pas d'en-têtes).
  // Astro y ajoute l'empreinte de chacun de ses scripts et styles intégrés.
  // Toute nouvelle intégration tierce doit être déclarée ici (voir docs/securite.md).
  security: {
    csp: {
      algorithm: 'SHA-256',
      directives: [
        "default-src 'self'",
        "base-uri 'self'",
        "object-src 'none'",
        "form-action 'self' https://formspree.io",
        // Avatars Google des avis ; images de l'espace client Actelo.
        "img-src 'self' data: https://*.googleusercontent.com https://peakfunding.actelo.app",
        "font-src 'self' https://peakfunding.actelo.app",
        "media-src 'self'",
        // Avis (Supabase), géocodage des villes (Nominatim), widget Actelo et son suivi d'erreurs.
        "connect-src 'self' https://cuzermbffitfuoknrmca.supabase.co wss://cuzermbffitfuoknrmca.supabase.co https://nominatim.openstreetmap.org https://peakfunding.actelo.app https://*.ingest.sentry.io",
        "frame-src https://peakfunding.actelo.app",
        'upgrade-insecure-requests',
      ],
      scriptDirective: { resources: ["'self'", 'https://peakfunding.actelo.app'] },
      styleDirective: { resources: ["'self'", 'https://peakfunding.actelo.app', { resource: "'unsafe-inline'", kind: 'attribute' }] },
    },
  },
  vite: { plugins: [tailwindcss(), observatoireDevPlugin()] },
});
