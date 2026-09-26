import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';
import sectorData from './data/sectors.json';

/**
 * Every collection is organised as <collection>/<lang>/<slug>.md, so an entry id
 * is "en/edu-well". src/i18n/utils.ts#getLocalized splits that back apart.
 *
 * Files written by scripts/import-wp.mjs carry wp* fields. Everything else
 * (sectors, results, featured, ...) is editorial and survives re-imports.
 */

const SECTOR_IDS = sectorData.sectors.map((s) => s.id) as [string, ...string[]];
const lang = z.enum(['en', 'el']);

/** Provenance fields added by the WordPress importer. */
const wp = {
  wpId: z.number().optional(),
  wpType: z.string().optional(),
  wpSlug: z.string().optional(),
  wpUrl: z.url().optional(),
  wpCategories: z.array(z.string()).optional(),
  translations: z.record(z.string(), z.string()).optional(),
  sync: z.boolean().optional(),
};

/**
 * One estimated effect. The refinement is a guard against data-entry errors:
 * a point estimate outside its own confidence interval fails the build.
 */
const effect = z
  .object({
    label: z.string(),
    group: z.string().optional(),
    estimate: z.number(),
    ciLow: z.number(),
    ciHigh: z.number(),
    controlMean: z.number().optional(),
    n: z.number().int().positive().optional(),
    note: z.string().optional(),
  })
  .refine((e) => e.ciLow <= e.estimate && e.estimate <= e.ciHigh, {
    message: 'Each effect needs ciLow <= estimate <= ciHigh',
  });

const results = z.object({
  title: z.string(),
  /** Short unit shown next to numbers, e.g. "pp" or "SD". */
  unit: z.string(),
  /** Axis label, e.g. "Effect in percentage points". */
  unitLabel: z.string(),
  decimals: z.number().int().min(0).max(3).default(1),
  /** Confidence level of the intervals, as a percentage. */
  level: z.number().default(95),
  /** Estimation note shown under the chart: model, fixed effects, SEs, clustering. */
  note: z.string(),
  effects: z.array(effect).min(1),
});

const pages = defineCollection({
  loader: glob({ base: './src/content/pages', pattern: '**/*.md' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      lang,
      summary: z.string().optional(),
      date: z.string().optional(),
      modified: z.string().optional(),
      cover: image().optional(),
      ...wp,
    }),
});

const posts = defineCollection({
  loader: glob({ base: './src/content/posts', pattern: '**/*.md' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      lang,
      summary: z.string().optional(),
      date: z.string().optional(),
      modified: z.string().optional(),
      cover: image().optional(),
      ...wp,
    }),
});

/** Work: imported WP projects and hand-written case studies share one model. */
const projects = defineCollection({
  loader: glob({ base: './src/content/projects', pattern: '**/*.md' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      lang,
      summary: z.string(),
      sectors: z.array(z.enum(SECTOR_IDS)).min(1),
      programmes: z.array(z.string()).optional(),
      partner: z.string().optional(),
      countries: z.array(z.string()).optional(),
      years: z.string().optional(),
      status: z.enum(['ongoing', 'completed']).optional(),
      design: z.string().optional(),
      sample: z.string().optional(),
      preregistration: z.object({ registry: z.string(), id: z.string(), url: z.url().optional() }).optional(),
      /** Headline stat for cards and hero callouts. */
      headline: z.object({ value: z.string(), label: z.string() }).optional(),
      results: results.optional(),
      /** Further outcomes on other scales: each gets its own chart (one axis per chart). */
      secondaryResults: z.array(results).default([]),
      /** Shown as a note when results may still change, e.g. a deliverable under revision. */
      provisional: z.string().optional(),
      featured: z.boolean().default(false),
      /** False keeps an entry out of Work listings (e.g. a paper that lives under Research). */
      listed: z.boolean().default(true),
      order: z.number().default(100),
      /** True for case studies whose numbers are simulated for the prototype. */
      illustrative: z.boolean().default(false),
      cover: image().optional(),
      date: z.string().optional(),
      modified: z.string().optional(),
      ...wp,
    }),
});

const people = defineCollection({
  loader: glob({ base: './src/content/people', pattern: '**/*.md' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      lang,
      role: z.string().optional(),
      summary: z.string().optional(),
      cover: image().optional(),
      order: z.number().default(100),
      ...wp,
    }),
});

const research = defineCollection({
  loader: glob({ base: './src/content/research', pattern: '**/*.md' }),
  schema: z.object({
    title: z.string(),
    lang,
    type: z.enum(['working-paper', 'journal-article', 'policy-brief', 'report', 'dataset']),
    date: z.coerce.date(),
    authors: z.array(z.string()).min(1),
    venue: z.string().optional(),
    url: z.url().optional(),
    summary: z.string(),
    sectors: z.array(z.enum(SECTOR_IDS)).default([]),
    methods: z.array(z.string()).default([]),
    /** Key findings in one line each, taken from the published abstract or paper. */
    highlights: z.array(z.string()).default([]),
    /** Sample entries written for the prototype. Rendered with a visible badge. */
    placeholder: z.boolean().default(false),
  }),
});

const products = defineCollection({
  loader: glob({ base: './src/content/products', pattern: '**/*.md' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      lang,
      kicker: z.string(),
      summary: z.string(),
      status: z.enum(['live', 'pilot', 'in development']),
      url: z.url().optional(),
      cover: image().optional(),
      features: z.array(z.string()).default([]),
      order: z.number().default(100),
      placeholder: z.boolean().default(false),
    }),
});

export const collections = { pages, posts, projects, people, research, products };
