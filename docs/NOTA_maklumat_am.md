# Susunan baharu mengikut senarai KANDUNGAN dokumen rujukan (fasa 05)

Rujukan: "Buku Pengurusan & Takwim" (PDF, sekolah lain) - hanya tajuk, susunan & struktur halaman digunakan; **tiada nama dari PDF dimasukkan**.
Fail baharu: `src/config/partRujukan.ts`. Diubah: `defaultContent.ts`, `partPentadbiran.ts`, `partPengenalan.ts`, `bookStore.ts` (migrasi v16).

## 1. Halaman Pengenalan dipadam
Dipadam: Teras Perkhidmatan Awam, Fokus Pengurusan, KBAT i-THINK, PAK-21 5C, Aspirasi Pendidikan, Dasar Pendidikan Digital, TS25 (+ imej isi-05/07-12).
Kekal: Kata Pengantar, Ikrar Perkhidmatan Awam, Surat Aku Janji, Falsafah Pendidikan Kebangsaan (Rukun Negara & FPK), Visi & Misi KPM, Surat Pekeliling Ikhtisas.

## 2. Bahagian 1 = MAKLUMAT AM (Pengenalan + Maklumat Sekolah digabung)
Maklumat Peribadi* → Kata Pengantar → Guru & Anggota Kumpulan Pelaksana* → FPK → Visi & Misi KPM → Profil Sekolah (Sejarah, Latar Belakang, Visi/Misi/Moto, Matlamat, Lagu, Lencana) →
Pelan Kelas & Bilik Khas → Pelan Pengungsian → Ikrar Perkhidmatan Awam → Surat Aku Janji → Surat Pekeliling Ikhtisas → Kalendar Akademik → Cuti Perayaan →
Minggu Akademik* → Waktu Persekolahan* → Simulasi Jadual Waktu (Tahap 1 & 2)*.   (* = halaman baharu; Kandungan dijana automatik oleh sistem)

## 3. Bahagian lain (susunan ikut rujukan)
- **Pentadbiran**: tambah *Penyelaras Bilik-bilik Khas* (selepas Semakan Hasil Kerja Murid). Lain-lain sudah sepadan.
- **Kurikulum**: Ketetapan Dasar (Visi/Misi, Objektif, Pengenalan) → Carta JK Induk* → JK Induk → JK Guru Petang* → Panitia → JK PBD/KSSR*, Data Sekolah*, KBAT/i-THINK/ISPPK*, Pemulihan*, HIP*, Pendekatan Bertema*, Sudut Pidato*, Semakan Buku Kerja*, Celik Jawi* → Bidang Tugas → Bilik-bilik Khas → Takwim.
  JK yang sudah ada dalam "JK Unit Kurikulum" (Prasekolah, Jadual Waktu, DELIMa, Intervensi Tahun 1, Guru Muda, Kecemerlangan Akademik) tidak diganda.
- **HEM**: Aluan → Ketetapan Dasar → Carta Organisasi* → JK Induk → JK Unit → SSDM*, Lokar*, Pembangunan Fizikal*, Penempatan Murid Tg 1*, Orientasi Thn 1 & Prasekolah*, Aset Alih Kerajaan* → Bidang Tugas.
- **Kokurikulum**: susunan Beruniform → Sukan & Permainan → Kelab & Persatuan → Jurulatih → Rumah Sukan → Agihan Tugas → *Jadual Perhimpunan Bulanan Unit Beruniform* (baharu).
- **Takwim Sekolah 2026** dialihkan selepas Kokurikulum (Kalendar 2026 + Takwim Induk 12 bulan).
- Tidak sepadan dengan rujukan tetapi **dikekalkan**: Pendidikan Khas (PPKI), Prasekolah, Lampiran, Catatan, Panduan Am, Akuan, Bidang Tugas Guru/AKP, Kalendar 2026, Takwim Induk, semua halaman Koku/HEM sedia ada.

## Migrasi v16 (pengguna sedia ada)
Struktur diganti struktur baharu; tajuk lama yang telah disunting / bahagian tambahan pengguna **tidak dipadam** (diletakkan di hujung bahagian asal). Halaman lalai yang belum disunting dimuat semula.

## Perlu disemak
- Halaman baharu (JK, Maklumat Peribadi, Waktu Persekolahan, Bilik Khas, Perhimpunan Bulanan) kosong/ruang diisi; Setiausaha & AJK perlu diisi.
- Minggu Akademik dijana daripada tarikh penggal 2026 (43 minggu, Isnin-Jumaat); semak catatan cuti/UASA.
- Jadual simulasi mengambil waktu minimum KPM dari rujukan (bukan nama/masa sekolah itu).
- `npm install && npm run build` belum dijalankan (tiada rangkaian); transpile & semakan struktur (tiada ID hilang/pendua) lulus.
