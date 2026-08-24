/**
 * Convenience picker — prints the first `queued` topic in content-backlog.md
 * as JSON, and warns when the queue is running low.
 *
 * There is no automation attached to this. It exists so whoever's about to
 * write the next article (in chat, by hand) doesn't have to scan the table.
 *
 * Usage: node scripts/next-topic.mjs
 */
import { readFile } from 'node:fs/promises';

const LOW_WATER_MARK = 4;
const NEEDS_RESEARCH = new Set(['guides', 'reviews']);

const md = await readFile('content-backlog.md', 'utf8');

const rows = md
  .split('\n')
  .filter((l) => /^\|\s*queued\s*\|/i.test(l))
  .map((l) => l.split('|').map((c) => c.trim()).filter(Boolean))
  .map(([status, slug, collection, targetKeyword, angle]) => ({
    status, slug, collection, targetKeyword, angle,
  }));

if (rows.length === 0) {
  console.error('BACKLOG EMPTY: no topics with status `queued` in content-backlog.md.');
  process.exit(1);
}

const next = rows[0];
const remaining = rows.length - 1;
const low = remaining < LOW_WATER_MARK;

console.log(JSON.stringify({ ...next, remaining, low }, null, 2));

if (NEEDS_RESEARCH.has(next.collection)) {
  console.error(
    `\nNote: "${next.slug}" is a ${next.collection} entry — verify any ASINs and prices\n` +
    'against live Amazon listings before publishing. Never invent product data.',
  );
}

if (low) {
  console.error(
    `\n⚠️  BACKLOG LOW: only ${remaining} topic(s) left after this one ` +
    `(threshold ${LOW_WATER_MARK}). Add more rows to content-backlog.md.`,
  );
}
