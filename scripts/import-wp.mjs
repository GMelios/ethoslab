#!/usr/bin/env node
/**
 * Import content from the legacy WordPress site into Astro content collections.
 *
 *   npm run import:wp                  import everything and download images
 *   npm run import:wp -- --dry-run     fetch and report, write nothing
 *   npm run import:wp -- --no-images   skip image downloads (keeps remote URLs)
 *   npm run import:wp -- --force       also overwrite entries marked `sync: false`
 *   npm run import:wp -- --prune       delete previously imported files not seen this run
 *
 * Sources
 *   pages     REST  /wp-json/wp/v2/pages            -> src/content/pages/<lang>/<slug>.md
 *   posts     REST  /wp-json/wp/v2/posts            -> src/content/posts/<lang>/<slug>.md
 *   projects  The theme registers projects as a `portfolio-item` post type with
 *             show_in_rest = false, so REST cannot list them. We discover them from
 *             three public sources and merge them:
 *               - WP core sitemaps (/wp-sitemap.xml): every published item, plus the
 *                 list of portfolio-category terms;
 *               - RSS feeds (?post_type=portfolio-item, ?portfolio-category=<slug>):
 *                 publish dates and each item's categories (tags);
 *               - portfolio grids embedded in REST page content: cover images.
 *             Then we fetch each project's public HTML and convert its <main>.
 *                                                  -> src/content/projects/<lang>/<slug>.md
 *   people    The same post type also holds team profiles (tagged Team, Executive
 *             Team, Consultants). They are split out by tag.
 *                                                  -> src/content/people/<lang>/<slug>.md
 *   images    Every wp-content/uploads image referenced is downloaded once to
 *             src/assets/wp/<yyyy>/<mm>/ and rewritten to a relative path, so Astro's
 *             image pipeline optimises it at build time.
 *
 * Language comes from Polylang: URLs under /el/ are Greek; legacy Greek pages that
 * live at the site root are detected by script (Greek vs Latin letter counts).
 *
 * Re-running is safe. WP-owned frontmatter keys and the body are refreshed; any
 * other frontmatter you add (sectors, results, featured, ...) is preserved.
 * Set `sync: false` on an entry to stop the importer touching it.
 * A human-readable log of what was fetched is written to docs/wp-import-report.md.
 */
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { parse } from 'node-html-parser';
import TurndownService from 'turndown';
import { gfm } from 'turndown-plugin-gfm';
import { load as yamlLoad, dump as yamlDump } from 'js-yaml';

const BASE = 'https://ethoslab.gr';
const API = `${BASE}/wp-json/wp/v2`;
const UA = 'EthosLab-site-importer/1.0 (+https://ethoslab.gr)';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const CONTENT = path.join(ROOT, 'src/content');
const ASSETS = path.join(ROOT, 'src/assets/wp');
const REPORT = path.join(ROOT, 'docs/wp-import-report.md');

const args = new Set(process.argv.slice(2));
const DRY = args.has('--dry-run');
const NO_IMAGES = args.has('--no-images');
const FORCE = args.has('--force');
const PRUNE = args.has('--prune');

const { sectors: SECTORS } = JSON.parse(
  await fs.readFile(path.join(ROOT, 'src/data/sectors.json'), 'utf8'),
);

// Frontmatter keys the importer owns. Everything else in an existing file is kept;
// `seed` values passed to writeEntry are only filled when the key is missing.
const OWNED = ['title', 'lang', 'wpId', 'wpType', 'wpSlug', 'wpUrl', 'wpCategories', 'programmes', 'date', 'modified', 'cover', 'translations'];

// Portfolio tags that mark a team profile rather than a project.
const PEOPLE_TAG = /team|consultant|people|staff|ομάδα/i;

// WP portfolio filter slugs -> funding programme labels.
const PROGRAMMES = {
  horizon: 'Horizon Europe',
  erasmus: 'Erasmus+',
  'rec-programme': 'REC / CERV',
  'eu-programs': 'EU-funded',
  policy: 'Public policy',
  business: 'Private sector',
  consultation: 'Consulting',
  'consultation-el': 'Consulting',
  'commerce-el': 'Commerce',
};

const report = { pages: [], posts: [], projects: [], people: [], skipped: [], stale: [], errors: [], images: new Map() };
const written = new Set(); // absolute paths written (or deliberately kept) this run

