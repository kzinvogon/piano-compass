// Piano Compass content generator.
//
// Reads content/ (pianos, insights, videos, settings), renders indexable
// HTML section pages, and injects the "Discover" nav + social links + the
// homepage dynamic blocks into the hand-authored static pages.
//
// Run by Netlify (`npm run build`) on every deploy; content is edited in
// Pages CMS (see .pages.yml), which commits to content/ and triggers a rebuild.

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import matter from 'gray-matter';
import { marked } from 'marked';
import { pageShell, socialLinks, nav, footer, esc } from './partials.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = (p) => fs.readFileSync(path.join(ROOT, p), 'utf8');
const write = (p, s) => { fs.mkdirSync(path.dirname(path.join(ROOT, p)), { recursive: true }); fs.writeFileSync(path.join(ROOT, p), s); };
const exists = (p) => fs.existsSync(path.join(ROOT, p));

// ---- load content ---------------------------------------------------------
function loadCollection(dir) {
  const abs = path.join(ROOT, dir);
  if (!fs.existsSync(abs)) return [];
  return fs.readdirSync(abs)
    .filter((f) => f.endsWith('.md'))
    .map((f) => {
      const { data, content } = matter(read(path.join(dir, f)));
      // Pages CMS stores a markdown body field either as the file body or,
      // for some field setups, as a frontmatter `body:` — accept both.
      return { slug: f.replace(/\.md$/, ''), ...data, body: (content.trim() || data.body || '') };
    })
    .filter((e) => e.status !== 'draft')
    .sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0));
}

const pianos = loadCollection('content/pianos');
const insights = loadCollection('content/insights');
const videos = loadCollection('content/videos');
const social = exists('content/settings/social.json')
  ? JSON.parse(read('content/settings/social.json')) : {};

const fmtDate = (d) => d ? new Date(d).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }) : '';

// ---- YouTube helper -------------------------------------------------------
function ytId(url = '') {
  const s = String(url).trim();
  let m = s.match(/(?:v=|youtu\.be\/|embed\/)([A-Za-z0-9_-]{11})/);
  if (m) return m[1];
  if (/^[A-Za-z0-9_-]{11}$/.test(s)) return s;
  return '';
}

function vimeoId(url = '') {
  const s = String(url).trim();
  const m = s.match(/vimeo\.com\/(?:video\/)?(\d+)/);
  if (m) return m[1];
  if (/^\d{6,}$/.test(s)) return s;
  return '';
}

// ---- component renderers --------------------------------------------------
function instrumentCard(p, base = '') {
  const badge = [p.constructor, p.year].filter(Boolean).join(' · ');
  const specs = [p.type, p.category].filter(Boolean).join(' · ');
  const img = p.image ? `<div class="instrument-card__img"><img src="${base}${esc(p.image)}" alt="${esc(p.title)}" loading="lazy"></div>` : '';
  return `<article class="instrument-card">
    ${img}
    <div class="instrument-card__body">
      ${badge ? `<span class="instrument-card__badge">${esc(badge)}</span>` : ''}
      <h3>${esc(p.title)}</h3>
      ${specs ? `<p class="instrument-card__specs">${esc(specs)}</p>` : ''}
      ${p.excerpt ? `<p>${esc(p.excerpt)}</p>` : ''}
      <div class="instrument-card__foot">
        ${p.price ? `<span class="instrument-card__price">${esc(p.price)}</span>` : '<span></span>'}
        <a class="btn--ghost" href="${base}contact.html?piano=${encodeURIComponent(p.slug)}">Enquire</a>
      </div>
    </div>
  </article>`;
}

