import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import { projectDetails } from './project-data.mjs';
import { projectDetails as englishProjectDetails } from './project-data.en.mjs';

const i18n = window.siteI18n;
const localizedProjects = () => i18n.language === 'en' ? englishProjectDetails : projectDetails;

gsap.registerPlugin(ScrollTrigger);
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
const finePointer = matchMedia('(hover: hover) and (pointer: fine)');
const motionButton = document.querySelector('.motion-toggle');
let userPaused = false;
try { userPaused = sessionStorage.getItem('charles-motion-paused') === 'true'; } catch { /* Storage may be unavailable. */ }
let lenis;
let motionContext;
let removeMotionListeners = () => {};
const dialog = document.querySelector('#project-dialog');
let dialogTrigger;
let latestStars;
let spatialScenes;

function renderProject(id) {
  const data = localizedProjects()[id];
  document.querySelector('#dialog-title').textContent = data.title;
  dialog.querySelector('.dialog-tags').replaceChildren(...data.tags.map(tag => {
    const span = document.createElement('span');
    span.textContent = tag;
    return span;
  }));
  // Authored, local project content; never populate this with remote HTML.
  dialog.querySelector('.dialog-body').innerHTML = data.content;
  if (latestStars !== undefined) applyStars(latestStars);
}
function translateProjects() {
  document.querySelectorAll('[data-project-content]').forEach(element => {
    element.innerHTML = localizedProjects()[element.dataset.projectContent].content;
  });
  if (dialog.open && dialogTrigger) {
    const scroll = dialog.scrollTop;
    renderProject(dialogTrigger.dataset.project);
    dialog.scrollTop = scroll;
  }
  if (latestStars !== undefined) applyStars(latestStars);
}
translateProjects();

// Content, navigation and dialogs are independent of the motion lifecycle.
document.querySelectorAll('[data-project]').forEach(summary => {
  summary.addEventListener('click', event => {
    const data = localizedProjects()[summary.dataset.project];
    if (!data || typeof dialog.showModal !== 'function') return;
    event.preventDefault();
    dialogTrigger = summary;
    renderProject(summary.dataset.project);
    dialog.showModal();
    updateDecoration();
    dialog.scrollTop = 0;
    document.documentElement.style.overflow = 'hidden';
    lenis?.stop();
    dialog.querySelector('.dialog-close').focus({ preventScroll: true });
    if (motionEnabled()) {
      gsap.fromTo(dialog, { y: 22, opacity: 0 }, { y: 0, opacity: 1, duration: .4, ease: 'power3.out', clearProps: 'transform,opacity' });
    }
  });
});
dialog.setAttribute('data-lenis-prevent', '');
dialog.querySelector('.dialog-close').addEventListener('click', () => dialog.close());
dialog.addEventListener('keydown', event => {
  if (event.key !== 'Tab') return;
  const focusable = [...dialog.querySelectorAll('button, a[href], [tabindex="0"]')].filter(element => element.getClientRects().length);
  const first = focusable[0];
  const last = focusable.at(-1);
  if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
  else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
});
dialog.addEventListener('click', event => {
  if (event.target !== dialog) return;
  const rect = dialog.getBoundingClientRect();
  if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) dialog.close();
});
dialog.addEventListener('close', () => {
  gsap.killTweensOf(dialog);
  dialog.style.removeProperty('opacity');
  dialog.style.removeProperty('transform');
  document.documentElement.style.overflow = '';
  lenis?.start();
  updateDecoration();
  dialogTrigger?.focus({ preventScroll: true });
});

const menuButton = document.querySelector('.menu-toggle');
const menu = document.querySelector('#mobile-menu');
function closeMenu(returnFocus = false) {
  menu.hidden = true;
  menuButton.setAttribute('aria-expanded', 'false');
  i18n.setAttribute(menuButton, 'aria-label', 'home.menuOpen');
  if (returnFocus) menuButton.focus();
}
menuButton.addEventListener('click', () => {
  const open = menuButton.getAttribute('aria-expanded') !== 'true';
  menu.hidden = !open;
  menuButton.setAttribute('aria-expanded', String(open));
  i18n.setAttribute(menuButton, 'aria-label', open ? 'home.menuClose' : 'home.menuOpen');
});
menu.querySelectorAll('a').forEach(link => link.addEventListener('click', () => closeMenu()));
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && !menu.hidden) closeMenu(true);
});
document.addEventListener('click', event => {
  if (!menu.hidden && !event.target.closest('.site-header')) closeMenu();
});
matchMedia('(min-width: 761px)').addEventListener('change', event => { if (event.matches) closeMenu(); });

document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', event => {
    const target = document.querySelector(link.getAttribute('href'));
    if (!target) return;
    event.preventDefault();
    closeMenu();
    // Keep deep links and keyboard navigation meaningful after smooth scrolling.
    const finish = () => {
      const wasFocusable = target.hasAttribute('tabindex');
      if (!wasFocusable) target.setAttribute('tabindex', '-1');
      target.focus({ preventScroll: true });
      if (!wasFocusable) target.addEventListener('blur', () => target.removeAttribute('tabindex'), { once: true });
    };
    if (location.hash !== link.hash) history.pushState(null, '', link.hash);
    finish();
    if (lenis) lenis.scrollTo(target, { offset: -85, duration: 1.15 });
    else target.scrollIntoView();
  });
});

