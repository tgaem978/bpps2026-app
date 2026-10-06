# Phase 04 – Header & footer baharu (semua halaman isi BPPS)

Imej: public/template/page-header.png (2172x396) dan page-footer.png (2576x194) – reka bentuk baharu, TANPA teks.
Teks ialah teks hidup yang berubah mengikut sistem:
- Tajuk halaman  : Montserrat ExtraBold, #0C2B5E, lejang putih + bayang (index.css .bp-title), berpusat di kanvas putih kiri.
- Lencana        : putih, Montserrat Bold, berpusat dalam poligon biru (.bp-badge-txt). Teks = subtajuk seksyen;
                   jika kosong → nama bahagian; jika tiada → "BPPS <tahun>".
- Teks kaki      : lalai "BUKU PANDUAN PENGURUSAN SEKOLAH | {{nama_pendek}} | {{tahun}}", Roboto Condensed Bold #0C2B5E (.bp-foot-title),
                   saiz dikecilkan automatik supaya muat satu baris.
- Nombor halaman : emas #F4B41A, Montserrat ExtraBold, dalam lencana trapezoid kanan (.bp-page-no).
Fail diubah: src/index.css, src/templates/master.ts (nilai lalai), src/components/book/BookPages.tsx, src/lib/pptxNative.ts (tajuk PPT di tengah).
Halaman tanpa header/footer (kulit, partition) tidak berubah. Nilai master yang pernah anda ubah sendiri (Tetapan > Master) kekal; tekan "Set semula" untuk guna lalai baharu.