function postCard(a, base = '') {
  const img = a.image ? `<div class="post-card__img"><img src="${base}${esc(a.image)}" alt="${esc(a.title)}" loading="lazy"></div>` : '';
  return `<a class="post-card" href="${base}insights/${esc(a.slug)}.html">
    ${img}
    <div class="post-card__body">
      <span class="post-card__meta">${esc(fmtDate(a.date))}${a.author ? ' · ' + esc(a.author) : ''}</span>
      <h3>${esc(a.title)}</h3>
      ${a.excerpt ? `<p>${esc(a.excerpt)}</p>` : ''}
      <span class="post-card__cta">Read more</span>
    </div>
  </a>`;
}

const isAbs = (u = '') => /^(https?:)?\/\//.test(String(u));
const withBase = (u, base) => (isAbs(u) ? u : base + u);

function videoCard(v, base = '') {
  const id = ytId(v.youtube);
  const vid = vimeoId(v.vimeo);
  const mp4 = v.video_file || v.video_url; // uploaded path or external URL
  const posterAttr = v.poster ? ` poster="${withBase(esc(v.poster), base)}"` : '';

  let thumb, tag = 'div', attrs = '', play = '';
  if (id) {
    // YouTube: thumbnail links out to the video
    tag = 'a';
    attrs = ` href="https://www.youtube.com/watch?v=${id}" target="_blank" rel="noopener"`;
    play = '<span class="video-card__play" aria-hidden="true">▶</span>';
    thumb = `<img src="https://img.youtube.com/vi/${id}/hqdefault.jpg" alt="${esc(v.title)}" loading="lazy">`;
  } else if (vid) {
    // Vimeo: inline iframe player
    thumb = `<iframe class="video-card__embed" src="https://player.vimeo.com/video/${vid}" title="${esc(v.title)}" loading="lazy" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen></iframe>`;
  } else if (mp4) {
    // Self-hosted / linked MP4: inline HTML5 player
    thumb = `<video class="video-card__video" controls preload="metadata"${posterAttr}>
        <source src="${withBase(esc(mp4), base)}" type="video/mp4">
        Your browser doesn't support embedded video.
      </video>`;
  } else {
    thumb = `<div class="video-card__placeholder"><span>Add a YouTube link or upload an MP4 in the CMS</span></div>`;
  }

  return `<${tag} class="video-card"${attrs}>
    <div class="video-card__thumb">
      ${thumb}
      ${play}
    </div>
    <div class="video-card__body">
      <h3>${esc(v.title)}</h3>
      ${v.description ? `<p>${esc(v.description)}</p>` : ''}
      <span class="video-card__meta">${esc(fmtDate(v.date))}</span>
    </div>
  </${tag}>`;
}

function sectionHead(eyebrow, title, lead = '', center = true) {
  return `<div class="section-head ${center ? 'section-head--center' : ''}">
      <p class="eyebrow ${center ? 'eyebrow--center' : ''}">${esc(eyebrow)}</p>
      <h2>${esc(title)}</h2>
      ${lead ? `<p class="lead" style="margin-top:1rem">${esc(lead)}</p>` : ''}
    </div>`;
}

// ---- page: Insights index -------------------------------------------------
function buildInsightsIndex() {
  const cards = insights.length
    ? insights.map((a) => postCard(a, '')).join('\n')
    : `<p class="muted-note">No articles yet — publish the first one.</p>`;
  const body = `<main>
    <section class="sub-hero">
      <div class="container sub-hero__content">
        <p class="eyebrow">Insights &amp; Advice</p>
        <h1>Guidance for your piano journey</h1>
        <p class="lead" style="margin-top:1.2rem;max-width:60ch">Impartial articles on choosing, owning and caring for a piano — new and vintage.</p>
      </div>
    </section>
    <section class="section">
      <div class="container">
        <div class="card-grid">${cards}</div>
      </div>
    </section>
  </main>`;
  write('insights.html', pageShell({ title: 'Insights & Advice', description: 'Impartial articles on choosing, owning and caring for a piano — new and vintage.', active: 'insights', social, body }));
}

