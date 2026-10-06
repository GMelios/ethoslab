/**
 * The two products and the shared closing call to action, from "Ethos Lab homepage copy (v2)".
 * Used by the homepage, /services/ and the two engagement pages under /services/. `todos` are [TODO]s in the brief: they render
 * as visible placeholders. Do not fill them with invented timelines or prices.
 */
export type Product = {
  id: 'test' | 'evaluation';
  name: string;
  path: string;
  /** ETHOS stages this engagement covers. */
  stages: string;
  tagline: string;
  for: string;
  questions: string;
  weDo: string;
  youReceive: string;
  todos: { label: string; note: string }[];
};

export const products: Product[] = [
  {
    id: 'test',
    name: 'Ethos Test',
    path: '/services/ethos-test/',
    stages: 'Explore, Test, Hone',
    tagline: 'Know before you launch.',
    for: 'A message, letter, policy option, service change, campaign or product idea you have not rolled out yet.',
    questions: 'Which version will people actually respond to? Will this change be understood and accepted?',
    weDo: 'We compare your options side by side with real people, online or in the field, in a fair experiment.',
    youReceive: 'Which option works best, how confident we are, and what to change before launch.',
    todos: [
      // Brief: typical duration, e.g. "3 to 6 weeks".
      { label: 'Timeline', note: 'Typical duration to confirm' },
      // Brief: "From €X" or remove.
      { label: 'Price', note: 'Starting price to confirm, or remove' },
    ],
  },
  {
    id: 'evaluation',
    name: 'Ethos Evaluation',
    path: '/services/ethos-evaluation/',
    stages: 'Optimise, Scale',
    tagline: 'Prove what worked.',
    for: 'A programme, policy or funded project that is running, finished, or about to start.',
    questions: 'Did it change outcomes? For whom, and why? What should we keep, fix or stop?',
    weDo: 'We measure real impact using experiments or rigorous causal methods, on new data or data you already hold. Best of all, we build the evaluation in from day one.',
    youReceive:
      'A credible estimate of impact, who benefited, why it worked or did not, and clear recommendations. The report is built to satisfy funders, auditors and the European Commission.',
    todos: [
      // Brief: e.g. "Typically 3 to 12 months, or across the life of a programme".
      { label: 'Timeline', note: 'Typical duration to confirm' },
    ],
  },
];

export const productById = (id: Product['id']) => products.find((p) => p.id === id)!;

export const closingCta = {
  title: 'What do you need to know?',
  body: 'Tell us about the idea you want to test or the programme you need to evaluate. We will reply within two working days with an honest view of what we could find out.',
  button: 'Start a conversation',
};
