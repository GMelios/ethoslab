/**
 * Placeholder positioning copy for "What we do". Written fresh for the prototype;
 * none of it comes from the current site. Shared by the page and the three homepages.
 */
export const services = [
  {
    id: 'trials',
    title: 'Randomised trials',
    short: 'Field, cluster and stepped-wedge trials built into real administrative processes.',
    body: 'When you can decide who receives a programme, or when, a randomised trial gives the cleanest answer. We design trials that fit inside the way an agency already works, power them properly, and register the analysis before the first participant is enrolled.',
    methods: ['Individual and cluster randomisation', 'Stepped-wedge rollouts', 'A/B tests of letters and digital services'],
  },
  {
    id: 'quasi',
    title: 'Quasi-experimental evaluation',
    short: 'Credible comparisons from rollouts, thresholds and rule changes in administrative data.',
    body: 'Most policies are never randomised. We use staggered rollouts, eligibility thresholds and changes in rules to build credible comparisons, and we show the diagnostics that tell you whether to believe them.',
    methods: ['Difference-in-differences and event studies', 'Regression discontinuity', 'Synthetic control', 'Instrumental variables'],
  },
  {
    id: 'surveys',
    title: 'Survey experiments and measurement',
    short: 'Multi-country experiments and outcomes that administrative registers miss.',
    body: 'Some outcomes never appear in a register: trust, wellbeing, attitudes, intentions. We measure them with validated instruments and run experiments inside surveys, translated, back-translated and piloted in every language.',
    methods: ['Conjoint and vignette designs', 'List experiments', 'Cross-national panels'],
  },
  {
    id: 'behavioural',
    title: 'Behavioural design',
    short: 'Letters, forms, defaults and digital journeys, redesigned and then tested.',
    body: 'We redesign the points where citizens meet the state using what is known about how people decide. Then we test the redesign against the status quo before it is rolled out, so a good idea does not stay an untested one.',
    methods: ['Choice architecture', 'Co-design with frontline staff', 'Rapid pre-testing'],
  },
  {
    id: 'frameworks',
    title: 'Evaluation for EU programmes',
    short: 'Impact evaluation plans for Horizon Europe, Erasmus+ and CERV consortia.',
    body: 'We join European consortia as the partner responsible for evidence: theory of change, indicator frameworks, and impact evaluations that will survive a reviewer. We also advise managing authorities on evaluating cohesion policy.',
    methods: ['Theory of change', 'Indicator frameworks', 'Counterfactual impact evaluation'],
  },
  {
    id: 'data',
    title: 'Data products and AI tools',
    short: 'Regional indices and AI assistants grounded in data we can vouch for.',
    body: 'We build tools that put evidence in front of decision makers when they need it, and we only build them on data we understand well enough to defend.',
    methods: ['Composite indices', 'Dashboards', 'Retrieval-grounded AI assistants'],
  },
];

export const process = [
  { step: '01', title: 'Scope', body: 'Agree the question, the decision it will inform, and what would count as success. Most engagements start with two to four weeks of scoping.' },
  { step: '02', title: 'Design', body: 'Choose a design that can answer the question, run power calculations, write and register the pre-analysis plan, and secure ethics approval.' },
  { step: '03', title: 'Run', body: 'Run the trial or assemble the data. We monitor implementation and balance as we go, so problems surface while they can still be fixed.' },
  { step: '04', title: 'Report', body: 'Planned analyses come first, including null results. Exploratory analysis follows, clearly labelled as such.' },
  { step: '05', title: 'Use', body: 'Brief the people who decide, publish where possible, and plan the follow-up that tells you whether the effect lasts.' },
];

export const standards = [
  { title: 'Every analytic choice on the page', body: 'We report every specification we ran, pre-register where the design allows, and say so when we did not.' },
  { title: 'Null results are results', body: 'If something did not work, we say so, and we publish it.' },
  { title: 'Open where possible', body: 'Code and data are shared whenever law, contracts and ethics allow.' },
  { title: 'Ethics and GDPR first', body: 'Every study involving personal data has an ethics review and a data protection plan.' },
];
