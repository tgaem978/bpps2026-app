# BPPS 2026 Generator

Aplikasi interaktif untuk membina **Buku Panduan Pengurusan Sekolah 2026** dan menjananya sebagai PDF.

## Ciri-ciri
- **Papan pemuka** — kemajuan pengisian setiap bahagian buku.
- **Editor bahagian** — sunting tajuk/subtajuk dan tambah, susun atau padam blok: Tajuk, Perenggan, Senarai, Jadual, Maklumat (perkara/butiran) dan Gambar.
- **Kulit buku** — tajuk, subtajuk, alamat, moto dan logo sekolah.
- **Pratonton langsung** di sebelah editor, dan **Pratonton Buku** penuh (kulit, kandungan auto, semua bahagian).
- **Eksport PDF** — dialog cetak pelayar (pilih *Simpan sebagai PDF*), A4 potret.
- **Simpan automatik** dalam pelayar (localStorage); `Ctrl+S` untuk mengesahkan simpanan.
- **Fail projek .json** — muat turun untuk sandaran dan import semula di halaman Projek.

## Template halaman
Reka bentuk halaman diambil daripada PPTX *final DRAF 1 - BPPS2026 SKBTS* (A4 potret):
- **BPPS 01 Muka hadapan** — imej reka bentuk penuh (boleh diganti), atau dijana daripada teks.
- **BPPS 02 Isi kandungan** — dijana automatik dengan nombor muka surat.
- **BPPS 03 Partition** — halaman pemisah sebelum setiap bahagian (boleh dimatikan).
- **BPPS 05 Tajuk + teks** — jalur tajuk, bingkai kandungan, jalur kaki dengan moto & nombor halaman.

Aset dalam `public/template/`, geometri (mm) dalam `src/templates/bpps.ts`, warna & fon dalam
`src/templates/tokens.ts`. Kandungan panjang dipecah ke halaman baharu secara automatik
(`src/lib/pagination.ts`) — jadual mengulang baris tajuk pada setiap halaman.

## Cloudflare Pages (Git)
- Build command: `npm run build`
- Build output directory: `dist`
- Framework preset: None (atau Vite)
- Node version: 20 atau lebih (tetapkan env `NODE_VERSION=20` jika perlu)

## Tempatan
```
npm install
npm run dev      # pelayan pembangunan
npm run build
npm run deploy
```
