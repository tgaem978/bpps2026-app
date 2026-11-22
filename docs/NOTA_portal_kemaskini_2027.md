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

## 10. Portal Kemas Kini - identiti Biru Navy & Emas
- **/portal** (penyelaras): warna navy/emas (token reka bentuk portal), latar grid pelan, halaman log masuk bergaya kulit buku (logo KPM & sekolah, PORTAL KEMAS KINI, pil SESI AKADEMIK tahun edisi daripada `/api/health`, lukisan bangunan), kepala navy berjalur emas dengan butang **Hantar** emas, kad selamat datang dengan kiraan (halaman unit, perlu dikemas kini, belum dihantar, menunggu semakan) dan bar kemajuan emas.
- **/kemaskini** (pentadbir): jalur hero navy-emas, nombor langkah 01-05 dalam lencana emas, kad berjalur emas.
- Pembetulan: unit lalai bagi "PENGURUSAN & PENTADBIRAN" kini dinamakan "Pengurusan & Pentadbiran" (sebelum ini "& Pentadbiran").

## 11. Pengenalan unit seragam (Kurikulum = HEM = Kokurikulum = PPKI)
Setiap unit kini dibuka dengan empat halaman pengenalan yang sama susunan, gaya dan jenis maklumat seperti Unit Kurikulum (`src/config/unitPengenalan.ts`):

| Kurikulum | Hal Ehwal Murid | Kokurikulum | PPKI |
|---|---|---|---|
| Ketetapan Dasar | Ketetapan Dasar | Ketetapan Dasar | Ketetapan Dasar *(baharu)* |
| Visi dan Misi | Visi dan Misi | Visi dan Misi | Visi dan Misi |
| Objektif dan Matlamat | Objektif dan Matlamat | Objektif dan Matlamat *(baharu)* | Objektif dan Matlamat *(baharu)* |
| Pengenalan (KPI) | Pengenalan (KPI) | Pengenalan (KPI) | Pengenalan (KPI) |

- **Ketetapan Dasar**: bermula dengan *1. LATAR BELAKANG* dan *2. OBJEKTIF* ("Penetapan dasar ini digariskan atas tujuan berikut:"), diikuti dasar, mesyuarat dan seksyen lain bernombor; subtajuk dinombor semula termasuk julat (cth. 8.3 - 8.4). Piagam Pelanggan dan Strategi Kokurikulum digabungkan ke dalam Ketetapan Dasar.
- **Visi dan Misi**: jadual berikon Visi, Misi, Motto, KPI Sekolah {tahun}, Matlamat, Objektif (baris kosong menjadi ruang isian).
- **Objektif dan Matlamat**: dua kad navy berlabel emas + ruang Catatan (kad kekal navy hingga 640 aksara supaya seragam antara unit).
- **Pengenalan (KPI)**: KEY PERFORMANCE INDICATOR (KPI) UNIT … dengan ruang isian KPI 1-3 untuk diisi penyelaras melalui portal.
- PPKI: Maklumat Program dipindah ke halaman Murid PPKI; halaman lain PPKI kekal.
- Migrasi (v20): halaman yang belum disunting dikemas kini ke susunan baharu; halaman yang telah disunting / bertanda *Siap* tidak disentuh. Dalam edisi 2027, halaman baharu ditanda *Perlu dikemas kini*.

## 12. Carta Organisasi Induk unit & foto dalam bulatan
- Carta Organisasi Kurikulum, HEM, Kokurikulum dan Prasekolah kini seragam dan lengkap: Pengerusi (Guru Besar) → Timbalan Pengerusi (GPK unit) → Naib Pengerusi (GPK lain) → Setiausaha → Ketua Panitia / Guru Penyelaras (nama diisi automatik daripada Pangkalan Data Guru).
- Foto pentadbir dalam bulatan: bingkai lalai (zum 1.3, fokus di muka) supaya muka berada di tengah, tidak terlalu tinggi atau terpotong. Boleh dilaras untuk setiap guru: **Tetapan → Pangkalan Data Guru → buka guru → "Kedudukan gambar dalam bulatan carta"** (seret gambar atau guna peluncur Zum / Mendatar / Menegak).

