// Shared HTML partials for generated pages and for injecting the
// dynamic-section nav/social into the hand-authored static pages.
// Matches the Piano Compass design (same CSS classes, Fraunces + Inter).

export const esc = (s = '') =>
  String(s)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

// ---- Social ---------------------------------------------------------------
const ICONS = {
  instagram: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/></svg>',
  tiktok: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M16.5 3c.3 2.1 1.6 3.7 3.7 4v2.5c-1.4 0-2.7-.4-3.7-1.1v5.8a5.7 5.7 0 1 1-5.7-5.7c.3 0 .6 0 .9.1v2.7a3 3 0 1 0 2.1 2.9V3h2.7z"/></svg>',
  youtube: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M22 8.2a3 3 0 0 0-2.1-2.1C18 5.6 12 5.6 12 5.6s-6 0-7.9.5A3 3 0 0 0 2 8.2 31 31 0 0 0 1.7 12 31 31 0 0 0 2 15.8a3 3 0 0 0 2.1 2.1c1.9.5 7.9.5 7.9.5s6 0 7.9-.5a3 3 0 0 0 2.1-2.1c.3-1.2.3-3.8.3-3.8s0-2.6-.3-3.8zM10 15V9l5.2 3-5.2 3z"/></svg>',
  facebook: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M14 9h3V6h-3c-2 0-3.5 1.5-3.5 3.5V11H8v3h2.5v7h3v-7H16l.5-3h-3V9.8c0-.5.4-.8 1-.8z"/></svg>',
};

const SOCIAL_ORDER = [
  ['instagram_url', 'instagram', 'Instagram'],
  ['tiktok_url', 'tiktok', 'TikTok'],
  ['youtube_url', 'youtube', 'YouTube'],
  ['facebook_url', 'facebook', 'Facebook'],
];

export function socialLinks(social = {}, cls = 'social-icons') {
  const items = SOCIAL_ORDER
    .filter(([key]) => social[key] && String(social[key]).trim())
    .map(([key, icon, label]) =>
      `<a href="${esc(social[key])}" target="_blank" rel="noopener" aria-label="${label}" class="social-icons__link">${ICONS[icon]}</a>`)
    .join('');
  return items ? `<div class="${cls}">${items}</div>` : '';
}

// ---- Nav dropdown for the dynamic "Discover" sections ---------------------
export function discoverDropdown(base = '', active = '') {
  const is = (p) => (active === p ? ' class="active"' : '');
  return `<div class="nav__dropdown nav__discover">
        <a href="${base}insights.html" class="nav__link${active === 'discover' ? ' active' : ''}">Discover</a>
        <ul class="nav__dropdown-menu">
          <li><a href="${base}insights.html"${is('insights')}>Insights &amp; Advice</a></li>
          <li><a href="${base}index.html#piano-of-week">Piano of the Week</a></li>
          <li><a href="${base}instruments.html"${is('instruments')}>New &amp; Interesting</a></li>
          <li><a href="${base}videos.html"${is('videos')}>Videos</a></li>
        </ul>
      </div>`;
}

// ---- Full nav (for generated pages) --------------------------------------
export function nav({ base = '', active = '', social = {} }) {
  return `<nav id="nav">
    <a href="${base}index.html" class="nav__logo" aria-label="Piano Compass home">
      <svg class="nav__logo-mark" viewBox="0 0 32 32" fill="none" aria-hidden="true">
        <circle cx="16" cy="16" r="14" stroke="currentColor" stroke-width="1.6"/>
        <path d="M16 6l3 8-3 12-3-12 3-8z" fill="currentColor"/>
        <circle cx="16" cy="16" r="1.8" fill="var(--bg)"/>
      </svg>
      <span class="nav__logo-text"><b>Piano Compass</b><span>Independent Piano Advisory</span></span>
    </a>
    <button class="nav__toggle" id="nav-toggle" aria-expanded="false" aria-label="Menu">
      <span></span><span></span><span></span>
    </button>
    <div class="nav__menu" id="nav-menu">
      <a href="${base}index.html#finder" class="nav__link">Find Your Piano</a>
      <div class="nav__dropdown">
        <a href="${base}brands.html" class="nav__link${active === 'brands' ? ' active' : ''}">Brands</a>
        <ul class="nav__dropdown-menu">
          <li><a href="${base}brands.html">All Brands We Advise On</a></li>
          <li><a href="${base}collection/luxury.html">Feurich — Featured Partner</a></li>
          <li><a href="${base}vintage.html">Vintage &amp; Pre-Owned</a></li>
        </ul>
      </div>
      <a href="${base}vintage.html" class="nav__link${active === 'vintage' ? ' active' : ''}">Vintage</a>
      ${discoverDropdown(base, active)}
      <a href="${base}services.html" class="nav__link${active === 'services' ? ' active' : ''}">Services</a>
      <a href="${base}about.html" class="nav__link${active === 'about' ? ' active' : ''}">About</a>
      <a href="${base}contact.html" class="nav__link${active === 'contact' ? ' active' : ''}">Contact</a>
      <div class="nav__utils">
        ${socialLinks(social, 'social-icons social-icons--nav')}
        <button class="nav__theme" id="theme-toggle" type="button" aria-label="Toggle light or dark theme">
          <svg class="icon-sun" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"><circle cx="12" cy="12" r="4.2"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>
          <svg class="icon-moon" viewBox="0 0 24 24" fill="currentColor"><path d="M21 12.8A8.5 8.5 0 1 1 11.2 3a6.7 6.7 0 0 0 9.8 9.8z"/></svg>
        </button>
        <a href="${base}contact.html" class="nav__book">Book a Consultation</a>
      </div>
    </div>
  </nav>`;
}

