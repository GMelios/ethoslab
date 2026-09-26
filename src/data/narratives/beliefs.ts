/**
 * Homepage narrative "What we believe": a short op-ed in four convictions about
 * evidence, each followed by the work that tests it. Each conviction builds on
 * the one before (test it; so some tests fail; so report how precise a null is;
 * so decide with the interval in view), and the fourth points back to the first.
 *
 * ALL copy for /b/beliefs and /c/beliefs lives in this file. The two designs
 * render the same words and differ only in layout and visuals.
 *
 * No number is typed here. Estimates, intervals, samples and designs are read
 * from the case-study entries in src/content/projects and formatted with the
 * same rules as EffectSizeChart, so the story cannot drift from the evidence.
 * If an entry or an effect this story relies on is renamed, the build fails.
 */
import type { Locale } from '../../i18n/config';
import { getWork, getResearch } from '../../lib/content';
import { getLocalized, localePath, type Localised } from '../../i18n/utils';

type Project = Localised<'projects'>;
type Results = NonNullable<Project['data']['results']>;
type Effect = Results['effects'][number];

// ---------------------------------------------------------------------------
// Lookups that fail the build instead of silently printing a stale number.
// ---------------------------------------------------------------------------
function needCase(work: Project[], slug: string) {
  const entry = work.find((w) => w.slug === slug);
  if (!entry?.data.results) throw new Error(`beliefs narrative: case study "${slug}" with results is missing`);
  return entry as Project & { data: { results: Results } };
}

function needEffect(entry: Project, label: string, group?: string): Effect {
  const hit = entry.data.results?.effects.find((e) => e.label === label && (group === undefined || e.group === group));
  if (!hit) throw new Error(`beliefs narrative: effect "${label}" not found in ${entry.slug}`);
  return hit;
}

