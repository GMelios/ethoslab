/**
 * Services content. The structure (the ETHOS method, two engagements, eight domains)
 * is a proposal for the demo. The words come from the current ethoslab.gr pages:
 * Our History (the ETHOS Framework), Diagnose, Design, Measure, Evaluate, How we work
 * and Domains of Expertise, condensed and with the em dashes taken out.
 */
import type { ImageMetadata } from 'astro';

import aiImg from '../assets/wp/2019/03/pexels-pixabay-373543-scaled.jpg';
import businessImg from '../assets/wp/2019/03/pexels-kindelmedia-7688336-scaled.jpg';
import democracyImg from '../assets/wp/2019/03/pexels-joshsorenson-976866-scaled.jpg';
import educationImg from '../assets/wp/2019/03/pexels-emily-ranquist-493228-1205651-scaled.jpg';
import governmentImg from '../assets/wp/2019/03/pexels-brett-sayles-937493-scaled.jpg';
import transportImg from '../assets/wp/2019/03/pexels-vividcafe-681335-scaled.jpg';
import economyImg from '../assets/wp/2019/03/pexels-davidmcbee-730547-scaled.jpg';
import environmentImg from '../assets/wp/2019/03/pexels-felix-mittermeier-957024-scaled.jpg';

export type Stage = {
  letter: 'E' | 'T' | 'H' | 'O' | 'S';
  id: string;
  name: string;
  /** One line for the homepage and the method diagram. */
  line: string;
  /** The question a client brings to this stage. */
  question: string;
  weDo: string[];
  methods: string[];
  youReceive: string[];
  /** Which packaged engagement covers this stage. */
  engagement: 'test' | 'evaluation';
};

export const methodIntro =
  'ETHOS is the method we developed and the name we work under: Explore, Test, Hone, Optimise, Scale. Unlike approaches that jump from diagnosis to evaluation, it builds in iteration. We pilot more than one approach, refine on the results, then measure impact rigorously before anything is scaled.';

export const stages: Stage[] = [
  {
    letter: 'E',
    id: 'explore',
    name: 'Explore',
    line: 'Find the root causes and the right levers for change.',
    question: 'What is really stopping people, and where would a change make the biggest difference?',
    weDo: [
      'Translate broad goals such as "increase uptake" or "reduce drop-off" into precise, testable behavioural statements.',
      'Hear from the people who matter through surveys, interviews, focus groups and participatory labs.',
      'Map the processes, touchpoints and rules that shape choices, and model the trade-offs people make with time, money, effort and risk.',
      'Make existing data actionable with inferential statistics, econometrics and interpretable machine learning.',
    ],
    methods: ['Evidence scans', 'Stakeholder workshops', 'Surveys and focus groups', 'System maps', 'Decision-economics models', 'Administrative burden assessments'],
    youReceive: ['Diagnostic report on root causes and behavioural drivers', 'Opportunity and priority maps', 'Hypotheses and metrics to guide pilots'],
    engagement: 'test',
  },
  {
    letter: 'T',
    id: 'test',
    name: 'Test',
    line: 'Compare your options with real people before you commit the budget.',
    question: 'Which version will people actually respond to?',
    weDo: [
      'Design the options worth comparing: messages, letters, defaults, incentives, timing and channels.',
      'Run fair experiments, online or in the field, with the people the change is meant for.',
      'Build every test for identification: hypotheses, guardrail metrics, randomisation units, power calculations and pre-analysis plans.',
    ],
    methods: ['A/B and factorial tests', 'Survey and conjoint experiments', 'Discrete choice experiments', 'Adaptive designs', 'Pre-analysis plans'],
    youReceive: ['Which option works best, and how confident we are', 'Testable hypotheses and pre-analysis plans', 'What to change before launch'],
    engagement: 'test',
  },
  {
    letter: 'H',
    id: 'hone',
    name: 'Hone',
    line: 'Refine the winning idea until it works in real conditions.',
    question: 'Will it hold up in the real world, at a cost that makes sense?',
    weDo: [
      'Move from low-fidelity prototypes to field pilots, with usability checks, fidelity checks and pre-mortems.',
      'Embed ethics, GDPR and change management from day one.',
      'Write the targeting rules, scripts, message libraries and procedures that turn a promising idea into practice.',
    ],
    methods: ['Service design and blueprinting', 'Field pilots', 'Fidelity monitoring', 'Mechanism design', 'Pricing and incentive design'],
    youReceive: ['Intervention blueprints linked to a theory of change', 'Pilot protocols and training materials', 'Implementation guidance and copy'],
    engagement: 'test',
  },
  {
    letter: 'O',
    id: 'optimise',
    name: 'Optimise',
    line: 'Measure what worked, for whom, and by how much.',
    question: 'Did it change outcomes, for whom, and why?',
    weDo: [
      'Measure impact with experiments or rigorous causal methods, on new data or on data you already hold.',
      'Build counterfactuals that hold up, separating real impact from noise, seasonality and structural shifts.',
      'Set up indicators, data pipelines and dashboards so you can monitor progress as it happens.',
      'Quantify economic and social value, including distributional effects and spillovers.',
    ],
    methods: ['Randomised controlled trials', 'Difference-in-differences', 'Regression discontinuity', 'Synthetic control', 'Instrumental variables', 'Cost-benefit analysis'],
    youReceive: ['Impact evaluation report with clear causal estimates', 'Effect sizes and value-for-money metrics', 'Monitoring and evaluation frameworks and dashboards'],
    engagement: 'evaluation',
  },
  {
    letter: 'S',
    id: 'scale',
    name: 'Scale',
    line: 'Grow what works, and build the capacity to keep learning.',
    question: 'What should we keep, fix or stop, and how do we roll it out?',
    weDo: [
      'Translate effects into unit costs, marginal returns and scale scenarios.',
      'Prepare delivery plans, training materials and procurement-ready specifications.',
      'Train policy teams in experimental methods and help organisations build their own behavioural insights capability.',
    ],
    methods: ['Cost-effectiveness and ROI modelling', 'Scale-up planning', 'Capacity building and training'],
    youReceive: ['Scalability and implementation recommendations', 'Costing models and scale strategies', 'Policy briefs and stakeholder-ready summaries'],
    engagement: 'evaluation',
  },
];

