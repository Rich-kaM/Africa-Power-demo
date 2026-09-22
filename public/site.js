const applyLanguage = (lang) => {
  const root = document.documentElement;
  root.lang = lang;
  const dataset = lang === 'fr' ? 'fr' : 'en';
  const labels = document.querySelectorAll('[data-label]');
  labels.forEach((el) => {
    const text = el.dataset[dataset];
    if (text) {
      el.textContent = text;
    }
  });
  const buttons = document.querySelectorAll('.language-toggle');
  buttons.forEach((button) => {
    const activeLabel = button.querySelector('.active');
    const otherLabel = button.querySelector('.inactive');
    if (activeLabel && otherLabel) {
      const next = lang === 'fr' ? 'FR' : 'EN';
      activeLabel.textContent = next;
      otherLabel.textContent = lang === 'fr' ? 'EN' : 'FR';
    }
  });
  document.querySelectorAll('[data-lang]').forEach((node) => {
    const text = node.dataset[lang];
    if (text) {
      node.textContent = text;
    }
  });
  const canonicalLink = document.querySelector('link[rel="canonical"]');
  if (canonicalLink) {
    canonicalLink.href = `${window.location.origin}/${lang}/`;
  }
};

const localizedSlugs = {
  about: { fr: 'about', en: 'about' },
  services: { fr: 'services', en: 'services' },
  industries: { fr: 'industries', en: 'industries' },
  projects: { fr: 'projects', en: 'projects' },
  experts: { fr: 'experts', en: 'experts' },
  news: { fr: 'news', en: 'news' },
  insights: { fr: 'insights', en: 'insights' },
  sustainability: { fr: 'durabilite', en: 'sustainability' },
  careers: { fr: 'carrieres', en: 'careers' },
  contact: { fr: 'contact', en: 'contact' },
  privacy: { fr: 'privacy', en: 'privacy' },
  cookies: { fr: 'cookies', en: 'cookies' },
  terms: { fr: 'terms', en: 'terms' },
  accessibility: { fr: 'accessibility', en: 'accessibility' }
};

const getLocalizedPath = (nextLang) => {
  const path = window.location.pathname;
  const match = path.match(/^\/(fr|en)(?:\/([^/]+))?/);
  if (!match) return `/${nextLang}/`;

  const currentSlug = (match[2] || '').replace(/\.html$/, '');
  if (!currentSlug) return `/${nextLang}/`;

  const page = Object.values(localizedSlugs).find((slugs) => Object.values(slugs).includes(currentSlug));
  const nextSlug = page?.[nextLang] || localizedSlugs.about[nextLang];
  return `/${nextLang}/${nextSlug}.html`;
};

const setupLanguageToggle = () => {
  const currentLang = window.location.pathname.startsWith('/en/') ? 'en' : 'fr';
  localStorage.setItem('apah-language', currentLang);
  applyLanguage(currentLang);

  document.querySelectorAll('.language-toggle').forEach((button) => {
    button.addEventListener('click', () => {
      const nextLang = currentLang === 'fr' ? 'en' : 'fr';
      localStorage.setItem('apah-language', nextLang);
      window.location.assign(getLocalizedPath(nextLang));
    });
  });
};

const setupMenu = () => {
  const menu = document.querySelector('.mobile-menu');
  const menuButton = document.querySelector('.menu-button');
  const closeButton = document.querySelector('.close-menu');
  if (!menu || !menuButton || !closeButton) return;

  const toggleMenu = (isOpen) => {
    menu.classList.toggle('open', isOpen);
    menuButton.setAttribute('aria-expanded', String(isOpen));
    closeButton.setAttribute('aria-expanded', String(isOpen));
    document.body.style.overflow = isOpen ? 'hidden' : '';
  };

  menuButton.addEventListener('click', () => toggleMenu(true));
  closeButton.addEventListener('click', () => toggleMenu(false));

  menu.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => toggleMenu(false));
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && menu.classList.contains('open')) {
      toggleMenu(false);
    }
  });
};

const normalizeBrandName = () => {
  const oldName = 'Africa Power Advisory Holdings';
  const newName = 'Africa Power Advisory Holding';
  document.title = document.title.replaceAll(oldName, newName);

  document.querySelectorAll('meta[content], img[alt], [aria-label]').forEach((node) => {
    ['content', 'alt', 'aria-label'].forEach((attribute) => {
      const value = node.getAttribute(attribute);
      if (value?.includes(oldName)) {
        node.setAttribute(attribute, value.replaceAll(oldName, newName));
      }
    });
  });

  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  const textNodes = [];
  while (walker.nextNode()) textNodes.push(walker.currentNode);
  textNodes.forEach((node) => {
    if (node.nodeValue.includes(oldName)) {
      node.nodeValue = node.nodeValue.replaceAll(oldName, newName);
    }
  });
};

document.addEventListener('DOMContentLoaded', () => {
  normalizeBrandName();
  setupLanguageToggle();
  setupMenu();

  const yearNode = document.getElementById('year');
  if (yearNode) {
    yearNode.textContent = new Date().getFullYear();
  }
});
