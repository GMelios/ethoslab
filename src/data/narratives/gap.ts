/**
 * Homepage narrative "The evaluation gap": a problem-led argument.
 *
 *   hook -> stakes -> turn -> how -> proof -> who -> invite
 *
 * Every word shown on /b/gap and /c/gap lives in this file. The two designs
 * render it and may differ only in layout and visuals, never in wording.
 *
 * The proof uses two real studies:
 *   1. MultiPoD language experiment (projects/en/multipod-language-experiment),
 *      numbers read from `results` and `secondaryResults`; provisional.
 *   2. The PIP working paper (research/en/disability-benefits-employment),
 *      findings read from `highlights`; no intervals yet, so no chart.
 * Nothing numeric is typed here. getGapStory() formats the entries' numbers and
 * throws at build time if the data stop supporting the wording.
 */
import type { CollectionEntry } from 'astro:content';
import { getWork, getResearch, programmeLine, formatDate } from '../../lib/content';
import { getLocalized, localePath } from '../../i18n/utils';
import { partners } from '../site';
import type { Locale } from '../../i18n/config';

type Results = NonNullable<CollectionEntry<'projects'>['data']['results']>;
type Effect = Results['effects'][number];

// ---------------------------------------------------------------------------
// Formatting and guards
// ---------------------------------------------------------------------------
const MINUS = '\u2212';
const num = (v: number, d: number) => {
  const s = Math.abs(v).toFixed(d);
  return (v < 0 && Number(s) !== 0 ? MINUS : '') + s;
};
const signed = (v: number, d: number) => (v > 0 ? '+' : '') + num(v, d);
/** Log points to a rounded percentage change. */
const logPct = (v: number) => Math.round((Math.exp(v) - 1) * 100);
const WORDS = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten'];
const word = (n: number) => WORDS[n] ?? String(n);
const includesZero = (e: Effect) => e.ciLow <= 0 && e.ciHigh >= 0;

function assert(cond: unknown, msg: string): asserts cond {
  if (!cond) throw new Error(`[narratives/gap] ${msg}`);
}

