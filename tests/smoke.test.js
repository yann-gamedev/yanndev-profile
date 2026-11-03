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
    for (const id of ['top', 'about', 'stack', 'work', 'journey', 'achievements', 'contact']) {
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
    const config = JSON.parse(readFileSync('vercel.json', 'utf8'));
    assert.equal(config.framework, 'vite');
    assert.equal(config.outputDirectory, 'dist');
    assert.ok(!readFileSync('index.html', 'utf8').includes('script.js'));
  } finally {
    await server.close();
  }
});
