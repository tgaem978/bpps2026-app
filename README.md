# BPPS 2026 Generator

Aplikasi interaktif untuk membina **Buku Panduan Pengurusan Sekolah 2026** dan menjananya sebagai PDF.

## Ciri-ciri
- **Papan pemuka** — kemajuan pengisian setiap bahagian buku.
- **Editor bahagian** — sunting tajuk/subtajuk dan tambah, susun atau padam blok: Tajuk, Perenggan, Senarai, Jadual, Maklumat (perkara/butiran) dan Gambar.
- **Kulit buku** — tajuk, subtajuk, alamat, moto dan logo sekolah.
- **Pratonton langsung** di sebelah editor, dan **Pratonton Buku** penuh (kulit, kandungan auto, semua bahagian).
- **Eksport PDF** — dialog cetak pelayar (pilih *Simpan sebagai PDF*), A4 landskap.
- **Simpan automatik** dalam pelayar (localStorage); `Ctrl+S` untuk mengesahkan simpanan.
- **Fail projek .json** — muat turun untuk sandaran dan import semula di halaman Projek.

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