## 13. Jawatankuasa: susunan ikut senarai + Bidang Tugas sehalaman
- Setiap unit (Pentadbiran, Kurikulum, HEM, Kokurikulum) mempunyai halaman **Senarai Jawatankuasa Unit** selepas Jawatankuasa Induk; halaman jawatankuasa disusun mengikut turutan senarai itu.
- Setiap halaman jawatankuasa = senarai ahli + **BIDANG TUGAS** dalam halaman yang sama (35 jawatankuasa yang belum ada bidang tugas diberi draf — boleh disunting). Halaman yang melimpah sedikit dipadatkan supaya muat sehalaman; jawatankuasa dengan bidang tugas yang sangat panjang bersambung ke halaman berikutnya.
- Jawatankuasa unit Kurikulum (PAK21, Pusat Sumber, Transisi, PLaNS, Hari Bicara, Apresiasi Tahun 6, Kemenjadian Murid) kini halaman sendiri.

## 14. Tanda medan perlu diisi
- Medan kosong / ruang isian ditanda **merah pastel** dengan teks **+ TAMBAH MAKLUMAT**, **nombor panduan** (1, 2, 3 …) dan cip **"N MEDAN PERLU DIISI"** di bucu halaman.
- Hanya pada skrin: tidak dicetak dan tidak dieksport (PDF / PPTX). Halaman borang yang diisi dengan tangan (Lampiran, Maklumat Peribadi, Akuan) tidak ditanda.
- Butang **Medan kosong** (topbar penjana & kepala portal) untuk hidup / matikan tanda.

## 15. Takwim Induk berpaut kepada takwim unit
- Setiap unit menyunting **Takwim Tahunan Unit** masing-masing (BULAN | TARIKH | PROGRAM / AKTIVITI | TINDAKAN): Pentadbiran (baharu), Kurikulum, HEM (baharu), Kokurikulum, PPKI, Prasekolah (masuk lajur Kurikulum).
- Lajur unit dalam **Takwim Induk Sekolah** (Januari – Disember) dijana secara automatik daripada takwim unit; baris cuti / acara seluruh sekolah kekal diurus pentadbir dalam Takwim Induk. Aktiviti Takwim Induk 2026 telah dipindahkan ke takwim unit masing-masing.
- Format tarikh: "13 Jan", "13 - 16 Jan", "28 Jan - 2 Feb", "21.1.2027". Dalam edisi 2027 lajur TARIKH dikosongkan untuk diisi semula oleh unit.

## 16. Sunting terus dalam paparan halaman
- Penjana dan portal: pilihan **Sunting di halaman** (lalai) atau **Borang**.
- Klik mana-mana bahagian halaman sebenar (perenggan, sel jadual, item senarai, baris maklumat, peranan jawatankuasa, medan merah bernombor) → panel penyunting dibuka dengan kursor pada medan tersebut; perubahan dipaparkan serta-merta. Panel juga menyenaraikan pintasan nombor medan perlu diisi dan butang tambah kandungan.
- Telefon: panel penyunting muncul sebagai helaian di bahagian bawah skrin.

## 17. Kalendar Akademik 2027 (Kumpulan B — WP Kuala Lumpur)
Data rasmi 2027 (`src/config/kalendarAkademik.ts`) digunakan apabila edisi 2027 dijana / dimigrasi (v24):
- **Kalendar Akademik 2027**: Penggal 1 & 2, julat bulanan, jumlah hari & minggu setiap segmen, cuti penggal / pertengahan / akhir tahun; jumlah 203 hari, 44 minggu.
- **Cuti Perayaan 2027**: tambahan cuti KPM bagi Kumpulan B, catatan perayaan dalam cuti sekolah, dan jadual **Cuti Kelepasan Am WP Kuala Lumpur 2027** (tarikh kalendar Hijrah bertanda * — sahkan dengan senarai rasmi JPM).
- **Minggu Akademik 2027**: MP1 – MP44 dengan catatan cuti dalam minggu tersebut.
- **Kalendar 2027**: serlahan warna — merah (kelepasan am), ungu (perayaan KPM), biru (cuti persekolahan), krim (hujung minggu) + petunjuk. Kod sel: `8u`, `9p`, `6s` (boleh diubah dalam penyunting jadual).
- **Takwim Induk 2027**: nombor minggu persekolahan diisi; hari cuti ditanda sebagai baris cuti merentas semua unit.
- Halaman yang telah disunting pengguna tidak ditimpa (kecuali tanda cuti pada Takwim Induk).