// ---- Full footer (for generated pages) -----------------------------------
export function footer({ base = '', social = {} }) {
  const s = socialLinks(social, 'social-icons social-icons--footer');
  return `<footer>
    <div class="container">
      <div class="footer__grid">
        <div class="footer__brand">
          <div class="footer__brand-logo">
            <svg viewBox="0 0 32 32" fill="none" aria-hidden="true"><circle cx="16" cy="16" r="14" stroke="currentColor" stroke-width="1.6"/><path d="M16 6l3 8-3 12-3-12 3-8z" fill="currentColor"/></svg>
            <b>Piano Compass</b>
          </div>
          <div class="footer__brand-sub">Independent Piano Advisory</div>
          <p class="footer__tagline">Independent, accredited and impartial — a source of truth for your whole piano-owning journey.</p>
          ${s}
        </div>
        <div>
          <p class="footer__col-title">Explore</p>
          <ul class="footer__links">
            <li><a href="${base}index.html#finder">Find Your Piano</a></li>
            <li><a href="${base}brands.html">Brands</a></li>
            <li><a href="${base}vintage.html">Vintage</a></li>
            <li><a href="${base}index.html#process">Our Process</a></li>
          </ul>
        </div>
        <div>
          <p class="footer__col-title">Discover</p>
          <ul class="footer__links">
            <li><a href="${base}insights.html">Insights &amp; Advice</a></li>
            <li><a href="${base}instruments.html">New &amp; Interesting</a></li>
            <li><a href="${base}videos.html">Videos</a></li>
            <li><a href="${base}about.html">About</a></li>
          </ul>
        </div>
        <div>
          <p class="footer__col-title">Contact</p>
          <ul class="footer__links">
            <li><a href="tel:+34911234567">+34 91 123 4567</a></li>
            <li><a href="mailto:hello@pianocompass.com">hello@pianocompass.com</a></li>
            <li style="margin-top:.4rem"><span style="font-size:.8rem;color:var(--muted)">Spain · Portugal · Worldwide by video</span></li>
          </ul>
        </div>
      </div>
      <div class="footer__bottom">
        <p class="footer__copyright">© 2026 Piano Compass. All rights reserved.</p>
        <div class="footer__legal">
          <a href="#">Privacy</a>
          <a href="#">Terms</a>
          <a href="https://feurich.com" target="_blank" rel="noopener">Feurich</a>
        </div>
      </div>
      <p class="footer__disclaimer">Piano Compass is an independent advisory. Brand names are the property of their respective owners and are referenced for identification only; mention does not imply endorsement or affiliation, except where a partnership is stated.</p>
    </div>
  </footer>`;
}

// ---- Full page shell -----------------------------------------------------
export function pageShell({ title, description = '', base = '', active = '', social = {}, body = '', bodyClass = '' }) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="base-path" content="${base}">
  <title>${esc(title)} — Piano Compass</title>
  <meta name="description" content="${esc(description)}">
  <meta property="og:title" content="${esc(title)} — Piano Compass">
  <meta property="og:description" content="${esc(description)}">
  <meta property="og:type" content="website">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300..600;1,9..144,300..500&family=Inter:wght@300;400;500;600&display=swap" rel="stylesheet">
  <script>try{var t=localStorage.getItem('fi_theme');if(t==='dark')document.documentElement.dataset.theme='dark';}catch(e){}</script>
  <link rel="stylesheet" href="${base}css/style.css">
</head>
<body${bodyClass ? ` class="${bodyClass}"` : ''}>
  ${nav({ base, active, social })}
  ${body}
  ${footer({ base, social })}
  <script src="${base}js/i18n.js"></script>
  <script src="${base}js/main.js"></script>
  <script src="${base}js/theme.js"></script>
</body>
</html>`;
}
