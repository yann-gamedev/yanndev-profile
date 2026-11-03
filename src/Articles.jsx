import { useEffect, useState } from 'react';
import { Clock } from './components';
import { articleUrl, publishedArticles, readingMinutes } from './content/articles';

const dateLabel = date => new Date(`${date}T00:00:00Z`).toLocaleDateString('id-ID', {
  day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC',
});

function ArticleMeta({ article }) {
  return <div className="article-meta">
    <time dateTime={article.date}>{dateLabel(article.date)}</time>
    <span>{readingMinutes(article)} MENIT BACA</span>
    <span>CHRISTIAN BAGUS PRASETYA</span>
  </div>;
}

function ArticleCover({ article, preview = false }) {
  const [failed, setFailed] = useState(false);
  const cover = article.cover;
  return <figure className={preview ? 'article-cover article-cover--preview' : 'article-cover'}>
    {cover?.src && !failed ? <img src={cover.src} alt={cover.alt} loading={preview ? 'lazy' : 'eager'} onError={() => setFailed(true)} /> :
      <div className="article-cover__placeholder" aria-label="Foto artikel belum tersedia"><span aria-hidden="true">IMG</span><span>NO IMAGE YET</span></div>}
    {!preview && cover?.src && !failed && cover.caption && <figcaption>{cover.caption}</figcaption>}
  </figure>;
}

export function ArticleList({ entries = publishedArticles }) {
  if (!entries.length) return <div className="articles-empty">
    <span className="articles-empty__icon" aria-hidden="true">TXT</span>
    <div>
      <p className="label">NO ENTRIES YET</p>
      <h3>Next entry, coming soon.</h3>
      <p>Artikel kuliah, catatan belajar, dan eksplorasi teknologi akan hadir di sini.</p>
    </div>
    <span className="articles-empty__status">● WRITING IN PROGRESS</span>
  </div>;
  return <div className="article-grid">{entries.map((article, index) =>
    <article className="article-card" key={article.slug} style={{ '--c': 'var(--amber)' }}>
      <div className="article-card__top"><span>PREVIEW / {article.slug.toUpperCase()}.TXT</span><span>{String(index + 1).padStart(2, '0')}</span></div>
      <ArticleCover key={article.cover?.src} article={article} preview />
      <h3>{article.title}</h3>
      <p>{article.description}</p>
      <ArticleMeta article={article} />
      <div className="article-tags">{article.tags?.map(tag => <span key={tag}>{tag}</span>)}</div>
      <div className="article-card__link"><a className="btn btn--solid" href={articleUrl(article)} aria-label={`View artikel: ${article.title}`}>▸ VIEW</a></div>
    </article>,
  )}</div>;
}

export function ArticlesPreview() {
  return <section className="sec articles-preview" id="articles" data-section>
    <div className="sec__head"><span>06 / ARTICLES</span><span>WRITING.DIR</span></div>
    <div className="intro">
      <h2 className="big">Ideas worth <em className="serif">saving.</em></h2>
      <p>Catatan dari ruang kuliah dan perjalanan belajar — ditulis, disimpan, dan dibagikan.</p>
    </div>
    <div className="articles-preview__body">
      <ArticleList entries={publishedArticles.slice(0, 3)} />
      <div className="articles-more"><a className="btn" href="/articles/">▸ ALL ARTICLES</a></div>
    </div>
  </section>;
}

function ShareArticle({ article }) {
  const [status, setStatus] = useState('');
  async function share() {
    const url = new URL(articleUrl(article), window.location.origin).href;
    try {
      if (navigator.share) {
        await navigator.share({ title: article.title, text: article.description, url });
        setStatus('Menu berbagi dibuka.');
      } else if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(url);
        setStatus('Tautan disalin. Siap ditempel ke sosial media.');
      } else {
        setStatus(`Salin tautan dari address bar: ${url}`);
      }
    } catch (error) {
      if (error.name !== 'AbortError') setStatus(`Berbagi gagal. Salin tautan dari address bar: ${url}`);
    }
  }
  return <div className="reading-share">
    <button className="btn" type="button" onClick={share}>↗ BAGIKAN ARTIKEL</button>
    <p role="status">{status}</p>
  </div>;
}

