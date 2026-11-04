# GRINTEC: Phishing Awareness & Pre-Assessment

Website statis (HTML, CSS, JavaScript vanilla) untuk edukasi dan pre-assessment deteksi email phishing, dalam dua bahasa. Tidak ada backend, build step, atau library eksternal. Semua progres disimpan di `localStorage` browser pengguna, dan tidak ada data yang dikirim ke server.

## Struktur

```
index.html, learn.html, simulation.html,
assessment.html, result.html      Versi BAHASA INGGRIS (default, di root)
id/*.html                         Versi BAHASA INDONESIA (halaman yang sama)

assets/css/style.css     Design system (token warna, komponen, mode ujian, cetak)
assets/js/i18n.js        Semua teks yang dibuat JavaScript, EN + ID
assets/js/app.js         Bahasa aktif, state + localStorage, navigasi, reset, beranda & belajar
assets/js/simulation.js  Simulasi phishing 4 tahap (email, SMS, chat, QR) + hasilnya
assets/js/assessment.js  Tes (mode ujian satu layar) + halaman hasil
assets/fonts/            Jost (di-host sendiri, tanpa Google Fonts)
assets/img/logo-grintec.png  Logo versi web (800px). File asli: grintec-logo.png

data/sim.js           Konten simulasi, Inggris     data/sim.id.js        Indonesia
data/questions.js     Bank soal + kategori, Inggris data/questions.id.js  Indonesia
```

Halaman bahasa Inggris memuat `data/*.js`, halaman Indonesia memuat `data/*.id.js`. Bahasa teks JavaScript dipilih dari `<html lang="...">`. Tombol "Bahasa Indonesia" / "English" di header membuka halaman yang sama dalam bahasa lain. Progres tersimpan sama untuk kedua bahasa.

## Sebelum dipublikasikan

- Bagian **Why this matters / Mengapa ini penting** di `index.html` dan `id/index.html` (dicek November 2026):
  - 62% kebocoran melibatkan manusia: Verizon 2026 DBIR. Angka ini dikutip konsisten oleh banyak sumber, tetapi PDF lengkap Verizon perlu diunduh lewat formulir. Cocokkan sekali dengan PDF-nya sebelum rilis.
  - 191.561 laporan phishing/spoofing (jenis terbanyak) dan kerugian BEC US$3.046.598.558: FBI IC3 2025 Internet Crime Report, sudah dicocokkan langsung dengan PDF resminya.
  - Angka studi kasus (60,6% / 7,0% / 5,6% / 36,6%, target 50%): halaman studi kasus GRINTEC di grintecs.com/en/works/phishing-simulation-casestudy/.
  - Perbarui saat DBIR dan laporan IC3 edisi baru terbit (biasanya April sampai Mei).
- Tagline dan kontak diambil dari grintecs.com (November 2026): "Securing Future Transformation", info@grintecs.com, WhatsApp +62 851 6136 4811. Perbarui di footer kedua bahasa dan di blok CTA `result.html` jika berubah.
- Pastikan domain fiktif di contoh (misalnya `nusantararaya.co.id`, `kirimcepat.co.id`, `contohsejahtera.co.id`, `tokolaris.co.id`, `akunkerja365.com`, serta domain jebakan seperti `contohsejahtera-id.com`, `akunkerja-docs.net`, `nusantararaya-verifikasi.com`, `share-files.net`, `bayarparkir-online.com`) memang tidak dimiliki perusahaan nyata. Ganti di kedua bahasa jika ternyata ada.

## Menjalankan dan deploy

Situs bisa dibuka langsung dengan klik dua kali `index.html` (data memakai file `.js`, bukan JSON, agar jalan tanpa server). Untuk pengujian yang mirip kondisi online:

```bash
python3 -m http.server 8000
# buka http://localhost:8000      (Inggris)
#      http://localhost:8000/id/  (Indonesia)
```

**GitHub Pages:** push folder ini ke repository, buka Settings → Pages, pilih branch `main` dan folder `/ (root)`.
**Netlify:** seret folder ini ke app.netlify.com/drop, atau hubungkan repository tanpa build command, dengan publish directory `.`.
**Server statis lain (Nginx, Apache, S3):** unggah semua file apa adanya.

`grintec-logo.png` (file asli, 11449px) tidak dipakai halaman dan boleh tidak diunggah.

## Mode ujian

