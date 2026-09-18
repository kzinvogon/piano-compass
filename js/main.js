document.addEventListener('DOMContentLoaded', () => {
  I18n.init();
  preloadImages();
  initNav();
  initScrollReveal();
  initCounters();
  initMobileMenu();
  initInterestPrefill();
});

// Pre-select the contact form's "Area of Interest" from a ?interest= link
// (e.g. the "commission" CTA links to contact.html?interest=custom)
function initInterestPrefill() {
  const select = document.getElementById('interest');
  if (!select) return;
  const interest = new URLSearchParams(window.location.search).get('interest');
  if (interest && [...select.options].some(o => o.value === interest)) {
    select.value = interest;
  }
}

function preloadImages() {
  const base = document.querySelector('meta[name="base-path"]')?.content || '';
  [
    'images/self-playing-sunburst.jpeg',
    'images/self-playing-walnut.jpeg',
    'images/self-playing-lifestyle.jpeg',
    'images/self-playing-studio.jpeg',
    'images/luxury-grand-blue.jpeg',
    'images/custom-mosaic-upright.jpeg',
    'images/custom-grand-mosaic.jpeg',
  ].forEach(src => {
    const img = new Image();
    img.src = base + src;
  });
}

function initNav() {
  const nav = document.getElementById('nav');
  let lastScroll = 0;

  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    nav.classList.toggle('nav--scrolled', y > 60);
    nav.classList.toggle('nav--hidden', y > lastScroll + 10 && y > 200);
    nav.classList.toggle('nav--visible', y < lastScroll - 10);
    lastScroll = y;
  }, { passive: true });

  // Smooth scroll for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const target = document.querySelector(a.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        closeMobileMenu();
      }
    });
  });

  // Active nav highlight
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav__link[href^="#"]');
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navLinks.forEach(l => l.classList.remove('active'));
        const link = document.querySelector(`.nav__link[href="#${entry.target.id}"]`);
        if (link) link.classList.add('active');
      }
    });
  }, { threshold: 0.3 });
  sections.forEach(s => observer.observe(s));
}

function initMobileMenu() {
  const toggle = document.getElementById('nav-toggle');
  const menu = document.getElementById('nav-menu');
  if (!toggle) return;
  toggle.addEventListener('click', () => {
    const open = menu.classList.toggle('open');
    toggle.setAttribute('aria-expanded', open);
    document.body.classList.toggle('menu-open', open);
  });
}

function closeMobileMenu() {
  const menu = document.getElementById('nav-menu');
  const toggle = document.getElementById('nav-toggle');
  if (menu) {
    menu.classList.remove('open');
    document.body.classList.remove('menu-open');
    if (toggle) toggle.setAttribute('aria-expanded', false);
  }
}

function initScrollReveal() {
  const items = document.querySelectorAll('[data-reveal]');
  if (!items.length) return;
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.05, rootMargin: '0px 0px 300px 0px' });
  items.forEach(el => observer.observe(el));

  // Reveal elements already visible in viewport on load (prevents blank images)
  requestAnimationFrame(() => {
    items.forEach(el => {
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight && rect.bottom > 0) {
        el.classList.add('revealed');
        observer.unobserve(el);
      }
    });
  });
}

function initCounters() {
  const counters = document.querySelectorAll('[data-count]');
  if (!counters.length) return;
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = el.dataset.count;
        if (target === '∞') { el.textContent = '∞'; return; }
        const num = parseInt(target, 10);
        const duration = 1500;
        const start = performance.now();
        const update = (now) => {
          const t = Math.min((now - start) / duration, 1);
          el.textContent = Math.round(t * num);
          if (t < 1) requestAnimationFrame(update);
          else el.textContent = target;
        };
        requestAnimationFrame(update);
        observer.unobserve(el);
      }
    });
  }, { threshold: 0.5 });
  counters.forEach(el => observer.observe(el));
}

// Contact form handling
const contactForm = document.getElementById('contact-form');
if (contactForm) {
  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = contactForm.querySelector('[type="submit"]');
    btn.disabled = true;
    btn.textContent = '…';
    // Replace with real endpoint / Formspree / Netlify forms
    await new Promise(r => setTimeout(r, 1200));
    contactForm.innerHTML = `
      <div class="form-success">
        <svg width="48" height="48" viewBox="0 0 48 48" fill="none" style="margin:0 auto 1.2rem;color:var(--pine)">
          <circle cx="24" cy="24" r="23" stroke="currentColor" stroke-width="2"/>
          <path d="M14 24l7 7 13-14" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        <p data-i18n="contact.successMsg">Thank you. We will be in touch shortly.</p>
      </div>`;
    if (typeof I18n !== 'undefined') I18n.init && document.querySelectorAll('[data-i18n]').forEach(el => {
      const val = I18n.resolve(el.dataset.i18n);
      if (val !== el.dataset.i18n) el.textContent = val;
    });
  });
}
