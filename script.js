(() => {
  const root = document.documentElement;
  const body = document.body;
  const languageButtons = [...document.querySelectorAll('[data-language]')];
  const images = [...document.querySelectorAll('[data-alt-en]')];
  const filterButtons = [...document.querySelectorAll('[data-filter]')];
  const projectCards = [...document.querySelectorAll('.project-card[data-category]')];
  const projectGrid = document.querySelector('#project-grid');
  const emptyState = document.querySelector('#filter-empty');
  const navLinks = [...document.querySelectorAll('.nav-link')];
  const sections = navLinks.map((link) => document.querySelector(link.getAttribute('href'))).filter(Boolean);

  const setLanguage = (language, updateUrl = true) => {
    const next = language === 'zh' ? 'zh' : 'en';
    body.dataset.lang = next;
    root.lang = next === 'zh' ? 'zh-CN' : 'en';
    languageButtons.forEach((button) => {
      const active = button.dataset.language === next;
      button.classList.toggle('is-active', active);
      button.setAttribute('aria-pressed', String(active));
    });
    images.forEach((image) => {
      image.alt = image.dataset[next === 'zh' ? 'altZh' : 'altEn'];
    });
    try { localStorage.setItem('tardis-portfolio-language', next); } catch (_) {}
    if (updateUrl) {
      const url = new URL(window.location.href);
      url.searchParams.set('lang', next);
      window.history.replaceState({}, '', url);
    }
  };

  languageButtons.forEach((button) => button.addEventListener('click', () => setLanguage(button.dataset.language)));

  const setFilter = (filter) => {
    const next = filter || 'all';
    if (projectGrid) projectGrid.dataset.filter = next;
    let visible = 0;
    filterButtons.forEach((button) => button.classList.toggle('is-active', button.dataset.filter === next));
    projectCards.forEach((card) => {
      const show = next === 'all' || card.dataset.category === next;
      card.classList.toggle('is-hidden', !show);
      if (show) visible += 1;
    });
    if (emptyState) emptyState.hidden = visible > 0;
  };

  filterButtons.forEach((button) => button.addEventListener('click', () => setFilter(button.dataset.filter)));

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        navLinks.forEach((link) => link.classList.toggle('is-current', link.getAttribute('href') === `#${entry.target.id}`));
      });
    }, { rootMargin: '-25% 0px -65% 0px', threshold: 0 });
    sections.forEach((section) => observer.observe(section));
  }

  const queryLanguage = new URLSearchParams(window.location.search).get('lang');
  let initialLanguage = queryLanguage === 'zh' || queryLanguage === 'en' ? queryLanguage : 'en';
  if (!queryLanguage) {
    try { initialLanguage = localStorage.getItem('tardis-portfolio-language') || initialLanguage; } catch (_) {}
  }
  setLanguage(initialLanguage, false);
  setFilter('all');
})();
