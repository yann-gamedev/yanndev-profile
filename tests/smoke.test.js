import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { test } from 'node:test';
import { createServer } from 'vite';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';

// Compile JSX through the same Vite pipeline used by development and production.
test('portfolio keeps all sections, skills, previews and deployment settings', async () => {
  const server = await createServer({ server: { middlewareMode: true } });
  try {
    const { default: App } = await server.ssrLoadModule('/src/App.jsx');
    const html = renderToStaticMarkup(createElement(App));
    for (const id of ['top', 'about', 'stack', 'work', 'journey', 'achievements', 'articles', 'contact']) {
      assert.ok(html.includes(`id="${id}" data-section="true"`), `Missing section: ${id}`);
    }
    assert.equal((html.match(/class="skill"/g) ?? []).length, 18);
    assert.equal((html.match(/class="badge-card"/g) ?? []).length, 10);
    assert.equal((html.match(/class="badge-card__view"/g) ?? []).length, 9);
    assert.equal((html.match(/class="ch"/g) ?? []).length, 7);
    assert.ok(html.includes('id="skillPoints">47</b>'));
    for (const [, pages] of html.matchAll(/data-preview="([^"]+)"/g)) {
      for (const page of pages.split('|')) assert.ok(existsSync(resolve('public', page)), page);
    }
    const { default: ArticlesPage, ArticleReader, ArticleList } = await server.ssrLoadModule('/src/Articles.jsx');
    const { articles, getPublishedArticles, readingMinutes } = await server.ssrLoadModule('/src/content/articles.js');
    const listing = renderToStaticMarkup(createElement(ArticlesPage));
    const draft = articles.find(article => !article.published);
    assert.ok(listing.includes('▸ VIEW'), 'Article listing must show VIEW');
    assert.ok(listing.includes('href="/articles/contoh-artikel/"'));
    assert.ok(!listing.includes(draft.title), 'Draft must not be listed');
    const demo = renderToStaticMarkup(createElement(ArticlesPage, { pathname: '/articles/contoh-artikel/' }));
    assert.ok(demo.includes('Dari ide menjadi tulisan'));
    assert.ok(demo.includes('src="/assets/articles/contoh-artikel.svg"'));
    assert.ok(demo.includes('Tentang halaman ini'));
    assert.ok(existsSync('public/assets/articles/contoh-artikel.svg'));
    const missing = renderToStaticMarkup(createElement(ArticlesPage, { pathname: '/articles/judul-artikel-pertama/' }));
    assert.ok(missing.includes('FILE NOT FOUND'), 'Draft must not have a public reader');
    const fixture = { ...draft, published: true, title: '<script>alert(1)</script>', cover: { src: '/assets/images/zuma.png', alt: 'Foto artikel', caption: 'Kredit foto' } };
    const [published] = getPublishedArticles([fixture]);
    const reader = renderToStaticMarkup(createElement(ArticleReader, { article: published }));
    assert.ok(reader.includes('&lt;script&gt;'), 'Article content must be escaped');
    assert.ok(reader.includes('href="#pendahuluan"'));
    assert.ok(reader.includes('BAGIKAN ARTIKEL'));
    assert.ok(reader.includes('src="/assets/images/zuma.png"'));
    assert.ok(reader.includes('<figcaption>Kredit foto</figcaption>'));
    assert.ok(reader.includes(fixture.sections[0].paragraphs[0]));
    const preview = renderToStaticMarkup(createElement(ArticleList, { entries: [published] }));
    assert.ok(preview.includes('▸ VIEW'));
    assert.ok(preview.includes('href="/articles/judul-artikel-pertama/"'));
    assert.ok(!preview.includes(fixture.sections[0].paragraphs[0]), 'Preview must not contain full article text');
    assert.ok(preview.includes('alt="Foto artikel"'));
    const noPhoto = renderToStaticMarkup(createElement(ArticleReader, { article: draft }));
    assert.ok(noPhoto.includes('NO IMAGE YET'));
    assert.throws(() => getPublishedArticles([{ ...fixture, cover: { src: 'javascript:alert(1)', alt: 'Bad' } }]));
    assert.throws(() => getPublishedArticles([{ ...fixture, cover: { src: '/assets/foto.jpg', alt: '' } }]));
    assert.ok(readingMinutes(published) >= 1);
    assert.throws(() => getPublishedArticles([{ ...fixture, slug: '../escape' }]));
    assert.throws(() => getPublishedArticles([fixture, fixture]));
    assert.throws(() => getPublishedArticles([{ ...fixture, references: [{ title: 'Bad', url: 'javascript:alert(1)' }] }]));
    const config = JSON.parse(readFileSync('vercel.json', 'utf8'));
    assert.equal(config.framework, 'vite');
    assert.equal(config.outputDirectory, 'dist');
    assert.ok(!readFileSync('index.html', 'utf8').includes('script.js'));
  } finally {
    await server.close();
  }
});