## 18. Hari cuti dikemas kini terus dalam Takwim Induk
- Setiap baris Takwim Induk mempunyai **Jenis hari**: Hari sekolah, Hujung minggu, **Cuti kelepasan am** (merah), **Cuti perayaan KPM** (ungu), **Cuti persekolahan** (biru) atau Cuti (lain-lain).
- Alat **Tandakan julat tarikh** dalam penyunting Takwim Induk: pilih hari mula & akhir, jenis cuti dan keterangan (cth. CUTI PENGGAL 1 2027) → semua hari dalam julat ditanda sekali gus (merentas semua unit). Pilih "Hari sekolah (buang cuti)" untuk membatalkan.
- **Kalendar** (halaman berserlah warna) kini dijana daripada jenis hari dalam Takwim Induk — kemas kini hari cuti di Takwim Induk sahaja, Kalendar menyusul secara automatik.
- Mod *Sunting di halaman*: klik baris takwim pada halaman → penyunting dibuka pada baris tersebut (pemilih jenis hari).

## 19. Planner Guru bulanan
- Bahagian baharu **PLANNER GURU** (selepas Takwim Sekolah): 12 halaman, **satu halaman sebulan**.
- Setiap halaman: grid bulanan (Isnin dahulu) dengan nombor minggu persekolahan (MP); hari cuti diserlah (merah kelepasan am, ungu perayaan KPM, biru cuti persekolahan, krim hujung minggu); **aktiviti setiap unit** daripada Takwim Induk dengan warna unit (Pentadbiran navy, Kurikulum hijau, HEM oren, Kokurikulum biru kehijauan, PPKI merah jambu).
- Bahagian bawah: **Tarikh Penting** (automatik), **Senarai Tugasan** (petak semak), **Guru Ganti (Relief)** dan **Catatan**.
- Semua data kalendar, cuti dan aktiviti dimuatkan automatik daripada Takwim Induk / Takwim Tahunan Unit; hanya senarai tugasan & catatan disunting dalam halaman Planner (baris kosong dicetak untuk ditulis tangan).

## 20. Kemasan (foto, jadual, program khas, Planner, kaki halaman)
- Foto dalam bulatan carta: bingkai lalai baharu (zum 1.6, fokus 40% tinggi imej) — muka di tengah bulatan.
- Jadual: penjajaran seragam — nama / kod / tarikh (hingga ±48 aksara) di tengah, ayat panjang rata kiri, perenggan dalam sel diratakan.
- Pengurusan Program Khas Sekolah (Kurikulum, HEM, Kokurikulum): 10 nama program setiap unit diisi daripada takwim unit; nama guru penyelaras dikosongkan untuk diisi unit.
- Planner Guru kini tajuk ketiga di bawah **Takwim Sekolah** (Kalendar · Takwim Induk · Planner Guru), satu entri dalam Isi Kandungan.
- Teks kaki halaman sentiasa memaparkan tahun edisi (teks kaki tersuai "TAHUN 2026" dalam buku 2027 dipaparkan "TAHUN 2027").
- Migrasi v27.

## 21. Jadual Kumpulan Guru Bertugas 2027
- Jadual Kumpulan Guru Bertugas (Jan–Jun & Jul–Dis) dan Jadual Guru Bertugas PPKI dijana mengikut Kalendar Akademik 2027 (Kumpulan B):
  minggu M1–M44 dengan tarikh Isnin–Jumaat, baris cuti CP I (8–12 Mac), CPT (24 Mei – 4 Jun) dan CP II (30 Ogos – 3 Sep).
