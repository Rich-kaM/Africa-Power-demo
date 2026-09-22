const express = require('express');
const path = require('path');

const app = express();
const port = Number(process.env.PORT || 3000);
const isProduction = process.env.NODE_ENV === 'production';

const publicPath = path.join(__dirname, 'public');
const pageAliases = {
  fr: {
    '': 'index.html',
    'a-propos': 'about.html',
    'about': 'about.html',
    'services': 'services.html',
    'industries': 'industries.html',
    'projets': 'projects.html',
    'projects': 'projects.html',
    'experts': 'experts.html',
    'actualites': 'news.html',
    'news': 'news.html',
    'insights': 'insights.html',
    'durabilite': 'durabilite.html',
    'sustainability': 'durabilite.html',
    'carrieres': 'carrieres.html',
    'careers': 'carrieres.html',
    'contact': 'contact.html',
    'privacy': 'privacy.html',
    'cookies': 'cookies.html',
    'terms': 'terms.html',
    'accessibility': 'accessibility.html'
  },
  en: {
    '': 'index.html',
    'about': 'about.html',
    'services': 'services.html',
    'industries': 'industries.html',
    'projects': 'projects.html',
    'experts': 'experts.html',
    'news': 'news.html',
    'actualites': 'news.html',
    'insights': 'insights.html',
    'sustainability': 'sustainability.html',
    'durabilite': 'sustainability.html',
    'careers': 'careers.html',
    'carrieres': 'careers.html',
    'contact': 'contact.html',
    'privacy': 'privacy.html',
    'cookies': 'cookies.html',
    'terms': 'terms.html',
    'accessibility': 'accessibility.html'
  }
};

app.disable('x-powered-by');
app.set('trust proxy', 1);

app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  res.setHeader('Permissions-Policy', 'geolocation=(), microphone=(), camera=()');
  res.setHeader('Content-Security-Policy', "default-src 'self'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data:; script-src 'self' 'unsafe-inline'; connect-src 'self'; frame-ancestors 'none'; base-uri 'self'; object-src 'none';");
  next();
});

const sendLocalizedPage = (lang, slug, res) => {
  const target = pageAliases[lang]?.[slug];
  if (!target) {
    return res.status(404).sendFile(path.join(publicPath, '404.html'));
  }
  return res.sendFile(path.join(publicPath, lang, target));
};

app.use(express.static(publicPath));
app.use(express.static(__dirname));

app.get('/fr/:slug', (req, res, next) => {
  const { slug } = req.params;
  if (slug.includes('.')) {
    return next();
  }
  return sendLocalizedPage('fr', slug, res);
});

app.get('/en/:slug', (req, res, next) => {
  const { slug } = req.params;
  if (slug.includes('.')) {
    return next();
  }
  return sendLocalizedPage('en', slug, res);
});

app.get('/', (req, res) => {
  res.redirect('/fr/');
});

app.get('/fr', (req, res) => {
  res.redirect('/fr/');
});

app.get('/en', (req, res) => {
  res.redirect('/en/');
});

app.use((req, res) => {
  res.status(404).sendFile(path.join(publicPath, '404.html'));
});

app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).sendFile(path.join(publicPath, '500.html'));
});

app.listen(port, () => {
  console.log(`Africa Power Advisory Holdings is running on http://localhost:${port}`);
  if (!isProduction) {
    console.log('Mode: development');
  }
});