const header = document.querySelector('.site-header');
const progress = document.querySelector('.reading-progress');
let scrollFrame = 0;
function updateScrollUI() {
  scrollFrame = 0;
  header.classList.toggle('scrolled', scrollY > 30);
  const range = document.documentElement.scrollHeight - innerHeight;
  progress.style.transform = `scaleX(${range > 0 ? Math.min(1, Math.max(0, scrollY / range)) : 0})`;
}
function queueScrollUI() { if (!scrollFrame) scrollFrame = requestAnimationFrame(updateScrollUI); }
addEventListener('scroll', queueScrollUI, { passive: true });
addEventListener('resize', queueScrollUI, { passive: true });
updateScrollUI();

const rail = document.querySelector('.photo-rail');
let drag;
let suppressClickUntil = 0;
rail.addEventListener('pointerdown', event => {
  if (event.pointerType !== 'mouse' || event.button !== 0) return;
  drag = { x: event.clientX, scroll: rail.scrollLeft, id: event.pointerId, moved: false };
});
rail.addEventListener('pointermove', event => {
  if (!drag) return;
  const dx = event.clientX - drag.x;
  if (Math.abs(dx) > 5 && !drag.moved) {
    drag.moved = true;
    rail.setPointerCapture(drag.id);
    rail.classList.add('dragging');
  }
  if (drag.moved) { rail.scrollLeft = drag.scroll - dx; event.preventDefault(); }
});
function endDrag() {
  if (!drag) return;
  if (drag.moved) suppressClickUntil = performance.now() + 300;
  if (rail.hasPointerCapture(drag.id)) rail.releasePointerCapture(drag.id);
  drag = null;
  rail.classList.remove('dragging');
}
rail.addEventListener('pointerup', endDrag);
rail.addEventListener('pointercancel', endDrag);
rail.addEventListener('lostpointercapture', endDrag);
addEventListener('pointerup', endDrag);
rail.addEventListener('dragstart', event => event.preventDefault());
rail.addEventListener('click', event => {
  if (performance.now() < suppressClickUntil) { event.preventDefault(); event.stopPropagation(); }
}, true);
function moveRail(direction) {
  rail.scrollBy({ left: direction * rail.clientWidth * .7, behavior: motionEnabled() ? 'smooth' : 'instant' });
}
document.querySelectorAll('.rail-button').forEach(button => button.addEventListener('click', () => moveRail(Number(button.dataset.direction))));
rail.addEventListener('keydown', event => {
  if (event.target !== rail || !['ArrowLeft', 'ArrowRight'].includes(event.key)) return;
  event.preventDefault();
  moveRail(event.key === 'ArrowLeft' ? -1 : 1);
});

let toastTimeout;
function toast(key, vars) {
  const element = document.querySelector('#toast');
  clearTimeout(toastTimeout);
  i18n.setText(element, key, vars);
  element.classList.add('visible');
  toastTimeout = setTimeout(() => element.classList.remove('visible'), 2600);
}
document.querySelectorAll('[data-copy]').forEach(button => button.addEventListener('click', async () => {
  try { await navigator.clipboard.writeText(button.dataset.copy); toast('home.copied'); }
  catch { toast('common.copyManual', { value: button.dataset.copy }); }
}));

function applyStars(number) {
  latestStars = number;
  const text = number >= 1000 ? `${(number / 1000).toFixed(1).replace(/\.0$/, '')}k` : String(number);
  document.querySelectorAll('.gh-stars').forEach(element => { element.textContent = text; });
}
async function refreshStars() {
  const key = 'gh-stars:KINGSTON-115/llm-pid-tuner';
  try {
    const cached = JSON.parse(localStorage.getItem(key));
    if (Number.isFinite(cached?.v)) {
      applyStars(cached.v);
      if (Date.now() - cached.t < 3600000) return;
    }
  } catch { /* Use the authored fallback. */ }
  try {
    const response = await fetch('https://api.github.com/repos/KINGSTON-115/llm-pid-tuner', { signal: AbortSignal.timeout(6000) });
    if (!response.ok) return;
    const data = await response.json();
    if (!Number.isFinite(data.stargazers_count)) return;
    applyStars(data.stargazers_count);
    try { localStorage.setItem(key, JSON.stringify({ v: data.stargazers_count, t: Date.now() })); } catch { /* Optional cache. */ }
  } catch { /* The portfolio remains usable offline. */ }
}
refreshStars();

