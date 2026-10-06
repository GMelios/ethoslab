/**
 * The MultiPoD story under Insights (src/data/stories/multipod.ts arranges it into the story
 * template). Ported from the Question narrative prototype (/b/question). One REAL study, the MultiPoD language experiment
 * (src/content/projects/en/multipod-language-experiment.md), told in five chapters.
 *
 * Every statistic is read from the case-study entry, never retyped here, and the
 * claims the copy makes about them are asserted below, so an edit that would make the
 * story false stops the build instead of drifting.
 *
 * MultiPoD figures are PROVISIONAL (deliverable under review): the page must show
 * `story.ui.provisional` wherever they appear. The study was NOT pre-registered;
 * nothing here may claim or imply it was.
 */
import { getLocalized, localePath } from '../i18n/utils';
import type { Locale } from '../i18n/config';
import { site } from './site';

// ---- formatting ---------------------------------------------------------------------
const MINUS = '−';
const dec = (v: number, d = 2) => (v < 0 && Number(Math.abs(v).toFixed(d)) !== 0 ? MINUS : '') + Math.abs(v).toFixed(d);
const signed = (v: number, d = 2) => (v > 0 ? '+' : '') + dec(v, d);
const int = (v: number) => v.toLocaleString('en-GB');
/** Log points to a rounded percentage change, e.g. 0.105 -> 11. */
const logPct = (v: number) => Math.round((Math.exp(v) - 1) * 100);
const WORDS = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten'];
const word = (n: number) => WORDS[n] ?? String(n);
const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
const lcFirst = (s: string) => s.charAt(0).toLowerCase() + s.slice(1);
/** Country names as they read mid-sentence. */
const inSentence = (c: string) => (/^United /.test(c) ? `the ${c}` : c);
const listJoin = (xs: string[]) => (xs.length < 2 ? xs.join('') : `${xs.slice(0, -1).join(', ')} and ${xs[xs.length - 1]}`);
/** 'Unadjusted', 'Full controls' -> 'unadjusted, ..., and with full controls' (serial comma: the items contain 'and'). */
const specList = (xs: string[]) => {
  const w = xs.map((x) => (/^unadjusted$/i.test(x) ? 'unadjusted' : `with ${lcFirst(x)}`));
  return w.length < 3 ? w.join(' and ') : `${w.slice(0, -1).join(', ')}, and ${w[w.length - 1]}`;
};

function fail(msg: string): never {
  throw new Error(`[question story] ${msg} Update the copy in src/data/question.ts to match the case study.`);
}

// ---- types ----------------------------------------------------------------------------
export type Fact = { value: string; label: string; note?: string };
export type ChapterBase = {
  id: string;
  n: number;
  kicker: string;
  short: string;
  title: string;
  body: string[];
  facts: Fact[];
  bridge?: string;
};

