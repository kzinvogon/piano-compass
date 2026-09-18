/* Best-fit finder — a lightweight, client-side consultative shortlist.
   No backend: it maps answers to a recommended starting point and
   nudges the visitor toward a real consultation. */
(function () {
  const root = document.querySelector('.finder');
  if (!root) return;

  const steps   = [...root.querySelectorAll('.finder__step')];
  const progress = [...root.querySelectorAll('.finder__progress span')];
  const resultEl = root.querySelector('[data-result]');
  const titleEl  = root.querySelector('[data-result-title]');
  const textEl   = root.querySelector('[data-result-text]');
  const tagsEl   = root.querySelector('[data-result-tags]');
  const backBtn  = root.querySelector('[data-back]');
  const restartBtn = root.querySelector('[data-restart]');

  const answers = [];
  let index = 0;

  function t(key, fallback) {
    if (typeof I18n !== 'undefined' && I18n.resolve) {
      const v = I18n.resolve(key);
      if (v !== key) return v;
    }
    return fallback;
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
      renderResult();
    }
  }

  steps.forEach((step, n) => {
    step.querySelectorAll('.finder__opt').forEach(opt => {
      opt.addEventListener('click', () => {
        step.querySelectorAll('.finder__opt').forEach(o => o.classList.remove('selected'));
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
    resultEl.classList.remove('active');
    restartBtn.hidden = true;
    steps.forEach(s => s.querySelectorAll('.finder__opt').forEach(o => o.classList.remove('selected')));
    show(0);
  });

  function renderResult() {
    const [who, space, kind, priority] = answers;

    // Recommend an instrument category
    let title, key;
    if (space === 'apartment' || (who === 'beginner' && space !== 'large')) {
      key = 'upright'; title = t('finderResult.upright', 'A quality upright piano');
    } else if (space === 'public' || who === 'venue' || space === 'large') {
      key = 'grand'; title = t('finderResult.grand', 'A grand piano sized to the room');
    } else if (who === 'advanced') {
      key = 'grandOrTall'; title = t('finderResult.grandOrTall', 'A tall upright or compact grand');
    } else {
      key = 'upright'; title = t('finderResult.midUpright', 'A refined mid-to-tall upright');
    }

    // Body copy adapts to the "new vs vintage" choice + priority
    let body = t('finderResult.baseText',
      'Based on your answers, here is a sensible starting point. A short consultation will refine it into a specific shortlist of makes and models.');
    if (kind === 'vintage') body += ' ' + t('finderResult.vintageAdd', 'A verified vintage instrument could offer excellent value here — we would inspect condition before you commit.');
    if (kind === 'selfplay') body += ' ' + t('finderResult.selfAdd', 'We would also look at self-playing-capable models such as Feurich with integrated systems.');
    if (priority === 'value') body += ' ' + t('finderResult.valueAdd', 'We will weight the shortlist toward the best value for your budget, new or pre-owned.');
    if (priority === 'longevity') body += ' ' + t('finderResult.longevityAdd', 'We will favour makers with strong build quality and resale value.');

    // Suggested brands / directions
    const tagMap = {
      value:     ['Yamaha', 'Kawai', 'Feurich', t('finderResult.tagVintage', 'Verified vintage')],
      tone:      ['Feurich', 'Blüthner', 'Bösendorfer', 'Bechstein'],
      design:    ['Feurich bespoke', 'Custom finishes', 'Steinway'],
      longevity: ['Steinway', 'Yamaha', 'Kawai', 'Feurich'],
    };
    const tags = tagMap[priority] || ['Feurich', 'Yamaha', 'Kawai'];

    titleEl.textContent = title;
    textEl.textContent = body;
    tagsEl.innerHTML = '';
    tags.forEach(tag => {
      const s = document.createElement('span');
      s.textContent = tag;
      tagsEl.appendChild(s);
    });

    steps.forEach(s => s.classList.remove('active'));
    resultEl.classList.add('active');
    progress.forEach(p => p.classList.add('on'));
    backBtn.hidden = false;
    restartBtn.hidden = false;
  }

  show(0);
})();