// ---------------------------------------------------------------------------
// Static copy
// ---------------------------------------------------------------------------
export const copy = {
  meta: {
    title: 'Ethos Lab',
    description:
      'Public programmes are counted by what they spend. Ethos Lab tests what they change, with experiments and quasi-experimental evaluation for public bodies across Europe.',
  },

  hero: {
    eyebrow: 'The evaluation gap',
    /** Rendered in order; `accent` parts are highlighted by each design. */
    title: [
      { text: 'Launched is not the same as ', accent: false },
      { text: 'working.', accent: true },
    ],
    lead: 'Public programmes are counted by what they spend, pay out and publish. Whether anyone is better off because of them is a separate question, and only a fair test can answer it. We run those tests for public bodies across Europe.',
    primary: { label: 'Start a conversation', path: '/contact/' },
    secondary: { label: 'See what testing found', href: '#proof' },
    report: {
      title: 'Programme report',
      rows: [
        { label: 'Budget spent', status: 'Reported', known: true },
        { label: 'Benefits paid', status: 'Reported', known: true },
        { label: 'Information published', status: 'Reported', known: true },
        { label: 'What changed because of it', status: 'Not tested', known: false },
      ],
      footnote: 'Everything is counted except the effect.',
    },
  },

  stakes: {
    eyebrow: 'What the gap costs',
    title: 'Not knowing has a cost.',
    lead: 'An untested programme does not fail loudly. It fails quietly, and someone else pays.',
    unknownLabel: 'Unknown',
    items: [
      {
        id: 'understanding',
        thread: 'Understanding',
        title: 'Published is not the same as understood',
        body: 'Once information is online, it counts as provided, even when it is in a language the reader handles less well. What readers lose shows up in no report.',
        unknown: 'How much readers take in when the text is not in their language',
      },
      {
        id: 'employment',
        thread: 'Employment',
        title: 'Rules built on an assumption',
        body: 'The standard view is that disability benefits reduce work: they add income, and many withdraw support as earnings rise. Rules are designed around that view. Whether it holds for a particular benefit is an empirical question.',
        unknown: 'Whether a benefit with no earnings test keeps people out of work',
      },
    ],
  },

  turn: {
    eyebrow: 'It does not have to be this way',
    title: 'Every rollout is already an experiment.',
    lead: 'A reform changes eligibility for some conditions and not others. Different providers run assessments in different regions. A text reaches some readers in their own language and others in a second one. Set that up fairly, or find where it was as good as random, and you can measure what changed.',
    contrast: [
      {
        id: 'before-after',
        title: 'Before and after',
        body: 'Tells you what changed. But the economy, prices and the season changed too.',
        verdict: 'Mixes your programme with everything else',
      },
      {
        id: 'with-without',
        title: 'With and without',
        body: 'Tells you what your programme changed. That is the number a decision needs.',
        verdict: 'Isolates the effect',
      },
    ],
    chart: {
      start: 'Programme starts',
      treated: 'With the programme',
      control: 'Comparison group',
      caption: 'Schematic, not data.',
      describe:
        'Schematic line chart. Two groups move together until the programme starts; then the group with the programme rises faster than the comparison group. A dashed bracket shows the before and after rise of the programme group. A smaller highlighted bracket shows the gap between the two groups at the end, which is the effect of the programme.',
    },
    close: 'A fair test can be far smaller than the rollout it protects: one survey wave, a few regions, or a reform that has already happened. It costs far less than scaling something that does not work.',
  },

  how: {
    eyebrow: 'How a fair test works',
    title: 'Three steps from a question to an answer',
    stepLabel: 'Step',
    steps: [
      {
        title: 'Start with the decision',
        body: 'We agree what you will do differently depending on the answer, and which outcome matters, before any data is collected.',
      },
      {
        title: 'Build a fair comparison',
        body: 'We randomise who sees what, or use a reform that reached some people and not others. We register the analysis plan where the design allows, and say so when we have not.',
      },
      {
        title: 'Report everything',
        body: 'The effect, how sure we can be, and every specification we ran. A result with no detectable effect gets the same care as a success.',
      },
    ],
  },

  proof: {
    eyebrow: 'What testing finds',
    title: 'What you only learn by testing',
    lead: 'Two studies from our own work. In one, a cost nobody was counting turned out to be real, and a simple choice avoided it. In the other, the expected fall in employment was not found. Neither would show up in a spending report.',
    questionLabel: 'The question',
    withoutLabel: 'Without the test',
    provisionalBadge: 'Provisional',
    estimatesBadge: 'Estimates to add',
    multipod: {
      title: 'Political information in a second language',
      verdict: 'A cost, and a simple fix',
      without: 'Information in English would still count as provided, and nobody would know that a choice of language avoids the cost.',
      recommendsLabel: 'What the study recommends',
      recommends:
        "The platform should default to each user's preferred language, make language choice simple, visible and reversible, label translated content, and monitor comprehension and effort by language.",
      credit: "Ethos Lab led this study within MultiPoD Work Package 1. MultiPoD is funded by the European Union's Horizon Europe programme.",
      readLabel: 'Read the case study',
    },
    pip: {
      title: 'Disability benefits and work',
      verdict: 'Employment effects close to zero',
      slotLabel: 'Employment effects, with confidence intervals',
      /** `{year}` is filled from the paper's summary. */
      body: "The UK's Personal Independence Payment helps with the costs of disability and has no earnings test. The paper uses a {year} reform, with eligibility changes that differed across health conditions and quasi-random assignment of regions to assessment providers, to isolate the pure income effect.",
      highlightsLabel: 'What the paper finds',
      suggests: 'The findings suggest that a benefit designed as a cost-of-living supplement can provide financial security without necessarily discouraging work.',
      without: 'The benefit would still be judged on an expectation that this evidence does not support.',
      readLabel: 'Read the paper on SSRN',
    },
  },

  who: {
    eyebrow: 'Who we are',
    title: 'Research you can check',
    lead: 'Both studies are our own: Ethos Lab led the MultiPoD experiment, and the disability benefits paper is academic research by George Melios with Bouke Klein Teeselink. Our research leads are economists and political scientists who publish in peer-reviewed journals, based in Athens and working across Europe.',
    teamTitle: 'The team',
    partnersTitle: 'Partners',
    projectsTitle: 'EU-funded projects',
    stats: {
      partners: 'partner institutions across government, academia and civil society',
      projects: 'EU-funded projects, from Horizon Europe to Erasmus+',
      regions: { value: '250+', label: 'European regions scored in our Reframing Welfare Index' },
    },
    teamLink: { label: 'Meet the team', path: '/about/' },
  },

  invite: {
    eyebrow: 'Your next step',
    title: 'Know whether it works before you scale it.',
    body: 'Tell us about the programme and the decision ahead. We will come back with an honest view of what a fair test could show, and what it would take.',
    primary: { label: 'Start a conversation', path: '/contact/' },
    secondary: { label: 'Read the case studies', path: '/work/' },
  },
} as const;

