import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { createServer } from 'vite';
import { articleUrl, publishedArticles } from '../src/content/articles.js';

const escapeHtml = value => String(value).replace(/[&<>"']/g, char => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
})[char]);
const template = await readFile('dist/index.html', 'utf8');
const server = await createServer({ server: { middlewareMode: true } });

try {
  const { default: ArticlesPage } = await server.ssrLoadModule('/src/Articles.jsx');
  // Static HTML lets social crawlers read article metadata without executing JavaScript.
  const configuredOrigin = process.env.SITE_URL ||
    (process.env.VERCEL_PROJECT_PRODUCTION_URL && `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`) ||
    (process.env.VERCEL_URL && `https://${process.env.VERCEL_URL}`);
  const origin = configuredOrigin ? new URL(configuredOrigin) : null;
  if (origin && !['http:', 'https:'].includes(origin.protocol)) throw new Error('SITE_URL must use HTTP or HTTPS');
  const pages = [
    { path: '/articles/', title: 'Articles — YANNDEV', description: 'Artikel kuliah, catatan belajar, dan eksplorasi teknologi oleh Christian Bagus Prasetya.' },
    ...publishedArticles.map(article => ({ path: articleUrl(article), title: `${article.title} — YANNDEV`, description: article.description, article })),
    { path: '/404.html', title: 'Artikel tidak ditemukan — YANNDEV', description: 'Artikel belum diterbitkan atau tautannya tidak tersedia.', notFound: true },
  ];
  for (const page of pages) {
    const url = origin ? new URL(page.path, origin).href : null;
    const meta = [
      ['og:type', page.article ? 'article' : 'website'], ['og:site_name', 'YANNDEV'],
      ['og:locale', 'id_ID'], ['og:title', page.title], ['og:description', page.description],
      ...(url ? [['og:url', url]] : []),
      ...(page.article ? [['article:published_time', `${page.article.date}T00:00:00Z`], ['article:author', 'Christian Bagus Prasetya']] : []),
    ].map(([property, content]) => `<meta property="${property}" content="${escapeHtml(content)}" />`).join('\n  ');
    const head = `${meta}\n  <meta name="twitter:card" content="summary" />\n  <meta name="twitter:title" content="${escapeHtml(page.title)}" />\n  <meta name="twitter:description" content="${escapeHtml(page.description)}" />${url ? `\n  <link rel="canonical" href="${escapeHtml(url)}" />` : ''}${page.notFound ? '\n  <meta name="robots" content="noindex" />' : ''}`;
    const html = template.replace('<html lang="en"', '<html lang="id"')
      .replace(/<title>.*?<\/title>/s, () => `<title>${escapeHtml(page.title)}</title>`)
      .replace(/<meta name="description" content="[^"]*"\s*\/>/, () => `<meta name="description" content="${escapeHtml(page.description)}" />`)
      .replace('</head>', () => `  ${head}\n</head>`)
      .replace('<div id="root"></div>', () => `<div id="root">${renderToStaticMarkup(createElement(ArticlesPage, { pathname: page.path }))}</div>`);
    const file = page.notFound ? resolve('dist/404.html') : resolve('dist', `.${page.path}`, 'index.html');
    await mkdir(resolve(file, '..'), { recursive: true });
    await writeFile(file, html);
  }
  console.log(`Generated ${pages.length} static article pages (${publishedArticles.length} published articles).`);
} finally {
  await server.close();
}
