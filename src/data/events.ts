/** Events, from the current ethoslab.gr pages. Shown under Insights and on the homepage. */
export type SiteEvent = {
  title: string;
  date: Date;
  dateLabel: string;
  place: string;
  summary: string;
  people: string[];
  url?: string;
};

export const events: SiteEvent[] = [
  {
    title: 'Behavioural Insights for Policy: BiP Greece 2026',
    date: new Date('2026-02-26'),
    dateLabel: '26 to 27 February 2026',
    place: 'ETERON Institute, Athens',
    summary:
      'A two-day workshop of academic and policy presentations, panels and keynotes on applying behavioural science to public policy, co-organised by Ethos Lab and the ETERON Institute. After a first edition in Moldova, it was the first BiP event in Greece.',
    people: [
      'Keynote: Professor Ralph Hertwig, Max Planck Institute for Human Development',
      'Keynote: Eva Koromilas, OECD Observatory of Public Sector Innovation',
    ],
    url: 'https://ethoslab.gr/behavioural-insights-for-policy/',
  },
];
