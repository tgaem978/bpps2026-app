# Halaman Pengenalan (12 halaman) — kekal sebagai imej, header/footer ikut sistem

- Setiap tajuk Pengenalan (b-rukun-negara … b-visi-kpm) kini satu halaman: imej asal PDF di dalam bingkai kandungan BPPS.
- Imej `public/pengenalan/isi-03.jpg` … `isi-14.jpg` = pg-03…pg-14 yang dipotong (header, footer & bingkai lama dibuang; kandungan tidak diubah). `pg-XX.jpg` asal dikekalkan sebagai sandaran.
- Header (tajuk + lencana PENGENALAN), footer dan nombor halaman (susun atur cermin) dijana sistem melalui `ContentFrame`.
- Kod: `ImageBlock.frameFill` (src/types/book.ts), `SectionContentPage` (BookPages.tsx), `.bp-fill-img` (index.css), `src/config/partPengenalan.ts`, migrasi v11 dalam bookStore.ts (bahagian yang belum disunting dimuat semula dengan imej).
- Bahagian Pengenalan yang pernah anda sunting sendiri tidak ditimpa; padam bahagian itu / import projek baharu untuk mendapat imej.

## Semakan: eksport PPTX boleh disunting & susunan HEM
- pptxNative.ts: imej `object-fit: contain` (halaman Pengenalan) kini dieksport dengan nisbah asal & dipusatkan (sebelum ini diregangkan ke kotak).
- HEM: Bidang Tugas kini diletakkan selepas JK unit berkenaan (partHEM.ts `hemTopics`; migrasi v12 untuk projek sedia ada). Halaman pengenalan "Bidang Tugas Unit HEM" (hem-tugas) tidak lagi dalam susunan.
- PPTX boleh disunting: tajuk header, lencana, teks kaki & nombor halaman kini dirender sebagai imej (fon web dibenamkan, lejang putih & bayang seperti sistem) kerana fon Montserrat dll. tidak ada pada telefon/komputer lain. Badan halaman (teks, jadual, bentuk) kekal boleh disunting. Tajuk header tidak lagi boleh disunting dalam PowerPoint (ubah dalam sistem).

## HEM (semakan terkini, menggantikan susunan selang-seli)
- Susunan asal dipulihkan: semua JK Unit (1-10) dahulu, kemudian halaman pengenalan Bidang Tugas dan 8 Bidang Tugas. Bidang Tugas disusun ikut turutan JK berkaitan: Bimbingan & Kaunseling, Disiplin & Pengawas, Kebajikan & COMBI, Kantin, RMT, SPBT, Kesihatan & Rawatan, Keselamatan & Kebersihan (`HEM_TUGAS_ORDER` dalam partHEM.ts; migrasi v13).
- JK Induk HEM: jadual "Guru Penyelaras Unit" dibuang; setiap unit kini kad nama (jawatan unit + nama) dalam carta induk di bawah aras Setiausaha.
- Carta JK Induk HEM: setiap unit & Setiausaha = satu kad (tajuk unit, nama sesi pagi, nama sesi petang) — `CommitteeRow.stack`; nama tanpa bin/binti/a/l/a/p (`CommitteeBlock.cleanNames`, `shortName` dalam resolve.ts). Gambar pentadbir dikecilkan (carta jawatankuasa 17→15mm, utama 25→22mm; carta organisasi 22→20 / 30→27mm) dan diletakkan tengah-tengah bulatan (`object-position: center center`). Migrasi v14.
- Carta JK Induk HEM muat SATU halaman: `CommitteeBlock.onePage` — carta tidak dipecah; dipadatkan automatik (density 1-3: gambar, kad, jarak & fon lebih kecil) dalam pagination.ts + `.bp-dense-N .bp-cmc` (index.css).
- Bingkai bulat gambar carta organisasi dipermudah: jurang putih nipis + gelang emas halus + bayang lembut (sebelum ini 4 gelang). PPTX boleh disunting dipadankan (satu gelang emas).