export type StakeId = (typeof copy.stakes.items)[number]['id'];
const stake = (id: StakeId) => copy.stakes.items.find((s) => s.id === id)!;

// ---------------------------------------------------------------------------
// Resolve everything a design needs, for one language.
// ---------------------------------------------------------------------------
export async function getGapStory(lang: Locale) {
  const work = await getWork(lang);

  // ---- Case 1: MultiPoD language experiment (real, provisional) ------------
  const mp = work.find((w) => w.slug === 'multipod-language-experiment');
  assert(mp, 'MultiPoD case study not found');
  const r = mp.data.results;
  assert(r, 'MultiPoD case study has no results');
  const pick = (res: Results, label: string, group?: string) => {
    const hit = res.effects.find((e) => e.label === label && (group === undefined || e.group === group));
    assert(hit, `effect "${group ?? ''} / ${label}" not found`);
    return hit;
  };
  const secondary = (title: string) => {
    const hit = mp.data.secondaryResults.find((s) => s.title === title);
    assert(hit, `secondary result "${title}" not found`);
    return hit;
  };
  const forcedSpecs = r.effects.filter((e) => e.group === 'Forced second language');
  const forced = pick(r, 'Full controls', 'Forced second language');
  const choice = pick(r, 'Full controls', 'Choice of language');
  const unadj = pick(r, 'Unadjusted', 'Forced second language');
  const diff = secondary('Perceived difficulty');
  const time = secondary('Time spent reading');
  const diffForced = pick(diff, 'Forced second language');
  const diffChoice = pick(diff, 'Choice of language');
  const timeForced = pick(time, 'Forced second language');
  const timeChoice = pick(time, 'Choice of language');

  const control = forced.controlMean;
  const surveyN = mp.data.sample?.match(/survey of ([\d,]+)/)?.[1];
  const outOf = Number(r.unitLabel.match(/out of (\d+)/)?.[1]);
  const scale = diff.unitLabel.match(/(\d+ to \d+)/)?.[1];
  const nCountries = mp.data.countries?.length ?? 0;
  assert(control !== undefined && surveyN && outOf && scale && unadj.n && nCountries, 'MultiPoD entry is missing a number the copy needs');

  // Wording guards: each clause below must stay true of the data.
  assert(forced.ciHigh < 0, 'forced second language must lower scores');
  const spread = Math.max(...forcedSpecs.map((e) => e.estimate)) - Math.min(...forcedSpecs.map((e) => e.estimate));
  assert(forcedSpecs.length >= 2 && spread < 0.05, '"the estimate barely moves" needs specifications within 0.05');
  assert(choice.ciLow > 0, '"slightly above control" needs the choice interval above zero');
  assert(diffForced.ciLow > 0, '"rated the text harder" needs the difficulty interval above zero');
  assert(includesZero(diffChoice), '"no detectable change in difficulty" needs the interval to include zero');
  assert(timeForced.ciLow > 0, '"spent longer" needs the reading-time interval above zero');
  assert(includesZero(timeChoice), '"no clear difference in reading time" needs the interval to include zero');

  const d = r.decimals;
  const dd = diff.decimals;
  const multipod = {
    id: 'understanding' as const,
    thread: stake('understanding').thread,
    question: stake('understanding').unknown,
    ...copy.proof.multipod,
    meta: `${mp.data.design} in ${word(nCountries)} countries`,
    figure: {
      value: num(forced.estimate, d),
      label: `correct answers out of ${outOf} when the same article was read in a second language, with no choice (control average ${control.toFixed(1)})`,
    },
    design: `We surveyed ${surveyN} adults in ${word(nCountries)} countries. The ${unadj.n.toLocaleString('en-GB')} who speak a second language were randomly assigned to read the same article on the EU AI Act in the survey language, in their second language, or in a language they chose, then answered ${word(outOf)} factual questions.`,
    body: `With no choice, scores fell by ${num(Math.abs(forced.estimate), d)} correct answers (${r.level}% CI ${num(forced.ciLow, d)} to ${num(forced.ciHigh, d)}), about ${Math.round((Math.abs(forced.estimate) / control) * 100)}% of the control average; readers also found the text harder (${signed(diffForced.estimate, dd)} on a ${scale} scale) and took about ${logPct(timeForced.estimate)}% longer (${time.level}% CI about ${logPct(timeForced.ciLow)}% to ${logPct(timeForced.ciHigh)}%). A choice of language avoided the penalty: scores were slightly above control (${signed(choice.estimate, d)}, ${r.level}% CI ${num(choice.ciLow, d)} to ${num(choice.ciHigh, d)}), with no detectable change in difficulty (the interval rules out increases above ${num(diffChoice.ciHigh, dd)}), though a rise in reading time of up to about ${logPct(timeChoice.ciHigh)}% is not ruled out.`,
    note: 'The study was not pre-registered, so all three specifications are shown, and the estimate barely moves. The penalty is statistically significant in Austria, Belgium, France, Greece and the United Kingdom, and not distinguishable from zero in Portugal and Spain.',
    provisional: mp.data.provisional,
    chart: r,
    href: localePath(lang, `/work/${mp.slug}/`),
  };

  // ---- Case 2: PIP working paper (real, no intervals yet) ------------------
  const research = await getResearch(lang, { realFirst: true });
  const paper = research.find((p) => p.slug === 'disability-benefits-employment');
  assert(paper, 'PIP working paper not found');
  assert(paper.data.highlights.length > 0, 'PIP working paper needs highlights');
  const reformYear = paper.data.summary.match(/(\d{4}) reform/)?.[1];
  assert(reformYear, 'PIP summary needs the reform year');
  const pip = {
    id: 'employment' as const,
    thread: stake('employment').thread,
    question: stake('employment').unknown,
    ...copy.proof.pip,
    body: copy.proof.pip.body.replace('{year}', reformYear),
    meta: `${paper.data.authors.join(' and ')} · ${paper.data.venue ?? 'Working paper'}, ${formatDate(paper.data.date, lang)}`,
    highlights: paper.data.highlights,
    href: paper.data.url ?? localePath(lang, '/research/'),
  };

  // ---- Who: real facts only, derived from site data and content ------------
  const shortName = (title: string) => title.split(/\s+[\u2013\u2014-]/)[0].trim();
  const euProgramme = (programmes: string[] | undefined) => programmeLine(programmes?.filter((p) => !['Private sector', 'Consulting'].includes(p)));
  const euProjects = work
    .filter((w) => w.data.programmes?.includes('EU-funded'))
    .map((w) => ({ name: shortName(w.data.title), programme: euProgramme(w.data.programmes), href: localePath(lang, `/work/${w.slug}/`) }));

  const people = await getLocalized('people', lang);
  const rank = ['Executive Team', 'Team', 'Consultants'];
  const team = people
    .filter((p) => p.data.cover)
    .map((p) => ({ p, r: rank.findIndex((g) => p.data.wpCategories?.includes(g)) }))
    .sort((a, b) => (a.r < 0 ? 99 : a.r) - (b.r < 0 ? 99 : b.r) || a.p.data.order - b.p.data.order || a.p.data.title.localeCompare(b.p.data.title))
    .map(({ p }) => ({ name: p.data.title, cover: p.data.cover! }));

  return {
    ...copy,
    multipod,
    pip,
    whoData: {
      stats: [
        { value: String(partners.length), label: copy.who.stats.partners },
        { value: String(euProjects.length), label: copy.who.stats.projects },
        copy.who.stats.regions,
      ],
      euProjects,
      team,
    },
  };
}

export type GapStory = Awaited<ReturnType<typeof getGapStory>>;
