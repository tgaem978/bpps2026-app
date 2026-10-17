# Nota: reka bentuk semula kad carta organisasi & carta jawatankuasa

## Perubahan reka bentuk
- **Satu komponen kad** (`Card` dalam `src/components/book/BlockView.tsx`) untuk semua carta: kad bergambar (Guru Besar & GPK) dan kad nama (ahli lain, kumpulan penyelaras). Kelas lama `bp-plate`, `bp-chip`, `bp-oc-gbox` dibuang.
- **Kad bergambar**: gambar bulat separuh bertindih pada tepi atas kad (bukan blok gambar + plat berasingan) - menjimatkan ~25-34% tinggi carta.
- **Kad nama**: bingkai, jalur emas atas, jejari sudut dan bayang sama dengan kad bergambar; semua teks berpusat.
- Penyambung (garisan) kini bersambung ke SEMUA kad, termasuk kad tumpuan di tengah (sebelum ini kad tumpuan tiada penyambung dan gambar dibesarkan 116%; kini hanya bingkai & bayang lebih jelas).
- Kad dalam satu baris sama tinggi; nama sentiasa sejajar di bawah, label jawatan di atas.

## Tipografi (seragam, di `src/index.css` - pembolehubah `--oc-*`)
| Unsur | Gaya |
|---|---|
| JAWATAN (label) | fon badan, 5.2 pt, tebal, huruf besar, jarak huruf 0.08em, emas gelap (kontras lebih baik), garis halus di bawah |
| NAMA | fon tajuk, 6.6 pt, tebal, HURUF BESAR, warna tajuk |
| Keterangan (cth. GPK Pentadbiran / nota) | 5 pt, sederhana, kelabu |
| Guru Besar (kad utama) | nama 8.6 pt, jawatan 6.2 pt |
Mod padat (`bp-dense-1..3`) kini hanya menukar nilai pembolehubah (saiz gambar, jarak, saiz fon); tiada lagi peraturan CSS berganda.

## Cara penulisan (seragam, di `src/lib/resolve.ts`)
- `chartName()`: HURUF BESAR, tanpa bin/binti/bt/bte/a/l/a/p, jarak tunggal, alias ditulis `NAMA @ ALIAS`.
- `chartRole()`: jarak tunggal, `&` dengan ruang; huruf besar oleh CSS.
- Sebelum ini hanya carta HEM membuang bin/binti; carta lain memaparkan nama penuh bercampur. Kini semua carta (organisasi + jawatankuasa) sama.
- Untuk mengekalkan nama penuh pada satu carta: tetapkan `cleanNames: false` pada blok carta tersebut (data nama dalam Pangkalan Data Guru TIDAK diubah).

## Fail diubah
`src/components/book/BlockView.tsx`, `src/index.css`, `src/lib/resolve.ts`, `src/types/book.ts` (medan `cleanNames` pada `OrgChartBlock`; lalai `CommitteeBlock` ditukar kepada "bersih").

## Pengesahan
Pemasangan npm disekat dalam persekitaran penyediaan, jadi `npm run build` belum dijalankan. Jalankan `npm install && npm run build` sebelum deploy.

## Kemas kini 2 (bingkai timbul, gambar pentadbir, nama)
- **Bingkai gambar**: gelang emas logam bergradien (conic-gradient) dengan efek bevel (highlight atas-kiri, bayang bawah-kanan), bayang jatuh lembut dan alur dalam (inset) supaya gambar kelihatan terbenam. Eksport PPTX: gelang emas + bulatan dalam.
- **Gambar pentadbir** (`public/staff/*.jpg`, 6 fail diganti; asal disimpan di `docs/gambar-asal-pentadbir/`): latar diasingkan dan diganti kelabu gradient (cerah di tengah-atas), saiz kepala diseragamkan (~40% lebar bingkai; GPK HEM 46% kerana gambar asal terlalu rapat), kepala dipusatkan, tepi badan dipudarkan. Gambar kini persegi 480x480.
- **Nama pentadbir** satu baris jika muat (skala sepunya dalam satu baris kad, minimum 82%); jika tidak, dua baris pada saiz yang sama.
- **Kad nama**: nama berpusat menegak dalam ruang di bawah label jawatan.
- bin/binti/a/l/a/p dibuang pada semua carta.
