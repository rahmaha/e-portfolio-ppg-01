// filter media/artefak by category
function filterMedia(cat, btn) {
  document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  document.querySelectorAll('.media-card').forEach(card => {
    card.style.display = (cat === 'all' || card.dataset.cat === cat) ? '' : 'none';
  });
}

// analisis tabs per artefak
function switchTab(artefakId, tabName) {
  document.querySelectorAll(`#${artefakId} .atab`).forEach(t => t.classList.remove('active'));
  document.querySelectorAll(`#${artefakId} .analisis-panel`).forEach(p => p.classList.remove('active'));
  document.querySelector(`#${artefakId} .atab[data-tab="${tabName}"]`).classList.add('active');
  document.querySelector(`#${artefakId} .panel-${tabName}`).classList.add('active');
}

// scroll reveal
const observer = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
}, { threshold: 0.08 });
document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

// nav active highlight
const sections = document.querySelectorAll('section[id], div[id]');
const navLinks = document.querySelectorAll('.nav-links a');
window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(s => { if (window.scrollY >= s.offsetTop - 80) current = s.id; });
  navLinks.forEach(a => {
    a.classList.toggle('active', a.getAttribute('href') === '#' + current || a.getAttribute('href') === window.location.pathname.split('/').pop() + '#' + current);
  });
});

// hamburger
const menuToggle = document.getElementById('menu-toggle');
if (menuToggle) {
  const navMenu = document.querySelector('.nav-links');
  menuToggle.addEventListener('click', () => navMenu.classList.toggle('active'));
}
