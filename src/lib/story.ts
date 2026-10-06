/**
 * The "whole story" template for research summaries under Insights. A story is a short
 * hero (the research question), a few chapters made of typed blocks, and links to the
 * paper. Rendered by src/components/story/StoryPage.astro.
 *
 * Every number in a story must come from the paper or the case-study data it summarises.
 */
import type { CollectionEntry } from 'astro:content';

export type Results = NonNullable<CollectionEntry<'projects'>['data']['results']>;
export type StoryFact = { value: string; label: string };

export type StoryBlock =
  | { type: 'text'; paras: string[] }
  | { type: 'pull'; text: string }
  | { type: 'list'; title?: string; items: string[]; numbered?: boolean; boxed?: boolean }
  | { type: 'cards'; title?: string; items: { eyebrow?: string; title: string; body: string; accent?: boolean }[] }
  | { type: 'facts'; items: StoryFact[] }
  | { type: 'callout'; title: string; body: string }
  | { type: 'steps'; title?: string; rows: { label: string; detail: string }[] }
  | { type: 'answers'; labels: { worry: string; answer: string }; items: { worry: string; verdict: string; body: string; stat: StoryFact }[] }
  | { type: 'chart'; title?: string; results: Results }
  | { type: 'charts'; title?: string; results: Results[] }
  | { type: 'note'; text: string };

export type StoryChapter = {
  id: string;
  kicker: string;
  /** Short label for the contents list. */
  short: string;
  title: string;
  /** Left column (or full width when there is no aside). */
  main: StoryBlock[];
  /** Right column. */
  aside?: StoryBlock[];
  /** Full width, below both columns. */
  full?: StoryBlock[];
  /** One italic line that leads into the next chapter. */
  bridge?: string;
};

export type Story = {
  slug: string;
  /** e.g. "Working paper", "Cross-country survey experiment". */
  kind: string;
  /** The research question, used as the page title. */
  title: string;
  /** The paper's own title, shown in the meta line. */
  paperTitle: string;
  lede: string;
  /** Short text for cards on the Insights page. */
  summary: string;
  authors: string[];
  dateLabel: string;
  venue?: string;
  /** Shown as a badge and a note in the hero, e.g. provisional results. */
  status?: { badge: string; note: string };
  stats: StoryFact[];
  /** A PDF of the paper, or a placeholder note when none is public yet. */
  pdf: { href: string; label: string } | { placeholder: string };
  links: { label: string; href: string }[];
  chapters: StoryChapter[];
  /** Small print at the end: funding, disclaimers. */
  footnotes: string[];
};

/** Turn an estimate and a standard error (both as proportions) into a chart row in percentage points. */
export function ppEffect(label: string, est: number, se: number, group?: string) {
  const r = (x: number) => Math.round(x * 1000) / 10;
  return { label, group, estimate: r(est), ciLow: r(est - 1.96 * se), ciHigh: r(est + 1.96 * se) };
}
