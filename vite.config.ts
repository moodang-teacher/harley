import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig, loadEnv} from 'vite';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const siteUrl = env.VITE_SITE_URL?.trim();
  const site = siteUrl ? new URL(siteUrl.endsWith('/') ? siteUrl : siteUrl + '/') : undefined;
  if (site && !['https:', 'http:'].includes(site.protocol)) {
    throw new Error('VITE_SITE_URL must be an HTTP or HTTPS site URL.');
  }
  return {
    base: './',
    plugins: [react(), tailwindcss(), {
      name: 'social-metadata',
      transformIndexHtml: {
        order: 'post',
        handler(html) {
          const socialImage = site ? new URL('og-image.jpg', site).href : './og-image.jpg';
          return {
            html: html.replaceAll('__SOCIAL_IMAGE__', socialImage.replaceAll('&', '&amp;')),
            tags: site ? [
              { tag: 'meta', attrs: { property: 'og:url', content: site.href }, injectTo: 'head' },
              { tag: 'link', attrs: { rel: 'canonical', href: site.href }, injectTo: 'head' }
            ] : []
          };
        }
      }
    }],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
