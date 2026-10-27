const toggle = document.querySelector('.menu-toggle');
const drawer = document.querySelector('#menu-drawer');
const nav = document.querySelector('#navigation');
let closingTimer;
let previousOverflow = '';
function openMenu() {
  if (drawer.open) return;
  clearTimeout(closingTimer);
  previousOverflow = document.body.style.overflow;
  document.body.style.overflow = 'hidden';
  toggle.setAttribute('aria-expanded', 'true');
  drawer.showModal();
  // Commit the off-screen state before starting the slide animation.
  drawer.getBoundingClientRect();
  drawer.classList.add('is-open');
}
function closeMenu() {
  if (!drawer.open) return;
  drawer.classList.remove('is-open');
  toggle.setAttribute('aria-expanded', 'false');
  clearTimeout(closingTimer);
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) drawer.close();
  else closingTimer = setTimeout(() => drawer.close(), 320);
}
toggle.addEventListener('click', openMenu);
drawer.querySelector('.menu-close').addEventListener('click', closeMenu);
nav.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
drawer.addEventListener('cancel', event => { event.preventDefault(); closeMenu(); });
drawer.addEventListener('close', () => {
  clearTimeout(closingTimer);
  document.body.style.overflow = previousOverflow;
  toggle.setAttribute('aria-expanded', 'false');
  drawer.classList.remove('is-open');
  toggle.focus({ preventScroll: true });
});
drawer.addEventListener('click', event => {
  if (event.target !== drawer) return;
  const rect = drawer.getBoundingClientRect();
  if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) closeMenu();
});
const dialog = document.querySelector('#legal-dialog');
document.querySelector('[data-open-legal]').addEventListener('click', () => dialog.showModal());
document.querySelector('.close-dialog').addEventListener('click', () => dialog.close());
dialog.addEventListener('click', event => { if (event.target === dialog) { const r = dialog.getBoundingClientRect(); if (event.clientX < r.left || event.clientX > r.right || event.clientY < r.top || event.clientY > r.bottom) dialog.close(); } });
document.querySelectorAll('a[href^="#"]').forEach(link => link.addEventListener('click', () => {
  const id = link.getAttribute('href').slice(1);
  const target = id && document.getElementById(id);
  if (target?.tagName === 'DETAILS') target.open = true;
}));
