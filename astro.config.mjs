// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import mdx from '@astrojs/mdx';
import { remarkReadingTime } from './src/lib/remark-reading-time.mjs';

export default defineConfig({
  site: 'https://www.moshakha.com',
  // GitHub Pages serves the directory-format build by 301-redirecting the
  // no-slash form to the slash form — 'always' keeps every internal URL,
  // the canonical tag, and the sitemap agreeing with the URL that actually
  // returns 200, instead of pointing at one that redirects away from itself.
  trailingSlash: 'always',
  output: 'static',
  integrations: [
    mdx(),
    sitemap({
      filter: (page) =>
        // Legacy OraeSkin skincare posts are excluded from the new sitemap.
        !page.includes('/skincare/') &&
        // Soft-redirect stubs point their own canonical at a different URL —
        // listing them in the sitemap as well as their own canonical target
        // sends a conflicting signal about which URL to index.
        !page.includes('/blog/can-you-use-fabric-softener-on-microfiber'),
      changefreq: 'weekly',
      lastmod: new Date(),
      // Ensure exactly one trailing slash so sitemap URLs match the
      // <link rel="canonical"> tag emitted by Seo.astro.
      serialize: (item) => {
        item.url = item.url.replace(/\/*$/, '/');
        return item;
      },
    }),
  ],
  build: {
    // Emit /guides/foo/index.html so URLs stay extensionless and match the old site.
    format: 'directory',
    inlineStylesheets: 'auto',
  },
  image: {
    responsiveStyles: true,
  },
  markdown: {
    remarkPlugins: [remarkReadingTime],
    shikiConfig: { theme: 'github-light', wrap: true },
  },
});
