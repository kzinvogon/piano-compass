/* Site-wide image lightbox: click any photo to maximise it.
   Photos inside an element with data-lightbox-cta="<url>" also get a
   button to that page (the Design gallery links to a consultation). */
(function () {
  let overlay, imgEl, capEl, ctaEl;

  function build() {
    overlay = document.createElement('div');
    overlay.className = 'lightbox';
    overlay.innerHTML =
      '<button class="lightbox__close" type="button" aria-label="Close">&times;</button>' +
      '<img class="lightbox__img" alt="">' +
      '<p class="lightbox__caption"></p>' +
      '<a class="btn btn--brass lightbox__cta" hidden></a>';
    document.body.appendChild(overlay);
    imgEl = overlay.querySelector('.lightbox__img');
    capEl = overlay.querySelector('.lightbox__caption');
    ctaEl = overlay.querySelector('.lightbox__cta');
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay || e.target.classList.contains('lightbox__close')) close();
    });
  }

  function ctaText() {
    const key = 'customPage.lightboxCta';
    const v = (typeof I18n !== 'undefined' && I18n.resolve) ? I18n.resolve(key) : key;
    return v && v !== key ? v : 'Like this design? Book a consultation';
  }

  function open(src, alt, ctaHref) {
    if (!overlay) build();
    imgEl.src = src;
    imgEl.alt = alt || '';
    capEl.textContent = alt || '';
    ctaEl.hidden = !ctaHref;
    if (ctaHref) { ctaEl.href = ctaHref; ctaEl.textContent = ctaText(); }
    overlay.classList.add('open');
    document.body.classList.add('lightbox-open');
  }

  function close() {
    if (!overlay) return;
    overlay.classList.remove('open');
    document.body.classList.remove('lightbox-open');
    imgEl.src = '';
  }

  document.addEventListener('click', (e) => {
    const img = e.target.closest('img');
    if (!img) return;
    if (overlay && overlay.contains(img)) return;   // ignore the lightbox's own image
    if (img.closest('a')) return;                    // let linked images follow their link
    if (img.dataset.noLightbox !== undefined) return;
    e.preventDefault();
    const cta = img.closest('[data-lightbox-cta]');
    open(img.currentSrc || img.src, img.alt, cta ? cta.dataset.lightboxCta : '');
  });

  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') close(); });
})();
