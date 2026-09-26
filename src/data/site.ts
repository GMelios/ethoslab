import type { ImageMetadata } from 'astro';
import type { UIKey } from '../i18n/ui';

export type Direction = 'a' | 'b' | 'c';

export const site = {
  name: 'Ethos Lab',
  url: 'https://ethoslab.gr',
  /** Which direction renders at "/" until one is chosen. */
  homeDirection: 'a' as Direction,
  /** Colour palette for direction B (see [data-palette] in src/styles/global.css). */
  bPalette: 'brand' as 'plum' | 'brand' | 'aegean' | 'figure' | 'olive' | 'midnight',
  email: 'info@ethoslab.gr',
  phone: '+30 212 107 4164',
  phoneHref: 'tel:+302121074164',
  offices: { street: 'Stadiou 43', city: 'Athens', postcode: '105 64', country: 'Greece' },
  registered: { street: 'Gounari 21-23', city: 'Piraeus', country: 'Greece' },
  gemi: '151836007000',
  social: [
    { label: 'LinkedIn', href: 'https://www.linkedin.com/company/30099631' },
    { label: 'Facebook', href: 'https://www.facebook.com/EthosLabGr/' },
  ],
};

/** Primary navigation. Paths are locale-neutral; wrap with localePath(). */
export const nav: { key: UIKey; path: string }[] = [
  { key: 'nav.whatWeDo', path: '/what-we-do/' },
  { key: 'nav.work', path: '/work/' },
  { key: 'nav.research', path: '/research/' },
  { key: 'nav.products', path: '/products/' },
  { key: 'nav.about', path: '/about/' },
];

// ---------------------------------------------------------------------------
// Partner logos, from the "Track record and partnerships" page of the current site
// (downloaded by the importer to src/assets/wp).
// ---------------------------------------------------------------------------
const logoFiles = import.meta.glob<{ default: ImageMetadata }>('../assets/wp/**/*.{png,jpg,jpeg,svg}', { eager: true });
const logo = (rel: string) => {
  const hit = logoFiles[`../assets/wp/${rel}`];
  if (!hit) throw new Error(`Partner logo missing: ${rel}. Run npm run import:wp`);
  return hit.default;
};

export type Partner = { name: string; kind: 'public' | 'academic' | 'civil' | 'private'; logo: ImageMetadata };

export const partners: Partner[] = [
  { name: 'European Commission', kind: 'public', logo: logo('2019/03/eu-commision.png') },
  { name: 'OECD', kind: 'public', logo: logo('2019/03/oecd.png') },
  { name: 'The World Bank', kind: 'public', logo: logo('2019/03/wb.png') },
  { name: 'International Labour Organization', kind: 'public', logo: logo('2019/03/ilo.png') },
  { name: 'Hellenic Parliament', kind: 'public', logo: logo('2019/03/bte.png') },
  { name: 'DYPA, Public Employment Service of Greece', kind: 'public', logo: logo('2019/03/dypa.png') },
  { name: 'City of Zaragoza', kind: 'public', logo: logo('2019/03/zau.jpg') },
  { name: 'London School of Economics', kind: 'academic', logo: logo('2019/03/lse.png') },
  { name: 'University College London', kind: 'academic', logo: logo('2019/03/ucl.png') },
  { name: "King's College London", kind: 'academic', logo: logo('2025/11/untitled.png') },
  { name: 'The Open University', kind: 'academic', logo: logo('2019/03/tou.png') },
  { name: 'Universitat Autònoma de Barcelona', kind: 'academic', logo: logo('2019/03/uab.png') },
  { name: 'Universidade NOVA de Lisboa', kind: 'academic', logo: logo('2019/03/unl.png') },
  { name: 'EASPD', kind: 'civil', logo: logo('2019/03/easpd.png') },
  { name: 'Oxfam', kind: 'civil', logo: logo('2019/03/oxfam-1.png') },
  { name: 'KMOP', kind: 'civil', logo: logo('2019/03/kmop.png') },
  { name: 'Re-Imagine Europe', kind: 'civil', logo: logo('2019/03/rieu.png') },
  { name: 'Support Group Network', kind: 'civil', logo: logo('2019/03/spgn.png') },
  { name: 'Decidim', kind: 'civil', logo: logo('2019/03/dcdm.png') },
  { name: 'Open Source Politics', kind: 'private', logo: logo('2019/03/osp.png') },
  { name: 'Story Pact', kind: 'private', logo: logo('2019/03/sp.png') },
  { name: 'webLyzard technology', kind: 'private', logo: logo('2019/03/wlt.png') },
  { name: 'Allianz', kind: 'private', logo: logo('2019/03/allianz-logo.jpg') },
  { name: 'EY', kind: 'private', logo: logo('2019/03/ey.png') },
  { name: 'Vianex', kind: 'private', logo: logo('2019/03/vianex.png') },
  { name: 'FCNC', kind: 'private', logo: logo('2025/11/fcnc-main-logo.svg') },
];

/** Logos that read well in a single monochrome row (C's proof strip). */
// Circle and solid-block marks (Hellenic Parliament, DYPA, EASPD) turn into grey
// blobs under the monochrome filter, so the strip uses wordmark-style logos.
export const featuredPartners = [
  'European Commission', 'OECD', 'The World Bank', 'International Labour Organization', 'London School of Economics',
  'University College London', 'Universitat Autònoma de Barcelona', 'Oxfam', 'City of Zaragoza', 'Allianz',
].map((n) => partners.find((p) => p.name === n)!);

// ---------------------------------------------------------------------------
// Proof numbers. `placeholder: true` renders a visible "Sample" badge.
// Replace with audited figures before launch.
// ---------------------------------------------------------------------------
export type Proof = { value: string; label: string; placeholder: boolean; source?: string };

export const proof: Proof[] = [
  { value: String(partners.length), label: 'partner institutions across government, academia and civil society', placeholder: false, source: 'current partner list' },
  { value: '8,195', label: 'adults surveyed for one experiment on language and political understanding', placeholder: false, source: 'MultiPoD D1.1' },
  { value: '7', label: 'countries in that experiment, from Portugal to Austria', placeholder: false, source: 'MultiPoD D1.1' },
  { value: '36,000', label: 'households randomised in our largest trial', placeholder: true },
];

/** Methods vocabulary, used on What we do and in direction A. */
export const methods = [
  'Randomised controlled trials',
  'Cluster and stepped-wedge designs',
  'Survey and conjoint experiments',
  'Difference-in-differences and event studies',
  'Regression discontinuity',
  'Synthetic control',
  'Instrumental variables',
  'Administrative data linkage',
  'Pre-analysis plans',
  'Cost-effectiveness analysis',
];
