#!/usr/bin/env node
/**
 * Pins any live article URL not yet recorded in the manifest. Runs after each
 * successful deploy, so it reads the *live* site (sitemap + rendered <head>
 * tags) rather than local content files — what's actually public is the only
 * thing that should ever get pinned.
 */

const SITE_URL = process.env.SITE_URL || 'https://www.moshakha.com';
const APP_ID = process.env.PINTEREST_APP_ID;
const APP_SECRET = process.env.PINTEREST_APP_SECRET;
const REFRESH_TOKEN = process.env.PINTEREST_REFRESH_TOKEN;
const BOARD_ID = process.env.PINTEREST_BOARD_ID;
const MANIFEST_PATH = new URL('../data/pinterest-pinned.json', import.meta.url);

// Trial-access rate limits are tight; keep a run small and paced rather than
// risk a burst 429 mid-batch.
const MAX_PINS_PER_RUN = 15;
const DELAY_MS_BETWEEN_PINS = 3000;

// Only these sections are articles worth pinning — category index pages,
// the homepage, and static pages (about/contact/etc.) are excluded by never
// matching this pattern.
const ARTICLE_PATH_RE = /^\/(guides|how-to|reviews|blog)\/[^/]+\/$/;

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

function fail(msg) {
  console.error(`::error::${msg}`);
  process.exit(1);
}

for (const [name, val] of Object.entries({ APP_ID, APP_SECRET, REFRESH_TOKEN, BOARD_ID })) {
  if (!val) fail(`Missing required env var for ${name}`);
}

async function getAccessToken() {
  const res = await fetch('https://api.pinterest.com/v5/oauth/token', {
    method: 'POST',
    headers: {
      Authorization: `Basic ${Buffer.from(`${APP_ID}:${APP_SECRET}`).toString('base64')}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({ grant_type: 'refresh_token', refresh_token: REFRESH_TOKEN }),
  });
  if (!res.ok) fail(`Token refresh failed: ${res.status} ${await res.text()}`);
  const data = await res.json();
  if (data.refresh_token && data.refresh_token !== REFRESH_TOKEN) {
    console.warn(
      '::warning::Pinterest issued a new refresh_token. Update the PINTEREST_REFRESH_TOKEN secret or future runs will use a stale one.',
    );
  }
  return data.access_token;
}

async function loadManifest() {
  try {
    const text = await import('node:fs/promises').then((fs) => fs.readFile(MANIFEST_PATH, 'utf8'));
    return JSON.parse(text);
  } catch {
    return {};
  }
}

async function saveManifest(manifest) {
  const fs = await import('node:fs/promises');
  await fs.writeFile(MANIFEST_PATH, JSON.stringify(manifest, null, 2) + '\n');
}

async function fetchSitemapUrls() {
  const indexRes = await fetch(`${SITE_URL}/sitemap-index.xml`);
  if (!indexRes.ok) fail(`Could not fetch sitemap-index.xml: ${indexRes.status}`);
  const indexXml = await indexRes.text();
  const subSitemaps = [...indexXml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);

  const urls = [];
  for (const sitemapUrl of subSitemaps) {
    const res = await fetch(sitemapUrl);
    if (!res.ok) continue;
    const xml = await res.text();
    urls.push(...[...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]));
  }
  return urls;
}

function extractMeta(html, url) {
  const title = html.match(/<title>([^<]*)<\/title>/)?.[1]?.trim();
  const description =
    html.match(/<meta\s+property="og:description"\s+content="([^"]*)"/)?.[1] ||
    html.match(/<meta\s+name="description"\s+content="([^"]*)"/)?.[1];
  const image = html.match(/<meta\s+property="og:image"\s+content="([^"]*)"/)?.[1];
  const canonical = html.match(/<link\s+rel="canonical"\s+href="([^"]*)"/)?.[1];
  const noindex = /<meta\s+name="robots"\s+content="[^"]*noindex/.test(html);
  return { title, description, image, canonical: canonical ?? url, noindex };
}

async function createPin({ accessToken, title, description, link, imageUrl }) {
  const res = await fetch('https://api.pinterest.com/v5/pins', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      board_id: BOARD_ID,
      title: title?.slice(0, 100),
      description: description?.slice(0, 500),
      link,
      media_source: { source_type: 'image_url', url: imageUrl },
    }),
  });
  const body = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(`${res.status} ${JSON.stringify(body)}`);
  return body;
}

async function main() {
  const accessToken = await getAccessToken();
  const manifest = await loadManifest();
  const allUrls = await fetchSitemapUrls();

  const candidates = allUrls
    .map((u) => new URL(u).pathname)
    .filter((path) => ARTICLE_PATH_RE.test(path))
    .filter((path) => !manifest[path]);

  console.log(`${allUrls.length} sitemap URLs, ${candidates.length} unpinned article(s) found.`);

  let pinned = 0;
  for (const path of candidates) {
    if (pinned >= MAX_PINS_PER_RUN) {
      console.log(`Hit MAX_PINS_PER_RUN (${MAX_PINS_PER_RUN}); remaining candidates left for next run.`);
      break;
    }
    const url = new URL(path, SITE_URL).href;
    const res = await fetch(url);
    if (!res.ok) {
      console.warn(`Skipping ${url}: fetch failed (${res.status})`);
      continue;
    }
    const html = await res.text();
    const meta = extractMeta(html, url);

    if (meta.noindex) {
      console.log(`Skipping ${url}: noindex`);
      continue;
    }
    if (meta.canonical !== url) {
      console.log(`Skipping ${url}: canonical points elsewhere (${meta.canonical})`);
      continue;
    }
    if (!meta.image || !meta.title) {
      console.warn(`Skipping ${url}: missing title or image in <head>`);
      continue;
    }

    try {
      const pin = await createPin({
        accessToken,
        title: meta.title.replace(/\s*\|\s*Moshakha$/, ''),
        description: meta.description,
        link: url,
        imageUrl: meta.image,
      });
      manifest[path] = { pinId: pin.id, pinnedAt: new Date().toISOString() };
      pinned++;
      console.log(`Pinned: ${url} -> pin ${pin.id}`);
    } catch (err) {
      console.error(`::warning::Failed to pin ${url}: ${err.message}`);
    }

    await sleep(DELAY_MS_BETWEEN_PINS);
  }

  await saveManifest(manifest);
  console.log(`Done. ${pinned} new pin(s) created this run.`);
}

main().catch((err) => fail(err.stack || err.message));
