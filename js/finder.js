/* Best-fit finder — a lightweight, client-side consultative shortlist.
   Reads the piano library (data/pianos.json, generated from content/pianos)
   and returns up to 5 matching instruments the visitor can choose from.
   Per issue #4: results inlay -> chooser -> select = thank + CTA;
   no selection = go back to the wizard. No backend. */
(function () {
  const root = document.querySelector('.finder');
  if (!root) return;

  const steps    = [...root.querySelectorAll('.finder__step')];
  const progress = [...root.querySelectorAll('.finder__progress span')];
  const resultEl = root.querySelector('[data-result]');
  const titleEl  = root.querySelector('[data-result-title]');
  const textEl   = root.querySelector('[data-result-text]');
  const listEl   = root.querySelector('[data-result-list]');
  const footEl   = root.querySelector('[data-result-foot]');
  const backBtn  = root.querySelector('[data-back]');
  const restartBtn = root.querySelector('[data-restart]');

  const answers = [];
  let index = 0;
  let library = [];
  const chosen = new Map(); // slug -> piano (supports multiple selection)

  // Load the piano library (path-aware for pages served from subfolders).
  const base = document.querySelector('meta[name="base-path"]')?.content || '';
  fetch(`${base}data/pianos.json`)
    .then((r) => r.ok ? r.json() : [])
    .then((data) => { library = Array.isArray(data) ? data : []; })
    .catch(() => { library = []; });

  function t(key, fallback) {
    if (typeof I18n !== 'undefined' && I18n.resolve) {
      const v = I18n.resolve(key);
      if (v !== key) return v;
    }
    return fallback;
  }

  function esc(s = '') {
    return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;')
      .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  function show(i) {
    steps.forEach((s, n) => s.classList.toggle('active', n === i && !resultEl.classList.contains('active')));
    progress.forEach((p, n) => p.classList.toggle('on', n <= i));
    backBtn.hidden = i === 0;
  }

  function select(step, value) {
    answers[step] = value;
    if (step < steps.length - 1) {
      index = step + 1;
      show(index);
    } else {
      renderResults();
    }
  }

  steps.forEach((step, n) => {
    step.querySelectorAll('.finder__opt').forEach((opt) => {
      opt.addEventListener('click', () => {
        step.querySelectorAll('.finder__opt').forEach((o) => o.classList.remove('selected'));
        opt.classList.add('selected');
        setTimeout(() => select(n, opt.dataset.value), 160);
      });
    });
  });

  backBtn.addEventListener('click', () => {
    if (resultEl.classList.contains('active')) {
      resultEl.classList.remove('active');
      restartBtn.hidden = true;
      show(index);
      return;
    }
    if (index > 0) { index--; show(index); }
  });

  restartBtn.addEventListener('click', () => {
    answers.length = 0;
    index = 0;
    chosen.clear();
    resultEl.classList.remove('active');
    restartBtn.hidden = true;
    steps.forEach((s) => s.querySelectorAll('.finder__opt').forEach((o) => o.classList.remove('selected')));
    show(0);
  });

  // ---- matching ------------------------------------------------------------
  function kindOk(p, kind) {
    if (kind === 'selfplay') return !!p.self_playing;
    if (kind === 'used') return ['Used', 'Restored', 'Pre-owned'].includes(p.category);
    if (kind === 'new') return p.category === 'New';
    return true; // 'either'
  }

  function score(p, who, space, priority) {
    let s = 0;
    if ((p.fits_who || []).includes(who)) s += 3;
    if ((p.fits_space || []).includes(space)) s += 2;
    if ((p.priority || []).includes(priority)) s += 2;
    if (space === 'apartment' && p.type === 'Grand') s -= 4;
    if (space === 'public' && p.type === 'Upright') s -= 2;
    if (space === 'large' && p.type === 'Grand') s += 1;
    if (who === 'venue' && p.type === 'Grand') s += 1;
    if (who === 'beginner' && p.type === 'Upright') s += 1;
    return s;
  }

  function shortlist(who, space, kind, priority) {
    let pool = library.filter((p) => kindOk(p, kind));
    let note = '';
    if (!pool.length) {
      pool = library.slice();
      note = kind === 'used'
        ? t('finder.usedNote', "We don't have verified used instruments listed yet — here are the closest new options. We can source and independently verify a used piano for you.")
        : t('finder.noneNote', "Here are the closest options — a short consultation will refine the shortlist.");
    }
    const ranked = pool
      .map((p) => ({ p, s: score(p, who, space, priority) }))
      .sort((a, b) => b.s - a.s)
      .slice(0, 5)
      .map((x) => x.p);
    return { ranked, note };
  }

  // ---- rendering -----------------------------------------------------------
  function card(p) {
    const badge = [p.constructor, p.size].filter(Boolean).join(' · ');
    const img = p.image
      ? `<div class="finder-card__img"><img src="${esc(p.image)}" alt="${esc(p.title)}" loading="lazy"></div>`
      : '<div class="finder-card__img finder-card__img--none"></div>';
    return `<button type="button" class="finder-card" data-slug="${esc(p.slug)}">
      ${img}
      <div class="finder-card__body">
        ${badge ? `<span class="finder-card__badge">${esc(badge)}</span>` : ''}
        <h4>${esc(p.title)}</h4>
        ${p.excerpt ? `<p>${esc(p.excerpt)}</p>` : ''}
        <span class="finder-card__price">${esc(p.price || '')}</span>
        <span class="finder-card__pick" data-i18n="finder.pick">Choose this piano</span>
      </div>
    </button>`;
  }

  function renderResults() {
    chosen.clear();
    const [who, space, kind, priority] = answers;

    titleEl.textContent = t('finder.resultTitle', 'Your best-fit shortlist');

    if (!library.length) {
      textEl.textContent = t('finder.libEmpty', 'Book a consultation and we will build your shortlist personally.');
      listEl.innerHTML = '';
      footEl.innerHTML = `<a class="btn btn--gold" href="${base}contact.html">${esc(t('finder.resultCta', 'Book a consultation'))}</a>`;
    } else {
      const { ranked, note } = shortlist(who, space, kind, priority);
      textEl.textContent = t('finder.baseText', 'Based on your answers, here are the instruments that fit best. Choose one to continue — or go back to change your answers.') + (note ? ' ' + note : '');
      listEl.innerHTML = ranked.map(card).join('');
      footEl.innerHTML = `<p class="finder__hintline">${esc(t('finder.chooseHint', 'Select a piano to continue, or go back to adjust your answers.'))}</p>`;

      listEl.querySelectorAll('.finder-card').forEach((el) => {
        el.addEventListener('click', () => {
          const slug = el.dataset.slug;
          if (chosen.has(slug)) { chosen.delete(slug); el.classList.remove('selected'); el.setAttribute('aria-pressed', 'false'); }
          else { chosen.set(slug, ranked.find((p) => p.slug === slug)); el.classList.add('selected'); el.setAttribute('aria-pressed', 'true'); }
          renderChosen();
        });
      });
    }

    steps.forEach((s) => s.classList.remove('active'));
    resultEl.classList.add('active');
    progress.forEach((p) => p.classList.add('on'));
    backBtn.hidden = false;
    restartBtn.hidden = false;
    if (typeof I18n !== 'undefined' && I18n.apply) I18n.apply();
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  function renderChosen() {
    if (chosen.size === 0) {
      footEl.innerHTML = `<p class="finder__hintline">${esc(t('finder.chooseHint', 'Select one or more pianos to continue, or go back to adjust your answers.'))}</p>`;
      return;
    }
    const list = [...chosen.values()];
    const names = list.map((p) => p.title);
    const and = t('finder.and', 'and');
    const namesStr = names.length === 1
      ? names[0]
      : names.slice(0, -1).join(', ') + ' ' + and + ' ' + names[names.length - 1];
    const prefix = list.length === 1
      ? t('finder.chosenPrefixOne', 'Great choice — the')
      : t('finder.chosenPrefixMany', 'Great shortlist —');
    const thanks = t('finder.chosenThanks', ". We'll tailor our advice around your shortlist. Book a no-obligation consultation and we'll compare them honestly for you.");
    const cta = list.length === 1
      ? t('finder.chosenCtaOne', 'Book a consultation about this piano')
      : t('finder.chosenCtaMany', 'Book a consultation about your shortlist');
    const slugs = list.map((p) => p.slug).join(',');
    footEl.innerHTML = `<p class="finder__chosen">${esc(prefix)} <b>${esc(namesStr)}</b>${esc(thanks)}</p>
      <a class="btn btn--gold" href="${base}contact.html?piano=${encodeURIComponent(slugs)}">${esc(cta)}</a>`;
    footEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  show(0);
})();