// ---------------------------------------------------------------------------
// HTTP
// ---------------------------------------------------------------------------
async function http(url, { as = 'json', retries = 2 } = {}) {
  for (let attempt = 0; ; attempt++) {
    try {
      const res = await fetch(url, { headers: { 'User-Agent': UA }, signal: AbortSignal.timeout(45_000) });
      if (!res.ok) throw Object.assign(new Error(`HTTP ${res.status} for ${url}`), { status: res.status });
      if (as === 'json') return { data: await res.json(), headers: res.headers };
      if (as === 'text') return { data: await res.text(), headers: res.headers };
      return { data: Buffer.from(await res.arrayBuffer()), headers: res.headers };
    } catch (err) {
      if (attempt >= retries || err.status === 404) throw err;
      await new Promise((r) => setTimeout(r, 800 * (attempt + 1)));
    }
  }
}

async function fetchAll(endpoint, fields) {
  const out = [];
  for (let page = 1, total = 1; page <= total; page++) {
    const { data, headers } = await http(`${API}/${endpoint}?per_page=100&page=${page}&_fields=${fields}`);
    total = Number(headers.get('x-wp-totalpages') || 1);
    out.push(...data);
  }
  return out;
}

async function pool(items, size, fn) {
  const results = [];
  let i = 0;
  await Promise.all(
    Array.from({ length: Math.min(size, items.length) }, async () => {
      while (i < items.length) {
        const idx = i++;
        results[idx] = await fn(items[idx], idx);
      }
    }),
  );
  return results;
}

// ---------------------------------------------------------------------------
// Text helpers
// ---------------------------------------------------------------------------
const GREEK = { α: 'a', ά: 'a', β: 'v', γ: 'g', δ: 'd', ε: 'e', έ: 'e', ζ: 'z', η: 'i', ή: 'i', θ: 'th', ι: 'i', ί: 'i', ϊ: 'i', ΐ: 'i', κ: 'k', λ: 'l', μ: 'm', ν: 'n', ξ: 'x', ο: 'o', ό: 'o', π: 'p', ρ: 'r', σ: 's', ς: 's', τ: 't', υ: 'y', ύ: 'y', ϋ: 'y', ΰ: 'y', φ: 'f', χ: 'ch', ψ: 'ps', ω: 'o', ώ: 'o' };

function safeDecode(s) {
  try { return decodeURIComponent(s); } catch { return s; }
}

function slugify(input) {
  return (
    [...safeDecode(String(input)).toLowerCase().normalize('NFC')]
      .map((c) => GREEK[c] ?? c)
      .join('')
      .normalize('NFKD')
      .replace(/[̀-ͯ]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '') || 'untitled'
  );
}

const decodeEntities = (s) => parse(`<p>${s ?? ''}</p>`).text.trim();

/**
 * Prefer the WP slug, but fall back to the title when the slug is a theme-demo
 * leftover sharing no words with the title (e.g. `personal-injury` for E.T.Ho.S).
 * "HEAL – enHancing rEcovery ..." style titles use their short prefix ("heal").
 */
function entrySlug(title, wpSlug) {
  const fromWp = slugify(wpSlug);
  const [prefix, rest] = title.split(/\s+[–—-]\s*|\s*[–—]\s+/);
  const short = rest && prefix.split(/\s+/).length <= 3 ? slugify(prefix.replace(/\./g, '')) : null;
  if (short) return short;
  const titleWords = new Set(slugify(title).split('-'));
  const overlap = fromWp.split('-').some((w) => w.length > 2 && titleWords.has(w));
  const base = overlap ? fromWp : slugify(title);
  return base.length <= 60 ? base : base.slice(0, 60).replace(/-[^-]*$/, '');
}

function detectLang(url, text) {
  if (new URL(url).pathname.startsWith('/el/')) return 'el';
  const greek = (text.match(/[Ͱ-Ͽἀ-῿]/g) || []).length;
  const latin = (text.match(/[A-Za-z]/g) || []).length;
  return greek > latin ? 'el' : 'en';
}

