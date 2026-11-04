# YANNDEV

Portfolio React + Vite. Desain, stylesheet, konten, dan animasi dipertahankan dari versi HTML/CSS/JavaScript.

## Lokal

Node.js **24.x** dan npm diperlukan. Versi Node tersedia di `.nvmrc`.

```sh
npm ci
npm run dev
```

Buka URL yang ditampilkan Vite, biasanya `http://localhost:5173`.

```sh
npm test
npm run build
npm run preview
```

`npm test` memeriksa struktur halaman, jumlah skill/sertifikat, keberadaan preview, dan konfigurasi deployment. Build produksi ada di `dist/`.

## Struktur

- `src/App.jsx`: markup halaman, tema, filter, dan pemilihan preview.
- `src/components.jsx`: boot loader, jam, teks scramble, gambar, skill, dan dialog preview.
- `src/useAnimations.js`: observer dan animasi dengan pembersihan lifecycle React.
- `src/style.css`: CSS asli, tanpa perubahan desain.
- `public/assets/`: foto, gambar, dan sertifikat; URL tetap `/assets/...`.

Foto `assets/photos/profile` dan `assets/photos/activity-2` belum tersedia pada versi asli. Placeholder asli tetap ditampilkan. Tambahkan file `.png`, `.jpg`, `.jpeg`, atau `.webp` dengan nama tersebut ke `public/assets/photos/` untuk menampilkannya.

## Deploy Vercel

1. Masuk ke [Vercel](https://vercel.com/new), lalu import `yann-gamedev/yanndev-profile`.
2. Gunakan root directory `./`, framework **Vite**, dan Node.js **24.x**.
3. Build command: `npm run build`. Output directory: `dist`. Install command: `npm ci`.
4. Klik **Deploy**. Push berikutnya ke `main` memicu deployment produksi otomatis setelah repository terhubung.

`vercel.json` sudah menentukan framework, build command, dan output directory. Situs statis ini tidak memerlukan backend atau rewrite SPA. `npm run build` menghasilkan HTML untuk `/articles/`, tiap artikel terbit, dan halaman 404. HTML artikel sudah berisi konten serta metadata Open Graph/Twitter sehingga crawler sosial media tidak perlu menjalankan JavaScript.

Untuk canonical URL dan `og:url`, build memakai domain produksi bawaan Vercel. Jika memakai custom domain, set environment variable `SITE_URL=https://domain-kamu.com` di Vercel lalu redeploy. Nilai ini URL publik, bukan secret.

Jangan simpan secret di variabel `VITE_*`: nilainya masuk ke bundle browser dan dapat dibaca publik.

## Menulis dan menerbitkan artikel

1. Buka `src/content/articles.js`. Duplikat objek draft yang tersedia dalam array `articles`.
2. Isi `slug` unik (huruf kecil, angka, tanda hubung), `title`, `description`, `date` (`YYYY-MM-DD`), dan `tags`.
3. Isi `cover.src` dengan URL foto, misalnya `/assets/articles/foto-artikel.jpg` (file disimpan di `public/assets/articles/`), lalu isi `cover.alt` sebagai deskripsi foto dan `cover.caption` sebagai keterangan/kredit. URL HTTPS eksternal juga didukung. Tanpa foto, placeholder ditampilkan. Daftar artikel hanya menampilkan foto preview, judul, ringkasan, dan tombol **VIEW**; tombol ini membuka halaman terpisah berisi judul, foto penuh, serta isi bacaan.
4. Isi `sections`: tiap bagian punya `id` unik, `title`, serta `paragraphs`. Opsional: `list` untuk poin dan `quote` untuk kutipan. Isi `references` dengan judul sumber serta URL HTTP/HTTPS. Teks dirender aman sebagai teks, bukan HTML.
5. Ubah `published: false` menjadi `published: true` jika tulisan siap. Jalankan `npm test` dan `npm run build`.
6. Deploy perubahan. Artikel muncul di beranda, `/articles/`, dan `/articles/slug-artikel/`. Bagikan URL halaman artikel atau gunakan tombol **BAGIKAN ARTIKEL**; browser tanpa menu berbagi memakai salin tautan.

Draft tidak tampil dan tidak memiliki halaman publik. Jangan menyimpan informasi rahasia pada draft: repository ini publik. Artikel pertama, **Paru-Paru Borneo Terbakar, Istana Pura-Pura Buta**, ada di `src/content/borneo.js` dan diimpor melalui `src/content/articles.js`. Teks dan dua gambar diambil dari PDF artikel; tanggal publikasi situs diatur ke 4 November 2026. Demo `contoh-artikel` kini berstatus draft. Gambar per bagian bisa ditambahkan melalui `section.image` dengan properti `src`, `alt`, dan `caption`, sama seperti `cover`.

`src/Articles.jsx` berisi daftar, halaman baca, daftar isi, estimasi waktu baca, referensi, dan tombol berbagi. Gaya tambahan ada di `src/articles.css`; CSS lama tetap terpisah. Halaman artikel memakai navigasi link biasa tanpa dependency router tambahan.
