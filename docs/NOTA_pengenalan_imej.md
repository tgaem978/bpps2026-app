# Halaman Pengenalan (12 halaman) — kekal sebagai imej, header/footer ikut sistem

- Setiap tajuk Pengenalan (b-rukun-negara … b-visi-kpm) kini satu halaman: imej asal PDF di dalam bingkai kandungan BPPS.
- Imej `public/pengenalan/isi-03.jpg` … `isi-14.jpg` = pg-03…pg-14 yang dipotong (header, footer & bingkai lama dibuang; kandungan tidak diubah). `pg-XX.jpg` asal dikekalkan sebagai sandaran.
- Header (tajuk + lencana PENGENALAN), footer dan nombor halaman (susun atur cermin) dijana sistem melalui `ContentFrame`.
- Kod: `ImageBlock.frameFill` (src/types/book.ts), `SectionContentPage` (BookPages.tsx), `.bp-fill-img` (index.css), `src/config/partPengenalan.ts`, migrasi v11 dalam bookStore.ts (bahagian yang belum disunting dimuat semula dengan imej).
- Bahagian Pengenalan yang pernah anda sunting sendiri tidak ditimpa; padam bahagian itu / import projek baharu untuk mendapat imej.