// ---- page: single article -------------------------------------------------
function buildArticles() {
  for (const a of insights) {
    const hero = a.image ? `<div class="article__hero"><img src="../${esc(a.image)}" alt="${esc(a.title)}"></div>` : '';
    const body = `<main class="article">
      <div class="container container--narrow">
        <a class="article__back" href="../insights.html">← All insights</a>
        <p class="article__meta">${esc(fmtDate(a.date))}${a.author ? ' · ' + esc(a.author) : ''}</p>
        <h1>${esc(a.title)}</h1>
        ${a.excerpt ? `<p class="lead article__excerpt">${esc(a.excerpt)}</p>` : ''}
        ${hero}
        <div class="prose">${marked.parse(a.body || '')}</div>
        <div class="article__cta">
          <a class="btn btn--gold" href="../contact.html">Book a consultation</a>
        </div>
      </div>
    </main>`;
    write(`insights/${a.slug}.html`, pageShell({ title: a.title, description: a.excerpt || '', base: '../', active: 'insights', social, body }));
  }
}

// ---- page: New & interesting instruments ---------------------------------
function buildInstruments() {
  const list = pianos.filter((p) => (p.section || 'instruments') === 'instruments');
  const cards = list.length
    ? list.map((p) => instrumentCard(p, '')).join('\n')
    : `<p class="muted-note">No instruments yet — add one.</p>`;
  const body = `<main>
    <section class="sub-hero">
      <div class="container sub-hero__content">
        <p class="eyebrow">New &amp; Interesting Instruments</p>
        <h1>Pianos worth a closer look</h1>
        <p class="lead" style="margin-top:1.2rem;max-width:60ch">A rotating selection of new arrivals, restored vintage instruments and pieces we think are special — each independently assessed.</p>
      </div>
    </section>
    <section class="section">
      <div class="container">
        <div class="card-grid card-grid--instruments">${cards}</div>
      </div>
    </section>
  </main>`;
  write('instruments.html', pageShell({ title: 'New & Interesting Instruments', description: 'New arrivals, restored vintage instruments and special pieces — each independently assessed.', active: 'instruments', social, body }));
}

// ---- page: Videos ---------------------------------------------------------
function buildVideos() {
  const cards = videos.length
    ? videos.map((v) => videoCard(v, '')).join('\n')
    : `<p class="muted-note">No videos yet — add one.</p>`;
  const followRow = socialLinks(social, 'social-icons social-icons--big');
  const body = `<main>
    <section class="sub-hero">
      <div class="container sub-hero__content">
        <p class="eyebrow">Videos</p>
        <h1>Watch &amp; learn</h1>
        <p class="lead" style="margin-top:1.2rem;max-width:60ch">Walkthroughs, comparisons and behind-the-scenes from the workshop and showroom.</p>
        ${followRow ? `<div style="margin-top:1.6rem">${followRow}</div>` : ''}
      </div>
    </section>
    <section class="section">
      <div class="container">
        <div class="card-grid card-grid--videos">${cards}</div>
      </div>
    </section>
  </main>`;
  write('videos.html', pageShell({ title: 'Videos', description: 'Walkthroughs, comparisons and behind-the-scenes from the workshop and showroom.', active: 'videos', social, body }));
}

