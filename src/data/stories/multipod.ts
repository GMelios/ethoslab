/**
 * Story: the MultiPoD cross-country language experiment. All copy and numbers come from
 * getQuestionStory() in src/data/question.ts, which reads them from the case-study entry
 * and asserts the claims at build time. This file only arranges them into the story template.
 */
import type { Locale } from '../../i18n/config';
import type { Story } from '../../lib/story';
import { getQuestionStory } from '../question';

export async function getMultipodStory(lang: Locale): Promise<Story> {
  const q = await getQuestionStory(lang);
  const { question, design, field, findings, decision } = q;
  const hero = q.hero;
  return {
    slug: 'second-language-politics',
    kind: 'Cross-country survey experiment · MultiPoD',
    title: hero.title,
    paperTitle: 'MultiPoD deliverable D1.1 (revised)',
    lede: 'Political information about the EU increasingly arrives in English. For MultiPoD, a Horizon Europe project, we tested what that costs citizens in seven countries, and whether a simple choice of language fixes it.',
    summary: 'A seven-country experiment for the Horizon Europe project MultiPoD: reading politics in a second language costs about half a correct answer out of six, and letting people choose their language removes the penalty.',
    authors: ['Ethos Lab (MultiPoD Work Package 1)'],
    dateLabel: 'September 2026',
    venue: 'Revised deliverable, under review',
    status: { badge: q.ui.provisional, note: hero.note },
    stats: hero.stats,
    pdf: { placeholder: 'PDF to add once the deliverable or paper is public' },
    links: [
      { label: q.case.linkLabel, href: q.case.href },
      ...(q.case.projectHref ? [{ label: 'About MultiPoD', href: q.case.projectHref }] : []),
    ],
    chapters: [
      {
        id: question.id,
        kicker: question.kicker,
        short: question.short,
        title: question.title,
        main: [{ type: 'text', paras: question.body }, { type: 'pull', text: question.pull }],
        aside: [{ type: 'list', title: question.worriesTitle, items: question.worries, numbered: true, boxed: true }, { type: 'facts', items: question.facts }],
        bridge: question.bridge,
      },
      {
        id: design.id,
        kicker: design.kicker,
        short: design.short,
        title: design.title,
        main: [{ type: 'text', paras: design.body }],
        aside: [{ type: 'facts', items: [design.flow.surveyed, design.flow.analysed] }, { type: 'note', text: `${design.flow.draw}: ${design.flow.summary}` }],
        full: [
          { type: 'cards', items: design.arms.map((a, i) => ({ eyebrow: a.role, title: a.name, body: a.detail, accent: i > 0 })) },
          { type: 'list', title: design.measuresTitle, items: design.measures.map((m) => (m.tag ? `${m.label} (${m.tag.toLowerCase()})` : m.label)) },
          { type: 'callout', title: design.openBook.title, body: design.openBook.body },
        ],
        bridge: design.bridge,
      },
      {
        id: field.id,
        kicker: field.kicker,
        short: field.short,
        title: field.title,
        main: [{ type: 'text', paras: field.body }],
        aside: [{ type: 'steps', title: field.steps.title, rows: field.steps.rows }, { type: 'facts', items: field.facts }],
        bridge: field.bridge,
      },
      {
        id: findings.id,
        kicker: findings.kicker,
        short: findings.short,
        title: findings.title,
        main: [{ type: 'text', paras: findings.body }],
        full: [
          { type: 'answers', labels: findings.answerLabels, items: findings.answers },
          { type: 'chart', title: findings.chartTitle, results: q.case.results },
          { type: 'charts', title: findings.secondaryTitle, results: q.case.secondary },
          { type: 'note', text: findings.countries },
        ],
        bridge: findings.bridge,
      },
      {
        id: decision.id,
        kicker: decision.kicker,
        short: decision.short,
        title: decision.title,
        main: [{ type: 'text', paras: decision.body }, { type: 'list', items: decision.recommendations, numbered: true }, { type: 'text', paras: [decision.after] }],
        aside: [{ type: 'callout', title: decision.limits.title, body: decision.limits.body }],
      },
    ],
    footnotes: [decision.funding, 'Views and opinions expressed are those of the authors only and do not necessarily reflect those of the European Union.'],
  };
}