- Minggu yang semua harinya cuti (Tahun Baru Cina 8–12 Feb; Hari Raya Aidiladha / Hari Wesak 17–21 Mei) tidak diberi kumpulan bertugas dan dilabel sebab cutinya.
- Kumpulan 1–5 bergilir; ketua pagi / petang mengikut giliran ahli dalam halaman **Kumpulan Guru Bertugas**; tema minggu mengikut senarai sedia ada.
- Edisi 2027 baharu dijana automatik; buku 2027 sedia ada dikemas kini melalui migrasi v28 (jika jadual belum disunting).
- **Automatik:** jadual guru bertugas berpaut kepada halaman **Kumpulan Guru Bertugas** — ubah ahli / susunan ahli kumpulan di situ dan kumpulan, ketua pagi / petang serta guru PPKI dalam jadual dikemas kini sendiri. Suis **Automatik** dalam penyunting jadual boleh dinyahtanda untuk suntingan manual. Migrasi v29.

## 22. Istilah carta seragam & saiz foto
- Tajuk diseragamkan: **CARTA ORGANISASI UNIT …** / **CARTA ORGANISASI PROGRAM …** dan **JAWATANKUASA INDUK UNIT …** / **JAWATANKUASA INDUK PROGRAM …** (tanpa tahun; tajuk dalaman berulang dibuang).
- Barisan pentadbir semua carta & jawatankuasa induk: **Pengerusi** (Guru Besar) → **Timbalan Pengerusi** (GPK unit, di tengah) → **Naib Pengerusi** (GPK lain, tanpa nombor).
- Foto pentadbir: zum dikurangkan (1.35) — muka kekal di tengah bulatan, tidak terlalu besar.
- Halaman carta + senarai ahli yang melimpah sedikit dipadatkan supaya sehalaman. Migrasi v30.

## 23. Halaman jawatankuasa seragam
- Semua halaman jawatankuasa (Pentadbiran, Kurikulum, HEM, Kokurikulum, PPKI) menggunakan barisan pentadbir yang sama seperti carta: **Pengerusi** (Guru Besar) → **Timbalan Pengerusi** (GPK unit) → **Naib Pengerusi** (GPK lain, satu baris, dengan jawatan) — menggantikan "Naib Pengerusi I/II/III/IV".
- Jawatankuasa Kokurikulum yang ditulis sebagai jadual JAWATAN | NAMA (iKeps/SEGAK/PAJSK, 1M1S, Anugerah, Merentas Desa, Pendidikan Luar & Lawatan, Pembangunan Sukan) ditukar kepada format jawatankuasa; nama dipadankan dengan Pangkalan Data Guru.
- Jadual eRPH / Pencerapan: lajur bulanan & pencerapan tidak lagi ditanda "perlu diisi". Migrasi v31–v33.

## 24. Keseragaman menyeluruh (tipografi, jadual, nama guru, ruang Catatan)
- **Saiz seragam:** zum besar/kecil automatik dan pemadatan fon jadual dibuang — semua teks & jadual menggunakan saiz yang sama di setiap halaman (kecuali takwim / kalendar yang dipadatkan supaya sebulan sehalaman, dan halaman carta semata-mata yang dibesarkan memenuhi halaman).
- **Lajur nama guru:** satu nama sesel. Lajur nama dengan lajur lain di sebelah kanan (cth. selepas BIL) → rata kiri; lajur nama terakhir dengan satu nama sesel → tengah; jadual lajur nama selari (SESI PAGI | SESI PETANG) → jajaran sama; sel berbilang nama → senarai bertitik (•) rata kiri.
- **Ruang Catatan:** hanya jika baki ruang ≥ 34 mm, dan tingginya ≤ 60% isi utama halaman (minimum 40 mm); baki selebihnya dibiarkan kosong. Baris jadual tidak lagi diregang.
- **Bidang Tugas Guru & AKP:** baris teks ditukar kepada format sama dengan Bidang Tugas lain — subtajuk tebal / ayat pengenalan + senarai bernombor (sub-perkara a), b) …). Migrasi v34.