// ---- homepage dynamic block ----------------------------------------------
function homeDynamicHtml() {
  const potwSlug = social.piano_of_the_week;
  const potw = pianos.find((p) => p.slug === potwSlug) || pianos.find((p) => p.featured) || pianos[0];
  const latestInsights = insights.slice(0, 2);
  const latestVideos = videos.slice(0, 2);

  const potwBlock = potw ? `
  <section class="section section--tint" id="piano-of-week">
    <div class="container">
      ${sectionHead('Piano of the week', 'This week\'s pick', '', false)}
      <div class="potw" style="margin-top:2rem">
        <div class="potw__media">${potw.image ? `<img src="${esc(potw.image)}" alt="${esc(potw.title)}">` : ''}</div>
        <div class="potw__body">
          <span class="instrument-card__badge">${esc([potw.constructor, potw.year].filter(Boolean).join(' · '))}</span>
          <h3>${esc(potw.title)}</h3>
          <p class="potw__specs">${esc([potw.type, potw.category].filter(Boolean).join(' · '))}</p>
          <p>${esc(potw.excerpt || '')}</p>
          <div class="potw__foot">
            ${potw.price ? `<span class="instrument-card__price">${esc(potw.price)}</span>` : '<span></span>'}
            <a class="btn btn--gold" href="contact.html?piano=${encodeURIComponent(potw.slug)}">Enquire about this piano</a>
          </div>
        </div>
      </div>
    </div>
  </section>` : '';

  const insightsBlock = latestInsights.length ? `
  <section class="section" id="latest-insights">
    <div class="container">
      <div class="section-head" style="display:flex;justify-content:space-between;align-items:flex-end;gap:1rem;flex-wrap:wrap">
        <div><p class="eyebrow">Insights &amp; advice</p><h2>From the journal</h2></div>
        <a class="btn--ghost" href="insights.html">All insights</a>
      </div>
      <div class="card-grid" style="margin-top:2.4rem">${latestInsights.map((a) => postCard(a, '')).join('\n')}</div>
    </div>
  </section>` : '';

  const videosBlock = latestVideos.length ? `
  <section class="section section--tint" id="latest-videos">
    <div class="container">
      <div class="section-head" style="display:flex;justify-content:space-between;align-items:flex-end;gap:1rem;flex-wrap:wrap">
        <div><p class="eyebrow">Videos</p><h2>Watch &amp; learn</h2></div>
        <a class="btn--ghost" href="videos.html">All videos</a>
      </div>
      <div class="card-grid card-grid--videos" style="margin-top:2.4rem">${latestVideos.map((v) => videoCard(v, '')).join('\n')}</div>
    </div>
  </section>` : '';

  return `${potwBlock}${insightsBlock}${videosBlock}`;
}

// ---- inject into hand-authored static pages ------------------------------
// [file, base, activeNavKey]
const STATIC = [
  ['index.html', '', ''], ['about.html', '', 'about'], ['services.html', '', 'services'],
  ['contact.html', '', 'contact'], ['gallery.html', '', ''], ['brands.html', '', 'brands'],
  ['vintage.html', '', 'used'],
  ['collection/luxury.html', '../', 'brands'], ['collection/self-playing.html', '../', 'brands'],
  ['collection/grand-uprights.html', '../', 'used'], ['collection/custom-design.html', '../', 'design'],
];

function injectStatic() {
  for (const [file, base, active] of STATIC) {
    if (!exists(file)) continue;
    let s = read(file);

    // Replace the whole nav and footer with the shared partials (single
    // source of truth for menu structure, languages and social links).
    s = s.replace(/<nav id="nav">[\s\S]*?<\/nav>/, () => nav({ base, active, social }));
    s = s.replace(/<footer>[\s\S]*?<\/footer>/, () => footer({ base, social }));

    // Homepage dynamic block between markers
    if (file === 'index.html' && s.includes('<!-- GEN:home-dynamic -->')) {
      s = s.replace(/<!-- GEN:home-dynamic -->[\s\S]*?<!-- \/GEN:home-dynamic -->/,
        () => `<!-- GEN:home-dynamic -->\n${homeDynamicHtml()}\n  <!-- /GEN:home-dynamic -->`);
    }
    write(file, s);
  }
}

// ---- run ------------------------------------------------------------------
buildInsightsIndex();
buildArticles();
buildInstruments();
buildVideos();
injectStatic();

console.log(`[generate] pianos=${pianos.length} insights=${insights.length} videos=${videos.length}`);
console.log('[generate] wrote insights.html, insights/*, instruments.html, videos.html; injected nav/social/home blocks');