function motionEnabled() { return !userPaused && !reducedMotion.matches; }
function translateMotion() {
  const key = reducedMotion.matches ? 'home.systemMotion' : motionEnabled() ? 'home.pauseMotion' : 'home.startMotion';
  i18n.setAttribute(motionButton, 'aria-label', key);
  i18n.setAttribute(motionButton, 'title', key);
}
function configureMotion() {
  removeMotionListeners();
  motionContext?.revert();
  lenis?.destroy();
  lenis = undefined;
  const enabled = motionEnabled();
  document.documentElement.classList.toggle('motion-paused', !enabled);
  motionButton.setAttribute('aria-pressed', String(!enabled));
  translateMotion();
  motionButton.querySelector('span').textContent = enabled ? 'Ⅱ' : '▷';
  if (!enabled) { removeMotionListeners = () => {}; return; }

  lenis = new Lenis({ duration: 1.05, smoothWheel: true, syncTouch: false, anchors: false });
  lenis.on('scroll', ScrollTrigger.update);
  const tick = time => { if (!document.hidden) lenis?.raf(time * 1000); };
  gsap.ticker.add(tick);
  const removals = [() => gsap.ticker.remove(tick)];

  motionContext = gsap.context(() => {
    gsap.from('.title-line > span', { yPercent: 105, duration: 1.2, stagger: .12, ease: 'power4.out', clearProps: 'transform' });
    gsap.from('.hero-intro, .hero-description, .hero-actions, .hero-topline', { y: 14, opacity: 0, duration: .85, stagger: .08, delay: .15, clearProps: 'transform,opacity', ease: 'power3.out' });
    gsap.from('.hero-art', { opacity: 0, scale: .9, duration: 1.5, ease: 'power3.out', clearProps: 'transform,opacity' });

    document.querySelectorAll('.reveal').forEach((element, index) => {
      gsap.from(element, {
        y: 36, opacity: .08, duration: .9, ease: 'power3.out', delay: element.classList.contains('resource-link') ? (index % 3) * .04 : 0,
        clearProps: 'transform,opacity', scrollTrigger: { trigger: element, start: 'top 94%', once: true },
      });
    });
    const path = document.querySelector('.chart-after');
    const length = path.getTotalLength();
    gsap.fromTo(path, { strokeDasharray: length, strokeDashoffset: length }, { strokeDashoffset: 0, duration: 1.8, ease: 'power2.inOut', scrollTrigger: { trigger: '.project-featured', start: 'top 80%', once: true }, clearProps: 'strokeDasharray,strokeDashoffset' });

    if (finePointer.matches && innerWidth > 760) {
      gsap.to('.hero-art', { y: 45, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 1.2 } });
      gsap.to('.contact-arrow', { y: -24, ease: 'none', scrollTrigger: { trigger: '.contact-section', start: 'top bottom', end: 'bottom bottom', scrub: 1 } });
    }
  });
  if (dialog.open) lenis.stop();
  removeMotionListeners = () => removals.forEach(remove => remove());
  ScrollTrigger.refresh();
}
motionButton.addEventListener('click', () => {
  if (reducedMotion.matches) { toast('home.systemMotionToast'); return; }
  userPaused = !userPaused;
  try { sessionStorage.setItem('charles-motion-paused', String(userPaused)); } catch { /* Optional preference. */ }
  configureMotion();
});
reducedMotion.addEventListener('change', configureMotion);
matchMedia('(min-width: 761px)').addEventListener('change', configureMotion);
finePointer.addEventListener('change', configureMotion);
configureMotion();

window.addEventListener('site:languagechange', () => {
  translateProjects();
  translateMotion();
  requestAnimationFrame(() => { lenis?.resize(); ScrollTrigger.refresh(); queueScrollUI(); });
});

// Continuous decoration runs only while visible, including when the tab is hidden.
const animatedElements = [...document.querySelectorAll('.sculpture-float, .strip-track, .scroll-line, .project-art')];
const visibleAnimations = new Set();
function updateDecoration() {
  spatialScenes?.sync();
  animatedElements.forEach(element => {
    const playing = visibleAnimations.has(element) && !document.hidden && !dialog.open && motionEnabled();
    element.style.animationPlayState = playing ? 'running' : 'paused';
    element.style.setProperty('--motion-state', playing ? 'running' : 'paused');
  });
}
const animationObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => { if (entry.isIntersecting) visibleAnimations.add(entry.target); else visibleAnimations.delete(entry.target); });
  updateDecoration();
});
animatedElements.forEach(element => animationObserver.observe(element));
document.addEventListener('visibilitychange', updateDecoration);
motionButton.addEventListener('click', updateDecoration);
reducedMotion.addEventListener('change', updateDecoration);
document.fonts.ready.then(() => { ScrollTrigger.refresh(); queueScrollUI(); });
addEventListener('load', () => { ScrollTrigger.refresh(); queueScrollUI(); }, { once: true });

// Keep the content bundle small. The static artwork is visible while the local
// renderer loads; unsupported WebGL or a failed request simply retains it.
const loadSpatial = () => import('./spatial.min.js').then(({ createSpatialScenes }) => {
  spatialScenes = createSpatialScenes({ isEnabled: motionEnabled, isBlocked: () => dialog.open });
  spatialScenes.sync();
}).catch(() => {});
if ('requestIdleCallback' in window) requestIdleCallback(loadSpatial, { timeout: 1200 });
else setTimeout(loadSpatial, 100);