/** The paragraph under "## What changed" in a case study body. */
function whatChanged(entry: Project) {
  const m = entry.body?.match(/##\s*What changed\s*\n+([\s\S]*?)(?=\n#{1,6}\s|$)/);
  if (!m) throw new Error(`beliefs narrative: no "What changed" section in ${entry.slug}`);
  return m[1].replace(/\s+/g, ' ').trim();
}

// ---------------------------------------------------------------------------
// Number formatting, identical to EffectSizeChart (true minus sign, fixed decimals).
// ---------------------------------------------------------------------------
const MINUS = '−';
const WORDS = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten'];
const word = (n: number) => WORDS[n] ?? String(n);
const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

function formatter(r: Results) {
  const d = r.decimals;
  const v = (x: number, dec = d) => {
    const s = Math.abs(x).toFixed(dec);
    return (x < 0 && Number(s) !== 0 ? MINUS : '') + s;
  };
  const s = (x: number) => (x > 0 ? '+' : '') + v(x);
  return {
    unit: r.unit,
    level: r.level,
    v,
    /** "+5.4 pp" */
    est: (e: Effect) => `${s(e.estimate)} ${r.unit}`,
    /** "95% CI 4.4 to 6.4" */
    ci: (e: Effect) => `${r.level}% CI ${v(e.ciLow)} to ${v(e.ciHigh)}`,
    /** "[4.4, 6.4]" */
    br: (e: Effect) => `[${v(e.ciLow)}, ${v(e.ciHigh)}]`,
  };
}

// ---------------------------------------------------------------------------
// View model
// ---------------------------------------------------------------------------
export type Stat = { label: string; value: string; note?: string };
export type Note = { title: string; text: string };

export async function getBeliefsStory(lang: Locale) {
  const work = await getWork(lang);
  const letters = needCase(work, 'benefit-letters-trial');
  const trust = needCase(work, 'trust-local-government');
  const subsidy = needCase(work, 'youth-hiring-subsidy');
  const paper = (await getResearch(lang)).find((r) => r.slug === 'disability-benefits-employment' && !r.data.placeholder);
  const rwi = (await getLocalized('products', lang)).find((p) => p.slug === 'reframing-welfare-index');

  // Belief I: benefit letters.
  const fL = formatter(letters.data.results);
  const sms = needEffect(letters, 'Simplified letter + SMS', 'Applied within 60 days');
  const helpline = needEffect(letters, 'Calls to the helpline (letter + SMS)');
  if (sms.controlMean === undefined || helpline.controlMean === undefined) throw new Error('beliefs narrative: control means missing in benefit-letters-trial');
  const approved = needEffect(letters, 'Simplified letter + SMS', 'Approved within 90 days');
  const randomised = letters.data.sample?.match(/^[\d,]+/)?.[0];
  // Symmetric axis around zero, in half-point steps, for the single-interval glyph.
  const reach = Math.ceil(Math.max(Math.abs(helpline.ciLow), Math.abs(helpline.ciHigh)) * 2) / 2 + 0.5;
  const helplineAxis = {
    domain: [-reach, reach] as [number, number],
    ticks: [-reach, 0, reach].map((value) => ({ value, label: fL.v(value) })),
  };

  // Belief II: trust messages.
  const fT = formatter(trust.data.results);
  const mayor = needEffect(trust, "Mayor's endorsement");
  const pooled = trust.data.results.effects.filter((e) => e.group === mayor.group);
  const raised = pooled.filter((e) => e.ciLow > 0).length;
  const countries = trust.data.countries?.length ?? 0;

  // Belief III: youth hiring subsidy.
  const fS = formatter(subsidy.data.results);
  const youth = needEffect(subsidy, 'All', 'Eligible workers, aged 18 to 24');
  const ltu = needEffect(subsidy, 'Unemployed for 12+ months at baseline');
  const pre = needEffect(subsidy, 'Two years before rollout (pre-trend)');
  const displaced = needEffect(subsidy, 'Aged 25 to 29 (possible displacement)');
  const clusters = subsidy.data.sample?.match(/^(\d+)\s+regions/)?.[1];
  if (youth.controlMean === undefined || !clusters) throw new Error('beliefs narrative: baseline or cluster count missing in youth-hiring-subsidy');

  const caseHref = (e: Project) => localePath(lang, `/work/${e.slug}/`);

  const beliefs = [
    {
      id: 'intentions',
      index: 1,
      numeral: 'I',
      comfortable: '‘It is obviously a good idea. Why test it?’',
      title: 'Good intentions are not evidence.',
      body: 'Every reform is designed by people who expect it to work. That expectation is where a test should start, not where it ends. The only fair way to know what a policy did is to compare it with what would have happened without it.',
      bridge: 'Test ideas fairly and some of them will work. Others will show nothing we can detect.',
    },
    {
      id: 'nulls',
      index: 2,
      numeral: 'II',
      comfortable: '‘It did not work, so there is nothing to report.’',
      title: 'A null result is a result.',
      body: 'A careful test that finds no detectable effect is worth as much as a success: it stops money going to the wrong thing. But it only helps if you also say how large an effect the study could have missed.',
      bridge: 'Every null above came with an interval. That is what turns ‘we found nothing’ into ‘we know what we could have missed’.',
    },
    {
      id: 'uncertainty',
      index: 3,
      numeral: 'III',
      comfortable: '‘Just give us the number.’',
      title: 'Show the uncertainty.',
      body: 'A single number claims more certainty than any study has. We report every estimate with its interval, choose the inference that fits the design, and say plainly what the data cannot rule out.',
      bridge: 'None of this is a reason to wait. An honest interval tells you what you can decide now, and what you still need to measure.',
    },
    {
      id: 'decisions',
      index: 4,
      numeral: 'IV',
      comfortable: '‘The report is the deliverable.’',
      title: 'Evidence should change decisions.',
      body: 'A study earns its cost when it changes what someone does. So we start from the decision a study has to inform, and we finish by agreeing what to measure next.',
      bridge: 'A decision is not where evidence ends. It is where the next test begins.',
    },
  ] as const;

  const [bI, bII, bIII] = beliefs;

  return {
    meta: {
      title: 'What we believe',
      description: 'Four things we believe about evidence for public policy, each followed by the work that tests it.',
    },

    labels: {
      belief: 'Belief',
      comfortable: 'The comfortable view',
      proof: 'The proof',
      illustrative: 'Illustrative',
      draft: 'Draft copy',
      readCase: 'Read the case study',
      from: 'From belief',
    },

    hook: {
      eyebrow: 'What we believe',
      title: 'Everyone says evidence-based.',
      titleAccent: 'Here is what we mean.',
      lede: 'Four convictions shape how we design, analyse and report a study. Each builds on the one before, and each is followed by the work that tests it, including the results nobody was hoping for.',
      stakes: 'Budgets are tight and public trust is hard to win. The policies that last will be the ones that can show what they changed.',
      primary: { label: 'Start a conversation', href: localePath(lang, '/contact/') },
      secondary: { label: 'Read the four beliefs', href: '#belief-intentions' },
      announcement: paper
        ? { tag: 'New', text: `Working paper: ${paper.data.title}`, href: paper.data.url ?? localePath(lang, '/research/') }
        : undefined,
      tocTitle: 'The argument, in four steps',
      toc: [
        { id: bI.id, numeral: bI.numeral, index: bI.index, title: bI.title, proof: 'Benefit take-up trial', metric: `${fL.est(sms)} ${fL.br(sms)}` },
        { id: bII.id, numeral: bII.numeral, index: bII.index, title: bII.title, proof: `${cap(word(countries))}-country survey experiment`, metric: `${fT.est(mayor)} ${fT.br(mayor)}` },
        { id: bIII.id, numeral: bIII.numeral, index: bIII.index, title: bIII.title, proof: 'Youth hiring subsidy', metric: `${fS.est(youth)} ${fS.br(youth)}` },
        { id: beliefs[3].id, numeral: beliefs[3].numeral, index: beliefs[3].index, title: beliefs[3].title, proof: 'What each study changed', metric: undefined },
      ],
    },

    beliefs,

    /** I. Good intentions are not evidence. */
    intentions: {
      kicker: 'Benefit take-up trial',
      heading: letters.data.title,
      meta: [letters.data.design, letters.data.sample].filter(Boolean).join(' · '),
      stats: [
        { label: 'Standard letter (control)', value: `${fL.v(sms.controlMean)}%`, note: `${sms.group?.toLowerCase()}` },
        { label: 'Letter + SMS, difference', value: fL.est(sms), note: fL.ci(sms) },
        { label: 'Letter + SMS, approvals', value: fL.est(approved), note: fL.ci(approved) },
        ...(randomised ? [{ label: 'Households randomised', value: randomised, note: letters.data.preregistration ? `Pre-registered, ${letters.data.preregistration.registry}` : undefined }] : []),
      ] as Stat[],
      takeaway: `Applications within 60 days rose by ${fL.v(sms.estimate)} percentage points (${fL.ci(sms)}) on a control mean of ${fL.v(sms.controlMean)}%, and approvals rose with them. Both letters were written in good faith. Only the comparison could tell them apart.`,
      chartGroups: ['Applied within 60 days', 'Approved within 90 days'],
      entry: letters,
      href: caseHref(letters),
    },

    /** II. A null result is a result. */
    nulls: {
      mayor: {
        kicker: `${cap(word(countries))}-country survey experiment`,
        heading: 'Mayor’s endorsement: no detectable effect',
        text: `We tested ${word(pooled.length)} ways of explaining the same local reform, side by side in ${word(countries)} countries. ${cap(word(raised))} raised trust. The mayor’s endorsement had no detectable effect: ${fT.est(mayor)} (${fT.ci(mayor)}), and the interval rules out any positive effect larger than ${fT.v(mayor.ciHigh)} ${fT.unit}.`,
        takeaway: 'That is a finding. It tells a council what not to lead with.',
        chartGroups: [mayor.group ?? ''],
        entry: trust,
        href: caseHref(trust),
      },
      helpline: {
        kicker: 'Benefit take-up trial',
        heading: 'Helpline calls: no detectable change',
        text: `A clearer letter could have sent more people to the helpline. Calls changed by ${fL.est(helpline)} (${fL.ci(helpline)}) on a baseline of ${fL.v(helpline.controlMean)}%, so the interval rules out increases of more than ${fL.v(helpline.ciHigh)} points.`,
        takeaway: 'Whether that is acceptable is the agency’s call. Now it is a call made with a number.',
        effect: helpline,
        axis: helplineAxis,
        unitLabel: letters.data.results.unitLabel,
        statLabel: 'Calls to the helpline',
        stat: fL.est(helpline),
        statNote: fL.ci(helpline),
        entry: letters,
        href: caseHref(letters),
      },
      paper: paper
        ? {
            kicker: 'It holds in our own research',
            heading: paper.data.title,
            text: paper.data.summary,
            meta: [paper.data.authors.join(' and '), paper.data.venue, String(paper.data.date.getFullYear())].filter(Boolean).join(' · '),
            link: 'Read the paper',
            href: paper.data.url ?? localePath(lang, '/research/'),
          }
        : undefined,
    },

    /** III. Show the uncertainty. */
    uncertainty: {
      kicker: 'Youth hiring subsidy',
      heading: subsidy.data.title,
      meta: [subsidy.data.design, subsidy.data.sample].filter(Boolean).join(' · '),
      big: fS.est(youth),
      bigLabel: `average effect on youth employment once the subsidy reached a region (${fS.ci(youth)}), on a baseline of ${fS.v(youth.controlMean)}%`,
      notes: [
        {
          title: `Only ${clusters} clusters`,
          text: 'With so few regions, conventional clustered standard errors are too small and tests reject too often. The intervals come from a wild cluster bootstrap instead, which is why they need not be symmetric.',
        },
        {
          title: `Aged 25 to 29: ${fS.est(displaced)} ${fS.br(displaced)}`,
          text: `The interval includes zero. It also includes displacement of up to ${fS.v(Math.abs(displaced.ciLow))} points. We cannot rule that out, so we say so.`,
        },
        {
          title: `Pre-trend: ${fS.est(pre)} ${fS.br(pre)}`,
          text: `No detectable divergence before the rollout, although the interval still allows a gap of up to ${fS.v(Math.max(Math.abs(pre.ciLow), Math.abs(pre.ciHigh)))} points. That supports the parallel trends assumption. It cannot prove it.`,
        },
        {
          title: `Long-term unemployed: ${fS.est(ltu)} ${fS.br(ltu)}`,
          text: 'A larger point estimate than the average, but the intervals overlap. That is not a demonstrated difference, so we do not claim one.',
        },
      ] as Note[],
      entry: subsidy,
      href: caseHref(subsidy),
    },

    /** IV. Evidence should change decisions. */
    decisions: {
      heading: 'What happened next',
      cases: [
        { from: bI, name: 'Benefit take-up trial', text: whatChanged(letters), entry: letters, href: caseHref(letters) },
        { from: bII, name: `${cap(word(countries))}-country survey experiment`, text: whatChanged(trust), entry: trust, href: caseHref(trust) },
        { from: bIII, name: 'Youth hiring subsidy', text: whatChanged(subsidy), entry: subsidy, href: caseHref(subsidy) },
      ],
      tool: rwi
        ? {
            kicker: 'Evidence before the decision, too',
            heading: rwi.data.title,
            text: rwi.data.summary,
            link: 'Explore our data products',
            href: localePath(lang, '/products/'),
            placeholder: rwi.data.placeholder,
            cover: rwi.data.cover,
          }
        : undefined,
    },

    invite: {
      eyebrow: 'Your turn',
      title: 'If you believe this too, talk to us.',
      body: 'Bring us the decision you are facing. We will tell you honestly which design can answer it, what it will cost, and what it cannot tell you.',
      aside: 'Disagree with one of the four? Tell us that too.',
      primary: { label: 'Start a conversation', href: localePath(lang, '/contact/') },
      secondary: { label: 'See all our work', href: localePath(lang, '/work/') },
      partners: 'Among our partners',
    },
  };
}

export type BeliefsStory = Awaited<ReturnType<typeof getBeliefsStory>>;