Setelah pengguna menekan "Start the test / Mulai tes", halaman tes berubah menjadi satu layar ujian: header dan footer situs disembunyikan, ada bar ujian (nomor soal, timer opsional, Exit, Finish), daftar nomor soal, tombol "Mark for review / Tandai untuk ditinjau", dan tombol layar penuh (hanya muncul jika browser mendukung Fullscreen API; iPhone tidak). Sebelum selesai, pengguna melihat ringkasan soal yang belum dijawab dan yang ditandai. "Exit / Keluar" menyimpan progres.

## Menambah atau mengubah soal tes

Edit **kedua** file: `data/questions.js` (Inggris) dan `data/questions.id.js` (Indonesia). `id`, `type`, `level`, `cat`, `answer`, dan `id` opsi harus sama di kedua file. Yang berbeda hanya teksnya.

```js
{
  id: "q26",               // unik, jangan dipakai ulang
  type: "scenario",        // "email" | "scenario" | "url"
  level: "sedang",         // "mudah" | "sedang" | "sulit" (kunci yang sama di kedua bahasa)
  cat: "transfer",         // kunci di GRINTEC_CATEGORIES
  prompt: "Pertanyaan...",
  options: [               // untuk "scenario" dan "url" (diacak otomatis)
    { id: "a", text: "..." },
    { id: "b", text: "..." }
  ],
  answer: "b",             // id opsi benar. Untuk "email": "safe" atau "phish"
  explanation: "Penjelasan yang muncul di halaman hasil."
}
```

Soal tipe `email` memakai `mail` sebagai pengganti `options`:

```js
mail: { fromName: "...", fromAddress: "...", subject: "...", snippet: "...", attachment: "opsional.pdf" }
```

Jumlah soal per tingkat diatur di `GRINTEC_CONFIG.perLevel` (default 5/5/5). Bank soal minimal harus punya soal sebanyak angka itu di setiap tingkat. Batas kategori hasil diatur di `GRINTEC_CONFIG.levels`.

## Mengubah konten simulasi

Simulasi punya empat tahap berurutan: **email**, **SMS**, **chat**, dan **QR**, lalu halaman hasil. Setiap tahap punya hitung mundur (`seconds`) dan konteks singkat yang tampil sebelum tahap dimulai. Peserta bisa membuka pesan dan menekan "Laporkan". Klik pada link, tombol, atau "Buka link" dari QR mana pun langsung menutup tahap itu dan tercatat sebagai klik.

Edit **kedua** file: `data/sim.js` dan `data/sim.id.js`. Struktur lengkap ada di komentar atas `data/sim.js`. Setiap pesan phishing punya `flags` (daftar `{ cat, note }`) dan `trap` (apa yang terjadi jika diklik). Pesan aman wajib punya `safeReason`. Tulis `{nama}` untuk menyapa pengguna dengan namanya.

Kode QR digambar sebagai pola dekoratif yang sengaja **tidak bisa dipindai** kamera, sehingga tidak ada orang yang benar-benar membuka domain jebakan.

Halaman hasil menampilkan level (Rentan / Cukup Waspada / Sangat Waspada), angka ala laporan PhaaS (dibuka, jebakan diklik, jebakan dilaporkan, salah lapor), pembahasan per pesan, dan CTA "Implement this in my company" / "Terapkan di perusahaan saya".

Aturan konten: gunakan brand, orang, dan domain **fiktif**. Jangan memakai nama, logo, atau domain perusahaan maupun instansi nyata.

## Mengubah teks antarmuka

- Teks statis halaman: langsung di file HTML (`*.html` untuk Inggris, `id/*.html` untuk Indonesia).
- Teks yang dibuat JavaScript (layar simulasi, layar tes, hasil): `assets/js/i18n.js`. Setiap kunci harus ada di `id` dan `en`.

## Kategori red flag

Kategori di `GRINTEC_CATEGORIES` dipakai di grafik hasil dan rekomendasi. `anchor` adalah `id` kartu di `learn.html`, sehingga rekomendasi membuka kartu yang sesuai. Jika menambah kategori, tambahkan juga kartunya di `learn.html` dan `id/learn.html`.

## Progres yang tersimpan

Semua data ada di satu kunci `localStorage`: `grintec-pa-v1`. Jika struktur data diubah besar-besaran, ganti nama kunci di `assets/js/app.js` (misalnya `-v2`) agar progres lama tidak bentrok.
