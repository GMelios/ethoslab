/**
 * Where we work (eight domains) and how we hold ourselves to account (principles).
 * The services themselves are in src/data/offer.ts.
 * Words from the "Domains of Expertise" and "How we work" pages on ethoslab.gr,
 * condensed and with the em dashes taken out. Domain photos: Unsplash, credited in
 * src/assets/photos/CREDITS.md.
 */
import type { ImageMetadata } from 'astro';

import aiImg from '../assets/photos/domain-ai.jpg';
import businessImg from '../assets/photos/domain-business.jpg';
import democracyImg from '../assets/photos/domain-democracy.jpg';
import educationImg from '../assets/photos/domain-education.jpg';
import governmentImg from '../assets/photos/domain-government.jpg';
import transportImg from '../assets/photos/domain-transport.jpg';
import economyImg from '../assets/photos/domain-economy.jpg';
import environmentImg from '../assets/photos/domain-environment.jpg';

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
