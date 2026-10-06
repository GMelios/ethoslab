/**
 * Story: "The Employment Effects of Disability Benefits Without Work Restrictions"
 * (Klein Teeselink and Melios), latest version, public/papers/. Every number below is
 * from the paper: Table 2 (employment), Table A17 (benefit receipt), Tables A15-A16 (no
 * movers), sections 3, 5 and 6. 95% intervals are computed from the reported standard
 * errors (clustered by individual) as estimate ± 1.96 × SE.
 */
import type { Story, Results } from '../../lib/story';
import { ppEffect } from '../../lib/story';
import { withBase } from '../../i18n/utils';

const employment: Results = {
  title: 'Effect on being in paid employment',
  unit: 'pp',
  unitLabel: 'Difference in the probability of employment, percentage points',
  decimals: 1,
  level: 95,
  note: 'Matched difference-in-differences with individual and year fixed effects, UKHLS up to 2019. "With controls" adds age, age squared and number of children. 95% intervals computed from the reported standard errors, clustered by individual.',
  effects: [
    ppEffect('No controls', 0.016, 0.013, 'Mental health problems: more access'),
    ppEffect('With controls', 0.003, 0.013, 'Mental health problems: more access'),
    ppEffect('No controls', -0.003, 0.012, 'Minor physical problems: less access'),
    ppEffect('With controls', -0.003, 0.011, 'Minor physical problems: less access'),
    ppEffect('No controls', 0.029, 0.011, 'Stricter assessor region'),
    ppEffect('With controls', 0.033, 0.011, 'Stricter assessor region'),
    ppEffect('No controls', 0.011, 0.011, 'Stricter assessor region, excluding movers'),
    ppEffect('With controls', 0.013, 0.011, 'Stricter assessor region, excluding movers'),
  ],
};

const benefits: Results = {
  title: 'Effect on receiving disability benefits',
  unit: 'pp',
  unitLabel: 'Difference in the probability of receiving DLA or PIP, percentage points',
  decimals: 1,
  level: 95,
  note: 'With controls. Table A17 of the paper. 95% intervals computed from the reported standard errors.',
  effects: [
    ppEffect('Mental health problems', 0.059, 0.01),
    ppEffect('Minor physical problems', -0.056, 0.009),
    ppEffect('Stricter assessor region', -0.018, 0.008),
  ],
};

