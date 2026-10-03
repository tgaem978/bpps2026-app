# BPPS 2026 Generator

Aplikasi interaktif untuk membina **Buku Panduan Pengurusan Sekolah 2026** dan menjananya sebagai PDF.

## Ciri-ciri
- **Papan pemuka** — kemajuan pengisian setiap bahagian buku.
- **Editor bahagian** — sunting tajuk/subtajuk dan tambah, susun atau padam blok: Tajuk, Perenggan, Senarai, Jadual, Maklumat (perkara/butiran) dan Gambar.
- **Kulit buku** — tajuk, subtajuk, alamat, moto dan logo sekolah.
- **Pratonton langsung** di sebelah editor, dan **Pratonton Buku** penuh (kulit, kandungan auto, semua bahagian).
- **Eksport PDF** — dialog cetak pelayar (pilih *Simpan sebagai PDF*), A4 potret.
- **Muat turun PowerPoint (.pptx)** — keseluruhan buku, satu bahagian utama, satu tajuk (bersama subtajuk) atau halaman tertentu; satu halaman A4 = satu slaid potret. Format *boleh disunting* (teks, jadual, bentuk dan gambar sebagai objek PowerPoint; jalur kepala/kaki, bingkai dan placeholder tajuk dalam Slide Master) atau *gambar* (rupa tepat).
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

## Kandungan sebenar BPPS 2026 SKBTS
Kandungan lalai diimport daripada dokumen sebenar sekolah (dijana, jangan sunting dengan tangan):
- `src/config/partA.ts` — Bahagian A Pentadbiran (*v10 C-PENTADBIRAN SEKOLAH*) dan senarai 126 staf.
- `src/config/partB.ts` — Bahagian B Pengenalan & Maklumat Sekolah (*v3 B-PENGENALAN SEKOLAH*), Kalendar 2026, Cuti Perayaan, Kalendar Akademik dan Takwim Induk 12 bulan (*DRAF2 TAKWIM 2026*); imej dalam `public/content/`.
- `src/config/partKK.ts` — Kurikulum (*FINAL KURIKULUM 7 JAN*), Kokurikulum (*v9 JK Kokurikulum*) dan Kata Pengantar Guru Besar.

Ahli jawatankuasa dipautkan kepada Pangkalan Data Guru (ejaan nama berbeza dipadankan), dengan nota tugas
pilihan seperti "SU Peperiksaan". Jawatankuasa boleh dipaparkan sebagai *senarai peranan* atau *carta bergambar*.

## Cloudflare Workers (Git)
Projek Workers Builds: **bpps2026-app** (nama mesti sama dengan `name` dalam `wrangler.toml`).
- Build command: `npm run build`
- Deploy command: `npx wrangler deploy` (lalai)
- Aset statik daripada `dist/`; laluan SPA dihidangkan oleh `index.html` (`not_found_handling`).
- Node version: 20 atau lebih (tetapkan env `NODE_VERSION=20` jika perlu)

## Tempatan
```
npm install
npm run dev      # pelayan pembangunan
npm run build
npm run deploy
```
