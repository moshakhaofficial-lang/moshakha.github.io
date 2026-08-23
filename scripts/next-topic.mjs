/**
 * Reads content-backlog.md, returns the first `queued` topic as JSON, and
 * warns when the queue is running low.
 *
 * Usage: node scripts/next-topic.mjs
 * Exits non-zero (with a clear message) if the backlog is empty.
 */
import { readFile } from 'node:fs/promises';

const LOW_WATER_MARK = 4;
const AUTOMATABLE = new Set(['blog', 'how-to']);

const md = await readFile('content-backlog.md', 'utf8');

const rows = md
  .split('\n')
  .filter((l) => /^\|\s*queued\s*\|/i.test(l))
  .map((l) => l.split('|').map((c) => c.trim()).filter(Boolean))
  .map(([status, slug, collection, targetKeyword, angle]) => ({
    status, slug, collection, targetKeyword, angle,
  }));

if (rows.length === 0) {
  console.error(
    'BACKLOG EMPTY: no topics with status `queued` in content-backlog.md.\n' +
    'Add rows to the Queue table before the weekly job can run again.',
  );
  process.exit(1);
}

const next = rows[0];

if (!AUTOMATABLE.has(next.collection)) {
  console.error(
    `REFUSING TO AUTOMATE: "${next.slug}" is in the "${next.collection}" collection.\n` +
    'Only `blog` and `how-to` may be generated automatically — guides and reviews\n' +
    'contain product picks, ASINs and prices that must be verified by a human\n' +
    'against live Amazon listings. Write this one by hand, or change its collection.',
  );
  process.exit(1);
}

const remaining = rows.length - 1;
const low = remaining < LOW_WATER_MARK;

// Consumed by the workflow via $GITHUB_OUTPUT.
console.log(JSON.stringify({ ...next, remaining, low }, null, 2));

if (low) {
  console.error(
    `\n⚠️  BACKLOG LOW: only ${remaining} topic(s) left after this one ` +
    `(threshold ${LOW_WATER_MARK}). Add more rows to content-backlog.md.`,
  );
}