export async function getQuestionStory(lang: Locale) {
  const allProjects = await getLocalized('projects', lang);
  const bySlug = (s: string) => allProjects.find((w) => w.slug === s);
  const study = bySlug('multipod-language-experiment');
  if (!study?.data.results) fail('The multipod-language-experiment entry or its results are missing.');
  const d = study.data;
  const results = d.results!;

  // ---- read the design ------------------------------------------------------------------
  const sample = d.sample?.match(/([\d,]+)[^,\d]*,?[^\d]*([\d,]+)/);
  if (!sample) fail(`Could not read the sample sizes from "${d.sample}".`);
  const analysed = Number(sample![1].replace(/,/g, ''));
  const surveyed = Number(sample![2].replace(/,/g, ''));
  if (!(analysed < surveyed)) fail('Expected the analysis sample to be smaller than the survey.');
  const countries = d.countries ?? fail('Countries are missing.');
  const nCountries = countries.length;
  const questions = Number(results.unitLabel.match(/out of (\d+)/)?.[1] ?? fail('No "out of N" in the results unit label.'));

  // ---- read the estimates ---------------------------------------------------------------
  const groups = [...new Set(results.effects.map((e) => e.group ?? ''))];
  if (groups.length !== 2) fail('Expected two treatment groups (forced second language, choice of language).');
  const [gForced, gChoice] = groups;
  const inGroup = (g: string) => results.effects.filter((e) => (e.group ?? '') === g);
  const pick = (g: string) => inGroup(g).find((e) => /full controls/i.test(e.label)) ?? inGroup(g).at(-1)!;
  const forced = pick(gForced);
  const choice = pick(gChoice);
  const specs = inGroup(gForced).map((e) => e.label);
  const forcedAbs = inGroup(gForced).map((e) => Math.abs(e.estimate));
  const control = forced.controlMean ?? fail('The comprehension outcome needs a control mean.');
  const relative = Math.round((Math.abs(forced.estimate) / control) * 100);

  const secondary = d.secondaryResults;
  const difficulty = secondary.find((r) => /difficult/i.test(r.title)) ?? fail('Perceived difficulty results are missing.');
  const reading = secondary.find((r) => /time|reading/i.test(r.title)) ?? fail('Reading time results are missing.');
  const byLabel = (r: typeof difficulty, g: string) => r.effects.find((e) => e.label === g) ?? fail(`No "${g}" row in "${r.title}".`);
  const diffForced = byLabel(difficulty, gForced);
  const diffChoice = byLabel(difficulty, gChoice);
  const timeForced = byLabel(reading, gForced);
  const timeChoice = byLabel(reading, gChoice);
  const scale = difficulty.unitLabel.match(/(\d+) to (\d+)/) ?? fail('No "1 to 5" scale in the difficulty unit label.');
  const scaleText = `${scale[1]} to ${scale[2]}`;

  // Country pattern from the deliverable; no country intervals are published, so no country numbers.
  const notSignificant = ['Portugal', 'Spain'];
  if (!notSignificant.every((c) => countries.includes(c))) fail('Country list changed.');
  const significant = countries.filter((c) => !notSignificant.includes(c));

  // ---- claims the copy makes; if the data stop supporting them, stop the build -------
  const excludesZero = (e: { ciLow: number; ciHigh: number }) => e.ciLow > 0 || e.ciHigh < 0;
  if (!(forced.estimate < 0 && inGroup(gForced).every((e) => e.ciHigh < 0))) fail('The copy says the forced-language penalty is negative in every specification.');
  if (!(choice.estimate > 0 && excludesZero(choice))) fail('The copy says choice scored slightly above control, with an interval above zero.');
  if (!(diffForced.estimate > 0 && excludesZero(diffForced))) fail('The copy says the forced group found the text harder.');
  if (excludesZero(diffChoice)) fail('The copy says choice had no detectable effect on difficulty.');
  if (!(timeForced.estimate > 0 && excludesZero(timeForced))) fail('The copy says the forced group read for longer.');
  if (excludesZero(timeChoice)) fail('The copy says choice reading time was not clearly different.');
  if (d.preregistration) fail('The copy says the study was not pre-registered.');
  if (!d.provisional) fail('The copy treats these figures as provisional.');
  // Narrative details that live only in the case-study prose. Warn, do not fail.
  for (const phrase of ['250-word', 'EU AI Act', 'online panel', 'not pre-registered', 'Portugal and Spain', 'Work Package 1', "Horizon Europe programme", 'reversible']) {
    if (!study.body?.includes(phrase)) console.warn(`[question story] The MultiPoD case study no longer mentions "${phrase}". Check the story copy.`);
  }

  const multipod = bySlug('multipod');

  const worries = [
    'Do people understand less when they read politics in a second language?',
    'Does it cost them more effort?',
    'Does letting people choose their language help?',
  ];
  const ctrlName = 'Survey language';

  // ---- chapters ----------------------------------------------------------------------
  const question = {
    id: 'chapter-1',
    n: 1,
    kicker: 'Chapter 1',
    short: 'The question',
    title: 'A question for a multilingual Europe',
    body: [
      'MultiPoD, a Horizon Europe project, is building an online space where citizens from across Europe can deliberate on policy across language borders. Before designing how the platform handles language, the consortium needed evidence, and Ethos Lab led the study.',
      'Political information about the EU increasingly arrives first, or only, in English. Whether citizens take in politics as well in a second language as in their own was an open question.',
    ],
    pull: 'A debate you cannot follow is not a debate you can join.',
    worriesTitle: `${cap(word(worries.length))} worries on the table`,
    worries,
    facts: [
      { value: 'MultiPoD', label: 'Horizon Europe project, building a multilingual deliberation platform' },
      { value: 'Work Package 1', label: 'where Ethos Lab led this study' },
    ],
    bridge: 'The easy default is to publish in English and assume people cope. We wanted to measure what that default costs, so we built an experiment into a survey.',
  } satisfies ChapterBase & Record<string, unknown>;

  const design = {
    id: 'chapter-2',
    n: 2,
    kicker: 'Chapter 2',
    short: 'A fair test',
    title: 'We design a fair test',
    body: [
      `We surveyed ${int(surveyed)} adults in ${word(nCountries)} countries. The ${int(analysed)} who speak at least one language beyond their first all read the same short article, in one of three ways: in the survey language, in their second language with no choice, or in a language of their choosing.`,
      'A random draw decided which version each person read: not the respondent, and not us. That makes the three groups alike, on average, in every way except how they met the article. So if one group understands less than chance alone would explain, the way they read is the reason.',
    ],
    arms: [
      { name: ctrlName, detail: 'The article in the language of the survey', role: 'Comparison group' },
      { name: gForced, detail: 'The same article in their second language, with no choice', role: 'Group 2' },
      { name: gChoice, detail: 'The same article in a language they picked', role: 'Group 3' },
    ],
    flow: {
      surveyed: { value: int(surveyed), label: `adults surveyed in ${word(nCountries)} countries` },
      analysed: { value: int(analysed), label: 'speak a second language' },
      draw: 'Random draw',
      summary: `${int(surveyed)} adults surveyed; ${int(analysed)} multilingual respondents randomly assigned to three versions of the same article.`,
    },
    openBook: {
      title: 'Every specification on the page',
      body: `This study was not pre-registered, and we say so. The hypotheses came from earlier research, and we report every specification we estimated: ${specList(specs)}. All ${word(specs.length)} appear in chapter 4.`,
    },
    measuresTitle: 'What we would measure, one for each worry',
    measures: [
      { label: `Correct answers to ${word(questions)} factual questions`, tag: 'Main outcome' },
      { label: `How difficult the text felt (${scaleText}) and time spent reading`, tag: '' },
      { label: 'The same measures, for the group that chose its language', tag: '' },
    ],
    facts: [
      { value: int(surveyed), label: `adults surveyed in ${word(nCountries)} countries` },
      { value: int(analysed), label: 'multilingual respondents, randomly assigned' },
      { value: '3', label: 'versions of the same article' },
      { value: `${specs.length} of ${specs.length}`, label: 'specifications reported; the study was not pre-registered' },
    ],
    bridge: 'With the design fixed, the survey went into the field.',
  } satisfies ChapterBase & Record<string, unknown>;

  const field = {
    id: 'chapter-3',
    n: 3,
    kicker: 'Chapter 3',
    short: 'Into the field',
    title: `We run it in ${word(nCountries)} countries`,
    body: [
      `The survey ran through an online panel in ${listJoin(countries.map(inSentence))}. Everyone read the same short, factual article on the EU AI Act, so the only difference between the groups was how they met it.`,
      `${cap(word(questions))} factual questions followed straight away. We also asked how difficult the text felt and recorded how long each person spent on the page: the first shows what people understood, the other two what it cost them to get there.`,
    ],
    steps: {
      title: 'What each respondent did',
      rows: [
        { label: 'Read', detail: 'One 250-word article on the EU AI Act' },
        { label: 'Answer', detail: `${cap(word(questions))} factual questions, straight away` },
        { label: 'Rate', detail: `How difficult the text felt, from ${scaleText}` },
        { label: 'Recorded', detail: 'Time spent on the page' },
      ],
    },
    facts: [
      { value: String(nCountries), label: 'countries, one online panel' },
      { value: '250', label: 'words, one article on the EU AI Act' },
      { value: String(questions), label: 'factual questions' },
    ],
    bridge: `Then we estimated the effects ${word(specs.length)} ways, and kept every one.`,
  } satisfies ChapterBase & Record<string, unknown>;

  const answers = [
    {
      worry: worries[0],
      verdict: 'Yes. About half a correct answer less.',
      stat: { value: signed(forced.estimate), label: `correct answers out of ${questions}, ${lcFirst(gForced)}` },
      body: `Reading in a forced second language cost ${dec(Math.abs(forced.estimate))} correct answers out of ${word(questions)} (95% CI ${dec(forced.ciLow)} to ${dec(forced.ciHigh)}), about ${relative}% of the comparison group's average of ${dec(control, 1)}. Across all ${word(specs.length)} specifications the estimate stays between ${dec(-Math.min(...forcedAbs))} and ${dec(-Math.max(...forcedAbs))}.`,
    },
    {
      worry: worries[1],
      verdict: 'Yes. More effort, less understanding.',
      stat: { value: signed(diffForced.estimate), label: `difficulty, points on a ${scaleText} scale` },
      body: `The same group rated the text harder, by ${dec(diffForced.estimate)} points on a ${scaleText} scale (95% CI ${dec(diffForced.ciLow)} to ${dec(diffForced.ciHigh)}), and spent roughly ${logPct(timeForced.estimate)}% longer on it (95% CI about ${logPct(timeForced.ciLow)}% to ${logPct(timeForced.ciHigh)}%).`,
    },
    {
      worry: worries[2],
      verdict: 'Yes. Choice avoided the penalty.',
      stat: { value: signed(choice.estimate), label: `correct answers out of ${questions}, ${lcFirst(gChoice)}` },
      body: `People who picked their own language scored slightly above the comparison group (${signed(choice.estimate)}, 95% CI ${dec(choice.ciLow)} to ${dec(choice.ciHigh)}). We found no detectable change in how difficult they found the text: the interval rules out increases of more than ${dec(diffChoice.ciHigh)} points. Their reading time was not clearly different, although an increase of up to about ${logPct(timeChoice.ciHigh)}% is not ruled out.`,
    },
  ];

  const findings = {
    id: 'chapter-4',
    n: 4,
    kicker: 'Chapter 4',
    short: 'What we found',
    title: `${cap(word(worries.length))} worries, ${word(answers.length)} answers`,
    body: ['Each worry had its own measure. Here is what each one showed.'],
    answers,
    answerLabels: { worry: 'The worry', answer: 'The answer' },
    countries: `By country, the comprehension penalty is statistically significant in ${listJoin(significant.map(inSentence))}, and not distinguishable from zero in ${listJoin(notSignificant)}. Country estimates are much less precise than the pooled result, so we read them descriptively.`,
    chartTitle: 'Every estimate, every specification',
    secondaryTitle: 'Effort, measured two ways',
    headline: {
      base: dec(control, 1),
      baseLabel: `average correct answers out of ${questions}, ${lcFirst(ctrlName)}`,
      effect: signed(forced.estimate),
      effectLabel: lcFirst(gForced),
      change: `about ${MINUS}${relative}%`,
    },
    facts: answers.map((a) => a.stat),
    bridge: 'An answer matters only if someone designs with it.',
  } satisfies ChapterBase & Record<string, unknown>;

  const decision = {
    id: 'chapter-5',
    n: 5,
    kicker: 'Chapter 5',
    short: 'What it means',
    title: 'From findings to recommendations',
    body: [
      'The two findings point one way: reading politics in a second language carries a real cost, and a simple choice removes it. The study therefore recommends that the platform:',
    ],
    recommendations: [
      "Defaults to each user's preferred language, not to English",
      'Makes language choice simple, visible and reversible',
      'Labels translated or summarised content clearly',
      'Monitors comprehension and effort by language, so no group carries a heavier burden',
    ],
    after: 'These are recommendations to the consortium. How the platform takes them up is for the project to decide.',
    limits: {
      title: 'What this cannot tell us',
      body: 'Online panel respondents tend to be younger, more digitally literate and more politically attentive than the general population. The test covers one short, factual article; longer or more technical texts could behave differently.',
    },
    funding: "MultiPoD is funded by the European Union's Horizon Europe programme.",
    facts: [
      { value: '4', label: 'recommendations for the platform' },
      { value: 'Next', label: 'the final deliverable and a forthcoming paper' },
    ],
  } satisfies ChapterBase & Record<string, unknown>;
  if (decision.recommendations.length !== Number(decision.facts[0].value)) fail('Recommendation count mismatch.');

  const chapters: ChapterBase[] = [question, design, field, findings, decision];

  // ---- the turn: from one question to every question -----------------------------------
  const turn = {
    eyebrow: 'What the story shows',
    title: 'Opinions were easy to find. Evidence had to be built.',
    lede: 'What made the answer usable was a fair comparison, every specification on the page, and an honest account of what the study cannot tell us. We bring that to every question, whatever the method, through three services.',
    servicesTitle: 'Three ways we help',
  };

  // ---- the invitation --------------------------------------------------------------------
  const invite = {
    eyebrow: 'Your turn',
    title: 'What is your question?',
    body: 'The best time to plan a test is before a rollout, while there is still a choice about who gets what, and when. Tell us what you are deciding. We will reply within two working days with an honest view of what we could find out.',
    examplesLabel: 'It might sound like',
    examples: ['Will a reminder cut missed appointments?', 'Did our training scheme get people into work?', 'Which message makes residents back a reform?'],
    cta: { label: 'Tell us your question', href: localePath(lang, '/contact/') },
    email: { label: `Or email ${site.email}`, href: `mailto:${site.email}` },
  };

  return {
    meta: {
      title: site.name,
      description: `Follow one real policy question from MultiPoD, through a ${word(nCountries)}-country experiment to recommendations, and see how Ethos Lab works.`,
    },
    hero: {
      eyebrow: `Our services · one real study, in ${word(chapters.length)} chapters`,
      title: 'What gets lost when politics speaks a second language?',
      lede: `Political information about the EU increasingly arrives in English. For MultiPoD, a Horizon Europe project, we tested what that costs citizens in ${word(nCountries)} countries. Follow the study chapter by chapter to see exactly how we work, then see how we could help with yours.`,
      note: d.provisional!,
      stats: [
        { value: int(surveyed), label: 'adults surveyed' },
        { value: String(nCountries), label: 'countries' },
      ],
      primary: { label: 'Follow the question', href: `#${question.id}` },
      secondary: { label: 'Jump to what we found', href: `#${findings.id}` },
      contentsLabel: 'In this story',
      skip: { label: 'Skip to our services', href: '#services' },
    },
    chapters,
    question,
    design,
    field,
    findings,
    decision,
    turn,
    invite,
    /** The case study itself, for the charts and the "read the full case" link. */
    case: {
      entry: study,
      results,
      secondary,
      href: localePath(lang, `/work/${study.slug}/`),
      linkLabel: 'Read the full case study',
      projectHref: multipod ? localePath(lang, `/work/${multipod.slug}/`) : undefined,
    },
    ui: {
      provisional: 'Provisional',
      chapterNav: 'Chapters',
      soFar: 'Carried over',
      newHere: 'New in this chapter',
      caseFile: (step: number, slug: string) => `multipod / language-experiment / ${String(step).padStart(2, '0')}-${slug}`,
      fileSlugs: ['question', 'design', 'fieldwork', 'results', 'recommendations'],
      secondFile: 'research / pip-reform / working-paper',
    },
  };
}

export type QuestionStory = Awaited<ReturnType<typeof getQuestionStory>>;
