/* Brian Machoka portfolio: script.js
   Matches index.html + style.css (ids and classes unchanged). */
(() => {
  'use strict';

  const $ = s => document.querySelector(s);
  const $$ = s => [...document.querySelectorAll(s)];
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  const nav = $('#nav'), burger = $('#burger'), menu = $('#menu');
  const overlay = $('#navOverlay'), bar = $('#progress');
  const links = menu ? [...menu.querySelectorAll('a')] : [];

  /* ---------- Mobile menu ---------- */
  const setMenu = open => {
    if (!menu || !burger) return;
    menu.classList.toggle('open', open);
    burger.setAttribute('aria-expanded', String(open));
    if (overlay) overlay.classList.toggle('show', open);
  };
  if (burger) burger.addEventListener('click', () => setMenu(!menu.classList.contains('open')));
  if (overlay) overlay.addEventListener('click', () => setMenu(false));

  links.forEach(a => a.addEventListener('click', e => {
    const hash = a.getAttribute('href');
    const target = hash && hash.startsWith('#') ? $(hash) : null;
    if (target) {
      e.preventDefault();
      history.pushState(null, '', hash);
      (target.querySelector('.eyebrow') || target).scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
    }
    setMenu(false);
  }));

  /* ---------- Nav background + scroll progress ---------- */
  const onScroll = () => {
    if (nav) nav.classList.toggle('scrolled', scrollY > 20);
    if (bar) {
      const max = document.documentElement.scrollHeight - innerHeight;
      bar.style.transform = 'scaleX(' + (max > 0 ? scrollY / max : 0) + ')';
    }
  };
  onScroll();
  addEventListener('scroll', onScroll, { passive: true });

  /* ---------- Footer year ---------- */
  const year = $('#year');
  if (year) year.textContent = new Date().getFullYear();

  /* ---------- Live project previews (pop-up) ---------- */
  const dialog = $('#projectDialog');
  if (dialog) {
    const frame = dialog.querySelector('.project-dialog-frame');
    const titleEl = $('#projectDialogTitle');
    const openLink = dialog.querySelector('.project-dialog-link');
    const closeBtn = dialog.querySelector('.project-dialog-close');

    // Hosts that refuse to be framed open in a new tab instead,
    // e.g. ['example.com']. Empty = every preview opens as a pop-up.
    const NEW_TAB_HOSTS = [];
    const opensInNewTab = link => {
      try { return NEW_TAB_HOSTS.includes(new URL(link.href).hostname); } catch (err) { return false; }
    };

    const closeDialog = () => { if (dialog.open) dialog.close(); };

    $$('.project-preview').forEach(link => {
      if (opensInNewTab(link)) {
        link.target = '_blank';
        link.rel = 'noopener';
        return;
      }
      link.addEventListener('click', e => {
        if (typeof dialog.showModal !== 'function' || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
        e.preventDefault();
        const card = link.closest('.card');
        const title = card && card.querySelector('h3') ? card.querySelector('h3').textContent : 'Project preview';
        if (titleEl) titleEl.textContent = title;
        if (frame) { frame.title = title + ' preview'; frame.src = link.href; }
        if (openLink) openLink.href = link.href;
        dialog.showModal();
      });
    });

    if (closeBtn) closeBtn.addEventListener('click', closeDialog);
    dialog.addEventListener('cancel', e => { e.preventDefault(); closeDialog(); });
    dialog.addEventListener('click', e => { if (e.target === dialog) closeDialog(); });
    dialog.addEventListener('close', () => { if (frame) frame.src = 'about:blank'; });
  }

  addEventListener('keydown', e => {
    if (e.key === 'Escape') setMenu(false);
  });

  /* ---------- Number count-up ---------- */
  const count = el => {
    const end = +el.dataset.count, suf = el.dataset.suffix || '';
    if (reduce) { el.textContent = end + suf; return; }
    const t0 = performance.now(), dur = 1400;
    (function step(t) {
      const p = Math.min((t - t0) / dur, 1);
      el.textContent = Math.round(end * (1 - Math.pow(1 - p, 3))) + suf;
      if (p < 1) requestAnimationFrame(step);
    })(t0);
  };

  /* ---------- Staggered reveal on scroll ---------- */
  $$('.grid,.skills,.stats,.cgrid,.certs').forEach(g =>
    [...g.children].forEach((c, i) => { c.style.transitionDelay = (i % 4) * 90 + 'ms'; }));

  const io = new IntersectionObserver(entries => entries.forEach(e => {
    if (!e.isIntersecting) return;
    const t = e.target;
    t.classList.add('in');
    io.unobserve(t);
    const c = t.querySelector('[data-count]');
    if (c) count(c);
    // hand control back to the element's own hover transitions
    setTimeout(() => { t.style.transitionDelay = ''; t.classList.remove('reveal', 'in'); }, 1200);
  }), { threshold: .12 });
  $$('.reveal').forEach(el => io.observe(el));

  /* ---------- Cursor spotlight on cards ---------- */
  $$('.card,.sk').forEach(el => el.addEventListener('pointermove', e => {
    const r = el.getBoundingClientRect();
    el.style.setProperty('--mx', e.clientX - r.left + 'px');
    el.style.setProperty('--my', e.clientY - r.top + 'px');
  }));

  /* ---------- Highlight the nav link of the section in view ---------- */
  const spy = new IntersectionObserver(entries => entries.forEach(e => {
    if (e.isIntersecting) links.forEach(l => l.classList.toggle('active', l.getAttribute('href') === '#' + e.target.id));
  }), { rootMargin: '-45% 0px -50% 0px' });
  $$('main section[id]').forEach(s => spy.observe(s));

  /* ---------- Typing effect for the role line ---------- */
  const typed = $('#typed');
  if (typed && !reduce) {
    const roles = ['Software Developer', 'IT Systems Specialist', 'Web Applications Engineer'];
    let r = 0, i = 0, del = false;
    (function tick() {
      const w = roles[r];
      typed.textContent = w.slice(0, i);
      if (!del && i === w.length) { del = true; return setTimeout(tick, 1800); }
      if (del && i === 0) { del = false; r = (r + 1) % roles.length; }
      i += del ? -1 : 1;
      setTimeout(tick, del ? 35 : 75);
    })();
  }
})();
