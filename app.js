const legal = document.querySelector('#legal');
document.querySelector('#legal-open').addEventListener('click', () => legal.showModal());
document.querySelector('.close').addEventListener('click', () => legal.close());
legal.addEventListener('click', event => {
  if (event.target !== legal) return;
  const rect = legal.getBoundingClientRect();
  if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) legal.close();
});