export const disabilityBenefitsStory: Story = {
  slug: 'disability-benefits-work',
  kind: 'Working paper · Labour economics',
  title: 'Do disability benefits stop people working?',
  paperTitle: 'The Employment Effects of Disability Benefits Without Work Restrictions',
  lede: 'Most disability benefits shrink as earnings rise, so it is hard to tell whether they discourage work through the extra income or through the rules. The UK’s Personal Independence Payment has no earnings test, which lets us separate the two.',
  summary: 'Using the UK’s 2013 disability benefit reform, we find that gaining or losing a benefit with no earnings test barely changes whether people work. The one exception, in regions with a stricter assessor, comes with important caveats.',
  authors: ['Bouke Klein Teeselink', 'Georgios Melios'],
  dateLabel: 'Working paper, latest version',
  stats: [
    { value: '33,051', label: 'people followed in the UK Household Longitudinal Study' },
    { value: '2013', label: 'reform that replaced DLA with PIP' },
  ],
  pdf: { href: withBase('/papers/klein-teeselink-melios-disability-benefits-employment.pdf'), label: 'Download the PDF' },
  links: [{ label: 'Earlier version on SSRN', href: 'https://papers.ssrn.com/sol3/papers.cfm?abstract_id=5378340' }],
  chapters: [
    {
      id: 'chapter-1',
      kicker: 'Chapter 1',
      short: 'The question',
      title: 'Two reasons a benefit might keep people out of work',
      main: [
        {
          type: 'text',
          paras: [
            'Disability benefits are among the largest social insurance programmes in rich countries, often more than two percent of GDP. Most studies find they reduce employment among recipients, typically by 15 to 30 percentage points.',
            'That fall can come from two places. An income effect: extra money makes work less necessary. A substitution effect: the benefit is cut when people earn, so working pays less. The first is a transfer that does not distort choices; the second creates real economic losses. Because most programmes do both at once, telling them apart has been hard.',
          ],
        },
        { type: 'pull', text: 'If a benefit is never cut when people earn, any drop in work has to come from the income itself.' },
      ],
      aside: [
        { type: 'facts', items: [{ value: '<4% → ~8%', label: 'share of working-age adults in the UK claiming disability benefits, 2000 to 2023' }, { value: '£14.7bn', label: 'spent on these benefits in 2021–22, up from £9.4bn before PIP' }] },
        { type: 'callout', title: 'Why PIP is different', body: 'Personal Independence Payment, which replaced Disability Living Allowance from April 2013, covers the extra costs of living with a disability. It is not means-tested, does not require being out of work, and is never reduced when recipients earn.' },
      ],
      bridge: 'The reform that introduced PIP also changed who could get it, and where they were assessed. That created two natural experiments.',
    },
    {
      id: 'chapter-2',
      kicker: 'Chapter 2',
      short: 'Two natural experiments',
      title: 'Using the reform as a test',
      main: [
        {
          type: 'text',
          paras: [
            'PIP widened eligibility for people with mental health conditions and narrowed it for people with minor physical disabilities. Because these groups were defined by health before the reform, we can compare how their working lives changed with similar people the reform treated differently.',
            'The government also split assessments by region between two private providers. Atos covered eight regions, including London, the North and Scotland; Capita covered four, including Wales and Northern Ireland. If one provider was stricter, otherwise similar people faced different odds of getting the benefit simply because of where they lived.',
          ],
        },
      ],
      full: [
        {
          type: 'cards',
          title: 'Three comparisons',
          items: [
            { eyebrow: 'Gained access', title: 'Mental health problems', body: 'People with mental health problems before the reform, compared with similar people without them.', accent: true },
            { eyebrow: 'Lost access', title: 'Minor physical problems', body: 'People with minor physical limitations, compared with those with major ones.', accent: true },
            { eyebrow: 'Stricter screening', title: 'Assessor region', body: 'Regions assessed by Atos, the stricter provider, compared with regions assessed by Capita.', accent: true },
          ],
        },
        {
          type: 'callout',
          title: 'How the comparison is made fair',
          body: 'Each person in a treated group is matched with the five most similar people in the comparison group, on health, age, income, gender and education before the reform. We then compare their paths before and after 2013 (difference-in-differences), check that the groups moved together before the reform, and run placebo tests on earlier data.',
        },
      ],
      bridge: 'The data come from a large household panel that interviews the same people every year.',
    },
    {
      id: 'chapter-3',
      kicker: 'Chapter 3',
      short: 'The data',
      title: 'Following the same people for a decade',
      main: [
        {
          type: 'text',
          paras: [
            'The UK Household Longitudinal Study interviews a representative sample of UK households every year. It records employment, every source of income including disability benefits, health and family circumstances.',
            'We follow everyone aged 59 or younger in 2013, so that retirement does not drive the results, and use the years up to 2019 to keep the pandemic out of the main estimates.',
          ],
        },
      ],
      aside: [
        {
          type: 'steps',
          title: 'What we measure',
          rows: [
            { label: 'Benefits', detail: 'Whether someone receives DLA or PIP' },
            { label: 'Work', detail: 'Whether someone is in paid employment' },
            { label: 'Health', detail: 'Mental and physical limitations reported in 2012' },
            { label: 'Region', detail: 'Which provider assessed claims where they live' },
          ],
        },
        { type: 'facts', items: [{ value: '259,087', label: 'observations in the analysis sample' }, { value: '210,773', label: 'of them before COVID-19, used for most results' }] },
      ],
      bridge: 'First, did the reform change who received the benefit? Then, did that change who worked?',
    },
    {
      id: 'chapter-4',
      kicker: 'Chapter 4',
      short: 'What we found',
      title: 'Big changes in benefits, little change in work',
      main: [{ type: 'text', paras: ['The reform moved benefit receipt exactly as intended. The question is what happened to employment.'] }],
      full: [
        {
          type: 'answers',
          labels: { worry: 'The question', answer: 'The answer' },
          items: [
            {
              worry: 'Did better access to the benefit make people with mental health problems work less?',
              verdict: 'No.',
              body: 'Benefit receipt rose by 5.9 percentage points, but employment did not fall. The estimate is +0.3 points with controls (95% interval −2.2 to +2.8), and every post-reform estimate is slightly positive.',
              stat: { value: '+5.9', label: 'points more likely to receive the benefit' },
            },
            {
              worry: 'Did losing access push people with minor physical problems into work?',
              verdict: 'No.',
              body: 'Benefit receipt fell by 5.6 percentage points, but employment was unchanged: −0.3 points (95% interval −2.5 to +1.9).',
              stat: { value: '−5.6', label: 'points less likely to receive the benefit' },
            },
            {
              worry: 'Did stricter assessment raise employment?',
              verdict: 'Possibly, with caveats.',
              body: 'In regions with the stricter assessor, benefit receipt fell by 1.8 points and employment rose by 2.9 to 3.3 points. But the effect shrinks to +1.3 points and loses significance when people who moved between regions are excluded, and one pre-reform estimate is significant, so we read it as reduced-form evidence, not the effect of the benefit itself.',
              stat: { value: '+3.3', label: 'points in employment, with controls' },
            },
          ],
        },
        { type: 'chart', title: 'Employment, every comparison and specification', results: employment },
        { type: 'chart', title: 'First, the reform did change who received the benefit', results: benefits },
        {
          type: 'note',
          text: 'Checks: 17 of 18 placebo estimates on pre-reform data are indistinguishable from zero. Of 51 estimates on other benefits, only three are significant, and benefits unrelated to disability policy do not move, which argues against austerity or other shocks driving the results. In stricter-assessor regions, the employment rise is concentrated among unmarried people (+6.0 points, against +1.5 for married people).',
        },
      ],
      bridge: 'So what does this mean for how disability benefits are designed?',
    },
    {
      id: 'chapter-5',
      kicker: 'Chapter 5',
      short: 'What it means',
      title: 'Support without a work penalty can work',
      main: [
        {
          type: 'text',
          paras: [
            'For people whose eligibility changed because of objectively measurable health conditions, gaining or losing PIP did not change whether they worked. That suggests a benefit designed to cover the extra costs of disability, rather than to replace earnings, can provide security without discouraging work.',
            'The stricter-assessor results point to a second lesson, with more caution: tighter screening may help separate genuine need from claims by people who could work. The paper sets out the policy implications:',
          ],
        },
        {
          type: 'list',
          numbered: true,
          items: [
            'Keep PIP’s work-neutral design, which lets recipients work as much as they can',
            'Consider widening coverage where conditions can be verified objectively',
            'Use rigorous assessment to improve targeting and limit strategic claims',
          ],
        },
      ],
      aside: [
        {
          type: 'callout',
          title: 'What this cannot tell us',
          body: 'PIP has no formal work test, but assessors may still treat work as a sign of lower need, which could create a hidden disincentive. The results cover the short to medium term; longer-run effects may differ. The design cannot fully rule out people adjusting how they report their conditions. The assessor result is sensitive to excluding movers.',
        },
      ],
    },
  ],
  footnotes: [
    'Funded by Ethos Lab as part of the Horizon Europe project BENEFITS (Grant Agreement No. 101179032). The results are research outputs and do not necessarily reflect the views of the European Commission or other organisations in the BENEFITS project.',
    'Data: UK Household Longitudinal Study (Understanding Society), University of Essex, Institute for Social and Economic Research.',
  ],
};
