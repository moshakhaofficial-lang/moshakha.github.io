// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import mdx from '@astrojs/mdx';

export default defineConfig({
  site: 'https://www.moshakha.com',
  trailingSlash: 'ignore',
  output: 'static',
  integrations: [
    mdx(),
    sitemap({
      // Legacy OraeSkin skincare posts are excluded from the new sitemap.
      filter: (page) => !page.includes('/skincare/'),
      changefreq: 'weekly',
      lastmod: new Date(),
      // Strip trailing slashes so sitemap URLs match the <link rel="canonical">
      // we emit. Mismatched forms make Google pick a canonical for us.
      serialize: (item) => {
        item.url = item.url.replace(/(?<!:\/)\/$/, '');
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
    shikiConfig: { theme: 'github-light', wrap: true },
  },
});
