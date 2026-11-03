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

`vercel.json` sudah menentukan framework, build command, dan output directory. Situs statis ini tidak memerlukan environment variable, backend, atau rewrite SPA karena navigasi memakai anchor halaman.

Jangan simpan secret di variabel `VITE_*`: nilainya masuk ke bundle browser dan dapat dibaca publik.
