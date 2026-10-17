# Bahagian Pengurusan & Pentadbiran (templat daripada PDF rujukan)

Sumber struktur: "ii. PENTADBIRAN DAN PENGURUSAN" (PDF, sekolah lain). Hanya tajuk, subtajuk, susunan lajur dan senarai peranan/bidang tugas
diambil; **tiada nama dari PDF digunakan**. Pentadbir & guru diisi automatik daripada Pangkalan Data Guru SKBTS (ikut jawatan).
Fail baharu: `src/config/partPentadbiran.ts`. Bahagian ini dinamakan semula **PENGURUSAN & PENTADBIRAN** (id `p-pentadbiran`).

## Struktur
1. **Carta Organisasi Sekolah** (+ kotak sisi PIBG) → *Carta Organisasi Pentadbiran dan Pengurusan* → *Carta JK Induk Pusat Sumber*
2. Senarai Nama Guru & AKP (sedia ada: pagi / petang / AKP)
3. **ID DELIMa Guru** (nama guru diisi; e-mel kosong)
4. Guru Kelas dan Guru Bantu (sedia ada)
5. **Jawatankuasa** - 18 halaman (Pengurusan Tertinggi, Pentadbiran & Staf Sokongan, Mesyuarat Guru, Kewangan & Akaun, Buku Pengurusan & Takwim,
   Maklumat Sekolah, TS25, Perkembangan Staf & PLC, SKPM, Lembaga Tatatertib, Papan Kenyataan, Bimbingan & Kaunseling, Kajian Tindakan,
   Mentor Mentee, Pusat Sumber, Anugerah NILAM, Teknikal & Siar Raya, PIBG). Barisan pentadbir automatik; ruang lain kosong untuk diisi; Bidang Tugas daripada rujukan.
6. **Jadual Pencerapan 2026** → eRPH → Pencerapan Guru → Semakan Hasil Kerja Murid (nama guru SKBTS diisi; kolum lain kosong)
7. **Pengurusan Program Khas Sekolah** - Unit Kurikulum / HEM / Kokurikulum (JK + jadual program kosong)
8. Kumpulan Guru Bertugas + Jadual Mingguan (sedia ada, sepadan dengan "Jadual Tugasan Mingguan")
9. Panduan Am, Akuan, Bidang Tugas Guru & AKP (sedia ada, dikekalkan di hujung)

"Penyelaras Bilik-bilik Khas" tidak diulang: sudah wujud dengan data sebenar di Pengurusan Kurikulum (`k-bilik-khas`).

## Blok baharu: Carta Struktur (`orgtree`)
Puncak (Guru Besar) + kotak sisi pilihan, pentadbir sebagai lajur kad bergambar, dan kotak unit/bidang tugas di bawah setiap pentadbir.
Disunting dalam editor tajuk (Tambah blok → Carta Struktur): jawatan lajur, tajuk kotak, senarai titik (satu baris = satu titik).
Gaya sama carta lain (kad, gelang emas, garisan, `--oc-*`); muat satu halaman (dipadatkan automatik, `bp-dense-1..3`); eksport PPTX melalui laluan DOM sedia ada.
Fail: `types/book.ts`, `lib/blocks.ts`, `lib/units.ts`, `lib/pagination.ts`, `components/book/BlockView.tsx`, `components/editor/StaffBlockEditors.tsx`, `index.css`.

## Migrasi (v15)
Pengguna sedia ada: struktur lama yang belum diubah diganti struktur baharu; "Carta Organisasi Induk" dan "JK Pengurusan" lama yang telah disunting dikekalkan.

## Andaian untuk disemak
- Lajur **GPK Pendidikan Khas** ditambah pada carta (SKBTS ada 5 pentadbir; rujukan hanya 4). Kandungan PPKI ditulis berdasarkan carta PPKI sedia ada.
- Bidang tugas PK (carta 1) ikut rujukan; singkatan lama (PROTIM, PATS, PLBS, NKRA) dikekalkan untuk disemak/dibuang.
- Kod eRPH dalam jadual (GB, PKP, PKHEM, PKKO, PKPTG, PKPK) ialah cadangan.
- `npm run build` belum dijalankan (npm disekat); paparan diuji melalui pelayar dengan data sebenar. Jalankan `npm install && npm run build` sebelum deploy.
