import { getEntry } from 'astro:content';

type Resolved = { pick: any; guideHref: string; guideTitle: string };

function lowestWithAsin(picks: any[]) {
  return [...picks].filter((p) => p.asin).sort((a, b) => a.rank - b.rank)[0];
}

async function fromRef(ref: string): Promise<Resolved | null> {
  const [path, rankStr] = ref.split('#');
  const [collection, ...rest] = path.split('/');
  if (collection !== 'guides') return null;
  const guide = await getEntry('guides', rest.join('/'));
  if (!guide || guide.data.draft) return null;
  const picks = guide.data.picks;
  const pick = rankStr
    ? picks.find((p) => p.rank === Number(rankStr) && p.asin)
    : lowestWithAsin(picks);
  if (!pick) return null;
  return { pick, guideHref: `/guides/${guide.id}/`, guideTitle: guide.data.title };
}

/** Resolve the product to feature on how-to / blog articles. */
export async function resolveRecommendation(data: {
  recommended?: string;
  related?: string[];
}): Promise<Resolved | null> {
  if (data.recommended) return fromRef(data.recommended);
  for (const ref of data.related ?? []) {
    if (!ref.startsWith('guides/')) continue;
    const r = await fromRef(ref);
    if (r) return r;
  }
  return null;
}
