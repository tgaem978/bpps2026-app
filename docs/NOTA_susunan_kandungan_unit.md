# Susunan Kurikulum, HEM & Kokurikulum mengikut senarai KANDUNGAN rujukan (migrasi v17)

Sumber susunan: senarai KANDUNGAN dokumen rujukan (Buku Pengurusan & Takwim). Hanya tajuk dan susunan diambil; nama orang dalam rujukan tidak digunakan.

## Prinsip
- Isi Kandungan bagi **Kurikulum (21 tajuk), HEM (23 tajuk), Kokurikulum (11 tajuk)** sama bilangan, tajuk dan turutan dengan rujukan.
- **Satu jawatankuasa = satu tajuk = satu halaman** (termasuk Bidang Tugas dalam halaman yang sama). Kandungan panjang dipecah ke halaman baharu secara automatik.
- `OutlinePart.tocChildren = false` (p-kurikulum, p-hem, p-koku): subtajuk/halaman sambungan **tetap ada dalam buku dan bernombor**, tetapi tidak disenaraikan dalam Isi Kandungan.
- Lencana kecil (subtitle) dikosongkan - lencana halaman = nama bahagian, dan tajuk Isi Kandungan tidak lagi berekor "— SESI 2026".

## Pemetaan kandungan sedia ada
**Kurikulum** - jawatankuasa unit (`k-jk-unit`) dipadankan ke halamannya sendiri: PBS -> JK PBD & KSSR; Jadual Waktu -> JK Jadual Waktu dan Guru Ganti; DELIMA -> JK DELIMA; Guru Muda -> JK Guru Muda; Kecemerlangan Akademik -> JK Program Peningkatan Akademik; Intervensi Tahun 1; Prasekolah -> JK Pengurusan Prasekolah. Halaman baharu tanpa data (Pentaksiran Bilik Darjah) ialah ruang kosong. Yang tidak dipadankan kekal dalam `k-jk-unit`.
**HEM** - `hem-jk-1..10` + `hem-tugas-*` digabungkan ke halaman `hx-*`:
Data HEM, Disiplin & Pengawas, Bimbingan & Kaunseling, PPDa, SPBT (+BOSD), Kantin, Kedai Buku, 3K Kebersihan & Keceriaan, 3K Kesihatan & Rawatan (+COMBI), 3K Keselamatan, Bantuan Kerajaan (KWAPM/BAP), Bantuan Ehsan (Kebajikan Murid + Baitulmal), RMT, PSS.
Lokar, Pembangunan Fizikal, Penempatan, Orientasi, SSDM, Aset Alih = ruang kosong (turutan rujukan).
**Kokurikulum** - tajuk sedia ada ditukar nama mengikut rujukan; `kx-carta-koku` (Carta Organisasi Unit Kokurikulum) ditambah; Pembangunan Sukan dialih ke kedudukan ketiga.

## Halaman tambahan sekolah (tiada dalam rujukan) - TIDAK dipadam
Dikekalkan sebagai sambungan: Kurikulum (`k-jk-unit`, `k-bidang-tugas`, `k-bilik-khas`, `k-takwim`) di hujung; HEM (`hem-aluan` di bawah Ketetapan Dasar, `hem-jk` di bawah JK Induk); Kokurikulum (aluan/pengenalan/visi/piagam/strategi/polisi di bawah Ketetapan Dasar; JK khas & takwim di hujung).

## Halaman Guru & AKP bergambar
`ma-guru-pelaksana` (selepas Kata Pengantar) dipadam daripada struktur lalai dan dibuang oleh migrasi (walaupun telah disunting). Senarai nama Guru & AKP dalam Pentadbiran (tanpa foto) tidak diubah.

## Migrasi v17 (data tersimpan dalam pelayar)
Halaman lalai yang belum disunting dimuat semula (tajuk/kandungan baharu). Halaman lama yang telah disunting, atau ditambah pengguna, dikekalkan sebagai sambungan di hujung bahagian berkenaan.