function summarise(markdown, max = 220) {
  const paras = markdown
    .split(/\n{2,}/)
    .map((p) => p.replace(/!\[[^\]]*\]\([^)]*\)/g, '').replace(/\[([^\]]*)\]\([^)]*\)/g, '$1').replace(/[#*_>`|]/g, '').trim())
    .filter(Boolean);
  const para = paras.find((p) => p.length > 60) ?? paras[0];
  if (!para) return undefined;
  if (para.length <= max) return para;
  return para.slice(0, max).replace(/\s+\S*$/, '') + '…';
}

/** The WP `horizon` tag covers both framework programmes; the text says which. */
function programmeLabel(category, text) {
  if (category === 'horizon' && /horizon\s*2020|\bH2020\b/i.test(text) && !/horizon europe/i.test(text)) return 'Horizon 2020';
  return PROGRAMMES[category];
}

// Used when no sector keyword matches (e.g. stub entries with no body text).
const CATEGORY_SECTORS = { business: 'economy', 'commerce-el': 'economy', consultation: 'economy', 'consultation-el': 'economy', horizon: 'democracy', erasmus: 'education', 'rec-programme': 'equality' };

function inferSectors(text, categories = []) {
  const hay = ` ${text.toLowerCase()} `;
  const scored = SECTORS.map((s) => ({
    id: s.id,
    score: s.keywords.reduce((n, k) => n + (hay.split(k).length - 1), 0),
  }))
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score);
  const strong = scored.filter((s) => s.score >= 2).slice(0, 3).map((s) => s.id);
  if (strong.length) return strong;
  if (scored.length) return [scored[0].id];
  return [...new Set(categories.map((c) => CATEGORY_SECTORS[c]).filter(Boolean))].slice(0, 2);
}

const wordCount = (md) => md.split(/\s+/).filter(Boolean).length;

// ---------------------------------------------------------------------------
// HTML -> Markdown
// ---------------------------------------------------------------------------
// WPBakery / theme shortcodes leak into REST content as literal text.
const SHORTCODES = /\[\/?(?:vc_|gtc_|rev_slider|contact-form|caption|embed|et_pb_)[^\]]*\]/g;
const JUNK = [
  'script', 'style', 'noscript', 'form', 'svg', 'button', 'rs-module-wrap', 'rs-module',
  '.vc_empty_space', '.gtc_lazyload_placeholder', '.portfolio-hover', '.portfolio-list-filter',
  '.screen-reader-text', '.wpcf7', '.rev_slider_wrapper', '.vc_separator', '.gtc_css_icon',
].join(',');

const turndown = new TurndownService({ headingStyle: 'atx', bulletListMarker: '-', codeBlockStyle: 'fenced', emDelimiter: '_' });
turndown.use(gfm);
turndown.addRule('dropEmptyLinks', {
  filter: (node) => node.nodeName === 'A' && !node.textContent.trim() && !node.querySelector('img'),
  replacement: () => '',
});

function isUpload(url) {
  try { return new URL(url, BASE).hostname.endsWith('ethoslab.gr') && url.includes('/wp-content/uploads/'); } catch { return false; }
}
const isImageFile = (url) => /\.(jpe?g|png|gif|webp|avif|svg)(\?.*)?$/i.test(url);

/** Clean WP markup; returns { root, images } with lazy-load attributes resolved. */
function cleanHtml(html) {
  const root = parse(html.replace(SHORTCODES, ''), { comment: false });
  root.querySelectorAll(JUNK).forEach((n) => n.remove());

  root.querySelectorAll('iframe').forEach((f) => {
    const src = f.getAttribute('src') || f.getAttribute('data-src');
    f.replaceWith(src && !src.startsWith('about:') ? `<p><a href="${src}">Embedded media</a></p>` : '');
  });

  const images = new Set();
  root.querySelectorAll('img').forEach((img) => {
    const src = img.getAttribute('data-src') || img.getAttribute('data-lazy-src') || img.getAttribute('src') || '';
    if (!src || src.startsWith('data:')) return img.remove();
    const abs = new URL(src, BASE).href;
    img.setAttribute('src', abs);
    for (const a of ['srcset', 'data-srcset', 'sizes', 'data-sizes', 'class', 'style', 'width', 'height', 'loading', 'decoding', 'fetchpriority', 'data-src']) img.removeAttribute(a);
    if (isUpload(abs)) images.add(abs);
  });

  // Lightbox pattern: <a href="big.jpg"><img src="big.jpg"></a> -> keep the image only.
  // Links to other projects point at their new /work/ URLs.
  root.querySelectorAll('a').forEach((a) => {
    const href = a.getAttribute('href') || '';
    const kids = a.childNodes.filter((n) => n.nodeType === 1 || n.text.trim());
    if (isImageFile(href) && kids.length === 1 && kids[0].rawTagName === 'img') a.replaceWith(kids[0].toString());
    else if (projectRoutes.has(href.replace(/\/?$/, '/'))) a.setAttribute('href', projectRoutes.get(href.replace(/\/?$/, '/')));
  });

  // WP separates paragraphs with <br /> inside one <p>; make them real paragraphs.
  root.querySelectorAll('p').forEach((p) => {
    if (!/<br\s*\/?>/i.test(p.innerHTML)) return;
    const parts = p.innerHTML.split(/(?:\s*<br\s*\/?>\s*)+/i).filter((s) => s.replace(/&nbsp;/g, '').trim());
    p.replaceWith(parts.map((s) => `<p>${s}</p>`).join(''));
  });

  return { root, images };
}

