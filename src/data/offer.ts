/**
 * What we offer: three services, and the shared closing call to action.
 *
 * Words come from the current ethoslab.gr service pages (Diagnose, Design, Measure,
 * Evaluate, Our History) and from "Ethos Lab homepage copy (v2)", condensed. `todos` are
 * [TODO]s from that brief and render as visible placeholders: do not fill them with
 * invented timelines or prices.
 */
export type ServiceId = 'research-design' | 'evaluation-impact' | 'scale-up';

export type Service = {
  id: ServiceId;
  name: string;
  path: string;
  /** One line for cards. */
  short: string;
  /** The question a client brings. */
  question: string;
  /** Page introduction. */
  intro: string;
  for: string;
  weDo: string[];
  methods: string[];
  youReceive: string[];
  todos: { label: string; note: string }[];
};

export const services: Service[] = [
  {
    id: 'research-design',
    name: 'Research & Design',
    path: '/services/research-design/',
    short: 'Find out what will work before you spend the budget.',
    question: 'What is really driving the problem, and which option will people actually respond to?',
    intro: 'We diagnose problems with research and data, then design the options and compare them with real people, online or in the field, before you commit the budget.',
    for: 'A policy, service, programme, product, message or campaign you are about to design, change or launch.',
    weDo: [
      'Frame the challenge in precise, testable terms, and review the data, reports and policies you already have.',
      'Hear from the people who matter through surveys, interviews, focus groups and participatory labs.',
      'Map the processes, rules and incentives that shape choices, and model the trade-offs people face.',
      'Design the options worth comparing: messages, services, defaults, incentives, timing and channels.',
      'Compare them side by side with real people in a fair experiment, with the analysis planned in advance.',
    ],
    methods: ['Surveys and focus groups', 'Evidence reviews', 'Stakeholder workshops', 'Survey and conjoint experiments', 'A/B tests and field trials', 'Service design', 'Pre-analysis plans'],
    youReceive: [
      'A diagnosis of root causes and the levers for change',
      'Which option works best, and how confident we are',
      'What to change before launch, with designs and copy ready to use',
    ],
    todos: [
      // Brief: typical duration, e.g. "3 to 6 weeks".
      { label: 'Timeline', note: 'Typical duration to confirm' },
      // Brief: "From €X" or remove.
      { label: 'Price', note: 'Starting price to confirm, or remove' },
    ],
  },
  {
    id: 'evaluation-impact',
    name: 'Evaluation & Impact',
    path: '/services/evaluation-impact/',
    short: 'Know what changed, for whom, and whether it was worth it.',
    question: 'Did it change outcomes? For whom, and why? What should we keep, fix or stop?',
    intro: 'We measure real impact using experiments or rigorous causal methods, on new data or data you already hold. Best of all, we build the evaluation in from day one.',
    for: 'A programme, policy, product or funded project that is running, finished, or about to start.',
    weDo: [
      'Design the evaluation, from rapid tests to fully powered experiments and quasi-experimental designs.',
      'Build counterfactuals that hold up, separating real impact from noise, seasonality and structural change.',
      'Set up indicators, data pipelines and dashboards so you can monitor progress as it happens.',
      'Quantify economic and social value, including distributional effects and spillovers.',
      'Report clearly: what worked, what did not, for whom, and what it means for the next decision.',
    ],
    methods: ['Randomised controlled trials', 'Difference-in-differences', 'Regression discontinuity', 'Synthetic control', 'Monitoring and evaluation frameworks', 'Cost-benefit analysis', 'Mixed methods'],
    youReceive: [
      'A credible estimate of impact, and who benefited',
      'Why it worked or did not, with clear recommendations',
      'A report built to satisfy funders, auditors and the European Commission',
    ],
    todos: [
      // Brief: e.g. "Typically 3 to 12 months, or across the life of a programme".
      { label: 'Timeline', note: 'Typical duration to confirm' },
    ],
  },
  {
    id: 'scale-up',
    name: 'Scale up',
    path: '/services/scale-up/',
    short: 'Take what works further, and make it last.',
    question: 'How do we roll out what works, at a cost that makes sense, and keep improving it?',
    intro: 'Once something works, we help you take it further: costing and scale-up plans, delivery support, and training your teams to run tests and evaluations themselves.',
    for: 'Organisations with a programme or product that has shown results, and teams that want evidence skills in-house.',
    weDo: [
      'Translate effects into unit costs, marginal returns and scale scenarios.',
      'Prepare delivery plans, training materials and procurement-ready specifications.',
      'Monitor implementation as it grows, so the effect survives the move from pilot to programme.',
      'Train policy and business teams in experimental methods and help them build their own evidence capability.',
    ],
    methods: ['Cost-effectiveness and ROI modelling', 'Scale-up planning', 'Fidelity monitoring', 'Capacity building and training'],
    youReceive: ['Costing models and scale strategies', 'Delivery plans and procurement-ready specifications', 'Training and support for your teams'],
    todos: [],
  },
];

export const serviceById = (id: ServiceId) => services.find((s) => s.id === id)!;

export const closingCta = {
  title: 'What do you need to know?',
  body: 'Tell us about the decision in front of you, the idea you want to test or the programme you need to evaluate. We will reply within two working days with an honest view of what we could find out.',
  button: 'Start a conversation',
};
