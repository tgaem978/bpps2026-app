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
