
/* Brian Machoka - Portfolio - FINAL 2026 */
'use strict';

const nav = document.getElementById('nav');
const burger = document.getElementById('burger');
const menu = document.getElementById('menu');
const overlay = document.getElementById('navOverlay');
const progress = document.getElementById('progress');
const yearEl = document.getElementById('year');
const links = [...menu.querySelectorAll('a')];
const typedEl = document.getElementById('typed');

/* ===== MENU - FIXED SOLID BLACK ===== */
const setMenu = (open) => {
  menu.classList.toggle('open', open);
  overlay?.classList.toggle('open', open);
  nav.classList.toggle('menu-open', open);
  burger.setAttribute('aria-expanded', String(open));
  burger.setAttribute('aria-label', open? 'Close menu' : 'Open menu');
  document.body.style.overflow = open? 'hidden' : '';
  if (open) nav.classList.add('scrolled');
};

burger.addEventListener('click', () => setMenu(!menu.classList.contains('open')));
links.forEach(a => a.addEventListener('click', () => setMenu(false)));
overlay?.addEventListener('click', () => setMenu(false));

document.addEventListener('click', (e) => {
  if (menu.classList.contains('open') &&!menu.contains(e.target) &&!burger.contains(e.target) &&!overlay?.contains(e.target)) {
    setMenu(false);
  }
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && menu.classList.contains('open')) setMenu(false);
});

window.addEventListener('resize', () => {
  if (window.innerWidth >= 900 && menu.classList.contains('open')) setMenu(false);
}, { passive: true });

/* ===== NAV SCROLL + PROGRESS BAR ===== */
const onScroll = () => {
  const y = window.scrollY;
  if (!nav.classList.contains('menu-open')) {
    nav.classList.toggle('scrolled', y > 20);
  }
  if (progress) {
    const h = document.documentElement.scrollHeight - window.innerHeight;
    progress.style.width = h > 0? (y / h * 100) + '%' : '0%';
  }
};
onScroll();
window.addEventListener('scroll', onScroll, { passive: true });

/* ===== YEAR ===== */
if (yearEl) yearEl.textContent = new Date().getFullYear();

/* ===== REVEAL ON SCROLL ===== */
const reveal = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('in');
      reveal.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.reveal').forEach(el => reveal.observe(el));

/* ===== ACTIVE LINK SPY ===== */
const spy = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const id = entry.target.id;
      links.forEach(l => l.classList.toggle('active', l.getAttribute('href') === '#' + id));
    }
  });
}, { rootMargin: '-45% 0px -50% 0px' });

document.querySelectorAll('main section[id]').forEach(s => spy.observe(s));

/* ===== TYPING EFFECT ===== */
if (typedEl &&!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const roles = ['Software Developer', 'IT Systems Specialist', 'Web Applications Engineer'];
  let r = 0, i = 0, del = false;

  (function tick() {
    const w = roles[r];
    typedEl.textContent = w.slice(0, i);

    if (!del && i === w.length) {
      del = true;
      return setTimeout(tick, 1800);
    }
    if (del && i === 0) {
      del = false;
      r = (r + 1) % roles.length;
    }
    i += del? -1 : 1;
    setTimeout(tick, del? 35 : 75);
  })();
} else if (typedEl) {
  typedEl.textContent = 'Software Developer';
}