export function ArticleReader({ article }) {
  return <div className="reading-layout">
    <article className="reading-article" lang="id">
      <header className="reading-header">
        <p className="label">◆ FIELD NOTES / ARTICLE</p>
        <h1>{article.title}</h1>
        <p className="reading-description">{article.description}</p>
        <ArticleMeta article={article} />
        <div className="article-tags">{article.tags?.map(tag => <span key={tag}>{tag}</span>)}</div>
      </header>
      <ArticleCover key={article.cover?.src} article={article} />
      <div className="reading-body">{article.sections.map(section =>
        <section id={section.id} key={section.id}>
          <h2>{section.title}</h2>
          {section.paragraphs?.map((paragraph, index) => <p key={index}>{paragraph}</p>)}
          {section.list?.length > 0 && <ul>{section.list.map((point, index) => <li key={index}>{point}</li>)}</ul>}
          {section.quote && <blockquote>{section.quote}</blockquote>}
        </section>,
      )}</div>
      {article.references?.length > 0 && <section className="reading-references" id="references">
        <h2>Referensi</h2>
        <ol>{article.references.map(reference => <li key={reference.url}>
          <a href={reference.url} target="_blank" rel="noopener noreferrer">{reference.title} ↗</a>
        </li>)}</ol>
      </section>}
      <div className="reading-end"><span className="label">◆ END OF FILE</span><ShareArticle article={article} /></div>
    </article>
    <aside className="reading-aside" aria-label="Navigasi artikel">
      <p className="label">CONTENTS.TXT</p>
      <nav aria-label="Daftar isi">{article.sections.map(section => <a key={section.id} href={`#${section.id}`}>{section.title}</a>)}
        {article.references?.length > 0 && <a href="#references">Referensi</a>}
      </nav>
      <a className="btn" href="/articles/">← ALL ARTICLES</a>
    </aside>
  </div>;
}

export default function ArticlesPage({ pathname = '/articles/' }) {
  const normalized = pathname.replace(/\/+$/, '');
  const isIndex = normalized === '/articles';
  const article = publishedArticles.find(entry => normalized === articleUrl(entry).replace(/\/$/, ''));
  useEffect(() => {
    document.title = article ? `${article.title} — YANNDEV` : isIndex ? 'Articles — YANNDEV' : 'Artikel tidak ditemukan — YANNDEV';
    document.documentElement.lang = 'id';
    try {
      const saved = localStorage.getItem('theme');
      if (saved === 'light' || saved === 'dark') document.documentElement.dataset.theme = saved;
    } catch { /* Storage is optional. */ }
  }, [article, isIndex]);
  function toggleTheme() {
    const next = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
    document.documentElement.dataset.theme = next;
    try { localStorage.setItem('theme', next); } catch { /* Theme still works. */ }
  }
  return <>
    <div className="crt" aria-hidden="true" />
    <header className="nav">
      <a href="/" className="nav__logo" aria-label="Beranda YANNDEV"><span className="logo-mark">Y_</span></a>
      <nav className="nav__links" aria-label="Navigasi utama">
        <a href="/">HOME</a><a href="/articles/" className="is-active" aria-current="page">ARTICLES</a>
      </nav>
      <div className="nav__right"><Clock /><button className="nav__theme" type="button" onClick={toggleTheme} aria-label="Ganti tema">◐</button><a className="nav__cta" href="/#contact">GET IN TOUCH</a></div>
    </header>
    <main className="writing-page" id="top">
      <div className="sec__head"><span>YANNDEV / ARTICLES</span><span>READ_ONLY.MODE</span></div>
      <div className="writing-content">
        <div className="writing-toolbar"><a href={article ? '/articles/' : '/'}>← {article ? 'ALL ARTICLES' : 'BACK TO HOME'}</a><span>{article ? 'ENTRY OPENED' : `${publishedArticles.length} ENTRIES`}</span></div>
        {isIndex ? <>
          <header className="writing-intro"><p className="label">◆ NOTES, IDEAS & EXPLORATIONS</p><h1>Words into <em className="serif">pixels.</em></h1><p>Artikel kuliah dan catatan belajar Christian. Satu tulisan, satu hal baru untuk dibagikan.</p></header>
          <ArticleList />
        </> : article ? <ArticleReader article={article} /> : <header className="writing-intro">
          <p className="label">ERROR 404 / FILE NOT FOUND</p><h1>Entry <em className="serif">not found.</em></h1><p>Artikel belum diterbitkan atau tautannya tidak tersedia.</p><a href="/articles/" className="btn">▸ ALL ARTICLES</a>
        </header>}
      </div>
    </main>
    <footer className="foot writing-footer"><span>© 2026 CHRISTIAN BAGUS PRASETYA</span><span>YANNDEV · WRITING.DIR</span><a href="#top">BACK TO TOP ↑</a></footer>
  </>;
}