const projectRoutes = new Map(); // legacy /project/<slug>/ URL -> new site path

function toMarkdown(html) {
  return turndown
    .turndown(html)
    .replace(/ /g, ' ')
    // House style has no em dashes: "X—Y" and "X — Y" become "X, Y".
    .replace(/\s*—\s*/g, ', ')
    .replace(/^[ \t]+$/gm, '')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

// ---------------------------------------------------------------------------
// Images
// ---------------------------------------------------------------------------
const imageJobs = new Map(); // remote url -> Promise<local abs path | null>

function localPathFor(url) {
  const rel = new URL(url).pathname.split('/wp-content/uploads/')[1] || path.basename(new URL(url).pathname);
  const parts = rel.split('/').map((p, i, arr) => (i === arr.length - 1 ? p : slugify(p)));
  const file = parts.pop();
  const ext = path.extname(file).toLowerCase();
  const stem = slugify(path.basename(file, path.extname(file)));
  return path.join(ASSETS, ...parts, `${stem}${ext}`);
}

/** Prefer the original upload over WP's resized variant (foo-660x495.jpg -> foo.jpg). */
function originalOf(url) {
  return url.replace(/-\d+x\d+(?=\.[a-z]+(\?.*)?$)/i, '');
}

function downloadImage(url) {
  if (NO_IMAGES || DRY) return Promise.resolve(null);
  if (imageJobs.has(url)) return imageJobs.get(url);
  const job = (async () => {
    for (const candidate of [...new Set([originalOf(url), url])]) {
      const dest = localPathFor(candidate);
      try {
        await fs.access(dest);
        report.images.set(candidate, { dest, bytes: (await fs.stat(dest)).size, cached: true });
        return dest;
      } catch {}
      try {
        const { data, headers } = await http(candidate, { as: 'buffer' });
        if (!String(headers.get('content-type')).startsWith('image/')) continue;
        await fs.mkdir(path.dirname(dest), { recursive: true });
        await fs.writeFile(dest, data);
        report.images.set(candidate, { dest, bytes: data.length, cached: false });
        return dest;
      } catch {}
    }
    report.errors.push(`image failed: ${url}`);
    return null;
  })();
  imageJobs.set(url, job);
  return job;
}

const imgLimit = { active: 0, queue: [] };
async function limitedDownload(url) {
  if (imgLimit.active >= 6) await new Promise((r) => imgLimit.queue.push(r));
  imgLimit.active++;
  try { return await downloadImage(url); } finally { imgLimit.active--; imgLimit.queue.shift()?.(); }
}

function relFrom(mdFile, absAsset) {
  const rel = path.relative(path.dirname(mdFile), absAsset).split(path.sep).join('/');
  return rel.startsWith('.') ? rel : `./${rel}`;
}

/** Download images in `markdown` and rewrite their URLs relative to `mdFile`. */
async function localiseImages(markdown, images, mdFile) {
  let md = markdown;
  for (const url of images) {
    const local = await limitedDownload(url);
    if (local) md = md.split(url).join(relFrom(mdFile, local));
  }
  return md;
}

// ---------------------------------------------------------------------------
// Writing entries
// ---------------------------------------------------------------------------
const usedSlugs = new Map(); // `${collection}/${lang}` -> Set

function uniqueSlug(collection, lang, slug) {
  const key = `${collection}/${lang}`;
  if (!usedSlugs.has(key)) usedSlugs.set(key, new Set());
  const set = usedSlugs.get(key);
  let s = slug;
  for (let n = 2; set.has(s); n++) s = `${slug}-${n}`;
  set.add(s);
  return s;
}

async function readExisting(file) {
  try {
    const raw = await fs.readFile(file, 'utf8');
    const m = raw.match(/^---\n([\s\S]*?)\n---\n?/);
    return m ? yamlLoad(m[1]) || {} : {};
  } catch {
    return null;
  }
}


async function writeEntry({ collection, lang, slug, fields, seed, body, images }) {
  const file = path.join(CONTENT, collection, lang, `${slug}.md`);
  written.add(file);
  const existing = await readExisting(file);
  if (existing?.sync === false && !FORCE) {
    report.skipped.push({ reason: 'sync: false', file: path.relative(ROOT, file) });
    return { file, skipped: true };
  }

  const localBody = await localiseImages(body, images, file);
  const cover = fields.cover ? await limitedDownload(fields.cover) : null;

  const data = { ...(existing || {}) };
  for (const k of OWNED) delete data[k];
  Object.assign(data, fields, { cover: cover ? relFrom(file, cover) : undefined });
  for (const [k, v] of Object.entries(seed)) if (data[k] === undefined || (Array.isArray(data[k]) && !data[k].length)) data[k] = v;
  for (const k of Object.keys(data)) if (data[k] === undefined || (Array.isArray(data[k]) && !data[k].length)) delete data[k];

  // Stable key order: owned first, then editorial keys.
  const ordered = Object.fromEntries([...OWNED.filter((k) => k in data).map((k) => [k, data[k]]), ...Object.entries(data).filter(([k]) => !OWNED.includes(k))]);
  const out = `---\n${yamlDump(ordered, { lineWidth: -1, noRefs: true, quotingType: '"' })}---\n\n${localBody}\n`;

  if (!DRY) {
    await fs.mkdir(path.dirname(file), { recursive: true });
    await fs.writeFile(file, out);
  }
  return { file: path.relative(ROOT, file), words: wordCount(localBody), images: images.size, cover: Boolean(cover) };
}

// ---------------------------------------------------------------------------
// Pages & posts (REST)
// ---------------------------------------------------------------------------
const FIELDS = 'id,slug,link,title,content,excerpt,date,modified,template,featured_media,parent,menu_order';

async function mediaUrl(id) {
  if (!id) return undefined;
  try { return (await http(`${API}/media/${id}?_fields=source_url`)).data.source_url; } catch { return undefined; }
}

/** WP excerpts on this site are auto-generated from WPBakery shortcodes; ignore those. */
function cleanExcerpt(html) {
  const text = decodeEntities(String(html || '').replace(/\[[^\]]*\]/g, ''));
  return text.length >= 40 ? text.slice(0, 280) : undefined;
}

