// ===============================
// FILTER MEDIA / ARTEFAK
// ===============================
function filterMedia(cat, btn) {
  document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  document.querySelectorAll('.media-card').forEach(card => {
    card.style.display = (cat === 'all' || card.dataset.cat === cat) ? '' : 'none';
  });
  ['siklus1','siklus2','siklus3','lainnya'].forEach(s => {
    const el = document.getElementById('hint-' + s);
    if (el) el.style.display = (cat === s) ? 'flex' : 'none';
  });
}

// ===============================
// ANALISIS TABS
// ===============================
function switchTab(artefakId, tabName) {
  document.querySelectorAll(`#${artefakId} .atab`).forEach(t => t.classList.remove('active'));
  document.querySelectorAll(`#${artefakId} .analisis-panel`).forEach(p => p.classList.remove('active'));
  document.querySelector(`#${artefakId} .atab[data-tab="${tabName}"]`).classList.add('active');
  document.querySelector(`#${artefakId} .panel-${tabName}`).classList.add('active');
}

// ===============================
// MODAL
// ===============================
function openModal(id) {
  const modal = document.getElementById(id);
  if (modal) { modal.classList.add('open'); document.body.classList.add('modal-open'); }
}
function closeModal(id) {
  const modal = document.getElementById(id);
  if (modal) { modal.classList.remove('open'); document.body.classList.remove('modal-open'); }
}
document.addEventListener('click', (e) => {
  if (e.target.classList.contains('modal-overlay')) closeModal(e.target.id);
});
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    document.querySelectorAll('.modal-overlay.open').forEach(m => closeModal(m.id));
  }
});

// ===============================
// SCROLL REVEAL
// ===============================
const observer = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
}, { threshold: 0.08 });
document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

// ===============================
// SEMUA NAV LOGIC — dalam DOMContentLoaded
// ===============================
document.addEventListener('DOMContentLoaded', () => {

  // HAMBURGER
  const menuToggle = document.getElementById('menu-toggle');
  const navMenu = document.querySelector('.nav-links');

  if (menuToggle && navMenu) {
    menuToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      navMenu.classList.toggle('active');
    });
  }
  document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
      if (navMenu) navMenu.classList.remove('active');
    });
  });
  document.addEventListener('click', (e) => {
    if (navMenu && !e.target.closest('nav')) navMenu.classList.remove('active');
  });

  // DROPDOWN — hover desktop, klik mobile
  document.querySelectorAll('.nav-dropdown').forEach(dropdown => {
    const toggle = dropdown.querySelector('.nav-dropdown-toggle');
    if (toggle) {
      toggle.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (window.innerWidth <= 840) {
          document.querySelectorAll('.nav-dropdown').forEach(d => {
            if (d !== dropdown) d.classList.remove('mobile-open');
          });
          dropdown.classList.toggle('mobile-open');
        }
      });
    }
  });
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.nav-dropdown')) {
      document.querySelectorAll('.nav-dropdown').forEach(d => d.classList.remove('mobile-open'));
    }
  });

  // NAV ACTIVE + DROPDOWN LABEL
  const currentPage = document.body.dataset.page || 'index';
  const navLinks = document.querySelectorAll('.nav-links a');
  const sections = document.querySelectorAll('section[id], div[id]');

  const dropdownSections = currentPage === 'index' ? {
    'artefak':    { dropdownId: 'nav-dropdown-portfolio', label: 'artefak ▾' },
    'lampiran':   { dropdownId: 'nav-dropdown-portfolio', label: 'lampiran ▾' },
    'model-guru': { dropdownId: 'nav-dropdown-portfolio', label: 'model guru ▾' },
  } : {};

  const siklabels = { siklus1: 'siklus 1 ▾', siklus2: 'siklus 2 ▾', siklus3: 'siklus 3 ▾' };

  // fungsi: set active dropdown siklus
  function activateSiklusDropdown(page) {
    const dd = document.getElementById('nav-dropdown-siklus');
    if (!dd) return;
    const toggle = dd.querySelector('.nav-dropdown-toggle');
    if (!toggle) return;
    toggle.classList.add('active');
    toggle.textContent = siklabels[page] || 'siklus ▾';
  }

  // fungsi: highlight link yang cocok
  function highlightLink(matchFn) {
    navLinks.forEach(a => {
      a.classList.remove('active');
      if (matchFn(a.getAttribute('href') || '')) a.classList.add('active');
    });
  }

  // HALAMAN NON-INDEX — highlight langsung saat load
  if (currentPage !== 'index') {
    // highlight link yang mengarah ke halaman ini
    highlightLink(href => href.includes(currentPage + '.html'));

    // highlight dropdown siklus kalau halaman siklus
    if (siklabels[currentPage]) activateSiklusDropdown(currentPage);

    // tidak perlu scroll listener
    return;
  }

  // INDEX — scroll listener
  window.addEventListener('scroll', () => {
    let current = '';
    const scrollY = window.scrollY;

    sections.forEach(s => {
      const top = s.offsetTop - 80;
      const bottom = top + s.offsetHeight;
      if (scrollY >= top && scrollY < bottom) current = s.id;
    });

    // fallback
    if (!current) {
      let minDist = Infinity;
      sections.forEach(s => {
        const dist = Math.abs(s.offsetTop - scrollY - 80);
        if (dist < minDist) { minDist = dist; current = s.id; }
      });
    }

    // reset semua
    navLinks.forEach(a => a.classList.remove('active'));
    document.querySelectorAll('.nav-dropdown-toggle').forEach(t => {
      t.classList.remove('active');
      if (t.closest('#nav-dropdown-portfolio')) t.textContent = 'portfolio ▾';
      if (t.closest('#nav-dropdown-siklus')) t.textContent = 'siklus ▾';
    });

    // set dropdown label kalau section ada di dropdown
    if (dropdownSections[current]) {
      const { dropdownId, label } = dropdownSections[current];
      const dd = document.getElementById(dropdownId);
      if (dd) {
        const toggle = dd.querySelector('.nav-dropdown-toggle');
        if (toggle) { toggle.classList.add('active'); toggle.textContent = label; }
      }
    }

    // highlight link biasa
    navLinks.forEach(a => {
      const href = a.getAttribute('href');
      if (href === '#' + current || href?.endsWith('#' + current)) {
        a.classList.add('active');
      }
    });
  });

  // jalankan sekali saat load
  window.dispatchEvent(new Event('scroll'));

}); // end DOMContentLoaded