export type Domain = { id: string; name: string; body: string; image: ImageMetadata; sector: string };

/** From "Domains of Expertise" on ethoslab.gr. `sector` links to the filtered project list. */
export const domains: Domain[] = [
  { id: 'government', name: 'Government and public services', body: 'Better design, delivery and performance of public systems, from infrastructure to local services.', image: governmentImg, sector: 'regions' },
  { id: 'democracy', name: 'Democracy and participation', body: 'Participation, trust and civic resilience, including citizens’ assemblies and deliberative formats.', image: democracyImg, sector: 'democracy' },
  { id: 'education', name: 'Education and skills', body: 'Learning designed around how people actually learn, with wellbeing and future capabilities beyond scores.', image: educationImg, sector: 'education' },
  { id: 'economy', name: 'Economy and welfare', body: 'Inclusive, resilient economies, measured beyond GDP and grounded in how people and firms behave.', image: economyImg, sector: 'labour' },
  { id: 'environment', name: 'Climate and environment', body: 'Sustainable everyday behaviours, climate adaptation and resilience.', image: environmentImg, sector: 'environment' },
  { id: 'transport', name: 'Transport and cities', body: 'Public transport uptake, sustainable mobility and road safety, co-designed to fit legal and financial realities.', image: transportImg, sector: 'regions' },
  { id: 'business', name: 'Business and ESG', body: 'Change that people adopt: demand analysis, ESG reporting and behaviourally informed communication.', image: businessImg, sector: 'economy' },
  { id: 'ai', name: 'AI and technology', body: 'Fair, transparent algorithms and platforms that support informed, healthy choices.', image: aiImg, sector: 'digital' },
];

/** From "How we work" on ethoslab.gr. */
export const principles = [
  { title: 'The right team for each project', body: 'Each project gets the specific expertise it needs, from experimental design to econometric modelling. If a project needs methods outside our expertise, we say so and recommend alternatives.' },
  { title: 'Methods in the open', body: 'You receive the results with the code, data sources, analytical decisions and justifications. When results are ambiguous or inconclusive, we say so clearly.' },
  { title: 'Independent findings', body: 'We collaborate closely with clients, but we do not let pressure shape findings or suppress inconvenient results.' },
  { title: 'Academic standards', body: 'Pre-registered analysis plans, established protocols for causal inference, and designs that withstand external scrutiny.' },
  { title: 'Internal peer review', body: 'Team members who were not on the project review the code, validate the statistics and challenge the findings before anything is final.' },
  { title: 'Ethics and data protection', body: 'Ethics review to academic and EU standards, informed consent, and GDPR-compliant data handling. Sensitive projects go to an external ethics committee.' },
];
