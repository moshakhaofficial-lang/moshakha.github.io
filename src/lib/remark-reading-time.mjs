import { toString } from 'mdast-util-to-string';

/**
 * Exposes `minutesRead` on each entry's remarkPluginFrontmatter, computed from
 * the actual rendered body rather than a frontmatter field someone has to
 * remember to update.
 */
export function remarkReadingTime() {
  return (tree, file) => {
    const words = toString(tree).trim().split(/\s+/).filter(Boolean).length;
    file.data.astro.frontmatter.minutesRead = Math.max(1, Math.round(words / 225));
    file.data.astro.frontmatter.wordCount = words;
  };
}
