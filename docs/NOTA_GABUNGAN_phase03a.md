# Gabungan: bpps2026-app-main + phase01..03 + phase03a + kemas kini Kokurikulum (6 Okt 2026)

Asas: bpps2026-app-main (lengkap). Di atasnya: semua fail phase03a (menang jika fail sama), gambar `public/kokurikulum`, `public/pengenalan`, `public/ppki`.

## Kemas kini Kokurikulum (baharu dalam gabungan ini) - src/config/partKoku.ts
- Halaman `kk-jk-03`, `04`, `05`, `07`, `08`, `09`, `11`, `12`, `13` (sebelum ini gambar PDF) kini jawatankuasa/jadual BOLEH SUNTING
  daripada JAWATANKUASA_KOKURIKULUM_v2.pdf (rujukan terkini). 319 baris nama disemak lawan PDF: tiada tercicir.
- Nama ditulis sebagai teks seperti PDF (bukan dipadankan ke Pangkalan Data Guru); ketua (K)/(P) ditebalkan melalui penanda **nama**.
- Halaman pembahagi `kk-jk-02`, `06`, `10` kekal gambar (tajuk sahaja).
- Migrasi: guna `migrateV8` phase03a (padam halaman kk-* yang belum disunting supaya data baharu dimuatkan). Tiada perubahan pada bookStore.ts.

## Keputusan gabungan
- Model format teks phase03a (sifat terus pada blok, `colAlign`, `rowHeights` array) menggantikan model phase03 (`fmt`/`cellFmt`).
  Akibat: `editCtx.tsx` dan `FormatBar.tsx` (phase03) dibuang kerana digantikan `FmtBar.tsx`, `TableEditor.tsx`, `BlockEditor.tsx` (phase03a).
  Format ikut-sel (cellFmt) tidak lagi ada.
- Teks pengenalan Kokurikulum (slaid 1-11) dikekalkan seperti dalam phase03/03a (versi disunting: "murid", ayat dirapikan).

## Perkara untuk disemak oleh pemilik (tidak diubah)
1. JK Induk: susunan Naib Pengerusi phase03a (PPKI, Kokurikulum, Petang, Pentadbiran, HEM) berbeza daripada slaid 11 PPTX.
2. JK Pembangunan Sukan / Rumah Sukan: Timbalan Pengerusi + Naib Pengerusi I-IV; PDF guna Naib Pengerusi I-V.
3. JK Majlis Anugerah: FATIMAH BINTI AB LATIF muncul dua kali.
4. Takwim: "PANDU PUTERI TUNAS" (PDF: PANDU PUTERI ISLAM MALAYSIA); format tarikh tidak seragam.
5. Kata aluan GPK guna token {{jawatan:GPK Kokurikulum}}.
6. Senarai jurulatih pasukan & rumah sukan ialah gambar PNG (tidak boleh disunting).
7. Pengesahan pada pelayar belum dibuat (pagination jadual unit baharu, eksport PPT). Jalankan `npm install && npm run build`.
