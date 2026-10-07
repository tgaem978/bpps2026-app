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

## Semakan 2
- Tinggi asal dipulihkan: header 0-37mm, footer 280-297mm (bingkai 38mm / 20mm tidak terganggu). Imej dimuat tepat pada kotak ini.
- Tajuk: Montserrat Black (wght 900 ditambah dalam index.html), lejang putih licin 16 arah + bayang jatuh, tajuk 2 baris diseimbangkan.
- Nombor halaman 3 digit dikecilkan automatik supaya muat dalam lencana.

## Semakan 3
- Header dikurangkan 50% (37mm → 18.5mm); footer dikurangkan 1/3 (17mm → 11.33mm, mulai 285.67mm). Imej dipadankan semula pada nisbah baharu; kedudukan teks dikira semula. Bingkai kandungan TIDAK diubah (kekal 38mm atas / 20mm bawah).

## Semakan 4
- Tajuk header: rata kiri, hujung huruf pertama selari dengan garis bingkai (4mm). 1–2 patah perkataan = satu baris (tengah menegak); 3+ = dua baris seimbang (`splitTitle` dalam BookPages.tsx; tidak berakhir pada kata sambung seperti DAN/DI/KE).
- Bingkai kandungan dibesarkan: kiri/kanan 4mm, atas 22.5mm (4mm di bawah header), bawah 15.33mm (4mm di atas footer). `pageGeometry.frame` + `.bp-frame`. Penomboran dikira semula secara automatik.
- Footer: Arial Narrow Bold (sandar Liberation Sans Narrow/Roboto Condensed), saiz lalai 11pt, kesan teks sama seperti tajuk header, berpusat menegak dalam ruang putih.
- Footer: lencana nombor kini segi empat selari condong (tepi kanan selari tepi kiri), bucu atas kanan selari garis bingkai kanan (206mm); lencana kedua sama bentuk ditambah dengan sela 2mm dan hujung kanan sampai tepi muka surat. Kotak nombor berpusat pada lencana pertama (left 189.45mm).
- Footer: lencana nombor ditukar kepada imej lencana baharu daripada pengguna (biru + emas, 45°); biru dimampatkan ke lebar ~17mm, bucu atas kanan di 206mm (garis bingkai), emas sampai tepi muka surat. Nombor berpusat (left 186.3mm).
- Footer: dua garisan kuning melintang dalam lencana biru dipadam.
- Footer (semakan akhir lencana): titik cahaya biru dipadam; sela biru-emas ~2mm; lebar kotak biru 20mm (muat 3 digit, nombor berpusat left 184.8mm, maks 15pt); warna emas lencana dipadankan dengan emas header/footer (#F4B41A–#FFD700).
- Nombor halaman: font, warna (putih), kesan bayang dan saiz sama seperti teks lencana biru header (`--m-title-font`, `--m-badge-color`, saiz = badgePt, dihadkan supaya 3 digit muat).
