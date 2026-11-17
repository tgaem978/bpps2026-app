# Portal Kemas Kini & Edisi 2027 (migrasi v19)

## 1. Bahagian yang dilengkapkan
Bahagian yang sebelum ini nipis kini sama struktur dengan Kurikulum / HEM / Kokurikulum. Barisan pentadbir dan guru diisi automatik
daripada Pangkalan Data Guru; ruang yang memerlukan data sebenar (nama kelas, bilangan murid, masa, tarikh, AJK) dibiarkan kosong
untuk diisi melalui penjana atau **Portal Kemas Kini**. Teks pengenalan / visi / bidang tugas ialah **cadangan** - sila semak oleh unit.

| Bahagian | Halaman baharu | Fail |
|---|---|---|
| Pendidikan Khas (PPKI) | Pengenalan PPKI (maklumat program + bilangan guru automatik), Visi/Misi/Objektif, Enrolmen Murid & Kelas (+ murid inklusif), Bidang Tugas (PK PKhas, Guru PKhas, PPM), **Takwim Tahunan PPKI** (62 program sebenar daripada lajur PPKI Takwim Induk 2026) | `src/config/partPPKI.ts` |
| Prasekolah | Pengenalan (KSPK, maklumat), Visi/Misi/Objektif, Carta Organisasi (GB, GPK, Guru Prasekolah automatik), Maklumat Kelas & Guru, Jadual Rutin Harian, Bidang Tugas Guru & PPM, Takwim Tahunan | `src/config/partPrasekolah.ts` |
| Lampiran | Senarai Lampiran, Lampiran A Borang Permohonan Cuti Guru, Lampiran B Borang Kebenaran Keluar Murid, Lampiran C Buku Rekod Pergerakan Guru | `src/config/partLampiran.ts` |

Migrasi **v19** (`bookStore.ts`): halaman baharu ditambah pada bahagian berkenaan tanpa mengubah susunan pengguna; halaman pengenalan
lalai yang belum disunting (`pendidikan-khas`, `prasekolah`, `lampiran`) dimuat semula; halaman yang telah disunting / ditambah pengguna dikekalkan.

## 2. Edisi tahunan baharu (2026 → 2027)
**Portal Kemas Kini → Langkah 1 → Cipta edisi 2027** (`src/lib/rollover.ts`, `src/lib/edition.ts`):
1. Fail arkib edisi 2026 dimuat turun (`BPPS2026-SKBTS-arkib-2026.json`) - boleh diimport semula di halaman Projek.
2. Tahun ditukar pada tajuk, lencana, teks, jadual dan kulit (`2026` → `2027`, `2025/2026` → `2026/2027`). Tarikh penuh (cth. `12.01.2026`) tidak diubah.
3. **Dijana semula untuk 2027**: Kalendar 2027 (grid bulanan) dan Takwim Induk 12 bulan (tarikh, hari, Sabtu/Ahad) - sel aktiviti dikosongkan.
4. **Tarikh dikosongkan** (label dikekalkan): Kalendar Akademik, Cuti Perayaan, Minggu Akademik, Jadual Guru Bertugas (3), eRPH, Pencerapan, Semakan Hasil Kerja, Perhimpunan Bulanan, Takwim Kokurikulum / PPKI / Prasekolah. Peraturan: `DATE_PAGES` dalam `rollover.ts`.
5. Setiap halaman + kulit ditandakan **perlu dikemas kini** (`SectionContent.review`). Titik kuning di panel kiri, lencana di papan pemuka, jalur di atas penyunting dengan butang **Tandakan siap**.
6. Profil: tahun 2027, kod projek `BPPS2027-SKBTS`. "Set semula" halaman dalam edisi 2027 memulihkan kandungan asal yang telah digulung ke 2027.

**Perlu tindakan manual:** imej muka hadapan (`cover-default.jpg`) mempunyai "2026" pada reka bentuk - muat naik reka bentuk 2027 atau jana kulit daripada teks.