async function importRestType(endpoint, collection) {
  const items = await fetchAll(endpoint, FIELDS);
  console.log(`  ${endpoint}: ${items.length} published`);
  await pool(items, 4, async (item) => {
    const title = decodeEntities(item.title?.rendered) || '(untitled)';
    const { root, images } = cleanHtml(item.content?.rendered || '');
    const body = toMarkdown(root.toString());
    const lang = detectLang(item.link, `${title} ${root.text}`);
    if (!body.replace(/!\[[^\]]*\]\([^)]*\)/g, '').trim()) {
      report.skipped.push({ reason: 'empty content', title, url: item.link });
      return;
    }
    const slug = uniqueSlug(collection, lang, slugify(item.slug));
    const res = await writeEntry({
      collection,
      lang,
      slug,
      fields: {
        title,
        lang,
        wpId: item.id,
        wpType: endpoint.replace(/s$/, ''),
        wpSlug: safeDecode(item.slug),
        wpUrl: item.link,
        date: item.date?.slice(0, 10),
        modified: item.modified?.slice(0, 10),
        cover: await mediaUrl(item.featured_media),
      },
      seed: { summary: cleanExcerpt(item.excerpt?.rendered) || summarise(body) },
      body,
      images,
    });
    report[collection].push({ title, lang, url: item.link, ...res });
  });
  return items;
}

// ---------------------------------------------------------------------------
// Projects and people (portfolio-item: discovered from sitemaps, feeds and grids,
// fetched as HTML)
// ---------------------------------------------------------------------------
const xmlLocs = (xml) => [...xml.matchAll(/<loc>\s*([^<\s]+)\s*<\/loc>/g)].map((m) => decodeEntities(m[1]));
const xmlTag = (xml, tag) => xml.match(new RegExp(`<${tag}>(?:<!\\[CDATA\\[)?([\\s\\S]*?)(?:\\]\\]>)?</${tag}>`))?.[1];
const normUrl = (u) => u.replace(/\/?$/, '/');

/** All items of a paged RSS feed: [{ url, title, date }], plus the channel title. */
async function readFeed(query) {
  const items = [];
  let channel;
  for (let page = 1; page <= 50; page++) {
    let xml;
    try {
      xml = (await http(`${BASE}/?${query}&feed=rss2&paged=${page}`, { as: 'text' })).data;
    } catch (err) {
      if (err.status === 404) break; // past the last page
      throw err;
    }
    channel ??= decodeEntities(xmlTag(xml.split('<item>')[0], 'title'));
    const chunk = xml.split('<item>').slice(1);
    if (!chunk.length) break;
    for (const it of chunk) {
      const url = xmlTag(it, 'link');
      if (!url) continue;
      const pub = xmlTag(it, 'pubDate');
      items.push({ url: normUrl(decodeEntities(url)), title: decodeEntities(xmlTag(it, 'title')), date: pub ? new Date(pub).toISOString().slice(0, 10) : undefined });
    }
  }
  return { channel, items };
}

