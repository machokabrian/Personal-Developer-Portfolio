const $ = s => document.querySelector(s);
const $$ = s => [...document.querySelectorAll(s)];
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const overlay = $('#navOverlay');
const nav = $('#nav'), burger = $('#burger'), menu = $('#menu'), bar = $('#progress');
const links = [...menu.querySelectorAll('a')];

// Mobile menu
const setMenu = open => { menu.classList.toggle('open', open); burger.setAttribute('aria-expanded', open); if (overlay) overlay.classList.toggle('show', open); };
if (overlay) overlay.addEventListener('click', () => setMenu(false));
burger.addEventListener('click', () => setMenu(!menu.classList.contains('open')));
links.forEach(a => a.addEventListener('click', e => {
  const target = $(a.getAttribute('href'));
  if (target) {
    e.preventDefault();
    history.pushState(null, '', a.hash);
    (target.querySelector('.eyebrow') || target).scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
  }
  setMenu(false);
}));
addEventListener('keydown', e => { if (e.key === 'Escape') setMenu(false); });

// Nav background + scroll progress bar
const onScroll = () => {
  nav.classList.toggle('scrolled', scrollY > 20);
  const max = document.documentElement.scrollHeight - innerHeight;
  bar.style.transform = 'scaleX(' + (max > 0 ? scrollY / max : 0) + ')';
};
onScroll();
addEventListener('scroll', onScroll, { passive: true });
$('#year').textContent = new Date().getFullYear();

// In-page live project previews
const projectDialog = $('#projectDialog');
const projectFrame = projectDialog.querySelector('.project-dialog-frame');
const projectDialogTitle = $('#projectDialogTitle');
const projectDialogLink = projectDialog.querySelector('.project-dialog-link');
$$('.project-preview').forEach(link => link.addEventListener('click', e => {
  if (typeof projectDialog.showModal !== 'function' || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
  e.preventDefault();
  const title = link.closest('.card').querySelector('h3').textContent;
  projectDialogTitle.textContent = title;
  projectFrame.title = title + ' preview';
  projectFrame.src = link.href;
  projectDialogLink.href = link.href;
  projectDialog.showModal();
}));
projectDialog.querySelector('.project-dialog-close').addEventListener('click', () => projectDialog.close());
projectDialog.addEventListener('cancel', e => {
  e.preventDefault();
  projectDialog.close();
});
addEventListener('keydown', e => {
  if (e.key === 'Escape' && projectDialog.open) projectDialog.close();
});
projectDialog.addEventListener('click', e => {
  if (e.target === projectDialog) projectDialog.close();
});
projectDialog.addEventListener('close', () => { projectFrame.src = 'about:blank'; });

// Number count-up
const count = el => {
  const end = +el.dataset.count, suf = el.dataset.suffix || '';
  if (reduce) { el.textContent = end + suf; return; }
  const t0 = performance.now(), dur = 1400;
  (function f(t) {
    const p = Math.min((t - t0) / dur, 1);
    el.textContent = Math.round(end * (1 - Math.pow(1 - p, 3))) + suf;
    if (p < 1) requestAnimationFrame(f);
  })(t0);
};

// Staggered reveal on scroll
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

// Cursor spotlight on cards
$$('.card,.sk').forEach(el => el.addEventListener('pointermove', e => {
  const r = el.getBoundingClientRect();
  el.style.setProperty('--mx', e.clientX - r.left + 'px');
  el.style.setProperty('--my', e.clientY - r.top + 'px');
}));

// Highlight the nav link of the section in view
const spy = new IntersectionObserver(entries => entries.forEach(e => {
  if (e.isIntersecting) links.forEach(l => l.classList.toggle('active', l.getAttribute('href') === '#' + e.target.id));
}), { rootMargin: '-45% 0px -50% 0px' });
$$('main section[id]').forEach(s => spy.observe(s));

// Typing effect for the role line
const el = $('#typed');
if (el && !reduce) {
  const roles = ['Software Developer', 'IT Systems Specialist', 'Web Applications Engineer'];
  let r = 0, i = 0, del = false;
  (function tick() {
    const w = roles[r];
    el.textContent = w.slice(0, i);
    if (!del && i === w.length) { del = true; return setTimeout(tick, 1800); }
    if (del && i === 0) { del = false; r = (r + 1) % roles.length; }
    i += del ? -1 : 1;
    setTimeout(tick, del ? 35 : 75);
  })();
}