### Berbilang edisi dalam sistem (pilih tahun)
- Setiap edisi (2026, 2027, …) disimpan lengkap dalam **IndexedDB pelayar** (`src/lib/editions.ts`): buku, Pangkalan Data Guru, master dan profil.
- *Cipta edisi 2027* menyimpan edisi 2026 dalam sistem dahulu (fail .json juga dimuat turun sebagai sandaran).
- **Pemilih tahun** di bar atas (`EditionPicker`) - menukar edisi menyimpan edisi aktif, kemudian memuatkan edisi pilihan.
- **Pilih edisi** dipaparkan pada permulaan setiap sesi pelayar jika ada lebih daripada satu edisi (`EditionChooser`).
- Jika edisi tahun hadapan sudah wujud, butang Langkah 1 membuka edisi itu (tidak mencipta semula).
- Peti masuk: kiriman edisi X hanya boleh diterima/ditolak semasa edisi X dibuka.
- Edisi disimpan dalam pelayar/komputer ini sahaja - gunakan *Muat turun (.json)* di halaman Projek untuk sandaran atau komputer lain.

## 3. Portal Kemas Kini (dalam talian)
Penjana: menu **Portal Kemas Kini** (`/kemaskini`, `src/pages/UpdateHubPage.tsx`, `src/components/portal/*`). Portal unit: `/portal#KOD` (`src/portal/PortalApp.tsx`).

Aliran:
1. Pentadbir log masuk (kata laluan `ADMIN_PASSWORD`), **Terbitkan** buku ke portal (halaman, guru, master, profil - berkelompok).
2. **Unit & pautan akses**: "Cipta unit lalai" = satu unit bagi setiap bahagian (kecuali Lampiran), penyelaras diisi daripada nota partition. Setiap unit: skop (bahagian penuh + tajuk tambahan), pautan `/portal#XXXX-XXXX-XXXX`, butang Salin / WhatsApp / Kod baharu / Nyahaktif.
3. Penyelaras buka pautan (telefon/komputer) → sunting halaman unit dengan penyunting & pratonton A4 yang sama → **Hantar** (nama + catatan). Draf disimpan dalam pelayar penyelaras sehingga dihantar.
4. **Peti masuk**: setiap halaman dalam kiriman dipaparkan dengan ringkasan perubahan (baris +/−), pratonton Semasa vs Cadangan, amaran jika halaman telah diubah dalam penjana selepas diterbitkan. **Terima** = halaman dalam buku diganti dan ditandakan siap ("Portal · Unit (nama)"), salinan portal diselaraskan. **Tolak** = buku tidak diubah.
5. Penyelaras melihat status (Menunggu / Diterima / Ditolak) dalam **Sejarah**.

Keselamatan: kod akses rawak 12 aksara (dalam serpihan `#`, dibuang daripada bar alamat selepas log masuk); token HMAC (pentadbir 12 jam, unit 30 hari);
"Kod baharu" membatalkan sesi lama; unit hanya boleh menghantar halaman dalam skopnya; had cubaan log masuk (8 / 15 minit); kandungan disemak bentuknya.
Dalam mod portal, stor pelayar disimpan dalam memori sahaja - membuka portal dalam pelayar pentadbir tidak menimpa data penjana.