/**
 * Every published portfolio item, from WordPress core sitemaps and feeds. Unlike the
 * grids, this also finds items no page links to. Returns Map url -> partial entry.
 */
async function discoverFromSitemaps() {
  const found = new Map();
  const get = (url) => {
    if (!found.has(url)) found.set(url, { url, categories: [], categoryLabels: {} });
    return found.get(url);
  };
  let index;
  try {
    index = xmlLocs((await http(`${BASE}/wp-sitemap.xml`, { as: 'text' })).data);
  } catch (err) {
    report.errors.push(`sitemap index failed: ${err.message} (falling back to portfolio grids only)`);
    return found;
  }
  const sitemaps = (re) => index.filter((u) => re.test(new URL(u).pathname));

  for (const sm of sitemaps(/wp-sitemap-posts-portfolio-item-\d+\.xml$/)) {
    for (const url of xmlLocs((await http(sm, { as: 'text' })).data)) get(normUrl(url));
  }

  // Dates (and titles) from the post-type feed.
  const all = await readFeed('post_type=portfolio-item');
  for (const it of all.items) Object.assign(get(it.url), { title: it.title, date: it.date });

  // Category membership from one feed per portfolio-category term.
  const terms = [];
  for (const sm of sitemaps(/wp-sitemap-taxonomies-portfolio-category-\d+\.xml$/)) {
    for (const url of xmlLocs((await http(sm, { as: 'text' })).data)) terms.push(new URL(url).pathname.split('/').filter(Boolean).pop());
  }
  await pool(terms, 4, async (slug) => {
    const feed = await readFeed(`portfolio-category=${encodeURIComponent(slug)}`);
    const label = feed.channel?.replace(/\s+[–—-]\s+[^–—-]+$/, '') || slug.replace(/-/g, ' ');
    for (const it of feed.items) {
      const e = get(it.url);
      if (!e.categories.includes(slug)) e.categories.push(slug);
      e.categoryLabels[slug] = label;
      e.title ??= it.title;
    }
  });
  console.log(`  portfolio-item: ${found.size} in sitemap/feeds, ${terms.length} categories`);
  return found;
}

function discoverPortfolio(pages, listed = new Map()) {
  const found = new Map();
  for (const p of pages) {
    const html = p.content?.rendered || '';
    if (!html.includes('portfolio-item')) continue;
    const root = parse(html);
    const labels = Object.fromEntries(
      root.querySelectorAll('.portfolio-list-filter [data-filter]').map((s) => [s.getAttribute('data-filter').replace(/^\./, ''), s.text.trim()]),
    );
    for (const art of root.querySelectorAll('article.portfolio-item')) {
      const a = art.querySelector('.portfolio-title a');
      if (!a) continue;
      const url = a.getAttribute('href').replace(/\/?$/, '/');
      const ignore = new Set(['portfolio-item', 'all', 'gtc_parent_lazy_loading']);
      const cats = art.classList.value.filter((c) => !ignore.has(c) && !c.startsWith('portfolio_item--') && !c.startsWith('portfolio-column'));
      const img = art.querySelector('img');
      const prev = found.get(url);
      found.set(url, {
        url,
        title: decodeEntities(a.text),
        categories: [...new Set([...(prev?.categories || []), ...cats])],
        categoryLabels: { ...(prev?.categoryLabels || {}), ...Object.fromEntries(cats.map((c) => [c, labels[c] || c.replace(/-/g, ' ')])) },
        cover: prev?.cover || (img && (img.getAttribute('data-src') || img.getAttribute('src'))),
      });
    }
  }

  // Merge in items from the sitemap and feeds. Grid data wins for titles and covers;
  // categories are unioned (the feeds know tags some grids omit, e.g. Reports).
  for (const [url, s] of listed) {
    const g = found.get(url);
    if (!g && !s.title) {
      report.errors.push(`portfolio item without a title in feeds: ${url}`);
      continue;
    }
    found.set(url, {
      url,
      title: g?.title || s.title,
      date: s.date,
      categories: [...new Set([...(g?.categories || []), ...s.categories])],
      categoryLabels: { ...(g?.categoryLabels || {}), ...s.categoryLabels }, // term names beat grid filter labels
      cover: g?.cover,
    });
  }

  // Classify and assign slugs up front so cross-links can be rewritten while converting.
  const entries = [...found.values()];
  for (const e of entries) {
    const labels = Object.values(e.categoryLabels);
    e.kind = labels.some((l) => PEOPLE_TAG.test(l)) ? 'people' : 'projects';
    e.wpSlug = safeDecode(new URL(e.url).pathname.split('/').filter(Boolean).pop());
    e.slug = uniqueSlug(e.kind, '*', entrySlug(e.title, e.wpSlug));
    projectRoutes.set(e.url, e.kind === 'people' ? `/about/#${e.slug}` : `/work/${e.slug}/`);
  }
  return entries;
}

