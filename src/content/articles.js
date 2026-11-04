import borneo from './borneo.js';

// Duplicate this draft to add an article. Only published: true appears publicly.
export const articles = [
  borneo,
  {
    slug: 'contoh-artikel',
    published: false,
    title: 'Dari ide menjadi tulisan',
    description: 'DEMO — contoh tampilan artikel. Tekan VIEW untuk melihat halaman baca dengan judul, foto, dan isi lengkap. Bukan artikel tugas kuliah.',
    date: '2026-11-03',
    tags: ['DEMO', 'Contoh tampilan'],
    cover: {
      src: '/assets/articles/contoh-artikel.svg',
      alt: 'Ilustrasi pixel sebuah dokumen dengan latar grid dan orbit',
      caption: 'Ilustrasi contoh YANNDEV. Ganti dengan foto untuk artikelmu.',
    },
    sections: [
      {
        id: 'tentang-contoh',
        title: 'Tentang halaman ini',
        paragraphs: ['Ini artikel demo untuk memperlihatkan tampilan halaman baca. Halaman Articles hanya menampilkan sampul, judul, dan ringkasan. Tombol VIEW membawa pembaca ke halaman ini untuk membaca tulisan lengkap.'],
      },
      {
        id: 'mulai-menulis',
        title: 'Mulai dari satu ide',
        paragraphs: ['Sebuah tulisan bisa dimulai dari pertanyaan yang ditemui saat belajar. Catat pertanyaannya, tentukan pokok pembahasan, lalu susun penjelasan dengan urutan yang mudah diikuti pembaca.', 'Ganti contoh ini dengan artikelmu sendiri. Tambahkan foto yang relevan, jelaskan gagasan dengan kata-katamu, dan cantumkan referensi jika memakai sumber lain.'],
      },
      {
        id: 'bagikan-tulisan',
        title: 'Simpan dan bagikan',
        paragraphs: ['Setelah tulisan selesai dan diterbitkan, bagikan URL halaman artikel ke sosial media. Tombol BAGIKAN ARTIKEL di bawah membantu membuka menu berbagi atau menyalin tautannya.'],
      },
    ],
    references: [],
  },
  {
    slug: 'judul-artikel-pertama',
    published: false,
    title: 'Judul artikel pertama',
    description: 'Tulis ringkasan singkat artikel untuk daftar artikel dan preview sosial media.',
    date: '2026-11-03',
    tags: ['Kuliah'],
    // Put your photo in public/assets/articles/, then set src to /assets/articles/filename.jpg.
    cover: {
      src: '',
      alt: 'Deskripsi foto yang relevan dengan artikel',
      caption: 'Keterangan foto dan kredit sumber jika diperlukan.',
    },
    sections: [
      {
        id: 'pendahuluan',
        title: 'Pendahuluan',
        paragraphs: ['Tulis latar belakang, tujuan, dan pembuka artikel di sini.'],
      },
      {
        id: 'pembahasan',
        title: 'Pembahasan',
        paragraphs: ['Tulis pembahasan utama dengan kata-katamu sendiri.'],
        list: ['Poin pembahasan pertama.', 'Poin pembahasan kedua.'],
        quote: 'Kutipan opsional. Cantumkan sumber pada daftar referensi.',
      },
      {
        id: 'kesimpulan',
        title: 'Kesimpulan',
        paragraphs: ['Rangkum temuan dan kesimpulan artikel di sini.'],
      },
    ],
    references: [
      { title: 'Ganti dengan judul sumber rujukan', url: 'https://example.com' },
    ],
  },
];

export const articleUrl = (article) => `/articles/${article.slug}/`;
export const readingMinutes = (article) => Math.max(1, Math.ceil(
  article.sections.map(section => [section.title, ...(section.paragraphs ?? []), ...(section.list ?? []), section.quote ?? ''].join(' '))
    .join(' ').trim().split(/\s+/u).length / 200,
));

export function getPublishedArticles(entries = articles) {
  const slugs = new Set();
  return entries.filter(article => article.published === true).map(article => {
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(article.slug) || slugs.has(article.slug)) {
      throw new Error(`Invalid or duplicate article slug: ${article.slug}`);
    }
    slugs.add(article.slug);
    if (!article.title?.trim() || !article.description?.trim() ||
        !/^\d{4}-\d{2}-\d{2}$/.test(article.date) ||
        new Date(`${article.date}T00:00:00Z`).toISOString().slice(0, 10) !== article.date ||
        !Array.isArray(article.sections) || !article.sections.length) {
      throw new Error(`Incomplete article: ${article.slug}`);
    }
    for (const image of [article.cover, ...article.sections.map(section => section.image)].filter(image => image?.src)) {
      const source = image.src;
      const isLocal = source.startsWith('/assets/') && !/[?#\\]/.test(source) &&
        !source.split('/').some(part => part === '.' || part === '..');
      if ((!isLocal && !/^https:\/\//.test(source)) || !image.alt?.trim()) {
        throw new Error(`Invalid cover in article: ${article.slug}`);
      }
    }
    const ids = new Set(['references']);
    for (const section of article.sections) {
      if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(section.id) || ids.has(section.id) || !section.title?.trim()) {
        throw new Error(`Invalid section in article: ${article.slug}`);
      }
      ids.add(section.id);
    }
    for (const reference of article.references ?? []) {
      if (!reference.title?.trim() || !/^https?:$/.test(new URL(reference.url).protocol)) {
        throw new Error(`Invalid reference in article: ${article.slug}`);
      }
    }
    return article;
  }).sort((a, b) => b.date.localeCompare(a.date));
}

export const publishedArticles = getPublishedArticles();
