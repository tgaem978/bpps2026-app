# Nota: reka bentuk semula carta organisasi (v3, gaya rujukan biru-navy-emas)

## Perubahan
- **Kad**: putih, sempadan navy lembut, sudut membulat, garis emas nipis di bawah, bayang halus. Jalur emas tebal di atas dibuang.
- **Label jawatan**: kapsul navy (#073B79) dengan teks putih (sebelum ini teks emas bergaris).
- **Bingkai gambar**: cincin luar emas nipis (#F5C84C), cincin putih dalam, garis halus navy, bayang lembut. Bevel logam tebal dibuang.
- **Garisan hierarki**: navy, lurus, tanpa anak panah (tiada anak panah dalam kod; disahkan melalui render).
- **Kotak sisi (PIBG), label kumpulan, kotak bidang tugas**: navy + aksen emas, penanda senarai biru terang.
- **Palet carta** (pembolehubah `--oc-*` dalam `src/index.css`): navy #073B79, biru #1686D9, emas #F5C84C, kelabu #E7EBEF, arang #252B33.
- **Foto pentadbir** (`public/staff/*.jpg`): potret berwarna berlatar biru (gambar baharu daripada pengguna), dipotong 480x480, zum keluar ~16% (lebar muka ~42% bingkai); ruang kiri-kanan kepala sama, ruang atas kepala = 1/3 ruang tepi (julat kepala dikira automatik); latar gradien biru muda dari foto asal. Foto versi lama disimpan di `docs/gambar-asal-pentadbir/` (asal) dan `docs/gambar-asal-pentadbir/v2-latar-kelabu/`.
- **PPTX boleh sunting**: gelang gambar kini emas #F5C84C + garis navy (`src/lib/pptxNative.ts`).

## Fail diubah
`src/index.css`, `src/lib/pptxNative.ts`, `public/staff/*.jpg` (6 fail). Komponen, data, simpanan automatik, pratonton, eksport PDF, header/footer tidak diubah.

## Perlu disahkan
- Warna header/footer BPPS asal berasaskan teal #004358 (tetapan Master); carta kini guna navy mengikut Master Prompt. Jika mahu carta mengikut Master, tukar nilai `--oc-navy` di `.bp-oc`.
- Latar foto ialah latar biru studio asal yang licin (bukan kesan bokeh buatan). Tiada API/AI luar digunakan.
- `npm run build` belum dijalankan (registri npm disekat dalam persekitaran ini). Jalankan `npm install && npm run build` sebelum deploy.

## Kemas kini: kesan 3D timbul
- Label jawatan: kapsul kuning emas (#F5C84C) berkecerunan dengan kilau atas, bevel dan bayang; teks navy tebal (kontras lebih baik daripada teks putih di atas kuning).
- Kad nama & kotak bidang tugas: kecerunan putih ke biru muda, tepi atas berkilau, tepi bawah emas, bayang jatuh berlapis (timbul).
- Bingkai gambar: gelang emas logam (conic-gradient) dengan bevel berkilau, alur dalam terbenam, cincin putih + garis navy, dan kilau kaca pada gambar.
- Jarak dirapatkan: padding kad, jarak penyambung (`--oc-drop` 3 mm), jarak baris, jarak foto-label; tinggi carta berkurang ~4-15%.

## Kemas kini: label kembali ke warna tema header
- Label jawatan, label kumpulan dan kotak sisi: kapsul biru tema header (kecerunan #2A6CB8 -> #073B79 -> #052E63) dengan bevel dan kilau; kuning emas dikekalkan pada bingkai gambar dan garis kad.
- Teks label: putih, fon tajuk (Montserrat 800), bayang biru gelap `rgba(0,20,60,.7)` + garis kilau halus - sama seperti teks lencana tajuk di header (`.bp-badge-txt`).