## 4. Pelayan (Cloudflare)
- `worker/index.ts` + `wrangler.toml`: Worker (`main`) dengan Workers Assets (`run_worker_first = ["/api/*"]`) dan **satu Durable Object berasaskan SQLite** (`PortalStore`) - tersedia pada pelan percuma, dicipta automatik semasa `wrangler deploy` (migrasi `v1`). Tiada pangkalan data luar.
- **Wajib sekali sahaja**: Cloudflare → Workers & Pages → **bpps2026-app** → Settings → Variables and Secrets → Add → jenis **Secret**, nama `ADMIN_PASSWORD`. (Atau `npx wrangler secret put ADMIN_PASSWORD`.)
- Tempatan: `echo 'ADMIN_PASSWORD="kata-laluan"' > .dev.vars`, `npm run build`, `npm run dev:api` (http://127.0.0.1:8787 - penjana + portal + API). `npm run dev` (Vite) menghantar `/api` ke port 8787.
- Wrangler dinaik taraf ke 4.155.0 (perlu untuk `run_worker_first`); `npm run build` kini turut menyemak jenis `worker/`.

## 5. Pengesahan
- `npm run build` (tsc penjana + worker + vite) lulus; `wrangler deploy --dry-run` lulus (bundle worker 22 KiB, binding PORTAL & ASSETS).
- Ujian API (curl) dan ujian hujung-ke-hujung Playwright pada `wrangler dev`: cipta edisi 2027 → arkib dimuat turun → log masuk → terbit → unit lalai →
  portal di telefon (390px) → sunting & hantar → peti masuk (diff + pratonton) → terima → halaman dalam buku dikemas kini & ditandakan siap → portal melihat "Diterima". Tiada ralat konsol.
- Migrasi v19 diuji pada data tersimpan v18: halaman baharu ditambah, halaman disunting & halaman tambahan pengguna dikekalkan.

## 6. Tema "Biru Navy & Emas" (edisi 2027)
- Tema disimpan bagi setiap edisi (`SchoolProfile.theme`): `klasik` (2026, header/footer imej asal) atau `biru-emas`. *Cipta edisi 2027* menetapkan `biru-emas`; boleh ditukar di halaman **Projek → Tema reka bentuk buku**.
- Rujukan: PDF *Muka Hadapan & Pembahagi BPPS SKBTS* (kulit + 9 pembahagi navy/emas dengan tab indeks) dan gaya imej rujukan (navy, emas, garisan pelan bangunan). Imej rujukan bertanda air pencipta lain **tidak** disalin - semua grafik dilukis semula sebagai SVG/CSS asal (`src/components/book/themeArt.tsx`).
- **Kulit**: logo KPM & sekolah, nama sekolah, BUKU PENGURUSAN SEKOLAH, pil *SESI AKADEMIK 2027*, moto, bangunan sekolah garis pelan, jalur kaki (kod, alamat, e-mel daripada Profil Sekolah). Kulit imej templat 2026 dikosongkan semasa cipta edisi supaya kulit 2027 dijana; muat naik imej sendiri untuk menggantikannya.
- **Pembahagi**: BAHAGIAN + nombor besar, reben navy (PENGURUSAN / tajuk / sub), ikon bulatan bersilang, **tab indeks 01–09** di tepi kanan (bahagian semasa ditonjolkan), jalur kaki navy.
- **Halaman isi**: kepala navy dengan tajuk putih condong + lencana berbingkai emas, kaki navy dengan nombor halaman pada jalur emas (cermin halaman genap/ganjil), latar kertas pelan.
- **Blok**: tajuk = reben emas dengan blok navy; tajuk VISI / MISI / OBJEKTIF / MOTO / SLOGAN / MATLAMAT → reben berpusat + kad navy (gaya Dasar PPKI / Hala Tuju); senarai bertitik = petak ✓; Maklumat (kunci-nilai) = kad dengan ikon navy (gaya Maklumat Sekolah, tanpa corak bunga); Isi Kandungan = bahagian bernombor 01, 02…
- Geometri bingkai sama dengan tema klasik → penomboran halaman tidak berubah. Fon tambahan: Montserrat italik, Oswald.
- Had: eksport PPTX *boleh disunting* masih menggunakan imej header/footer klasik; mod PPTX *gambar* dan PDF mengikut tema.

## 7. Kemasan menyeluruh tema Biru Navy & Emas + auto-imbang halaman
- **Auto-imbang** (`src/lib/pagination.ts`, hanya tema biru-emas):
  1. tajuk satu halaman yang jarang → kandungan dibesarkan (zum 1.06–1.75×, carta sehingga 1.75×, jadual sehingga 1.18×) selagi masih muat satu halaman;
  2. baki ruang diagih kepada baris jadual, kad maklumat, senarai jawatankuasa dan senarai (regangan terhad supaya kekal kemas);
  3. jika masih ≥ 34 mm kosong → panel **CATATAN** bergaris mengisi baki halaman; halaman akhir Isi Kandungan diisi ilustrasi bangunan; halaman carta tunggal dipusatkan menegak.
- **Varian blok** (`src/lib/variants.ts`): perenggan selepas VISI/MISI/MOTO/SLOGAN → kad navy; senarai/teks panjang selepas OBJEKTIF/MATLAMAT → kad cerah berbingkai emas; Kalendar → 12 bulan padat dalam satu halaman (hujung minggu berwarna emas).
- **Ruang-isi (placeholder)**: "[ … ]" → kotak/cip bergaris putus; peranan jawatankuasa tanpa nama → garisan titik; kad carta tanpa nama → kad bergaris putus (struktur carta lengkap, jelas apa yang perlu diisi).
- **Tipografi**: fon paparan Barlow Condensed (kulit, pembahagi, nombor), isi Roboto Condensed dengan jarak baris 1.28; tajuk = reben emas + garisan emas; subtajuk berpalang emas; nombor bahagian pada setiap kepala halaman.
- **Kulit & pembahagi** mengikut PDF rujukan (BUKU / PENGURUSAN SEKOLAH, pil SESI AKADEMIK, tab 01–09, jalur kaki navy-emas).
- Nilai lalai Master kini bergantung pada tema (`masterDefaults(type, theme)`); tetapan Master pengguna masih mengatasinya. Tema klasik 2026 tidak berubah.

## 8. Eksport PowerPoint mengikut tema Biru Navy & Emas
- Mod **Boleh disunting** (`src/lib/pptxNative.ts`, `addBeSlide`): setiap slaid = **lapisan reka bentuk** (imej halaman tepat seperti pratonton - kepala/kaki, reben, kad Visi/Misi, latar jadual, carta, foto, ikon; teks kandungan dilutsinarkan semasa ditangkap) + **teks & jadual PowerPoint boleh disunting** di atasnya pada kedudukan sebenar.
- Kulit & pembahagi = imej penuh (reka bentuk grafik); semua teks halaman disalin ke **nota penceramah**.
- Fon web dipetakan ke fon Office (Roboto/Barlow Condensed → Arial Narrow, Montserrat → Arial); saiz teks 4% lebih kecil dan kotak teks dilebarkan hingga tepi bekas supaya tiada balutan baris yang tidak dijangka.
- Pembetulan: nama Slide Master / objek yang mengandungi "&" kini selamat (sebelum ini PowerPoint meminta "repair" fail).
- Nama fail & tajuk pembentangan mengikut tahun edisi (`BPPS2027 - …pptx`). Tema klasik 2026 menggunakan penukar asal (tidak berubah).

## 9. Eksport PDF (tema Biru Navy & Emas)
- PDF dijana daripada halaman yang sama dengan pratonton (A4, tanpa margin, warna latar dicetak); disahkan: 286 halaman A4, fon tema (Barlow Condensed, Roboto Condensed, Montserrat) dibenamkan.
- `printBook` kini menunggu fon dan **semua gambar** (foto pentadbir, logo, carta) selesai dimuat sebelum dialog cetak dibuka (sebelum ini 0.3 saat sahaja - foto boleh hilang dalam PDF buku besar).
- Nama fail PDF lalai: `BPPS 2027 - SK Bandar Tasik Selatan` (ikut tahun edisi & nama sekolah).
- Takwim: kepala lajur MINGGU tidak lagi dipecah dua baris.
- Dalam dialog cetak: pilih *Simpan sebagai PDF*, saiz A4, margin *Tiada*, dan pastikan *Grafik latar* ditandakan jika pilihan itu dipaparkan.