async function importPortfolio(pages) {
  const entries = discoverPortfolio(pages, await discoverFromSitemaps());
  const n = (k) => entries.filter((e) => e.kind === k).length;
  console.log(`  portfolio-item: ${entries.length} discovered (${n('projects')} projects, ${n('people')} people)`);
  await pool(entries, 4, async (entry) => {
    let html;
    try {
      html = (await http(entry.url, { as: 'text' })).data;
    } catch (err) {
      report.errors.push(`portfolio fetch failed: ${entry.url} (${err.message})`);
      return;
    }
    const doc = parse(html);
    const postId = Number((doc.querySelector('body')?.getAttribute('class') || '').match(/postid-(\d+)/)?.[1]) || undefined;
    const htmlLang = (doc.querySelector('html')?.getAttribute('lang') || '').toLowerCase();
    const main = doc.querySelector('main') || doc.querySelector('.site-main');
    main?.querySelectorAll('.gtc_portfolio_title').forEach((n) => n.remove()); // duplicated H2 title
    const { root, images } = cleanHtml(main?.innerHTML || '');
    // Grid thumbnail first; items no grid shows fall back to their first uploaded image.
    const firstUpload = root.querySelectorAll('img').map((i) => i.getAttribute('src')).find(isUpload);
    const cover = entry.cover?.startsWith('http') ? originalOf(entry.cover) : firstUpload && originalOf(firstUpload);
    // The cover usually repeats as the first body image; drop the duplicate.
    if (cover) for (const img of root.querySelectorAll('img')) if (originalOf(img.getAttribute('src')) === cover) { images.delete(img.getAttribute('src')); img.remove(); }
    let body = toMarkdown(root.toString());
    const lang = htmlLang.startsWith('el') ? 'el' : detectLang(entry.url, `${entry.title} ${root.text}`);

    const translations = {};
    for (const link of doc.querySelectorAll('link[rel="alternate"][hreflang]')) {
      const hl = link.getAttribute('hreflang').slice(0, 2);
      if (hl !== lang && hl !== 'x-') translations[hl] = link.getAttribute('href');
    }

    const fields = {
      title: entry.title,
      lang,
      wpId: postId,
      wpType: 'portfolio-item',
      wpSlug: entry.wpSlug,
      wpUrl: entry.url,
      wpCategories: Object.values(entry.categoryLabels),
      cover,
      translations: Object.keys(translations).length ? translations : undefined,
    };
    let seed;
    if (entry.kind === 'people') {
      // Profiles open with the role as a heading: "## Chief Executive Officer / Co-Founder".
      const role = body.match(/^#{1,4}\s+(.+)$/m)?.[1]?.trim();
      if (role) body = body.replace(/^#{1,4}\s+.+\n*/m, '').trim();
      seed = { role, summary: summarise(body) };
    } else {
      fields.date = entry.date;
      fields.programmes = [...new Set(entry.categories.map((c) => programmeLabel(c, `${entry.title} ${root.text}`)).filter(Boolean))];
      seed = { summary: summarise(body), sectors: inferSectors(`${entry.title} ${root.text}`, entry.categories) };
    }

    const res = await writeEntry({ collection: entry.kind, lang, slug: entry.slug, fields, seed, body, images });
    report[entry.kind].push({ title: entry.title, lang, url: entry.url, categories: fields.wpCategories, ...res });
  });
}

// ---------------------------------------------------------------------------
// Stale files: previously imported (has wpUrl) but not produced by this run.
// ---------------------------------------------------------------------------
async function findStale() {
  for (const collection of ['pages', 'posts', 'projects', 'people']) {
    const dir = path.join(CONTENT, collection);
    let files = [];
    try { files = (await fs.readdir(dir, { recursive: true })).filter((f) => f.endsWith('.md')); } catch { continue; }
    for (const f of files) {
      const abs = path.join(dir, f);
      if (written.has(abs)) continue;
      const fm = await readExisting(abs);
      if (!fm?.wpUrl || fm.sync === false) continue; // hand-written or frozen: never touch
      report.stale.push(path.relative(ROOT, abs));
      if (PRUNE && !DRY) await fs.unlink(abs);
    }
  }
}

// ---------------------------------------------------------------------------
// Report
// ---------------------------------------------------------------------------
async function writeReport(startedAt) {
  const kb = (b) => `${(b / 1024).toFixed(0)} KB`;
  const imgs = [...report.images.values()];
  const byLang = (rows) => ['en', 'el'].map((l) => `${rows.filter((r) => r.lang === l).length} ${l.toUpperCase()}`).join(' / ');
  const table = (rows, extra = () => '') =>
    rows
      .sort((a, b) => a.lang.localeCompare(b.lang) || a.title.localeCompare(b.title))
      .map((r) => `| ${r.lang} | ${r.title.replace(/\|/g, '\\|')} | [source](${r.url}) | \`${r.file}\` | ${r.words ?? ''} | ${r.images ?? ''}${r.cover ? ' + cover' : ''} |${extra(r)}`)
      .join('\n');
  const head = (extra = '') => `| Lang | Title | Source | File | Words | Images |${extra}\n|---|---|---|---|---|---|${extra ? '---|' : ''}`;

  const md = `# WordPress import report

Generated ${new Date().toISOString().slice(0, 16).replace('T', ' ')} UTC by \`npm run import:wp\`${DRY ? ' (dry run, nothing written)' : ''} in ${((Date.now() - startedAt) / 1000).toFixed(0)}s.
Source: ${BASE} (WordPress REST API, plus public HTML for the \`portfolio-item\` post type).

| What | Imported | Source |
|---|---|---|
| Pages | ${report.pages.length} (${byLang(report.pages)}) | \`/wp-json/wp/v2/pages\` |
| Posts | ${report.posts.length} (${byLang(report.posts)}) | \`/wp-json/wp/v2/posts\` |
| Projects | ${report.projects.length} (${byLang(report.projects)}) | \`portfolio-item\` (not in REST): listed by \`/wp-sitemap.xml\` and RSS feeds, covers from portfolio grids, fetched as HTML |
| People | ${report.people.length} (${byLang(report.people)}) | \`portfolio-item\` entries tagged Team / Executive Team / Consultants |
| Images | ${imgs.length} files, ${kb(imgs.reduce((n, i) => n + i.bytes, 0))} | ${imgs.filter((i) => !i.cached).length} downloaded this run, ${imgs.filter((i) => i.cached).length} already on disk |
| Skipped | ${report.skipped.length} | see below |
| Stale | ${report.stale.length} | ${PRUNE ? 'deleted (--prune)' : 'kept; rerun with --prune to delete'} |
| Errors | ${report.errors.length} | see below |

Project sectors were inferred from keywords in \`src/data/sectors.json\` and need a human review. The importer never overwrites \`sectors\`, \`summary\` or \`role\` once they exist.

## Projects

${head(' WP tags |')}
${table(report.projects, (r) => ` ${r.categories.join(', ')} |`)}

## People

${head(' WP tags |')}
${table(report.people, (r) => ` ${r.categories.join(', ')} |`)}

## Pages

${head()}
${table(report.pages)}

## Posts

${report.posts.length ? `${head()}\n${table(report.posts)}` : 'The REST API returned no published posts.'}

## Skipped

${report.skipped.map((s) => `- ${s.reason}: ${s.title ? `${s.title} (${decodeURI(s.url)})` : s.file}`).join('\n') || 'None.'}

## Stale files

${report.stale.map((f) => `- \`${f}\``).join('\n') || 'None.'}

## Errors

${report.errors.map((e) => `- ${e}`).join('\n') || 'None.'}
`;
  if (!DRY) {
    await fs.mkdir(path.dirname(REPORT), { recursive: true });
    await fs.writeFile(REPORT, md);
  }
}

// ---------------------------------------------------------------------------
const startedAt = Date.now();
console.log(`Importing from ${BASE}${DRY ? ' (dry run)' : ''}`);
const pages = await importRestType('pages', 'pages');
await importRestType('posts', 'posts');
await importPortfolio(pages);
await Promise.all(imageJobs.values());
await findStale();
await writeReport(startedAt);

const imgs = [...report.images.values()];
console.log(`
Done in ${((Date.now() - startedAt) / 1000).toFixed(0)}s
  pages     ${report.pages.length}
  posts     ${report.posts.length}
  projects  ${report.projects.length}
  people    ${report.people.length}
  images    ${imgs.length} (${(imgs.reduce((n, i) => n + i.bytes, 0) / 1048576).toFixed(1)} MB)
  skipped   ${report.skipped.length}
  stale     ${report.stale.length}${PRUNE ? ' (deleted)' : ''}
  errors    ${report.errors.length}
Report: ${path.relative(ROOT, REPORT)}`);
