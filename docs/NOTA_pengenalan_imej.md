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
