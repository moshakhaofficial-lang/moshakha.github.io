/**
 * Generates one draft article from the next backlog topic.
 *
 * Usage: node scripts/generate-article.mjs '<topic-json>'
 * Requires ANTHROPIC_API_KEY in the environment.
 *
 * Writes src/content/<collection>/<slug>.md and prints the path.
 * The output is a DRAFT for human review — it is never published automatically.
 */
import Anthropic from '@anthropic-ai/sdk';
import { writeFile, readFile, readdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';

const topic = JSON.parse(process.argv[2] ?? '{}');
if (!topic.slug || !topic.collection) {
  console.error('Usage: node scripts/generate-article.mjs \'{"slug":...,"collection":...}\'');
  process.exit(1);
}

const outPath = `src/content/${topic.collection}/${topic.slug}.md`;
if (existsSync(outPath)) {
  console.error(`REFUSING TO OVERWRITE: ${outPath} already exists.`);
  process.exit(1);
}

// Give the model the real inventory so it links to pages that actually exist
// rather than inventing plausible-looking internal URLs.
const collections = ['guides', 'how-to', 'reviews', 'blog'];
const inventory = [];
for (const c of collections) {
  const files = await readdir(`src/content/${c}`).catch(() => []);
  for (const f of files.filter((f) => f.endsWith('.md'))) {
    const body = await readFile(`src/content/${c}/${f}`, 'utf8');
    const title = body.match(/^title:\s*"(.+)"/m)?.[1] ?? f;
    inventory.push(`  /${c}/${f.replace(/\.md$/, '')} — ${title}`);
  }
}

const SYSTEM = `You write for Moshakha, an independent car cleaning and detailing site.

VOICE
- Direct and specific. No filler, no "in today's fast-paced world", no hype.
- Take positions. Say when something is not worth buying, or when the honest answer
  is "you don't need this".
- Explain mechanisms, not just instructions. The reader should understand WHY.
- British spelling for "microfibre"; otherwise US English.
- Never use "we tested" or imply hands-on testing. Our research is specification
  analysis plus aggregated owner feedback, and we say so.

HARD RULES — violating any of these makes the draft unusable
1. NEVER invent product names, ASINs, prices, or specifications. This article must
   contain NO affiliate links and NO product recommendations by name. It is
   informational content only. If the topic seems to require product picks, write
   about the decision criteria instead and link to an existing guide.
2. NEVER state a specific price.
3. Only use internal links from the INVENTORY below. Never invent a URL.
4. Do not fabricate statistics, study results, or expert quotes.

FRONTMATTER — output valid YAML frontmatter with exactly these fields:
  title: max 70 characters, in double quotes
  description: between 70 and 165 characters, in double quotes (build fails outside this)
  targetKeyword: the target keyword, in double quotes
  publishDate: today's date as YYYY-MM-DD
  author: "Moshakha Editorial"
  related: a YAML list of 2-3 paths from the INVENTORY, formatted as "collection/slug"
           (no leading slash), in double quotes
  faq: a YAML list of 4-6 items, each with a q and an a field in double quotes.
       Answers should be 40-70 words and directly answer the question in the first sentence.
${topic.collection === 'how-to' ? `  totalTime: ISO 8601 duration, e.g. PT30M
  supplies: a YAML list of 3-8 required items in double quotes
  steps: a YAML list of 5-9 items, each with a name and a text field in double quotes.
         Step text should be 30-60 words and explain why, not just what.` : ''}

BODY
- 1100-1600 words of markdown after the frontmatter.
- Start with the answer or the key insight. No throat-clearing preamble.
- Use ## and ### headings. Include at least one markdown table where it genuinely helps.
- Weave in 2-4 internal links from the INVENTORY using markdown link syntax.
- Do not repeat the FAQ content in the body.

Output ONLY the article file content, starting with --- and nothing before it.
No code fences, no commentary.`;

const USER = `Write the next article.

SLUG: ${topic.slug}
COLLECTION: ${topic.collection}
TARGET KEYWORD: ${topic.targetKeyword}
ANGLE: ${topic.angle}
TODAY: ${new Date().toISOString().slice(0, 10)}

INVENTORY of existing pages you may link to:
${inventory.join('\n')}`;

const client = new Anthropic();

const stream = client.messages.stream({
  model: process.env.ARTICLE_MODEL || 'claude-opus-5',
  max_tokens: 16000,
  thinking: { type: 'adaptive' },
  output_config: { effort: 'high' },
  system: SYSTEM,
  messages: [{ role: 'user', content: USER }],
});

const response = await stream.finalMessage();

if (response.stop_reason === 'refusal') {
  console.error('Model declined this request:', response.stop_details?.explanation);
  process.exit(1);
}

let text = response.content
  .filter((b) => b.type === 'text')
  .map((b) => b.text)
  .join('')
  .trim();

// Strip a stray code fence if the model wraps the file despite instructions.
text = text.replace(/^```(?:markdown|md|yaml)?\n/, '').replace(/\n```$/, '');

if (!text.startsWith('---')) {
  console.error('Output did not start with YAML frontmatter. Aborting.');
  console.error(text.slice(0, 400));
  process.exit(1);
}

// Fail fast on the rules most likely to be violated, before a human reads it.
const violations = [];
if (/\bamzn\.to\b|amazon\.[a-z.]+\/dp\/|tag=/i.test(text)) violations.push('contains an affiliate or Amazon link');
if (/\bB0[A-Z0-9]{8}\b/.test(text)) violations.push('contains something shaped like an ASIN');
if (/\$\d/.test(text)) violations.push('states a specific price');
if (/\bwe tested\b/i.test(text)) violations.push('claims hands-on testing');
if (violations.length) {
  console.error('DRAFT REJECTED — ' + violations.join('; '));
  process.exit(1);
}

await writeFile(outPath, text + '\n', 'utf8');
console.log(outPath);
console.error(`\nWrote ${outPath} (${text.split(/\s+/).length} words)`);
